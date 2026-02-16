/**
 * Structured Logger for BOOMFLOW Backend
 *
 * Outputs JSON-formatted log lines with level, timestamp, and context.
 * Drop-in replacement for console.log/error/warn with structured output.
 *
 * Usage:
 *   import { logger } from './lib/logger.js'
 *   logger.info('Server started', { port: 3001 })
 *   logger.error('DB connection failed', { error: err.message })
 */

const LOG_LEVELS = { debug: 10, info: 20, warn: 30, error: 40 }

const MIN_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'info'] || LOG_LEVELS.info

function formatLog(level, message, meta = {}) {
  const entry = {
    level,
    ts: new Date().toISOString(),
    msg: message,
    ...meta,
  }

  // In development, pretty-print; in production, single-line JSON
  if (process.env.NODE_ENV === 'development') {
    const icon = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌' }[level] || ''
    const metaStr = Object.keys(meta).length
      ? ' ' + JSON.stringify(meta)
      : ''
    return `${icon} [${level.toUpperCase()}] ${message}${metaStr}`
  }

  return JSON.stringify(entry)
}

function log(level, message, meta) {
  if (LOG_LEVELS[level] < MIN_LEVEL) return

  const output = formatLog(level, message, meta)
  const writer = level === 'error' ? console.error : console.log
  writer(output)
}

export const logger = {
  debug: (msg, meta) => log('debug', msg, meta),
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta),
}
