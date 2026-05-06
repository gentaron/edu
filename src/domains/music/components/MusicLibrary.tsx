"use client";

import { useEffect, useState } from "react";
import type { Song } from "../music.types";
import { SongCard } from "./SongCard";

interface MusicLibraryProps {
  refreshKey?: number;
}

export function MusicLibrary({ refreshKey }: MusicLibraryProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/music/songs")
      .then((r) => r.json())
      .then((data: Song[]) => setSongs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  async function handleDelete(id: string) {
    await fetch(`/api/music/songs/${id}`, { method: "DELETE" });
    setSongs((prev) => prev.filter((s) => s.id !== id));
  }

  const filtered = search
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.style?.toLowerCase().includes(search.toLowerCase()),
      )
    : songs;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-edu-text">ライブラリ</h2>
        <span className="text-sm text-edu-muted">({songs.length} 曲)</span>
      </div>

      <input
        type="search"
        placeholder="曲名・スタイルで検索..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg border border-edu-border bg-edu-surface px-3 py-2 text-sm text-edu-text placeholder:text-edu-muted focus:border-edu-accent focus:outline-none"
      />

      {loading ? (
        <div className="py-12 text-center text-edu-muted">読み込み中...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-edu-muted">
          {songs.length === 0
            ? "まだ曲がありません。最初の曲を生成してみましょう！"
            : "該当する曲がありません"}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((song) => (
            <SongCard key={song.id} song={song} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
