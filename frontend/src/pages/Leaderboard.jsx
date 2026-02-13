import { useEffect, useState } from 'react'
import { Trophy, Medal, Award } from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

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

  useEffect(() => { load() }, [type])

  const getRankIcon = (rank) => {
    if (rank === 0) return <Medal className="w-8 h-8" style={{ color: '#FFD700' }} />
    if (rank === 1) return <Medal className="w-8 h-8" style={{ color: '#C0C0C0' }} />
    if (rank === 2) return <Medal className="w-8 h-8" style={{ color: '#CD7F32' }} />
    return null
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-3xl p-10 border-2">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: '#09637E' }}>
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold" style={{ color: '#09637E' }}>Leaderboard</h1>
            <p className="mt-1" style={{ color: '#088395' }}>Compete with the best contributors</p>
          </div>
        </div>
      </div>

      {/* Toggle */}
      <div className="glass-card rounded-2xl p-2 border flex gap-2">
        <button
          onClick={() => setType('uploads')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${type === 'uploads' ? 'text-white shadow-lg' : ''}`}
          style={type === 'uploads' ? { background: '#088395' } : { color: '#09637E' }}
        >
          <Trophy className="w-5 h-5" />
          Top Contributors
        </button>
        <button
          onClick={() => setType('views')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${type === 'views' ? 'text-white shadow-lg' : ''}`}
          style={type === 'views' ? { background: '#088395' } : { color: '#09637E' }}
        >
          <Award className="w-5 h-5" />
          Most Popular
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: '#EBF4F6', borderTopColor: '#088395' }}></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 0, 2].map((idx) => {
                const entry = leaderboard[idx]
                return (
                  <div key={idx} className={`glass-card rounded-2xl p-6 border text-center ${idx === 0 ? 'transform scale-110' : ''}`}>
                    {idx === 0 && <Trophy className="w-10 h-10 mx-auto mb-2" style={{ color: '#FFD700' }} />}
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl glass-card flex items-center justify-center shadow-lg border">
                      {getRankIcon(idx)}
                    </div>
                    <div className="font-bold text-lg" style={{ color: '#09637E' }}>{entry?.name || 'N/A'}</div>
                    <div className="text-sm mt-1" style={{ color: '#7AB2B2' }}>{entry?.score || 0} {type === 'uploads' ? 'papers' : 'views'}</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Rest of Leaderboard */}
          <div className="space-y-3">
            {leaderboard.slice(3).map((entry, index) => {
              const rank = index + 3
              const isCurrentUser = user?.id === entry.id

              return (
                <div key={entry.id} className={`glass-card rounded-xl p-5 border ${isCurrentUser ? 'border-2' : ''}`} style={isCurrentUser ? { borderColor: '#088395' } : {}}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-white font-bold shadow-lg" style={{ background: '#088395' }}>
                      #{rank + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold" style={{ color: '#09637E' }}>{entry.name}</div>
                        {isCurrentUser && (
                          <span className="px-2 py-1 text-white text-xs rounded-full font-semibold" style={{ background: '#088395' }}>You</span>
                        )}
                      </div>
                      <div className="text-sm" style={{ color: '#7AB2B2' }}>{entry.email}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: '#09637E' }}>{entry.score}</div>
                      <div className="text-xs" style={{ color: '#7AB2B2' }}>{type === 'uploads' ? 'papers' : 'views'}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {leaderboard.length === 0 && (
            <div className="glass-card rounded-2xl p-16 text-center border">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: '#7AB2B2' }} />
              <p className="font-medium" style={{ color: '#088395' }}>No data available yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
