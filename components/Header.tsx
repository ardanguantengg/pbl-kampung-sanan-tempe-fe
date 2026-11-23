'use client'

import { Store, Menu } from 'lucide-react'
import { getStoredUser } from '@/services/api'
import { useSidebar } from './SidebarContext'

function Header() {
  const user = getStoredUser()
  const { toggleMobile } = useSidebar()

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
      </div>
    </header>
  )
}

export default Header
