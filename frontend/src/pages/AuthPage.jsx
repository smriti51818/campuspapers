import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Mail, Lock, User, AlertCircle, LogIn, UserPlus } from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [emailErr, setEmailErr] = useState('')

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/
    return emailRegex.test(email)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setEmailErr('')
    if (!validateEmail(form.email)) {
      setEmailErr(`Please enter a part following '@'. '${form.email}' is incomplete.`)
      return
    }
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const { data } = await api.post(endpoint, form)
      login(data.token, data.user)
      if (data.user.role === 'admin') {
        nav('/admin')
      } else {
        nav('/')
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || (isLogin ? 'Login failed' : 'Signup failed')
      setErr(errorMessage)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl glass-card-dark mb-4 shadow-2xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">CampusPapers</h1>
          <p className="text-indigo-100">Your academic resource hub</p>
        </div>

        {/* Auth Form Card */}
        <div className="glass-card rounded-3xl p-8 border-2 shadow-2xl">
          {/* Tabs */}
          <div className="mb-6">
            <div className="glass-card rounded-2xl p-1 flex gap-1">
              <button
                onClick={() => {
                  setIsLogin(true)
                  setErr('')
                  setForm({ name: '', email: '', password: '' })
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isLogin ? 'text-white shadow-lg' : 'text-gray-600'
                  }`}
                style={isLogin ? { background: '#4F46E5' } : {}}
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false)
                  setErr('')
                  setForm({ name: '', email: '', password: '' })
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${!isLogin ? 'text-white shadow-lg' : 'text-gray-600'
                  }`}
                style={!isLogin ? { background: '#4F46E5' } : {}}
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </button>
            </div>
          </div>

          {/* Error Message */}
          {err && (
            <div className="mb-4 p-4 rounded-xl border flex items-start gap-3" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#DC2626' }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Authentication Error</p>
                <p className="text-sm">{err}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#4F46E5' }}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6366F1' }} />
                  <input
                    className="w-full glass-input rounded-xl pl-11 pr-4 py-3 text-sm font-medium"
                    style={{ color: '#1E293B' }}
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#4F46E5' }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6366F1' }} />
                <input
                  type="email"
                  className="w-full glass-input rounded-xl pl-11 pr-4 py-3 text-sm font-medium"
                  style={{ color: '#1E293B' }}
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value })
                    setEmailErr('')
                  }}
                  required
                />
              </div>
              {emailErr && (
                <div className="flex items-center gap-2 mt-2 p-3 rounded-lg border text-sm" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#D97706' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{emailErr}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#4F46E5' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#6366F1' }} />
                <input
                  type="password"
                  className="w-full glass-input rounded-xl pl-11 pr-4 py-3 text-sm font-medium"
                  style={{ color: '#1E293B' }}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{ background: '#4F46E5' }}
            >
              {isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Login to Account
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-indigo-100 text-sm">
          Secure authentication powered by JWT
        </p>
      </div>
    </div>
  )
}
