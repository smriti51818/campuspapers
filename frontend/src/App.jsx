import { Routes, Route, Navigate, Link } from 'react-router-dom'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <nav className="bg-white border-b-2 border-indigo-100 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            <Link to="/" className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
              📚 CampusPapers
            </Link>
            <div className="flex gap-1 ml-4">
              <Link to="/papers" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium text-sm">
                📄 Papers
              </Link>
              {user?.role !== 'admin' && (
                <>
                  <Link to="/upload" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium text-sm">
                    📤 Upload
                  </Link>
                  <Link to="/dashboard" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium text-sm">
                    📊 Dashboard
                  </Link>
                </>
              )}
              <Link to="/leaderboard" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium text-sm">
                🏆 Leaderboard
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium text-sm">
                  ⚙️ Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full">
              <span className="text-sm font-semibold text-indigo-700">👤 {user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all font-semibold text-sm shadow-md hover:scale-105 transform"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-6xl mx-auto p-4">
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

