"use client";

import { useState } from "react";
import { MusicCreatePanel } from "@/domains/music/components/MusicCreatePanel";
import { MusicLibrary } from "@/domains/music/components/MusicLibrary";
import { MusicPlayer } from "@/domains/music/components/MusicPlayer";

type Tab = "create" | "library";

export default function MusicPage() {
  const [tab, setTab] = useState<Tab>("create");
  const [libraryKey, setLibraryKey] = useState(0);

  function handleGenerated() {
    setLibraryKey((k) => k + 1);
    setTab("library");
  }

  return (
    <div className="min-h-screen bg-edu-bg pb-24">
      <div className="border-b border-edu-border">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="text-2xl font-bold tracking-wide text-edu-text">
            AI 音楽生成
          </h1>
          <p className="mt-1 text-sm text-edu-muted">
            ACE-Step 1.5 を使った高品質なAI音楽生成
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex gap-1 rounded-lg border border-edu-border bg-edu-surface p-1">
          {(["create", "library"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-edu-accent text-edu-bg"
                  : "text-edu-text-dim hover:text-edu-text"
              }`}
            >
              {t === "create" ? "生成" : "ライブラリ"}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-edu-border bg-edu-card p-6">
          {tab === "create" ? (
            <MusicCreatePanel onGenerated={handleGenerated} />
          ) : (
            <MusicLibrary refreshKey={libraryKey} />
          )}
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}
