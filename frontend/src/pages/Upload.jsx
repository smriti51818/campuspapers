import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    Object.entries(form).forEach(([k,v])=>fd.append(k,v))
    fd.append('file', file)
    try {
      const { data } = await api.post('/api/papers/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg('✅ Upload successful! Your paper is pending approval.')
      setTimeout(() => {
        nav('/dashboard')
      }, 2000)
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Upload failed. Please try again.'
      setMsg(`❌ ${errorMessage}`)
      console.error('Upload error:', e.response?.data || e)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-5xl">📤</span>
          <h1 className="text-4xl font-bold">Upload Paper</h1>
        </div>
        <p className="text-indigo-100">Share your past year question papers with the community</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-100">
        {msg && (
          <div className={`mb-6 p-4 rounded-lg font-semibold ${
            msg.includes('✅') ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300'
          }`}>
            {msg}
          </div>
        )}
        
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department *</label>
            <input 
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors" 
              placeholder="e.g., Computer Science" 
              value={form.department} 
              onChange={e=>setForm({...form,department:e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
            <input 
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors" 
              placeholder="e.g., Data Structures" 
              value={form.subject} 
              onChange={e=>setForm({...form,subject:e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
              <input 
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors" 
                placeholder="e.g., 2023" 
                type="number"
                value={form.year} 
                onChange={e=>setForm({...form,year:e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Semester *</label>
              <input 
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors" 
                placeholder="e.g., Fall" 
                value={form.semester} 
                onChange={e=>setForm({...form,semester:e.target.value})}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">University (optional)</label>
            <input 
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-indigo-500 focus:outline-none transition-colors" 
              placeholder="e.g., MIT" 
              value={form.university} 
              onChange={e=>setForm({...form,university:e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">PDF File *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
              <input 
                type="file" 
                accept="application/pdf" 
                onChange={e=>setFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="space-y-2">
                    <div className="text-4xl">📄</div>
                    <div className="font-semibold text-gray-700">{file.name}</div>
                    <div className="text-sm text-gray-500">Click to change file</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-5xl">📎</div>
                    <div className="font-semibold text-gray-700">Click to upload PDF</div>
                    <div className="text-sm text-gray-500">Maximum file size: 15MB</div>
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={uploading}
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Uploading...
              </span>
            ) : (
              '🚀 Upload Paper'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
