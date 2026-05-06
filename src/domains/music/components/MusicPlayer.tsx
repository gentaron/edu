"use client";

import { useEffect, useRef, useState } from "react";
import { useMusicStore } from "../music.store";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer() {
  const { currentSong, isPlaying, volume, pause, resume, setProgress, setVolume } =
    useMusicStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!currentSong?.audioPath) return;

    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    audio.src = currentSong.audioPath;
    audio.volume = volume;

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration > 0 ? audio.currentTime / audio.duration : 0);
    });
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => pause());

    return () => {
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  if (!currentSong) return null;

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = parseFloat(e.target.value);
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-edu-border bg-edu-surface px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-edu-text">{currentSong.title}</p>
          {currentSong.style && (
            <p className="truncate text-xs text-edu-text-dim">{currentSong.style}</p>
          )}
        </div>

        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <button
              onClick={isPlaying ? pause : resume}
              aria-label={isPlaying ? "一時停止" : "再生"}
              className="flex size-9 items-center justify-center rounded-full bg-edu-accent text-edu-bg transition-opacity hover:opacity-90"
            >
              {isPlaying ? (
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
          </div>

          <div className="flex w-full max-w-sm items-center gap-2 text-xs text-edu-muted">
            <span className="w-8 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 1}
              value={currentTime}
              onChange={handleSeek}
              className="h-1 flex-1 cursor-pointer accent-edu-accent"
            />
            <span className="w-8">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex flex-1 justify-end items-center gap-2">
          <svg className="size-4 text-edu-muted" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="h-1 w-20 cursor-pointer accent-edu-accent"
          />
        </div>
      </div>
    </div>
  );
}
