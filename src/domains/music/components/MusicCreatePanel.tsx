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

interface EduTextInspiration {
  id: string;
  name: string;
  nameEn: string | null;
  category: string;
  subCategory: string | null;
  era?: string;
  description: string;
  affiliation?: string;
  tier?: string;
  sourceLinks: Array<{ url: string; label: string }>;
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
  { label: "Ballad", value: "ballad, emotional, piano, slow, heartfelt" },
  { label: "Ambient", value: "ambient, atmospheric, ethereal, peaceful" },
];

export function MusicCreatePanel({ onGenerated }: MusicCreatePanelProps) {
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [style, setStyle] = useState("");
  const [duration, setDuration] = useState(60);
  const [bpm, setBpm] = useState<number | "">("");
  const [inferenceSteps, setInferenceSteps] = useState(8);
  const [seed, setSeed] = useState<number | "">(-1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // edutext連想
  const [inspirations, setInspirations] = useState<EduTextInspiration[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loadingEdu, setLoadingEdu] = useState(false);
  const [showEduPanel, setShowEduPanel] = useState(false);
  const [expandedInspiration, setExpandedInspiration] = useState<string | null>(null);

  async function fetchInspirations() {
    setLoadingEdu(true);
    try {
      const url = selectedCategory === "all"
        ? "/api/music/edutext?count=5"
        : `/api/music/edutext?category=${encodeURIComponent(selectedCategory)}&count=5`;
      const res = await fetch(url);
      const data = await res.json();
      setInspirations(data.inspirations ?? []);
      setCategories(data.categories ?? []);
    } catch (err) {
      console.error("edutext fetch error:", err);
    } finally {
      setLoadingEdu(false);
    }
  }

  function applyInspiration(insp: EduTextInspiration) {
    // タイトルをキャラクター名に設定
    if (!title) setTitle(insp.name);

    // スタイルをキャラクターの属性から連想
    const styleFromCharacter = generateStyleFromCharacter(insp);
    if (!style) setStyle(styleFromCharacter);

    // 説明文を元に歌詞のひな形を生成
    const lyricsFromCharacter = generateLyricsFromCharacter(insp);
    if (!lyrics) setLyrics(lyricsFromCharacter);
  }

  function generateStyleFromCharacter(insp: EduTextInspiration): string {
    const tierStyles: Record<string, string> = {
      "神格・歴史的人物": "orchestral, epic, cinematic, powerful, grand",
      "Tier 1": "symphonic rock, dramatic, intense, powerful, electric guitar",
      "Tier 2": "electronic, synth, modern, upbeat, energetic",
      "Tier 3": "ambient, atmospheric, mysterious, ethereal",
    };

    if (insp.tier && tierStyles[insp.tier]) return tierStyles[insp.tier];

    // カテゴリ別のスタイル
    const categoryStyles: Record<string, string> = {
      "キャラクター": "cinematic, emotional, piano, strings",
      "組織": "march, powerful, orchestral, dramatic",
      "地理": "ambient, atmospheric, peaceful, nature",
      "技術": "electronic, synth, futuristic, energetic",
      "用語": "mysterious, ambient, ethereal",
      "歴史": "orchestral, epic, dramatic, historical",
    };

    return categoryStyles[insp.category] ?? "cinematic, emotional, piano";
  }

  function generateLyricsFromCharacter(insp: EduTextInspiration): string {
    const desc = insp.description;
    const sentences = desc.split("。").filter((s) => s.trim().length > 0);

    const verseLines = sentences
      .slice(0, 3)
      .map((s) => s.trim())
      .filter((s) => s.length > 5)
      .slice(0, 4);

    const chorusLines = [
      insp.name,
      insp.affiliation ?? insp.subCategory ?? "",
      insp.era ? `${insp.era}の物語` : "",
      "永遠に語り継がれる",
    ].filter(Boolean);

    const lyricsParts: string[] = [];

    if (verseLines.length > 0) {
      lyricsParts.push("[Verse]");
      lyricsParts.push(...verseLines);
    }

    if (chorusLines.length > 0) {
      lyricsParts.push("");
      lyricsParts.push("[Chorus]");
      lyricsParts.push(...chorusLines);
    }

    if (sentences.length > 3) {
      lyricsParts.push("");
      lyricsParts.push("[Bridge]");
      lyricsParts.push(sentences.slice(3, 5).join("\n"));
    }

    lyricsParts.push("");
    lyricsParts.push("[Outro]");

    return lyricsParts.join("\n");
  }

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
          const stageLabel =
            job.stage === "generating"
              ? "ACE-Stepで生成中..."
              : job.stage === "done"
                ? "完了"
                : "待機中...";
          setJobStatus(stageLabel);
        }
      } catch {
        clearInterval(interval);
        setError("ステータス確認に失敗しました");
        setSubmitting(false);
      }
    }, 3000);
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
      setJobStatus("ACE-Stepに送信されました...");
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

      {/* ── edutext連想パネル ── */}
      <div className="rounded-lg border border-edu-border bg-edu-card">
        <button
          type="button"
          onClick={() => {
            setShowEduPanel((v) => !v);
            if (!showEduPanel && inspirations.length === 0) fetchInspirations();
          }}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-edu-text hover:text-edu-accent"
        >
          <span className="flex items-center gap-2">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            EDUテキストから連想する
          </span>
          <svg
            className={`size-4 transition-transform ${showEduPanel ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showEduPanel && (
          <div className="border-t border-edu-border px-4 py-3">
            <p className="mb-3 text-xs text-edu-muted">
              EDUの世界観・キャラクターからインスピレーションを得て、歌詞とスタイルを自動生成します
            </p>

            <div className="mb-3 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => { setSelectedCategory("all"); }}
                className={`rounded px-2 py-1 text-xs transition-colors ${
                  selectedCategory === "all"
                    ? "bg-edu-accent text-edu-bg"
                    : "border border-edu-border text-edu-text-dim hover:border-edu-accent"
                }`}
              >
                全て
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded px-2 py-1 text-xs transition-colors ${
                    selectedCategory === cat
                      ? "bg-edu-accent text-edu-bg"
                      : "border border-edu-border text-edu-text-dim hover:border-edu-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={fetchInspirations}
              disabled={loadingEdu}
              className="mb-3 rounded-lg border border-edu-accent px-3 py-1.5 text-xs font-medium text-edu-accent transition-colors hover:bg-edu-accent hover:text-edu-bg disabled:opacity-50"
            >
              {loadingEdu ? "読み込み中..." : "ランダムに選ぶ"}
            </button>

            {inspirations.length > 0 && (
              <div className="flex flex-col gap-2">
                {inspirations.map((insp) => (
                  <div
                    key={insp.id}
                    className="rounded-lg border border-edu-border bg-edu-surface p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-edu-text">{insp.name}</span>
                          {insp.nameEn && (
                            <span className="text-xs text-edu-muted">{insp.nameEn}</span>
                          )}
                          {insp.tier && (
                            <span className="rounded bg-edu-accent/20 px-1.5 py-0.5 text-[10px] text-edu-accent">
                              {insp.tier}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-edu-muted">
                          {insp.category}
                          {insp.affiliation && ` / ${insp.affiliation}`}
                          {insp.era && ` / ${insp.era}`}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => setExpandedInspiration(expandedInspiration === insp.id ? null : insp.id)}
                          className="rounded px-2 py-1 text-xs text-edu-text-dim hover:text-edu-accent"
                        >
                          {expandedInspiration === insp.id ? "閉じる" : "詳細"}
                        </button>
                        <button
                          type="button"
                          onClick={() => applyInspiration(insp)}
                          className="rounded bg-edu-accent px-2 py-1 text-xs font-medium text-edu-bg transition-opacity hover:opacity-90"
                        >
                          採用
                        </button>
                      </div>
                    </div>

                    {expandedInspiration === insp.id && (
                      <p className="mt-2 text-xs leading-relaxed text-edu-text-dim">
                        {insp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── タイトル ── */}
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

      {/* ── スタイル・ジャンル ── */}
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

      {/* ── 歌詞 ── */}
      <div>
        <label className="mb-1 block text-sm text-edu-text-dim">
          歌詞（任意 — EDUテキストから連想も可能）
        </label>
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          rows={6}
          placeholder={"[Verse]\n歌詞をここに入力...\n\n[Chorus]\n..."}
          className="w-full rounded-lg border border-edu-border bg-edu-surface px-3 py-2 text-sm text-edu-text placeholder:text-edu-muted focus:border-edu-accent focus:outline-none"
        />
      </div>

      {/* ── 長さ ── */}
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

      {/* ── 詳細設定 ── */}
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="flex items-center gap-1 text-sm text-edu-text-dim hover:text-edu-accent"
      >
        <svg
          className={`size-4 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        詳細設定
      </button>

      {showAdvanced && (
        <div className="flex flex-col gap-3 rounded-lg border border-edu-border bg-edu-card p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-edu-text-dim">BPM（0=自動）</label>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(e.target.value === "" ? "" : parseInt(e.target.value))}
                placeholder="0"
                className="w-full rounded border border-edu-border bg-edu-surface px-2 py-1.5 text-sm text-edu-text focus:border-edu-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-edu-text-dim">
                推論ステップ（推奨: 8）
              </label>
              <input
                type="number"
                min={4}
                max={50}
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

      {/* ── エラー・ステータス ── */}
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

      {/* ── 生成ボタン ── */}
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
