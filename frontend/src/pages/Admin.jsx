import { useEffect, useState } from 'react'
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

      // Update stats based on full paper list (optional: backend could provide this)
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
    if (!window.confirm('Are you sure you want to permanently delete this paper?')) return
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

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">⚙️</span>
          <h1 className="text-4xl font-bold">Admin Management</h1>
        </div>
        <p className="text-red-100 text-lg opacity-90">Control center for papers, users, and platform policies</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 mb-1">Total Papers</div>
          <div className="text-3xl font-bold text-gray-800">{stats.totalPapers}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 mb-1">Approved</div>
          <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-sm font-semibold text-gray-500 mb-1">Active Users</div>
          <div className="text-3xl font-bold text-indigo-600">{stats.users}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
        <button
          onClick={() => setActiveTab('papers')}
          className={`flex-1 py-3 font-semibold rounded-lg transition-all ${activeTab === 'papers' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          📄 Paper Moderation
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 font-semibold rounded-lg transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          👥 User Management
        </button>
      </div>

      {activeTab === 'papers' ? (
        <>
          {/* Filter */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum AI Score</label>
                <input
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors"
                  type="number"
                  placeholder="e.g., 70"
                  value={minScore}
                  onChange={e => setMinScore(e.target.value)}
                />
              </div>
              <button
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold shadow-lg"
                onClick={loadPapers}
                disabled={loading}
              >
                🔍 Filter
              </button>
            </div>
          </div>

          {/* Papers List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
              <p className="text-gray-500 font-medium">No papers found matching criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(i => (
                <div key={i._id} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl bg-gray-50 p-3 rounded-xl">📄</div>
                      <div>
                        <div className="font-bold text-xl text-gray-800">{i.subject} ({i.year})</div>
                        <div className="text-sm text-gray-500">{i.department} • {i.university || 'No Univ'}</div>
                        <div className="text-xs text-gray-400 mt-1">Uploaded by: <span className="font-semibold">{i.uploadedBy?.name || 'Unknown'}</span></div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${i.status === 'approved' ? 'bg-green-100 text-green-700' :
                          i.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {i.status.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(i.aiResult?.authenticityScore ?? 0)}`}>
                        AI: {i.aiResult?.authenticityScore ?? 0}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-50">
                    <a className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all font-bold text-sm" href={i.fileUrl} target="_blank" rel="noreferrer">
                      👁️ Preview
                    </a>
                    {i.status !== 'approved' && (
                      <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all font-bold text-sm" onClick={() => setStatus(i._id, 'approved')}>
                        ✅ Approve
                      </button>
                    )}
                    {i.status !== 'rejected' && (
                      <button className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-all font-bold text-sm" onClick={() => setStatus(i._id, 'rejected')}>
                        ❌ Reject
                      </button>
                    )}
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-bold text-sm ml-auto" onClick={() => deletePaper(i._id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase">User</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase">Role</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase">Registered</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteUser(u._id)}
                      disabled={u.role === 'admin'}
                      className="text-red-500 hover:text-red-700 disabled:opacity-30 transition-colors"
                      title="Delete User"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500 font-medium">No users found</div>
          )}
        </div>
      )}
    </div>
  )
}
