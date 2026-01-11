import { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Papers() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState({ subject: '', department: '', year: '', sort: 'new' })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q.subject) params.set('subject', q.subject)
    if (q.department) params.set('department', q.department)
    if (q.year) params.set('year', q.year)
    if (q.sort === 'views') params.set('sort', 'views')
    try {
      const { data } = await api.get('/api/papers?' + params.toString())
      setItems(data)
    } catch (e) {
      console.error('Failed to load papers:', e)
    } finally {
      setLoading(false)
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">📚</span>
          <h1 className="text-4xl font-bold">Browse Papers</h1>
        </div>
        <p className="text-indigo-100">Find past year question papers</p>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input 
            className="border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors" 
            placeholder="Subject" 
            value={q.subject} 
            onChange={e=>setQ({...q,subject:e.target.value})} 
          />
          <input 
            className="border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors" 
            placeholder="Department" 
            value={q.department} 
            onChange={e=>setQ({...q,department:e.target.value})} 
          />
          <input 
            className="border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors" 
            placeholder="Year" 
            value={q.year} 
            onChange={e=>setQ({...q,year:e.target.value})} 
          />
          <select 
            className="border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors" 
            value={q.sort} 
            onChange={e=>setQ({...q,sort:e.target.value})}
          >
            <option value="new">Newest First</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
        <button 
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-lg transform hover:scale-105" 
          onClick={load}
          disabled={loading}
        >
          {loading ? 'Searching...' : '🔍 Search Papers'}
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading papers...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-600 font-medium text-lg">No papers found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(i => (
            <div 
              key={i._id} 
              className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 card-hover transform hover:scale-105 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="text-3xl mb-2">📄</div>
                  <div className="font-bold text-lg text-gray-800 mb-1">{i.subject}</div>
                  <div className="text-sm text-gray-600">{i.department} • {i.year}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(i.aiResult?.authenticityScore ?? 0)}`}>
                  {i.aiResult?.authenticityScore ?? 0}%
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>👤</span>
                  <span>{i.uploadedBy?.name ?? 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>👁️</span>
                  <span>{i.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    i.status === 'approved' ? 'bg-green-100 text-green-700' :
                    i.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {i.status}
                  </span>
                </div>
              </div>
              
              <a 
                href={i.fileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-md transform hover:scale-105"
              >
                📖 View Paper
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
