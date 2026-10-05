import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Toko from './pages/Toko'
import Produk from './pages/Produk'
import Hampers from './pages/Hampers'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { getAuthToken } from './services/api'

function App() {
  const isLoggedIn = !!getAuthToken()

  return (
    <Routes>
      {/* Kalau sudah login dan buka /login, langsung ke dashboard */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Halaman admin — harus login dulu */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/toko" element={<Toko />} />
          <Route path="/produk" element={<Produk />} />
          <Route path="/hampers" element={<Hampers />} />
        </Route>
      </Route>

      {/* Default redirect ke login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
