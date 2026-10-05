import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Toko from './pages/Toko'
import Produk from './pages/Produk'
import Hampers from './pages/Hampers'
import AdminLayout from './layouts/AdminLayout'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/toko" element={<Toko />} />
        <Route path="/produk" element={<Produk />} />
        <Route path="/hampers" element={<Hampers />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
