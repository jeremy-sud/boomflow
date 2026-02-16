/**
 * BOOMFLOW Backend API
 * Main entry point
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import kudosRoutes from './routes/kudos.js'
import badgesRoutes from './routes/badges.js'
import usersRoutes from './routes/users.js'
import syncRoutes from './routes/sync.js'
import { errorHandler } from './middleware/errorHandler.js'
import { logger } from './lib/logger.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
})
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10kb' }))

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/kudos', kudosRoutes)
app.use('/api/badges', badgesRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/sync', syncRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Error handler
app.use(errorHandler)

// Start server
const server = app.listen(PORT, () => {
  logger.info('BOOMFLOW API started', { port: PORT })
  logger.info('Health endpoint', { url: `http://localhost:${PORT}/health` })
})

// Graceful shutdown
function shutdown(signal) {
  logger.info('Shutdown signal received', { signal })
  server.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })
  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

export default app
