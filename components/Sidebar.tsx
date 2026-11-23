'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  Package,
  Gift,
  LogOut,
  X,
  LucideIcon,
} from 'lucide-react'
import { api } from '@/services/api'
import { useSidebar } from './SidebarContext'

interface MenuItem {
  name: string
  path: string
  icon: LucideIcon
}

function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobileOpen, isCollapsed, closeMobile, toggleCollapse } = useSidebar()

  const mainMenu: MenuItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Manajemen Toko',
      path: '/toko',
      icon: Store,
    },
    {
      name: 'Produk',
      path: '/produk',
      icon: Package,
    },
    {
      name: 'Paket',
      path: '/hampers',
      icon: Gift,
    },
  ]

  const handleBrandClick = () => {
    if (window.innerWidth <= 1024) {
      closeMobile()
      return
    }

    toggleCollapse()
  }

  const handleLogout = () => {
    api.auth.logout()
    router.push('/login')
  }

  return (
    <>
      {/* Backdrop for mobile drawer */}
      <div
        className={`sidebar-backdrop ${isMobileOpen ? 'active' : ''}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      <aside
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${
          isMobileOpen ? 'mobile-open' : ''
        }`}
      >
        <div className="sidebar-brand">
          <button
            type="button"
            className="brand-logo-badge"
            onClick={handleBrandClick}
            title={
              isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'
            }
            aria-label={
              isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'
            }
          >
            <Store size={16} strokeWidth={2.2} />
          </button>
          <div className="brand-name">
            <span>Sanan Admin</span>
            <small>Digital Hub</small>
          </div>

          {/* Close button on mobile screen */}
          <button
            id="mobile-menu-close"
            type="button"
            className="sidebar-close-btn"
            onClick={closeMobile}
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">MENU UTAMA</div>

          <nav className="sidebar-nav">
            {mainMenu.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  title={item.name}
                  onClick={closeMobile}
                >
                  <div className="sidebar-link-icon">
                    <Icon size={17} strokeWidth={1.8} />
                  </div>
                  <span className="sidebar-link-text">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button
            id="sidebar-logout"
            type="button"
            className="sidebar-logout-button"
            onClick={handleLogout}
            title="Keluar dari Akun"
          >
            <LogOut size={15} />
            <span className="sidebar-logout-label">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
