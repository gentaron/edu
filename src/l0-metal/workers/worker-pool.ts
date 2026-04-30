/* ═══════════════════════════════════════════════════════════════
   L0 METAL — Generic Typed Worker Pool
   Manages a pool of Web Workers with support for:
   - Task queuing and round-robin distribution
   - Transferable Objects (ArrayBuffer, etc.)
   - Per-task timeout
   - Correlation IDs for response matching

   The pool embeds a correlation `id` in every message sent to workers.
   Workers must echo this `id` back in their response for the pool
   to resolve the correct promise.
   ═══════════════════════════════════════════════════════════════ */

// ── Types ──

interface WorkerTask<TRequest, TResponse> {
  readonly id: string
  readonly payload: TRequest
  readonly transferables: Transferable[] | undefined
  readonly resolve: (response: TResponse) => void
  readonly reject: (error: Error) => void
  readonly timeoutId: ReturnType<typeof setTimeout> | undefined
}

export interface PoolOptions {
  readonly workerCount?: number
  readonly workerUrl: string | URL
}

// ── ID Generator ──

let idCounter = 0

function generateTaskId(): string {
  idCounter += 1
  return `task-${idCounter}-${Date.now()}`
}

// ── Worker Pool ──

export class WorkerPool<TRequest = unknown, TResponse = unknown> {
  private workers: Worker[]
  private taskQueue: WorkerTask<TRequest, TResponse>[]
  private activeTasks: Map<string, WorkerTask<TRequest, TResponse>>
  private idleWorkers: Worker[]
  private terminated = false

  constructor(options: PoolOptions) {
    const count =
      options.workerCount ??
      (typeof navigator !== "undefined" ? (navigator.hardwareConcurrency ?? 4) : 4)

    this.workers = []
    this.taskQueue = []
    this.activeTasks = new Map()
    this.idleWorkers = []

    for (let i = 0; i < count; i++) {
      const worker = new Worker(options.workerUrl)
      worker.onmessage = (event: MessageEvent<TResponse>) => {
        this.handleWorkerMessage(worker, event)
      }
      worker.onerror = (event: ErrorEvent) => {
        this.handleWorkerError(worker, event)
      }
      this.workers.push(worker)
      this.idleWorkers.push(worker)
    }
  }

  /**
   * Submit a task to the pool.
   * Returns a Promise that resolves with the worker's response.
   * If no idle workers, the task is queued and dispatched when one becomes available.
   *
   * The pool embeds a correlation `id` in the message sent to the worker.
   * The worker MUST echo this `id` back in its response message for
   * the pool to resolve the correct promise.
   */
  submit(payload: TRequest, transferables?: Transferable[], timeout?: number): Promise<TResponse> {
    if (this.terminated) {
      return Promise.reject(new Error("WorkerPool has been terminated"))
    }

    const id = generateTaskId()
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const promise = new Promise<TResponse>((resolve, reject) => {
      if (timeout !== undefined && timeout > 0) {
        timeoutId = setTimeout(() => {
          // Remove from active tasks
          this.activeTasks.delete(id)
          // Remove from queue if still queued
          const queueIdx = this.taskQueue.findIndex((t) => t.id === id)
          if (queueIdx !== -1) {
            this.taskQueue.splice(queueIdx, 1)
          }
          reject(new Error(`Task ${id} timed out after ${timeout}ms`))
        }, timeout)
      }

      const task: WorkerTask<TRequest, TResponse> = {
        id,
        payload,
        transferables,
        resolve,
        reject,
        timeoutId,
      }

      // Try to dispatch immediately to an idle worker
      const idleWorker = this.idleWorkers.shift()
      if (idleWorker !== undefined) {
        this.dispatchTask(idleWorker, task)
      } else {
        this.taskQueue.push(task)
      }
    })

    return promise
  }

  /** Terminate all workers and reject all pending/active tasks. */
  terminate(): void {
    if (this.terminated) return
    this.terminated = true

    // Reject all queued tasks
    for (const task of this.taskQueue) {
      this.clearTaskTimeout(task)
      task.reject(new Error("WorkerPool terminated"))
    }
    this.taskQueue = []

    // Reject all active tasks
    for (const [, task] of this.activeTasks) {
      this.clearTaskTimeout(task)
      task.reject(new Error("WorkerPool terminated"))
    }
    this.activeTasks.clear()

    // Terminate all workers
    for (const worker of this.workers) {
      worker.terminate()
    }
    this.workers = []
    this.idleWorkers = []
  }

  /** Get the number of tasks waiting in the queue. */
  getPendingCount(): number {
    return this.taskQueue.length
  }

  /** Get the number of tasks currently being processed. */
  getActiveCount(): number {
    return this.activeTasks.size
  }

  /** Get the total number of workers in the pool. */
  getWorkerCount(): number {
    return this.workers.length
  }

  /** Check if all workers are idle (no active or pending tasks). */
  isIdle(): boolean {
    return this.activeTasks.size === 0 && this.taskQueue.length === 0
  }

  // ── Private Methods ──

  /**
   * Dispatch a task to a worker.
   * Embeds the correlation id in the message so the worker can echo it back.
   */
  private dispatchTask(worker: Worker, task: WorkerTask<TRequest, TResponse>): void {
    this.activeTasks.set(task.id, task)
    // Merge the task id into the payload so the worker receives it.
    // The payload is spread first, then id is set (overriding any existing id).
    const message = {
      ...(task.payload as Record<string, unknown>),
      id: task.id,
    }
    worker.postMessage(message, task.transferables ?? [])
  }

  private handleWorkerMessage(worker: Worker, event: MessageEvent<TResponse>): void {
    const data = event.data as Record<string, unknown>
    const taskId = data.id as string | undefined

    if (taskId === undefined) {
      // Malformed response — no correlation id — ignore
      return
    }

    const task = this.activeTasks.get(taskId)
    if (task === undefined) {
      // Unknown task ID — ignore
      return
    }

    this.activeTasks.delete(taskId)
    this.clearTaskTimeout(task)

    // Check for error response
    if (data.type === "ERROR") {
      const payload = data.payload as Record<string, unknown> | undefined
      const errorMsg =
        payload?.error !== undefined ? String(payload.error) : "Worker returned ERROR"
      task.reject(new Error(errorMsg))
    } else {
      task.resolve(event.data as TResponse)
    }

    // Worker is now idle — dispatch next queued task
    this.idleWorkers.push(worker)
    this.dispatchNextQueuedTask()
  }

  private handleWorkerError(worker: Worker, event: ErrorEvent): void {
    // Find the task associated with this worker (if any)
    const firstTask = this.activeTasks.values().next().value as
      | WorkerTask<TRequest, TResponse>
      | undefined

    if (firstTask !== undefined) {
      this.activeTasks.delete(firstTask.id)
      this.clearTaskTimeout(firstTask)
      firstTask.reject(new Error(`Worker error: ${event.message ?? "unknown error"}`))
    }

    // Worker is still technically usable after error — make idle
    this.idleWorkers.push(worker)
    this.dispatchNextQueuedTask()
  }

  private dispatchNextQueuedTask(): void {
    const nextTask = this.taskQueue.shift()
    if (nextTask === undefined) return

    const idleWorker = this.idleWorkers.shift()
    if (idleWorker !== undefined) {
      this.dispatchTask(idleWorker, nextTask)
    } else {
      // No idle workers — put it back at the front of the queue
      this.taskQueue.unshift(nextTask)
    }
  }

  private clearTaskTimeout(task: WorkerTask<TRequest, TResponse>): void {
    if (task.timeoutId !== undefined) {
      clearTimeout(task.timeoutId)
    }
  }
}
