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

export default function Leaderboard() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [type, setType] = useState('uploads')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/api/leaderboard?type=${type}`)
      setLeaderboard(data)
    } catch (e) {
      console.error('Failed to load leaderboard:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [type])

  const getRankDisplay = (rank) => {
    if (rank === 0) return { icon: '🥇', bg: 'from-yellow-400 to-yellow-600', text: '1st' }
    if (rank === 1) return { icon: '🥈', bg: 'from-gray-300 to-gray-500', text: '2nd' }
    if (rank === 2) return { icon: '🥉', bg: 'from-orange-400 to-orange-600', text: '3rd' }
    return { icon: null, bg: 'from-indigo-500 to-purple-500', text: `#${rank + 1}` }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">🏆</span>
          <h1 className="text-4xl font-bold">Leaderboard</h1>
        </div>
        <p className="text-indigo-100">Compete with the best contributors</p>
      </div>
      
      {/* Toggle Buttons */}
      <div className="flex gap-4 bg-white p-2 rounded-xl shadow-lg">
        <button
          onClick={() => setType('uploads')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all transform ${
            type === 'uploads'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="text-xl mr-2">📊</span>
          Top Contributors
        </button>
        <button
          onClick={() => setType('views')}
          className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all transform ${
            type === 'views'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span className="text-xl mr-2">🔥</span>
          Most Popular
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* 2nd Place */}
              <div className={`bg-gradient-to-br ${getRankDisplay(1).bg} rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-all card-hover`}>
                <div className="text-center">
                  <div className="text-4xl mb-2">{getRankDisplay(1).icon}</div>
                  <div className="text-2xl font-bold mb-1">{leaderboard[1]?.name || 'N/A'}</div>
                  <div className="text-lg opacity-90">{leaderboard[1]?.score || 0} {type === 'uploads' ? 'papers' : 'views'}</div>
                </div>
              </div>
              
              {/* 1st Place */}
              <div className={`bg-gradient-to-br ${getRankDisplay(0).bg} rounded-xl p-8 text-white shadow-2xl transform hover:scale-110 transition-all card-hover relative`}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-5xl">👑</div>
                <div className="text-center mt-4">
                  <div className="text-5xl mb-2">{getRankDisplay(0).icon}</div>
                  <div className="text-2xl font-bold mb-1">{leaderboard[0]?.name || 'N/A'}</div>
                  <div className="text-xl opacity-90">{leaderboard[0]?.score || 0} {type === 'uploads' ? 'papers' : 'views'}</div>
                </div>
              </div>
              
              {/* 3rd Place */}
              <div className={`bg-gradient-to-br ${getRankDisplay(2).bg} rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-all card-hover`}>
                <div className="text-center">
                  <div className="text-4xl mb-2">{getRankDisplay(2).icon}</div>
                  <div className="text-2xl font-bold mb-1">{leaderboard[2]?.name || 'N/A'}</div>
                  <div className="text-lg opacity-90">{leaderboard[2]?.score || 0} {type === 'uploads' ? 'papers' : 'views'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Rest of Leaderboard */}
          <div className="space-y-3">
            {leaderboard.slice(3).map((entry, index) => {
              const rank = index + 3
              const rankDisplay = getRankDisplay(rank)
              const isCurrentUser = user?.id === entry.id
              
              return (
                <div
                  key={entry.id}
                  className={`bg-white rounded-xl p-5 shadow-md card-hover border-2 ${
                    isCurrentUser ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${rankDisplay.bg} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {rankDisplay.icon || rankDisplay.text}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-lg text-gray-800">{entry.name}</div>
                        {isCurrentUser && (
                          <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full font-semibold">You</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{entry.email}</div>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-indigo-600 font-bold text-lg">
                            {entry.score}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {type === 'uploads' ? 'papers' : 'views'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 max-w-xs">
                      {entry.badges?.slice(0, 3).map((badge) => (
                        <div
                          key={badge}
                          className={`bg-gradient-to-br ${BADGE_GRADIENTS[badge] || 'from-gray-400 to-gray-500'} rounded-lg px-3 py-1 text-white text-xs font-bold shadow-md`}
                          title={BADGE_NAMES[badge]}
                        >
                          {BADGE_ICONS[badge]} {BADGE_NAMES[badge]}
                        </div>
                      ))}
                      {entry.badges?.length > 3 && (
                        <div className="bg-gray-200 rounded-lg px-3 py-1 text-gray-600 text-xs font-bold">
                          +{entry.badges.length - 3} more
                        </div>
                      )}
                      {(!entry.badges || entry.badges.length === 0) && (
                        <span className="text-gray-400 text-xs">No badges</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {leaderboard.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-600 font-medium text-lg">No data available yet</p>
              <p className="text-gray-500 text-sm mt-2">Be the first to contribute!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
