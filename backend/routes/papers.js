import express from 'express'
import multer from 'multer'
import axios from 'axios'
import { protect, requireRole } from '../middleware/auth.js'
import { checkOwnership } from '../middleware/ownership.js'
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js'
import { checkAndAwardBadges } from '../utils/badges.js'
import Paper from '../models/Paper.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } })

router.get('/papers', async (req, res) => {
  try {
    const { subject, department, year, sort } = req.query
    const q = {}
    if (subject) q.subject = new RegExp(subject, 'i')
    if (department) q.department = new RegExp(department, 'i')
    if (year) q.year = Number(year)
    const sortBy = sort === 'views' ? { views: -1 } : { createdAt: -1 }
    const items = await Paper.find(q).populate('uploadedBy', 'name').sort(sortBy)
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch' })
  }
})

const getPaperById = async (req, res, next) => {
  try {
    const paper = await Paper.findById(req.params.id)
    if (!paper) return res.status(404).json({ message: 'Not found' })
    req.paper = paper
    next()
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch paper' })
  }
}

router.get('/papers/:id', getPaperById, async (req, res) => {
  try {
    await req.paper.populate('uploadedBy', 'name')
    res.json(req.paper)
  } catch (e) {
    res.status(500).json({ message: 'Failed' })
  }
})

router.post('/papers/:id/view', async (req, res) => {
  try {
    const item = await Paper.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json(item)
  } catch (e) {
    res.status(500).json({ message: 'Failed' })
  }
})

router.post('/papers/upload', protect, upload.single('file'), async (req, res) => {
  try {
    const { department, subject, year, semester, university } = req.body
    if (!req.file) return res.status(400).json({ message: 'No file' })

    const result = await uploadToCloudinary(req.file.buffer)

    try {
      const payload = {
        metadata: { department, subject, year: Number(year), semester, university },
        file_url: result.secure_url
      }
      const ai = await axios.post(`${process.env.AI_SERVICE_URL}/check`, payload)
      const doc = await Paper.create({
        department,
        subject,
        year: Number(year),
        semester,
        university,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        uploadedBy: req.user.id,
        aiResult: ai.data,
        status: 'pending'
      })
      return res.json(doc)
    } catch (e) {
      return res.status(500).json({ message: 'AI failed' })
    }
  } catch (e) {
    res.status(500).json({ message: 'Upload failed' })
  }
})

router.put('/papers/:id', protect, getPaperById, checkOwnership, async (req, res) => {
  try {
    const up = await Paper.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(up)
  } catch (e) {
    res.status(500).json({ message: 'Failed' })
  }
})

router.delete('/papers/:id', protect, getPaperById, checkOwnership, async (req, res) => {
  try {
    await Paper.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ message: 'Failed' })
  }
})

router.get('/admin/papers', protect, requireRole('admin'), async (req, res) => {
  try {
    const { minScore } = req.query
    const q = {}
    if (minScore) q['aiResult.authenticityScore'] = { $gte: Number(minScore) }
    const items = await Paper.find(q).populate('uploadedBy', 'name').sort({ createdAt: -1 })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: 'Failed' })
  }
})

router.put('/admin/papers/:id/approve', protect, requireRole('admin'), async (req, res) => {
  try {
    const up = await Paper.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true })
    // Check and award badges when paper is approved
    if (up && up.uploadedBy) {
      await checkAndAwardBadges(up.uploadedBy)
    }
    res.json(up)
  } catch (e) {
    res.status(500).json({ message: 'Failed' })
  }
})

router.put('/admin/papers/:id/reject', protect, requireRole('admin'), async (req, res) => {
  try {
    const up = await Paper.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true })
    res.json(up)
  } catch (e) {
    res.status(500).json({ message: 'Failed' })
  }
})

export default router
