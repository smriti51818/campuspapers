import { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Admin() {
  const [items, setItems] = useState([])
  const [minScore, setMinScore] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (minScore) params.set('minScore', minScore)
    try {
      const { data } = await api.get('/api/admin/papers' + (params.toString() ? `?${params}` : ''))
      setItems(data)
    } catch (e) {
      console.error('Failed to load papers:', e)
    } finally {
      setLoading(false)
    }
  }

  const setStatus = async (id, status) => {
    try {
      const url = status === 'approved' ? `/api/admin/papers/${id}/approve` : `/api/admin/papers/${id}/reject`
      await api.put(url)
      await load()
    } catch (e) {
      console.error('Failed to update status:', e)
    }
  }

  useEffect(() => { load() }, [])

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
          <h1 className="text-4xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-red-100">Review and manage paper submissions</p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum AI Score</label>
            <input 
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors" 
              type="number"
              placeholder="e.g., 70" 
              value={minScore} 
              onChange={e=>setMinScore(e.target.value)} 
            />
          </div>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-lg transform hover:scale-105"
            onClick={load}
            disabled={loading}
          >
            {loading ? 'Loading...' : '🔍 Filter'}
          </button>
        </div>
      </div>

      {/* Papers List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading papers...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-600 font-medium text-lg">No papers to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(i => (
            <div key={i._id} className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">📄</div>
                    <div>
                      <div className="font-bold text-xl text-gray-800">{i.subject} ({i.year})</div>
                      <div className="text-sm text-gray-600">{i.department} • Uploaded by: {i.uploadedBy?.name || 'Unknown'}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      i.status === 'approved' ? 'bg-green-100 text-green-700' :
                      i.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {i.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(i.aiResult?.authenticityScore ?? 0)}`}>
                      AI Score: {i.aiResult?.authenticityScore ?? 0}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <a 
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all font-semibold shadow-md transform hover:scale-105" 
                  href={i.fileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                >
                  📖 Preview
                </a>
                {i.status !== 'approved' && (
                  <button 
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all font-semibold shadow-md transform hover:scale-105" 
                    onClick={() => setStatus(i._id, 'approved')}
                  >
                    ✅ Approve
                  </button>
                )}
                {i.status !== 'rejected' && (
                  <button 
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all font-semibold shadow-md transform hover:scale-105" 
                    onClick={() => setStatus(i._id, 'rejected')}
                  >
                    ❌ Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
