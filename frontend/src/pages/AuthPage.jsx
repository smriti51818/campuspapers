import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      // Redirect admin users to admin dashboard
      if (data.user.role === 'admin') {
        nav('/admin')
      } else {
        nav('/')
      }
    } catch (e) {
      // Extract specific error message from backend
      const errorMessage = e.response?.data?.message || (isLogin ? 'Login failed' : 'Signup failed')
      setErr(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-indigo-600 mb-2">CampusPapers</h1>
          <p className="text-gray-600">Your academic resource hub</p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <div className="flex gap-4 border-b">
              <button
                onClick={() => {
                  setIsLogin(true)
                  setErr('')
                  setForm({ name: '', email: '', password: '' })
                }}
                className={`pb-3 px-4 font-semibold transition-colors ${
                  isLogin
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false)
                  setErr('')
                  setForm({ name: '', email: '', password: '' })
                }}
                className={`pb-3 px-4 font-semibold transition-colors ${
                  !isLogin
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {err && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm flex items-start gap-3">
              <span className="text-lg mt-0.5">⚠️</span>
              <div>
                <p className="font-semibold mb-1">Login Error</p>
                <p>{err}</p>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {!isLogin && (
              <input
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            )}
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value })
                setEmailErr('')
              }}
              required
            />
            {emailErr && (
              <div className="flex items-center gap-2 bg-orange-50 border-l-4 border-orange-400 text-orange-800 text-sm px-3 py-2 mt-1 rounded shadow-sm">
                <span className="text-xl">⚠️</span>
                <span>{emailErr}</span>
              </div>
            )}
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}



