import { useEffect, useState } from 'react'
import { BookOpen, Filter, Download, Eye, Search, User as UserIcon } from 'lucide-react'
import api from '../utils/api'
import PdfPreview from '../components/PdfPreview'
import { downloadFile } from '../utils/download'

export default function Papers() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState({ subject: '', department: '', year: '', sort: 'new' })
  const [loading, setLoading] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState(null)

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q.subject) params.set('subject', q.subject)
    if (q.department) params.set('department', q.department)
    if (q.year) params.set('year', q.year)
    if (q.sort === 'downloads') params.set('sort', 'downloads')
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-3xl p-10 border-2">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: '#09637E' }}>
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold" style={{ color: '#09637E' }}>Browse Papers</h1>
            <p className="mt-1" style={{ color: '#088395' }}>Discover past year question papers</p>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="glass-card rounded-2xl p-6 border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            className="glass-input rounded-xl px-4 py-3 text-sm font-medium placeholder-gray-400"
            style={{ color: '#09637E' }}
            placeholder="Subject (e.g., Math)"
            value={q.subject}
            onChange={e => setQ({ ...q, subject: e.target.value })}
          />
          <input
            className="glass-input rounded-xl px-4 py-3 text-sm font-medium placeholder-gray-400"
            style={{ color: '#09637E' }}
            placeholder="Department"
            value={q.department}
            onChange={e => setQ({ ...q, department: e.target.value })}
          />
          <input
            className="glass-input rounded-xl px-4 py-3 text-sm font-medium placeholder-gray-400"
            style={{ color: '#09637E' }}
            placeholder="Year"
            type="number"
            value={q.year}
            onChange={e => setQ({ ...q, year: e.target.value })}
          />
          <select
            className="glass-input rounded-xl px-4 py-3 text-sm font-medium"
            style={{ color: '#09637E' }}
            value={q.sort}
            onChange={e => setQ({ ...q, sort: e.target.value })}
          >
            <option value="new">Newest First</option>
            <option value="downloads">Most Downloaded</option>
          </select>
        </div>
        <button
          className="w-full py-3 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
          style={{ background: '#088395' }}
          onClick={load}
          disabled={loading}
        >
          <Search className="w-5 h-5" />
          {loading ? 'Searching...' : 'Search Papers'}
        </button>
      </div>

      {/* Papers Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: '#EBF4F6', borderTopColor: '#088395' }}></div>
          <p className="mt-4 font-medium" style={{ color: '#088395' }}>Loading papers...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center border">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: '#7AB2B2' }} />
          <p className="font-medium text-lg" style={{ color: '#088395' }}>No papers found</p>
          <p className="text-sm mt-2" style={{ color: '#7AB2B2' }}>Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map(i => (
            <div
              key={i._id}
              className="glass-card rounded-2xl p-6 border group cursor-pointer animate-slide-up"
              onClick={() => setSelectedPaper(i)}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl glass-card border flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8" style={{ color: '#088395' }} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-2 group-hover:opacity-80 transition-colors" style={{ color: '#09637E' }}>
                    {i.subject}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold glass-card border" style={{ color: '#088395' }}>
                      {i.department}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold glass-card border" style={{ color: '#088395' }}>
                      {i.year}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold glass-card border" style={{ color: '#088395' }}>
                      {i.semester}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#7AB2B2' }}>
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span className="font-medium">{i.uploadedBy?.name ?? 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span className="font-medium">{i.downloads || 0} downloads</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPaper(i);
                    }}
                    className="px-6 py-3 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap flex items-center gap-2"
                    style={{ background: '#088395' }}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await downloadFile(i.fileUrl, `${i.subject}.pdf`, i._id);
                      load();
                    }}
                    className="px-6 py-3 rounded-xl glass-button font-semibold hover:shadow-lg whitespace-nowrap flex items-center gap-2"
                    style={{ color: '#09637E' }}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPaper && (
        <PdfPreview
          file={selectedPaper.fileUrl}
          title={selectedPaper.subject}
          subtitle={`${selectedPaper.department} • ${selectedPaper.year}`}
          onClose={() => setSelectedPaper(null)}
          paperId={selectedPaper._id}
          onDownload={load}
        />
      )}
    </div>
  )
}
