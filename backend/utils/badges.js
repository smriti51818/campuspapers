import User from '../models/User.js'
import Paper from '../models/Paper.js'

const BADGES = {
  FIRST_UPLOAD: 'first_upload',
  TEN_UPLOADS: 'ten_uploads',
  FIFTY_UPLOADS: 'fifty_uploads',
  HUNDRED_UPLOADS: 'hundred_uploads',
  POPULAR: 'popular', // 1000+ total views
  QUALITY_CONTRIBUTOR: 'quality_contributor', // 10+ approved papers
  TOP_CONTRIBUTOR: 'top_contributor' // 50+ approved papers
}

const BADGE_NAMES = {
  [BADGES.FIRST_UPLOAD]: 'First Upload',
  [BADGES.TEN_UPLOADS]: 'Contributor',
  [BADGES.FIFTY_UPLOADS]: 'Active Contributor',
  [BADGES.HUNDRED_UPLOADS]: 'Super Contributor',
  [BADGES.POPULAR]: 'Popular',
  [BADGES.QUALITY_CONTRIBUTOR]: 'Quality Contributor',
  [BADGES.TOP_CONTRIBUTOR]: 'Top Contributor'
}

export const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId)
    if (!user) return

    const approvedPapers = await Paper.countDocuments({
      uploadedBy: userId,
      status: 'approved'
    })

    const allPapers = await Paper.find({ uploadedBy: userId, status: 'approved' })
    const totalViews = allPapers.reduce((sum, p) => sum + (p.views || 0), 0)

    const newBadges = [...(user.badges || [])]

    // First upload
    if (approvedPapers >= 1 && !newBadges.includes(BADGES.FIRST_UPLOAD)) {
      newBadges.push(BADGES.FIRST_UPLOAD)
    }

    // Ten uploads
    if (approvedPapers >= 10 && !newBadges.includes(BADGES.TEN_UPLOADS)) {
      newBadges.push(BADGES.TEN_UPLOADS)
    }

    // Fifty uploads
    if (approvedPapers >= 50 && !newBadges.includes(BADGES.FIFTY_UPLOADS)) {
      newBadges.push(BADGES.FIFTY_UPLOADS)
    }

    // Hundred uploads
    if (approvedPapers >= 100 && !newBadges.includes(BADGES.HUNDRED_UPLOADS)) {
      newBadges.push(BADGES.HUNDRED_UPLOADS)
    }

    // Popular (1000+ views)
    if (totalViews >= 1000 && !newBadges.includes(BADGES.POPULAR)) {
      newBadges.push(BADGES.POPULAR)
    }

    // Quality Contributor (10+ approved)
    if (approvedPapers >= 10 && !newBadges.includes(BADGES.QUALITY_CONTRIBUTOR)) {
      newBadges.push(BADGES.QUALITY_CONTRIBUTOR)
    }

    // Top Contributor (50+ approved)
    if (approvedPapers >= 50 && !newBadges.includes(BADGES.TOP_CONTRIBUTOR)) {
      newBadges.push(BADGES.TOP_CONTRIBUTOR)
    }

    if (newBadges.length !== user.badges?.length) {
      await User.findByIdAndUpdate(userId, { badges: newBadges })
      return newBadges.filter(b => !user.badges?.includes(b))
    }

    return []
  } catch (e) {
    console.error('Error checking badges:', e)
    return []
  }
}

export { BADGES, BADGE_NAMES }


