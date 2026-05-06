import type { MusicGenerationParams } from "@/domains/music/music.types";

const GRADIO_URL =
  process.env.ACESTEP_GRADIO_URL ?? "http://localhost:7860";

export interface AceStepTaskResult {
  task_id: string;
  status: "queued" | "running" | "succeeded" | "failed";
  audio_paths?: string[];
  generation_details?: string;
  error?: string;
}

export interface AceStepReleaseTaskResponse {
  code: number;
  data: { task_id: string; status: string };
  error: string | null;
  timestamp: number;
}

export interface AceStepQueryResultResponse {
  code: number;
  data: Array<{
    task_id: string;
    status: number; // 0=running, 1=succeeded, 2=failed
    audio_paths?: string[];
    generation_details?: string;
    error?: string;
  }>;
  error: string | null;
  timestamp: number;
}

/**
 * ヘルスチェック — ACE-Stepの/healthエンドポイント使用
 * フォールバックでGradio /info と / も確認
 */
export async function isGradioAvailable(): Promise<boolean> {
  const candidates = [
    `${GRADIO_URL}/health`,
    `${GRADIO_URL}/gradio_api/info`,
    `${GRADIO_URL}/info`,
    `${GRADIO_URL}/`,
  ];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return true;
    } catch {
      // 次の候補を試す
    }
  }
  return false;
}

/**
 * MusicGenerationParamsをACE-Step /release_taskのJSON bodyに変換
 */
function buildReleaseTaskPayload(params: MusicGenerationParams): Record<string, unknown> {
  return {
    task_type: params.taskType ?? "text2music",
    prompt: params.style ?? "",
    lyrics: params.lyrics ?? "",
    bpm: params.bpm ?? 0,
    key_scale: params.key ?? "",
    time_signature: params.timeSignature ?? "4/4",
    vocal_language: "ja",
    inference_steps: params.inferenceSteps ?? 8,
    guidance_scale: params.guidanceScale ?? 7.0,
    seed: params.seed ?? -1,
    thinking: params.useLM ?? false,
    lm_temperature: 0.85,
    lm_cfg_scale: 2.0,
    lm_negative_prompt: "NO USER INPUT",
    audio_duration: params.duration ?? -1,
    batch_size: params.batchSize ?? 1,
    audio_format: "mp3",
  };
}

/**
 * タスクをACE-Stepに送信 (同期的 — Gradio UIサーバーの場合は完了までブロック)
 */
export async function submitGradioTask(
  params: MusicGenerationParams,
): Promise<AceStepTaskResult> {
  const payload = buildReleaseTaskPayload(params);

  const res = await fetch(`${GRADIO_URL}/release_task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`ACE-Step /release_task failed: ${res.status} — ${text}`);
  }

  const json = (await res.json()) as AceStepReleaseTaskResponse;

  if (json.code !== 200) {
    throw new Error(json.error ?? "ACE-Step returned error");
  }

  const { task_id } = json.data;

  // 同期モードではすでに完了している可能性がある
  // 非同期モードのためにクエリも試す
  return pollTaskResult(task_id);
}

/**
 * タスク結果をポーリング
 * status: 0=running, 1=succeeded, 2=failed
 */
export async function pollTaskResult(
  taskId: string,
  maxAttempts = 60,
  intervalMs = 3000,
): Promise<AceStepTaskResult> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${GRADIO_URL}/query_result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id_list: [taskId] }),
      });

      if (!res.ok) {
        await new Promise((r) => setTimeout(r, intervalMs));
        continue;
      }

      const json = (await res.json()) as AceStepQueryResultResponse;
      const result = json.data?.[0];

      if (!result) {
        await new Promise((r) => setTimeout(r, intervalMs));
        continue;
      }

      if (result.status === 1) {
        return {
          task_id: taskId,
          status: "succeeded",
          audio_paths: result.audio_paths,
          generation_details: result.generation_details,
        };
      }

      if (result.status === 2) {
        return {
          task_id: taskId,
          status: "failed",
          error: result.error ?? "Generation failed on ACE-Step server",
        };
      }

      // status === 0, まだ実行中
      await new Promise((r) => setTimeout(r, intervalMs));
    } catch {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }

  return {
    task_id: taskId,
    status: "failed",
    error: "Generation timed out",
  };
}

/**
 * ACE-Stepサーバーから音声ファイルをダウンロード
 */
export async function downloadAudio(
  audioPath: string,
): Promise<{ buffer: ArrayBuffer; contentType: string }> {
  const url = `${GRADIO_URL}/v1/audio?path=${encodeURIComponent(audioPath)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Audio download failed: ${res.status}`);
  }

  const contentType = res.headers.get("content-type") ?? "audio/mpeg";
  const buffer = await res.arrayBuffer();

  return { buffer, contentType };
}
