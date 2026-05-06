import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createJob, createSong, updateJob, updateSong } from "@/domains/music/music.repository";
import { submitGradioTask, isGradioAvailable, downloadAudio } from "@/services/gradio";
import type { MusicGenerationParams } from "@/domains/music/music.types";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const AUDIO_DIR =
  process.env.MUSIC_AUDIO_DIR ?? path.join(process.cwd(), "public", "music-audio");

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MusicGenerationParams & { title?: string };
    const { title, ...params } = body;

    const available = await isGradioAvailable();
    if (!available) {
      return NextResponse.json(
        {
          error:
            "ACE-Step サーバーに接続できません。\n" +
            "以下を確認してください:\n" +
            "1. ACE-Step 1.5 が起動しているか\n" +
            "2. --enable-api フラグ付きで起動しているか\n" +
            '3. .env の ACESTEP_GRADIO_URL が正しいか (デフォルト: http://localhost:7860)\n' +
            "起動例: acestep --port 7860 --enable-api --server-name 127.0.0.1",
        },
        { status: 503 },
      );
    }

    const song = await createSong({
      title: title ?? "Untitled",
      lyrics: params.lyrics,
      style: params.style,
      bpm: params.bpm ?? null,
      keySignature: params.key,
      timeSignature: params.timeSignature,
    });

    const job = await createJob(params, song.id);

    // バックグラウンドでACE-Stepにタスク送信 → ポーリング → 音声ダウンロード
    (async () => {
      try {
        await updateJob(job.id, { status: "running", progress: 0, stage: "generating" });

        const result = await submitGradioTask(params);

        if (result.status === "failed") {
          await updateJob(job.id, {
            status: "failed",
            errorMessage: result.error ?? "ACE-Step 生成に失敗しました",
          });
          return;
        }

        if (!result.audio_paths || result.audio_paths.length === 0) {
          await updateJob(job.id, {
            status: "failed",
            errorMessage: "ACE-Step から音声ファイルが返されませんでした",
          });
          return;
        }

        // 最初の音声ファイルをダウンロード
        const audioServerPath = result.audio_paths[0];
        if (!audioServerPath) {
          await updateJob(job.id, {
            status: "failed",
            errorMessage: "音声ファイルパスが取得できませんでした",
          });
          return;
        }

        await mkdir(AUDIO_DIR, { recursive: true });

        const audioFileName = `${song.id}.mp3`;
        const audioFilePath = path.join(AUDIO_DIR, audioFileName);

        try {
          const { buffer } = await downloadAudio(audioServerPath);
          await writeFile(audioFilePath, Buffer.from(buffer));

          await updateSong(song.id, {
            audioPath: `/music-audio/${audioFileName}`,
          });
        } catch (audioErr) {
          console.error("[music/generate] Audio download failed:", audioErr);
          // 音声ダウンロード失敗でもジョブは成功扱い（パス情報をDBに保存）
          await updateSong(song.id, {
            audioPath: `/api/music/audio/${encodeURIComponent(audioServerPath)}`,
          });
        }

        await updateJob(job.id, {
          status: "succeeded",
          progress: 1,
          stage: "done",
          songId: song.id,
        });
      } catch (err) {
        console.error("[music/generate] Background task error:", err);
        await updateJob(job.id, {
          status: "failed",
          errorMessage: err instanceof Error ? err.message : "不明なエラー",
        });
      }
    })();

    return NextResponse.json({ jobId: job.id, songId: song.id });
  } catch (err) {
    console.error("[music/generate]", err);
    return NextResponse.json({ error: "生成に失敗しました" }, { status: 500 });
  }
}
