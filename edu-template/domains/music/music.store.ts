"use client";

import { create } from "zustand";
import type { Song, GenerationJob } from "./music.types";

interface MusicStore {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  activeJob: GenerationJob | null;

  playSong: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
  setActiveJob: (job: GenerationJob | null) => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
  currentSong: null,
  isPlaying: false,
  progress: 0,
  volume: 1,
  activeJob: null,

  playSong: (song) => set({ currentSong: song, isPlaying: true, progress: 0 }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  setProgress: (progress) => set({ progress }),
  setVolume: (volume) => set({ volume }),
  setActiveJob: (job) => set({ activeJob: job }),
}));
