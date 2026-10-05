import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Store,
  Package,
  Gift,
  LucideIcon,
} from 'lucide-react'

interface MenuItem {
  name: string
  path: string
  icon: LucideIcon
}

function Sidebar() {
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

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-name">Sanan Admin</div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-title">MENU UTAMA</div>

        {mainMenu.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar
