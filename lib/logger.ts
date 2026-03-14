import 'server-only'

/**
 * Structured logging utility for Axiom integration.
 * Emits JSON log entries compatible with Axiom's ingestion format.
 * next-axiom captures console.log/console.error automatically.
 *
 * Schema Version: 2.0.0
 * Last Updated: 2026-03-13
 *
 * Log Categories:
 * - api_request: Successful API calls with timing and cache info
 * - api_error: Failed API calls with error details
 * - cart_lifecycle: Cart creation, reads, updates, deletions
 * - cache_event: Cache invalidation and revalidation events
 * - page_view: Server-side page render events
 * - user_action: Client-initiated user interactions
 * - system_event: System-level events (startup, config changes)
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LogCategory =
  | 'api_request'
  | 'api_error'
  | 'cart_lifecycle'
  | 'cache_event'
  | 'page_view'
  | 'user_action'
  | 'system_event'

export type CacheStrategy = 'use_cache' | 'no_cache' | 'suspense_stream' | 'stale_while_revalidate'

export type CartAction = 'create' | 'read' | 'add' | 'update' | 'remove' | 'clear'

export type UserActionType =
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'update_quantity'
  | 'view_product'
  | 'search'
  | 'filter'
  | 'checkout_start'
  | 'checkout_complete'

export interface BaseLogEntry {
  /** Log severity level */
  level: LogLevel
  /** Service identifier for filtering */
  service: 'swag-store-api' | 'swag-store-web'
  /** Event category for grouping */
  category: LogCategory
  /** ISO 8601 timestamp */
  timestamp: string
  /** Operation duration in milliseconds */
  durationMs: number
  /** Whether the operation succeeded */
  success: boolean
  /** Vercel environment (production, preview, development) */
  environment?: string
  /** Vercel region where the request was processed */
  region?: string
  /** Unique request ID for tracing */
  requestId?: string
  /** User session identifier (anonymized) */
  sessionId?: string
}

export interface ApiLogEntry extends BaseLogEntry {
  service: 'swag-store-api'
  category: 'api_request' | 'api_error' | 'cart_lifecycle' | 'cache_event'
  /** HTTP method (GET, POST, PATCH, DELETE) */
  method: string
  /** Request path */
  path: string
  /** Endpoint name for easy filtering */
  endpoint: string
  /** HTTP status code */
  status?: number
  /** Request parameters */
  params?: Record<string, string | number | boolean | undefined>
  /** Caching strategy used */
  cacheStrategy?: CacheStrategy
  /** Cache tags for invalidation */
  cacheTags?: string[]
  /** Cache profile name (hours, days, max) */
  cacheProfile?: string
  /** Whether cart token was present */
  cartTokenPresent?: boolean
  /** Cart operation type */
  cartAction?: CartAction
  /** Error code for categorization */
  errorCode?: string
  /** Human-readable error message */
  errorMessage?: string
  /** Response body size in bytes */
  responseSize?: number
}

export interface PageViewLogEntry extends BaseLogEntry {
  service: 'swag-store-web'
  category: 'page_view'
  /** Page route path */
  route: string
  /** Page title */
  pageTitle?: string
  /** Query parameters */
  searchParams?: Record<string, string>
  /** Referrer URL */
  referrer?: string
  /** User agent string */
  userAgent?: string
}

export interface UserActionLogEntry extends BaseLogEntry {
  service: 'swag-store-web'
  category: 'user_action'
  /** Type of user action */
  actionType: UserActionType
  /** Target of the action (product ID, search term, etc.) */
  target?: string
  /** Additional action metadata */
  metadata?: Record<string, string | number | boolean>
}

export interface SystemEventLogEntry extends BaseLogEntry {
  service: 'swag-store-api' | 'swag-store-web'
  category: 'system_event'
  /** Event name */
  eventName: string
  /** Event details */
  details?: Record<string, string | number | boolean>
}

export type LogEntry = ApiLogEntry | PageViewLogEntry | UserActionLogEntry | SystemEventLogEntry

/**
 * Enriches and emits a log entry as single-line JSON.
 * Uses console.log for info/warn, console.error for errors.
 * next-axiom captures these automatically.
 *
 * @param entry - The log entry to emit (API, PageView, UserAction, or SystemEvent)
 */
export function emitLog(entry: LogEntry): void {
  const enrichedEntry = {
    ...entry,
    environment: entry.environment ?? process.env.VERCEL_ENV ?? 'development',
    region: entry.region ?? process.env.VERCEL_REGION ?? 'local',
    // Add deployment-specific metadata
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
    gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA,
  }

  const jsonLine = JSON.stringify(enrichedEntry)

  switch (entry.level) {
    case 'error':
      console.error(jsonLine)
      break
    case 'warn':
      console.warn(jsonLine)
      break
    case 'debug':
      // Only emit debug logs in development
      if (process.env.NODE_ENV === 'development') {
        console.log(jsonLine)
      }
      break
    default:
      console.log(jsonLine)
  }
}

/**
 * Emits a page view log entry for server-side rendered pages.
 */
export function emitPageView(
  route: string,
  options?: Partial<Omit<PageViewLogEntry, 'category' | 'service' | 'route'>>
): void {
  emitLog({
    level: 'info',
    service: 'swag-store-web',
    category: 'page_view',
    route,
    timestamp: new Date().toISOString(),
    durationMs: options?.durationMs ?? 0,
    success: true,
    ...options,
  })
}

/**
 * Emits a user action log entry.
 */
export function emitUserAction(
  actionType: UserActionType,
  options?: Partial<Omit<UserActionLogEntry, 'category' | 'service' | 'actionType'>>
): void {
  emitLog({
    level: 'info',
    service: 'swag-store-web',
    category: 'user_action',
    actionType,
    timestamp: new Date().toISOString(),
    durationMs: options?.durationMs ?? 0,
    success: options?.success ?? true,
    ...options,
  })
}

/**
 * Emits a system event log entry.
 */
export function emitSystemEvent(
  eventName: string,
  options?: Partial<Omit<SystemEventLogEntry, 'category' | 'eventName'>>
): void {
  emitLog({
    level: options?.level ?? 'info',
    service: options?.service ?? 'swag-store-api',
    category: 'system_event',
    eventName,
    timestamp: new Date().toISOString(),
    durationMs: 0,
    success: true,
    ...options,
  })
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
 * Creates a base API log entry with common fields populated.
 * Use this to reduce boilerplate when creating log entries.
 */
export function createApiLogEntry(
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

/**
 * @deprecated Use createApiLogEntry instead
 */
export const createLogEntry = createApiLogEntry

/**
 * Generates a unique request ID for tracing.
 */
export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`
}
