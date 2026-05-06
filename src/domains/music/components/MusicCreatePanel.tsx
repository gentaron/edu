"use client";

import { useState } from "react";
import type { MusicGenerationParams } from "../music.types";

interface GenerationResult {
  jobId: string;
  songId: string;
}

interface JobPollResult {
  job: {
    status: string;
    progress: number;
    stage: string | null;
    errorMessage: string | null;
  };
  song: {
    audioPath: string | null;
    title: string;
  } | null;
}

interface MusicCreatePanelProps {
  onGenerated?: () => void;
}

const STYLE_PRESETS = [
  { label: "J-Pop", value: "j-pop, upbeat, catchy, piano, synth" },
  { label: "Lo-fi Hip-hop", value: "lo-fi, hip-hop, chill, vinyl, relaxing" },
  { label: "Orchestra", value: "orchestral, cinematic, strings, epic, dramatic" },
  { label: "EDM", value: "edm, electronic, dance, energetic, synth" },
  { label: "Jazz", value: "jazz, piano, saxophone, swing, smooth" },
  { label: "Rock", value: "rock, guitar, drums, powerful, electric" },
];

export function MusicCreatePanel({ onGenerated }: MusicCreatePanelProps) {
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [style, setStyle] = useState("");
  const [duration, setDuration] = useState(60);
  const [bpm, setBpm] = useState<number | "">("");
  const [inferenceSteps, setInferenceSteps] = useState(60);
  const [seed, setSeed] = useState<number | "">(-1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pollJob(jobId: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/music/jobs/${jobId}`);
        const data = (await res.json()) as JobPollResult;
        const { job } = data;

        if (job.status === "succeeded") {
          clearInterval(interval);
          setJobStatus(null);
          setSubmitting(false);
          onGenerated?.();
        } else if (job.status === "failed") {
          clearInterval(interval);
          setError(job.errorMessage ?? "生成に失敗しました");
          setJobStatus(null);
          setSubmitting(false);
        } else {
          const stageLabel = job.stage === "generating" ? "生成中..." : "待機中...";
          setJobStatus(stageLabel);
        }
      } catch {
        clearInterval(interval);
        setError("ステータス確認に失敗しました");
        setSubmitting(false);
      }
    }, 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    setJobStatus("リクエスト送信中...");

    const params: MusicGenerationParams & { title?: string } = {
      title: title || undefined,
      lyrics: lyrics || undefined,
      style: style || undefined,
      duration,
      bpm: bpm === "" ? undefined : bpm,
      inferenceSteps,
      seed: seed === "" ? -1 : seed,
    };

    try {
      const res = await fetch("/api/music/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error ?? "生成リクエストに失敗しました");
      }

      const { jobId } = (await res.json()) as GenerationResult;
      setJobStatus("キューに追加されました...");
      await pollJob(jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
      setSubmitting(false);
      setJobStatus(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-edu-text">新しい曲を生成</h2>

      <div>
        <label className="mb-1 block text-sm text-edu-text-dim">タイトル（任意）</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Song"
          className="w-full rounded-lg border border-edu-border bg-edu-surface px-3 py-2 text-sm text-edu-text placeholder:text-edu-muted focus:border-edu-accent focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-edu-text-dim">スタイル・ジャンル</label>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {STYLE_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setStyle(p.value)}
              className={`rounded px-2 py-1 text-xs transition-colors ${
                style === p.value
                  ? "bg-edu-accent text-edu-bg"
                  : "border border-edu-border text-edu-text-dim hover:border-edu-accent hover:text-edu-accent"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          placeholder="pop, rock, upbeat, piano..."
          className="w-full rounded-lg border border-edu-border bg-edu-surface px-3 py-2 text-sm text-edu-text placeholder:text-edu-muted focus:border-edu-accent focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-edu-text-dim">歌詞（任意）</label>
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          rows={5}
          placeholder={"[Verse]\n歌詞をここに入力...\n\n[Chorus]\n..."}
          className="w-full rounded-lg border border-edu-border bg-edu-surface px-3 py-2 text-sm text-edu-text placeholder:text-edu-muted focus:border-edu-accent focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 flex justify-between text-sm text-edu-text-dim">
          <span>長さ</span>
          <span>{duration}秒</span>
        </label>
        <input
          type="range"
          min={15}
          max={240}
          step={15}
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full cursor-pointer accent-edu-accent"
        />
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="flex items-center gap-1 text-sm text-edu-text-dim hover:text-edu-accent"
      >
        <svg
          className={`size-4 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        詳細設定
      </button>

      {showAdvanced && (
        <div className="flex flex-col gap-3 rounded-lg border border-edu-border bg-edu-card p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-edu-text-dim">BPM（-1=自動）</label>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(e.target.value === "" ? "" : parseInt(e.target.value))}
                placeholder="-1"
                className="w-full rounded border border-edu-border bg-edu-surface px-2 py-1.5 text-sm text-edu-text focus:border-edu-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-edu-text-dim">
                推論ステップ
              </label>
              <input
                type="number"
                min={20}
                max={150}
                value={inferenceSteps}
                onChange={(e) => setInferenceSteps(parseInt(e.target.value))}
                className="w-full rounded border border-edu-border bg-edu-surface px-2 py-1.5 text-sm text-edu-text focus:border-edu-accent focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-edu-text-dim">シード（-1=ランダム）</label>
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value === "" ? "" : parseInt(e.target.value))}
              placeholder="-1"
              className="w-full rounded border border-edu-border bg-edu-surface px-2 py-1.5 text-sm text-edu-text focus:border-edu-accent focus:outline-none"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {jobStatus && (
        <div className="flex items-center gap-2 rounded-lg border border-edu-border bg-edu-card px-4 py-3 text-sm text-edu-text-dim">
          <span className="size-3 animate-pulse rounded-full bg-edu-accent" />
          {jobStatus}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-edu-accent px-4 py-2.5 font-semibold text-edu-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "生成中..." : "生成する"}
      </button>
    </form>
  );
}
