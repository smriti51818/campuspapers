import express from 'express'
import User from '../models/User.js'
import Paper from '../models/Paper.js'

const router = express.Router()

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'uploads' } = req.query
    
    let leaderboard = []
    
    if (type === 'uploads') {
      // Leaderboard by number of approved papers
      const users = await User.find({ role: 'student' })
        .select('name email stats badges')
        .lean()
      
      for (const user of users) {
        const approvedCount = await Paper.countDocuments({
          uploadedBy: user._id,
          status: 'approved'
        })
        leaderboard.push({
          ...user,
          score: approvedCount,
          id: user._id
        })
      }
      
      leaderboard.sort((a, b) => b.score - a.score)
    } else if (type === 'views') {
      // Leaderboard by total views on user's papers
      const users = await User.find({ role: 'student' })
        .select('name email stats badges')
        .lean()
      
      for (const user of users) {
        const papers = await Paper.find({ uploadedBy: user._id, status: 'approved' })
        const totalViews = papers.reduce((sum, p) => sum + (p.views || 0), 0)
        leaderboard.push({
          ...user,
          score: totalViews,
          id: user._id
        })
      }
      
      leaderboard.sort((a, b) => b.score - a.score)
    }
    
    res.json(leaderboard.slice(0, 100)) // Top 100
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch leaderboard' })
  }
})

// Get user badges
router.get('/badges/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('badges stats name')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch badges' })
  }
})

export default router


