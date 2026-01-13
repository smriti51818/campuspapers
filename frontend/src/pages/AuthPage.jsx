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

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const { data } = await api.post(endpoint, form)
      login(data.token, data.user)
      nav('/')
    } catch (e) {
      setErr(isLogin ? 'Login failed' : 'Signup failed')
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
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
              {err}
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
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
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



