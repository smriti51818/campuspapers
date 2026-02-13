import { useEffect, useState } from 'react'
import { Settings, Users, FileText, Filter, Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import api from '../utils/api'

export default function Admin() {
  const [items, setItems] = useState([])
  const [users, setUsers] = useState([])
  const [minScore, setMinScore] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('papers')
  const [stats, setStats] = useState({ totalPapers: 0, pending: 0, approved: 0, users: 0 })

  const loadPapers = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (minScore) params.set('minScore', minScore)
    try {
      const { data } = await api.get('/api/admin/papers' + (params.toString() ? `?${params}` : ''))
      setItems(data)
      setStats(prev => ({
        ...prev,
        totalPapers: data.length,
        pending: data.filter(p => p.status === 'pending').length,
        approved: data.filter(p => p.status === 'approved').length
      }))
    } catch (e) {
      console.error('Failed to load papers:', e)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/auth/admin/users')
      setUsers(data)
      setStats(prev => ({ ...prev, users: data.length }))
    } catch (e) {
      console.error('Failed to load users:', e)
    } finally {
      setLoading(false)
    }
  }

  const setStatus = async (id, status) => {
    try {
      const url = status === 'approved' ? `/api/admin/papers/${id}/approve` : `/api/admin/papers/${id}/reject`
      await api.put(url)
      await loadPapers()
    } catch (e) {
      console.error('Failed to update status:', e)
    }
  }

  const deletePaper = async (id) => {
    if (!window.confirm('Permanently delete this paper?')) return
    try {
      await api.delete(`/api/admin/papers/${id}`)
      await loadPapers()
    } catch (e) {
      console.error('Failed to delete paper:', e)
    }
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return
    try {
      await api.delete(`/api/auth/admin/users/${id}`)
      await loadUsers()
    } catch (e) {
      console.error('Failed to delete user:', e)
    }
  }

  useEffect(() => {
    if (activeTab === 'papers') loadPapers()
    else loadUsers()
  }, [activeTab])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-3xl p-10 border-2">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: '#09637E' }}>
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold" style={{ color: '#09637E' }}>Admin Control</h1>
            <p className="mt-1" style={{ color: '#088395' }}>Manage papers, users, and platform policies</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-6 border">
          <div className="text-sm font-semibold mb-1" style={{ color: '#7AB2B2' }}>Total Papers</div>
          <div className="text-3xl font-bold" style={{ color: '#09637E' }}>{stats.totalPapers}</div>
        </div>
        <div className="glass-card rounded-xl p-6 border">
          <div className="text-sm font-semibold mb-1" style={{ color: '#7AB2B2' }}>Pending Review</div>
          <div className="text-3xl font-bold" style={{ color: '#ffc107' }}>{stats.pending}</div>
        </div>
        <div className="glass-card rounded-xl p-6 border">
          <div className="text-sm font-semibold mb-1" style={{ color: '#7AB2B2' }}>Approved</div>
          <div className="text-3xl font-bold" style={{ color: '#28a745' }}>{stats.approved}</div>
        </div>
        <div className="glass-card rounded-xl p-6 border">
          <div className="text-sm font-semibold mb-1" style={{ color: '#7AB2B2' }}>Active Users</div>
          <div className="text-3xl font-bold" style={{ color: '#088395' }}>{stats.users}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-2xl p-2 border flex gap-2">
        <button
          onClick={() => setActiveTab('papers')}
          className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'papers' ? 'text-white shadow-lg' : ''
            }`}
          style={activeTab === 'papers' ? { background: '#088395' } : { color: '#09637E' }}
        >
          <FileText className="w-5 h-5" />
          Paper Moderation
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 px-6 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'users' ? 'text-white shadow-lg' : ''
            }`}
          style={activeTab === 'users' ? { background: '#088395' } : { color: '#09637E' }}
        >
          <Users className="w-5 h-5" />
          User Management
        </button>
      </div>

      {activeTab === 'papers' ? (
        <>
          {/* Filter */}
          <div className="glass-card rounded-2xl p-6 border">
            <div className="flex gap-4">
              <input
                className="flex-1 glass-input rounded-xl px-4 py-3 text-sm font-medium placeholder-gray-400"
                style={{ color: '#09637E' }}
                type="number"
                placeholder="Minimum AI Score (e.g., 70)"
                value={minScore}
                onChange={e => setMinScore(e.target.value)}
              />
              <button
                className="px-6 py-3 text-white rounded-xl transition-all font-bold shadow-lg flex items-center gap-2"
                style={{ background: '#088395' }}
                onClick={loadPapers}
                disabled={loading}
              >
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>

          {/* Papers List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: '#EBF4F6', borderTopColor: '#088395' }}></div>
            </div>
          ) : items.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center border">
              <p className="font-medium" style={{ color: '#088395' }}>No papers found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(i => (
                <div key={i._id} className="glass-card rounded-2xl p-6 border">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl glass-card border flex items-center justify-center">
                        <FileText className="w-7 h-7" style={{ color: '#088395' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xl" style={{ color: '#09637E' }}>{i.subject} ({i.year})</div>
                        <div className="text-sm" style={{ color: '#7AB2B2' }}>{i.department} • {i.university || 'No Univ'}</div>
                        <div className="text-xs mt-1" style={{ color: '#7AB2B2' }}>By: {i.uploadedBy?.name || 'Unknown'}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold glass-card border" style={{ color: i.status === 'approved' ? '#28a745' : i.status === 'rejected' ? '#dc3545' : '#ffc107' }}>
                        {i.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t" style={{ borderColor: 'rgba(122, 178, 178, 0.2)' }}>
                    <a className="px-4 py-2 glass-button rounded-xl font-bold text-sm flex items-center gap-2" style={{ color: '#09637E' }} href={i.fileUrl} target="_blank" rel="noreferrer">
                      <Eye className="w-4 h-4" />
                      Preview
                    </a>
                    {i.status !== 'approved' && (
                      <button className="px-4 py-2 rounded-xl transition-all font-bold text-sm flex items-center gap-2" style={{ background: 'rgba(40, 167, 69, 0.1)', color: '#28a745', border: '1px solid rgba(40, 167, 69, 0.3)' }} onClick={() => setStatus(i._id, 'approved')}>
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                    )}
                    {i.status !== 'rejected' && (
                      <button className="px-4 py-2 rounded-xl transition-all font-bold text-sm flex items-center gap-2" style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', border: '1px solid rgba(255, 193, 7, 0.3)' }} onClick={() => setStatus(i._id, 'rejected')}>
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    )}
                    <button className="px-4 py-2 rounded-xl transition-all font-bold text-sm ml-auto flex items-center gap-2" style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', border: '1px solid rgba(220, 53, 69, 0.3)' }} onClick={() => deletePaper(i._id)}>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="glass-card rounded-2xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/50 border-b" style={{ borderColor: 'rgba(122, 178, 178, 0.2)' }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase" style={{ color: '#09637E' }}>User</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase" style={{ color: '#09637E' }}>Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase" style={{ color: '#09637E' }}>Registered</th>
                <th className="px-6 py-4 text-right text-sm font-bold uppercase" style={{ color: '#09637E' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(122, 178, 178, 0.1)' }}>
              {users.map(u => (
                <tr key={u._id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold" style={{ color: '#09637E' }}>{u.name}</div>
                    <div className="text-xs" style={{ color: '#7AB2B2' }}>{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold glass-card border" style={{ color: u.role === 'admin' ? '#088395' : '#7AB2B2' }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#7AB2B2' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteUser(u._id)}
                      disabled={u.role === 'admin'}
                      className="transition-colors disabled:opacity-30"
                      style={{ color: '#dc3545' }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && !loading && (
            <div className="p-8 text-center font-medium" style={{ color: '#7AB2B2' }}>No users found</div>
          )}
        </div>
      )}
    </div>
  )
}
