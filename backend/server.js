import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import paperRoutes from './routes/papers.js'
import leaderboardRoutes from './routes/leaderboard.js'

dotenv.config()

const app = express()

// CORS configuration - allow both localhost and 127.0.0.1 for development
const getCorsOrigin = () => {
  if (process.env.CLIENT_URL === '*') return '*'
  
  const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']
  
  if (process.env.CLIENT_URL) {
    try {
      const url = new URL(process.env.CLIENT_URL)
      // Add both localhost and 127.0.0.1 variants
      const origins = [process.env.CLIENT_URL]
      if (url.hostname === 'localhost') {
        origins.push(`http://127.0.0.1:${url.port}`)
      } else if (url.hostname === '127.0.0.1') {
        origins.push(`http://localhost:${url.port}`)
      }
      return origins
    } catch (e) {
      // If CLIENT_URL is not a valid URL, use defaults
      return defaultOrigins
    }
  }
  
  return defaultOrigins
}

app.use(cors({ 
  origin: getCorsOrigin(),
  credentials: true 
}))
app.use(express.json({ limit: '10mb' }))

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
