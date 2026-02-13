import { useEffect, useState } from 'react'
import { LayoutDashboard, Upload as UploadIcon, CheckCircle, Download, BookOpen, Award } from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const BADGE_ICONS = {
  first_upload: Award, ten_uploads: Award, fifty_uploads: Award, hundred_uploads: Award,
  popular: Award, quality_contributor: Award, top_contributor: Award
}

export default function Dashboard() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [badges, setBadges] = useState([])
  const [stats, setStats] = useState({ totalUploads: 0, totalDownloads: 0, approvedPapers: 0 })

  const load = async () => {
    const { data } = await api.get('/api/papers')
    const me = JSON.parse(localStorage.getItem('user') || 'null')
    const myItems = data.filter(d => d.uploadedBy?._id === me?.id)
    setItems(myItems)

    const approved = myItems.filter(i => i.status === 'approved').length
    const totalDownloads = myItems.reduce((sum, i) => sum + (i.downloads || 0), 0)
    setStats({ totalUploads: myItems.length, totalDownloads, approvedPapers: approved })

    if (user?.id) {
      try {
        const badgeData = await api.get(`/api/badges/${user.id}`)
        setBadges(badgeData.data.badges || [])
      } catch (e) {
        console.error('Failed to load badges:', e)
      }
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-3xl p-10 border-2">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: '#09637E' }}>
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold" style={{ color: '#09637E' }}>My Dashboard</h1>
            <p className="mt-1" style={{ color: '#088395' }}>Track your contributions and achievements</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl glass-card flex items-center justify-center border">
              <UploadIcon className="w-7 h-7" style={{ color: '#088395' }} />
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#09637E' }}>{stats.totalUploads}</div>
              <div className="text-sm font-medium" style={{ color: '#7AB2B2' }}>Total Uploads</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl glass-card flex items-center justify-center border">
              <Download className="w-7 h-7" style={{ color: '#088395' }} />
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#09637E' }}>{stats.totalDownloads}</div>
              <div className="text-sm font-medium" style={{ color: '#7AB2B2' }}>Total Downloads</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border group">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl glass-card flex items-center justify-center border">
              <CheckCircle className="w-7 h-7" style={{ color: '#088395' }} />
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: '#09637E' }}>{stats.approvedPapers}</div>
              <div className="text-sm font-medium" style={{ color: '#7AB2B2' }}>Approved Papers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="glass-card rounded-2xl p-8 border">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#09637E' }}>
            <Award className="w-7 h-7" />
            Your Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map(b => {
              const Icon = BADGE_ICONS[b] || Award
              return (
                <div key={b} className="glass-card rounded-xl p-4 border text-center group hover:scale-105 transition-transform">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl glass-card flex items-center justify-center shadow-lg border">
                    <Icon className="w-8 h-8" style={{ color: '#088395' }} />
                  </div>
                  <div className="text-sm font-bold" style={{ color: '#09637E' }}>{b.replace(/_/g, ' ')}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* My Papers */}
      <div className="glass-card rounded-2xl p-8 border">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#09637E' }}>
          <BookOpen className="w-7 h-7" />
          My Papers
        </h2>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: '#7AB2B2' }} />
            <p className="font-medium" style={{ color: '#088395' }}>No papers uploaded yet</p>
            <p className="text-sm mt-2" style={{ color: '#7AB2B2' }}>Start contributing to earn badges!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(i => (
              <div key={i._id} className="glass-card rounded-xl p-5 border group">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl glass-card border flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6" style={{ color: '#088395' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate" style={{ color: '#09637E' }}>{i.subject}</div>
                      <div className="text-sm" style={{ color: '#7AB2B2' }}>{i.department} • {i.year}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold glass-card border" style={{ color: i.status === 'approved' ? '#28a745' : i.status === 'rejected' ? '#dc3545' : '#ffc107' }}>
                      {i.status.toUpperCase()}
                    </span>
                    <div className="text-sm font-medium flex items-center gap-1" style={{ color: '#7AB2B2' }}>
                      <Download className="w-4 h-4" />
                      {i.downloads || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
