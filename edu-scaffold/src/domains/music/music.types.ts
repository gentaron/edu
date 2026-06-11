export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export interface Song {
  id: string;
  title: string;
  lyrics: string | null;
  style: string | null;
  duration: number;
  audioPath: string | null;
  bpm: number | null;
  keySignature: string | null;
  timeSignature: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerationJob {
  id: string;
  songId: string | null;
  status: JobStatus;
  params: MusicGenerationParams;
  progress: number;
  stage: string | null;
  errorMessage: string | null;
  gradioEventId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  createdAt: Date;
  songs?: Song[];
}

export interface MusicGenerationParams {
  taskType?: "text2music" | "audio2audio" | "cover" | "repaint";
  lyrics?: string;
  style?: string;
  duration?: number;
  bpm?: number;
  key?: string;
  timeSignature?: string;
  inferenceSteps?: number;
  guidanceScale?: number;
  seed?: number;
  batchSize?: number;
  useLM?: boolean;
  lmModelPath?: string;
  refAudioPath?: string;
  refAudioStrength?: number;
  repaintStart?: number;
  repaintEnd?: number;
  taskId?: string;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  queue: Song[];
}
