import { db } from "@/lib/db";
import type { GenerationJob, MusicGenerationParams, Song } from "./music.types";

export async function getSongs(limit = 50): Promise<Song[]> {
  return db.song.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  }) as unknown as Song[];
}

export async function getSongById(id: string): Promise<Song | null> {
  return db.song.findUnique({ where: { id } }) as unknown as Song | null;
}

export async function createSong(
  data: Partial<Pick<Song, "title" | "lyrics" | "style" | "bpm" | "keySignature" | "timeSignature">>,
): Promise<Song> {
  return db.song.create({ data }) as unknown as Song;
}

export async function updateSong(
  id: string,
  data: Partial<Pick<Song, "title" | "audioPath" | "duration" | "bpm" | "keySignature" | "timeSignature">>,
): Promise<Song> {
  return db.song.update({ where: { id }, data }) as unknown as Song;
}

export async function deleteSong(id: string): Promise<void> {
  await db.song.delete({ where: { id } });
}

export async function createJob(
  params: MusicGenerationParams,
  songId?: string,
): Promise<GenerationJob> {
  return db.generationJob.create({
    data: {
      params: params as object,
      songId: songId ?? null,
      status: "queued",
    },
  }) as unknown as GenerationJob;
}

export async function getJobById(id: string): Promise<GenerationJob | null> {
  return db.generationJob.findUnique({ where: { id } }) as unknown as GenerationJob | null;
}

export async function updateJob(
  id: string,
  data: Partial<Pick<GenerationJob, "status" | "progress" | "stage" | "errorMessage" | "gradioEventId" | "songId">>,
): Promise<GenerationJob> {
  return db.generationJob.update({
    where: { id },
    data,
  }) as unknown as GenerationJob;
}

export async function getRecentJobs(limit = 20): Promise<GenerationJob[]> {
  return db.generationJob.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  }) as unknown as GenerationJob[];
}
