import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createJob, createSong, updateJob } from "@/domains/music/music.repository";
import { runGradioPredict, isGradioAvailable } from "@/services/gradio";
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
        { error: "ACE-Step サーバーに接続できません。起動しているか確認してください。" },
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

    (async () => {
      try {
        await updateJob(job.id, { status: "running", progress: 0, stage: "generating" });

        const { audioUrls } = await runGradioPredict(params);

        if (audioUrls.length === 0) {
          await updateJob(job.id, {
            status: "failed",
            errorMessage: "Gradio から音声が返されませんでした",
          });
          return;
        }

        const gradioUrl = audioUrls[0];
        await mkdir(AUDIO_DIR, { recursive: true });

        const audioFileName = `${song.id}.mp3`;
        const audioFilePath = path.join(AUDIO_DIR, audioFileName);

        const audioRes = await fetch(gradioUrl!);
        if (audioRes.ok) {
          const buffer = await audioRes.arrayBuffer();
          await writeFile(audioFilePath, Buffer.from(buffer));

          const { updateSong } = await import("@/domains/music/music.repository");
          await updateSong(song.id, { audioPath: `/music-audio/${audioFileName}` });
        }

        await updateJob(job.id, {
          status: "succeeded",
          progress: 1,
          stage: "done",
          songId: song.id,
        });
      } catch (err) {
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
