'use client'

import { LogOut, Store, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { api, getStoredUser } from '@/services/api'
import { useSidebar } from './SidebarContext'

function Header() {
  const router = useRouter()
  const user = getStoredUser()
  const { toggleMobile } = useSidebar()

  const handleLogout = () => {
    api.auth.logout()
    router.push('/login')
  }

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          id="mobile-menu-toggle"
          type="button"
          className="sidebar-toggle-btn"
          onClick={toggleMobile}
          aria-label="Toggle Sidebar Menu"
          title="Buka Menu"
        >
          <Menu size={18} strokeWidth={2.2} />
        </button>

        <div className="header-breadcrumbs">
          <span className="hub-badge">Sanan Admin</span>
        </div>
      </div>

      <div className="header-tools">
        <div className="admin-profile">
          <div className="admin-avatar">
            <Store size={13} strokeWidth={2} />
          </div>

          <div className="admin-info">
            <strong>{user?.name || 'Admin Sanan'}</strong>
            <span className="admin-email">{user?.email || 'admin@sanan.com'}</span>
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          title="Keluar dari Akun"
          onClick={handleLogout}
        >
          <LogOut size={14} />
          <span className="logout-text">Keluar</span>
        </button>
      </div>
    </header>
  )
}

export default Header
