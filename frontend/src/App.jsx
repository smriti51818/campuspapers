import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { BookOpen, Upload as UploadIcon, LayoutDashboard, Trophy, Settings, LogOut, User } from 'lucide-react'
import AuthPage from './pages/AuthPage'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import Papers from './pages/Papers'
import Admin from './pages/Admin'
import Leaderboard from './pages/Leaderboard'
import { useAuth } from './context/AuthContext'

function Protected({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppLayout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Glass Navbar */}
      <nav className="glass-navbar sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform" style={{ background: '#4F46E5' }}>
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold hidden sm:block" style={{ color: '#4F46E5' }}>CampusPapers</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <Link
                to="/papers"
                className="px-4 py-2 rounded-xl hover:bg-white/50 transition-all font-medium text-sm backdrop-blur-sm flex items-center gap-2"
                style={{ color: '#4F46E5' }}
              >
                <BookOpen className="w-4 h-4" />
                Papers
              </Link>
              {user?.role !== 'admin' && (
                <>
                  <Link
                    to="/upload"
                    className="px-4 py-2 rounded-xl hover:bg-white/50 transition-all font-medium text-sm backdrop-blur-sm flex items-center gap-2"
                    style={{ color: '#4F46E5' }}
                  >
                    <UploadIcon className="w-4 h-4" />
                    Upload
                  </Link>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-xl hover:bg-white/50 transition-all font-medium text-sm backdrop-blur-sm flex items-center gap-2"
                    style={{ color: '#4F46E5' }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </>
              )}
              <Link
                to="/leaderboard"
                className="px-4 py-2 rounded-xl hover:bg-white/50 transition-all font-medium text-sm backdrop-blur-sm flex items-center gap-2"
                style={{ color: '#4F46E5' }}
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-xl transition-all font-semibold text-sm backdrop-blur-sm border flex items-center gap-2"
                  style={{ background: 'rgba(9, 99, 126, 0.1)', color: '#4F46E5', borderColor: 'rgba(9, 99, 126, 0.3)' }}
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>

            {/* User Section */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl glass-card">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: '#6366F1' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold" style={{ color: '#4F46E5' }}>{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl transition-all font-semibold text-sm backdrop-blur-sm border flex items-center gap-2"
                style={{ background: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', borderColor: 'rgba(220, 53, 69, 0.3)' }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const { user } = useAuth()

  // If not logged in, show only auth page
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // If logged in, show app with header
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Papers />} />
        <Route path="/papers" element={<Papers />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<Protected roles={["admin"]}><Admin /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}
