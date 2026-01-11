import { useEffect, useState } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const BADGE_NAMES = {
  first_upload: 'First Upload',
  ten_uploads: 'Contributor',
  fifty_uploads: 'Active Contributor',
  hundred_uploads: 'Super Contributor',
  popular: 'Popular',
  quality_contributor: 'Quality Contributor',
  top_contributor: 'Top Contributor'
}

const BADGE_ICONS = {
  first_upload: '🎯',
  ten_uploads: '⭐',
  fifty_uploads: '🔥',
  hundred_uploads: '💎',
  popular: '👑',
  quality_contributor: '✨',
  top_contributor: '🏆'
}

const BADGE_GRADIENTS = {
  first_upload: 'from-blue-500 to-cyan-500',
  ten_uploads: 'from-green-500 to-emerald-500',
  fifty_uploads: 'from-purple-500 to-pink-500',
  hundred_uploads: 'from-yellow-400 to-orange-500',
  popular: 'from-pink-500 to-rose-500',
  quality_contributor: 'from-indigo-500 to-blue-500',
  top_contributor: 'from-orange-500 to-red-500'
}

export default function Dashboard() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [badges, setBadges] = useState([])
  const [stats, setStats] = useState({ totalUploads: 0, totalViews: 0, approvedPapers: 0 })

  const load = async () => {
    const { data } = await api.get('/api/papers')
    const me = JSON.parse(localStorage.getItem('user') || 'null')
    const myItems = data.filter(d => d.uploadedBy?._id === me?.id)
    setItems(myItems)
    
    // Calculate stats
    const approved = myItems.filter(i => i.status === 'approved').length
    const totalViews = myItems.reduce((sum, i) => sum + (i.views || 0), 0)
    setStats({
      totalUploads: myItems.length,
      totalViews,
      approvedPapers: approved
    })

    // Load badges
    if (user?.id) {
      try {
        const badgeData = await api.get(`/api/badges/${user.id}`)
        setBadges(badgeData.data.badges || [])
      } catch (e) {
        console.error('Failed to load badges:', e)
      }
    }
  }

  const delItem = async (id) => {
    await api.delete(`/api/papers/${id}`)
    await load()
  }

  useEffect(() => { load() }, [user])

  // Calculate progress to next badge
  const getNextBadgeProgress = () => {
    if (stats.approvedPapers >= 100) return { badge: null, current: 100, target: 100, progress: 100 }
    if (stats.approvedPapers >= 50) return { badge: 'hundred_uploads', current: stats.approvedPapers, target: 100, progress: (stats.approvedPapers / 100) * 100 }
    if (stats.approvedPapers >= 10) return { badge: 'fifty_uploads', current: stats.approvedPapers, target: 50, progress: (stats.approvedPapers / 50) * 100 }
    if (stats.approvedPapers >= 1) return { badge: 'ten_uploads', current: stats.approvedPapers, target: 10, progress: (stats.approvedPapers / 10) * 100 }
    return { badge: 'first_upload', current: stats.approvedPapers, target: 1, progress: stats.approvedPapers > 0 ? 100 : 0 }
  }

  const nextBadge = getNextBadgeProgress()

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
        <p className="text-indigo-100">Track your contributions and achievements</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg card-hover transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📄</div>
            <div className="text-4xl font-bold">{stats.totalUploads}</div>
          </div>
          <div className="text-blue-100 font-medium">Total Uploads</div>
          <div className="text-blue-200 text-sm mt-1">Keep contributing!</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg card-hover transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">✅</div>
            <div className="text-4xl font-bold">{stats.approvedPapers}</div>
          </div>
          <div className="text-green-100 font-medium">Approved Papers</div>
          <div className="text-green-200 text-sm mt-1">Great work!</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg card-hover transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">👁️</div>
            <div className="text-4xl font-bold">{stats.totalViews}</div>
          </div>
          <div className="text-purple-100 font-medium">Total Views</div>
          <div className="text-purple-200 text-sm mt-1">Your papers are popular!</div>
        </div>
      </div>

      {/* Badge Progress Section */}
      {nextBadge.badge && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Next Badge Progress</h2>
            <span className="text-2xl">{BADGE_ICONS[nextBadge.badge] || '🎖️'}</span>
          </div>
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{BADGE_NAMES[nextBadge.badge]}</span>
              <span>{nextBadge.current} / {nextBadge.target}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${BADGE_GRADIENTS[nextBadge.badge] || 'from-indigo-500 to-purple-500'} rounded-full progress-bar flex items-center justify-end pr-2`}
                style={{ width: `${Math.min(nextBadge.progress, 100)}%` }}
              >
                {nextBadge.progress > 15 && (
                  <span className="text-xs text-white font-bold">{Math.round(nextBadge.progress)}%</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badges Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl">🏆</span>
          <h2 className="text-2xl font-bold text-gray-800">My Badges</h2>
        </div>
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge}
                className={`bg-gradient-to-br ${BADGE_GRADIENTS[badge] || 'from-gray-400 to-gray-500'} rounded-xl p-4 text-white shadow-md card-hover transform hover:scale-110 transition-all cursor-pointer relative overflow-hidden`}
              >
                <div className="absolute top-2 right-2 text-2xl opacity-20">{BADGE_ICONS[badge] || '🎖️'}</div>
                <div className="relative z-10">
                  <div className="text-3xl mb-2">{BADGE_ICONS[badge] || '🎖️'}</div>
                  <div className="font-bold text-sm">{BADGE_NAMES[badge] || badge}</div>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-gray-600 font-medium mb-2">No badges yet</p>
            <p className="text-gray-500 text-sm">Start uploading papers to earn your first badge!</p>
            <a href="/upload" className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold">
              Upload Now
            </a>
          </div>
        )}
      </div>

      {/* My Uploads */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📚</span>
          <h2 className="text-2xl font-bold text-gray-800">My Uploads</h2>
        </div>
        <div className="grid gap-4">
          {items.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-600 font-medium text-lg mb-2">No uploads yet</p>
              <p className="text-gray-500 mb-4">Start your journey by uploading your first paper!</p>
              <a href="/upload" className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg transform hover:scale-105">
                Upload Your First Paper
              </a>
            </div>
          ) : (
            items.map(i => (
              <div 
                key={i._id} 
                className="bg-white p-5 rounded-xl border-2 border-gray-100 shadow-md card-hover flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">📄</div>
                    <div className="font-bold text-lg text-gray-800">{i.subject}</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {i.department} • {i.year} • 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      i.status === 'approved' ? 'bg-green-100 text-green-700' :
                      i.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {i.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <span>👁️</span>
                      <span className="font-medium">{i.views || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <span>🤖</span>
                      <span className="font-medium">AI Score: {i.aiResult?.authenticityScore ?? 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md transform hover:scale-105" 
                    href={i.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    Preview
                  </a>
                  <button 
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-semibold shadow-md transform hover:scale-105" 
                    onClick={() => delItem(i._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
