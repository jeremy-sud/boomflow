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
    version: '2.0.0',
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
app.listen(PORT, () => {
  console.log(`🚀 BOOMFLOW API running on port ${PORT}`)
  console.log(`📊 Health: http://localhost:${PORT}/health`)
})

export default app
