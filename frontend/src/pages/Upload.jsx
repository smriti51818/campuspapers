import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload as UploadIcon, FileText, Rocket } from 'lucide-react'
import api from '../utils/api'

export default function Upload() {
  const nav = useNavigate()
  const [form, setForm] = useState({ department: '', subject: '', year: '', semester: '', university: '' })
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setUploading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('file', file)
    try {
      await api.post('/api/papers/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg('✅ Upload successful! Your paper is pending approval.')
      setTimeout(() => nav('/dashboard'), 2000)
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Upload failed'
      setMsg(`❌ ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-3xl p-10 border-2">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl" style={{ background: '#4F46E5' }}>
            <UploadIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold" style={{ color: '#4F46E5' }}>Upload Paper</h1>
            <p className="mt-1" style={{ color: '#6366F1' }}>Share knowledge with the community</p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="glass-card rounded-2xl p-8 border">
        {msg && (
          <div className={`mb-6 p-4 rounded-xl font-semibold border`} style={msg.includes('✅') ? { background: 'rgba(40, 167, 69, 0.1)', color: '#28a745', borderColor: 'rgba(40, 167, 69, 0.3)' } : { background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', borderColor: 'rgba(220, 53, 69, 0.3)' }}>
            {msg}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#4F46E5' }}>Department *</label>
            <input
              className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium placeholder-gray-400"
              style={{ color: '#4F46E5' }}
              placeholder="e.g., Computer Science"
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#4F46E5' }}>Subject *</label>
            <input
              className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium placeholder-gray-400"
              style={{ color: '#4F46E5' }}
              placeholder="e.g., Data Structures"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#4F46E5' }}>Year *</label>
              <input
                className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium placeholder-gray-400"
                style={{ color: '#4F46E5' }}
                placeholder="e.g., 2023"
                type="number"
                value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#4F46E5' }}>Semester *</label>
              <select
                className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium"
                style={{ color: '#4F46E5' }}
                value={form.semester}
                onChange={e => setForm({ ...form, semester: e.target.value })}
                required
              >
                <option value="" disabled>Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>Semester {num}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#4F46E5' }}>University (optional)</label>
            <input
              className="w-full glass-input rounded-xl px-4 py-3 text-sm font-medium placeholder-gray-400"
              style={{ color: '#4F46E5' }}
              placeholder="e.g., MIT"
              value={form.university}
              onChange={e => setForm({ ...form, university: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#4F46E5' }}>PDF File *</label>
            <div className="glass-card border-2 border-dashed rounded-2xl p-8 text-center hover:border-opacity-60 transition-all cursor-pointer" style={{ borderColor: 'rgba(122, 178, 178, 0.5)' }}>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => setFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="space-y-2">
                    <FileText className="w-12 h-12 mx-auto" style={{ color: '#6366F1' }} />
                    <div className="font-bold" style={{ color: '#4F46E5' }}>{file.name}</div>
                    <div className="text-sm" style={{ color: '#818CF8' }}>Click to change file</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadIcon className="w-16 h-16 mx-auto" style={{ color: '#818CF8' }} />
                    <div className="font-bold" style={{ color: '#4F46E5' }}>Click to upload PDF</div>
                    <div className="text-sm" style={{ color: '#818CF8' }}>Maximum file size: 15MB</div>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full px-6 py-4 text-white rounded-xl transition-all font-bold text-lg shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            style={{ background: '#6366F1' }}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5" />
                Upload Paper
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
