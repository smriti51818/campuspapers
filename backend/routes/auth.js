import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'
import { protect, requireRole } from '../middleware/auth.js'

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
  const start = Date.now()
  let t1, t2, t3, t4
  try {
    const { email, password } = req.body
    t1 = Date.now()
    if (!email || !password) {
      console.log(`[LOGIN TIMING] missing fields: ${Date.now() - start}ms`)
      return res.status(400).json({ message: 'Email and password are required', code: 'MISSING_FIELDS' })
    }
    // Validate email format
    // Must be a valid email: at least one char before @, at least one char for domain, a dot, and at least 2 chars after dot (any domain)
    const emailRegex = /^[^\s@]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/
    if (!emailRegex.test(email)) {
      console.log(`[LOGIN TIMING] invalid email format: ${Date.now() - start}ms`)
      return res.status(400).json({ message: `Please enter a part following '@'. '${email}' is incomplete.`, code: 'INVALID_EMAIL_FORMAT' })
    }
    t2 = Date.now()
    const user = await User.findOne({ email: email.toLowerCase() })
    t3 = Date.now()
    if (!user) {
      console.log(`[LOGIN TIMING] user not found: query=${t3 - t2}ms total=${Date.now() - start}ms`)
      return res.status(400).json({ message: 'Email address does not exist. Please sign up first.', code: 'EMAIL_NOT_FOUND' })
    }
    const ok = await bcrypt.compare(password, user.password)
    t4 = Date.now()
    if (!ok) {
      console.log(`[LOGIN TIMING] password mismatch: query=${t3 - t2}ms bcrypt=${t4 - t3}ms total=${Date.now() - start}ms`)
      return res.status(401).json({ message: 'Incorrect password. Please try again.', code: 'INVALID_PASSWORD' })
    }
    const token = generateToken(user)
    const total = Date.now() - start
    console.log(`[LOGIN TIMING] success: query=${t3 - t2}ms bcrypt=${t4 - t3}ms token=${Date.now() - t4}ms total=${total}ms`)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (e) {
    console.error('Login error:', e)
    console.log(`[LOGIN TIMING] error: total=${Date.now() - start}ms`)
    res.status(500).json({ message: 'Login failed. Please try again later.', code: 'SERVER_ERROR', error: process.env.NODE_ENV === 'development' ? e.message : undefined })
  }
})

router.get('/admin/users', protect, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users' })
  }
})

router.delete('/admin/users/:id', protect, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete user' })
  }
})

export default router
