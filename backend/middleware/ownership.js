export const checkOwnership = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next()
  }
  if (String(req.paper.uploadedBy) !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
}

