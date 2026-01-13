import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'

const router = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }
    
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email in use' })
    
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hash, role: role || 'student' })
    const token = generateToken(user)
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    console.error('Signup error:', e)
    res.status(500).json({ message: 'Signup failed', error: process.env.NODE_ENV === 'development' ? e.message : undefined })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' })
    
    const token = generateToken(user)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    console.error('Login error:', e)
    res.status(500).json({ message: 'Login failed', error: process.env.NODE_ENV === 'development' ? e.message : undefined })
  }
})

export default router
