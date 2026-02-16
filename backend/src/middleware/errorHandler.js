/**
 * Global error handler middleware
 */

import { logger } from '../lib/logger.js'

export function errorHandler(err, req, res, next) {
  logger.error('Request error', {
    method: req.method,
    path: req.path,
    errorName: err.name,
    errorCode: err.code,
    message: err.message,
  })

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    })
  }

  // Prisma errors
  if (err.code?.startsWith('P')) {
    const prismaErrors = {
      P2002: { status: 409, message: 'A record with this value already exists' },
      P2025: { status: 404, message: 'Record not found' },
      P2003: { status: 400, message: 'Invalid reference' }
    }
    
    const error = prismaErrors[err.code] || { status: 500, message: 'Database error' }
    return res.status(error.status).json({ error: error.message })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' })
  }

  // Default error
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

/**
 * Async handler wrapper to catch errors
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
