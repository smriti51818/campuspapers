import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import paperRoutes from './routes/papers.js'
import leaderboardRoutes from './routes/leaderboard.js'

dotenv.config()

const app = express()

// CORS configuration - supports both development and production
const getCorsOrigin = () => {
  // Allow all origins in development or if explicitly set
  if (process.env.NODE_ENV !== 'production' || process.env.CLIENT_URL === '*') {
    return '*'
  }
  
  const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']
  
  if (process.env.CLIENT_URL) {
    try {
      // Handle comma-separated URLs
      const urls = process.env.CLIENT_URL.split(',').map(url => url.trim()).filter(url => url)
      
      const origins = [...urls]
      
      // Add localhost variants for development
      urls.forEach(url => {
        try {
          const urlObj = new URL(url)
          if (urlObj.hostname === 'localhost') {
            origins.push(`http://127.0.0.1:${urlObj.port || ''}`)
          } else if (urlObj.hostname === '127.0.0.1') {
            origins.push(`http://localhost:${urlObj.port || ''}`)
          }
        } catch (e) {
          // Skip invalid URLs
        }
      })
      
      // Always include localhost for development
      origins.push(...defaultOrigins)
      
      return [...new Set(origins)] // Remove duplicates
    } catch (e) {
      console.error('Error parsing CLIENT_URL:', e)
      // Fallback: allow all in production if CLIENT_URL is invalid
      return '*'
    }
  }
  
  // In production without CLIENT_URL, allow all (less secure but works)
  console.warn('CLIENT_URL not set in production, allowing all origins')
  return '*'
}

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getCorsOrigin()
    
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins === '*' || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.log('CORS blocked origin:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))

app.get('/', (req, res) => {
  res.json({ 
    message: 'CampusPapers Backend API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      papers: '/api/papers',
      leaderboard: '/api/leaderboard'
    }
  })
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api', paperRoutes)
app.use('/api', leaderboardRoutes)

const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (e) {
    console.error('Failed to start server:', e.message)
    process.exit(1)
  }
}

start()
