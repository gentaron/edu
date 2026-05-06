import type { MusicGenerationParams } from "@/domains/music/music.types";

const GRADIO_URL =
  process.env.ACESTEP_GRADIO_URL ?? "http://localhost:8001";

export interface GradioQueueEvent {
  event_id: string;
}

export interface GradioJobStatus {
  status: "pending" | "processing" | "complete" | "error";
  progress?: number;
  output?: {
    data: unknown[];
  };
  error?: string;
}

function buildGradioPayload(params: MusicGenerationParams): unknown[] {
  return [
    params.taskType ?? "text2music",
    params.lyrics ?? "",
    params.style ?? "",
    params.duration ?? 60,
    params.bpm ?? -1,
    params.key ?? "",
    params.timeSignature ?? "4/4",
    params.inferenceSteps ?? 60,
    params.guidanceScale ?? 15,
    params.seed ?? -1,
    params.batchSize ?? 1,
    params.useLM ?? false,
    params.lmModelPath ?? "",
    params.refAudioPath ?? "",
    params.refAudioStrength ?? 0.5,
    params.repaintStart ?? 0,
    params.repaintEnd ?? 0,
    params.taskId ?? "",
  ];
}

export async function submitGradioJob(
  params: MusicGenerationParams,
): Promise<GradioQueueEvent> {
  const payload = buildGradioPayload(params);

  const res = await fetch(`${GRADIO_URL}/queue/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fn_index: 1,
      data: payload,
      session_hash: crypto.randomUUID().replace(/-/g, "").slice(0, 16),
    }),
  });

  if (!res.ok) {
    throw new Error(`Gradio queue/join failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as GradioQueueEvent;
}

export async function pollGradioStatus(
  eventId: string,
): Promise<GradioJobStatus> {
  const res = await fetch(
    `${GRADIO_URL}/queue/status?session_hash=${eventId}`,
  );

  if (!res.ok) {
    throw new Error(`Gradio status poll failed: ${res.status}`);
  }

  return (await res.json()) as GradioJobStatus;
}

export async function runGradioPredict(
  params: MusicGenerationParams,
): Promise<{ audioUrls: string[] }> {
  const payload = buildGradioPayload(params);

  const res = await fetch(`${GRADIO_URL}/run/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fn_index: 1, data: payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gradio predict failed: ${res.status} — ${text}`);
  }

  const json = (await res.json()) as { data: unknown[] };
  const audioUrls: string[] = [];

  for (const item of json.data) {
    if (typeof item === "string" && item.startsWith("http")) {
      audioUrls.push(item);
    } else if (
      item !== null &&
      typeof item === "object" &&
      "url" in item &&
      typeof (item as Record<string, unknown>).url === "string"
    ) {
      audioUrls.push((item as Record<string, unknown>).url as string);
    }
  }

  return { audioUrls };
}

export async function isGradioAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${GRADIO_URL}/info`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
