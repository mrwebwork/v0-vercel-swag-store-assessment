import 'server-only'

/**
 * Structured logging utility for Axiom integration.
 * Emits JSON log entries compatible with Axiom's ingestion format.
 * next-axiom captures console.log/console.error automatically.
 */

export type LogLevel = 'info' | 'warn' | 'error'

export type LogCategory = 'api_request' | 'api_error' | 'cart_lifecycle' | 'cache_event'

export type CacheStrategy = 'use_cache' | 'no_cache' | 'suspense_stream'

export type CartAction = 'create' | 'read' | 'add' | 'update' | 'remove'

export interface ApiLogEntry {
  level: LogLevel
  service: 'swag-store-api'
  category: LogCategory
  method: string
  path: string
  endpoint: string
  timestamp: string
  durationMs: number
  status?: number
  success: boolean
  params?: Record<string, string | number | boolean | undefined>
  cacheStrategy?: CacheStrategy
  cacheTags?: string[]
  cacheProfile?: string
  cartTokenPresent?: boolean
  cartAction?: CartAction
  errorCode?: string
  errorMessage?: string
}

/**
 * Enriches and emits a log entry as single-line JSON.
 * Uses console.log for info/warn, console.error for errors.
 * next-axiom captures these automatically.
 */
export function emitLog(entry: ApiLogEntry): void {
  const enrichedEntry = {
    ...entry,
    environment: process.env.VERCEL_ENV ?? 'development',
    region: process.env.VERCEL_REGION ?? 'local',
  }

  const jsonLine = JSON.stringify(enrichedEntry)

  if (entry.level === 'error') {
    console.error(jsonLine)
  } else {
    console.log(jsonLine)
  }
}

/**
 * Creates a timer function that measures elapsed time in milliseconds.
 * @returns A function that, when called, returns the elapsed time since startTimer() was called.
 */
export function startTimer(): () => number {
  const start = performance.now()
  return () => Math.round(performance.now() - start)
}

/**
 * Creates a base log entry with common fields populated.
 * Use this to reduce boilerplate when creating log entries.
 */
export function createLogEntry(
  overrides: Partial<ApiLogEntry> & Pick<ApiLogEntry, 'method' | 'path' | 'endpoint'>
): Omit<ApiLogEntry, 'durationMs' | 'success'> {
  return {
    level: 'info',
    service: 'swag-store-api',
    category: 'api_request',
    timestamp: new Date().toISOString(),
    ...overrides,
  }
}
