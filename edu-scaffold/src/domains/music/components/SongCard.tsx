"use client";

import { useMusicStore } from "../music.store";
import type { Song } from "../music.types";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface SongCardProps {
  song: Song;
  onDelete?: (id: string) => void;
}

export function SongCard({ song, onDelete }: SongCardProps) {
  const { playSong, currentSong, isPlaying, pause } = useMusicStore();

  const isActive = currentSong?.id === song.id;

  function handlePlay() {
    if (isActive && isPlaying) {
      pause();
    } else {
      playSong(song);
    }
  }

  return (
    <div
      className={`relative rounded-lg border p-4 transition-all ${
        isActive
          ? "border-edu-accent bg-edu-card-alt"
          : "border-edu-border bg-edu-card hover:border-edu-border-bright"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlay}
          disabled={!song.audioPath}
          aria-label={isActive && isPlaying ? "一時停止" : "再生"}
          className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-colors ${
            song.audioPath
              ? "bg-edu-accent text-edu-bg hover:opacity-90"
              : "cursor-not-allowed bg-edu-border text-edu-muted"
          }`}
        >
          {isActive && isPlaying ? (
            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="size-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-edu-text">{song.title}</p>
          {song.style && (
            <p className="truncate text-sm text-edu-text-dim">{song.style}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 text-sm text-edu-muted">
          {song.bpm && <span>{song.bpm} BPM</span>}
          {song.duration > 0 && <span>{formatDuration(song.duration)}</span>}
          {!song.audioPath && (
            <span className="rounded bg-edu-border px-1.5 py-0.5 text-xs">生成中</span>
          )}
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(song.id)}
            aria-label="削除"
            className="ml-2 shrink-0 text-edu-muted transition-colors hover:text-red-400"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
