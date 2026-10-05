import { LogOut, Store } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api, getStoredUser } from '../services/api'

function Header() {
  const navigate = useNavigate()
  const user = getStoredUser()

  const handleLogout = () => {
    api.auth.logout()
    navigate('/login')
  }

  return (
    <header className="top-header">
      <div></div>

      <div className="header-tools">
        <div className="admin-profile">
          <div className="admin-avatar">
            <Store size={12} strokeWidth={2} />
          </div>

          <div className="admin-info">
            <strong>{user?.name || 'Admin Sanan'}</strong>
            <span>{user?.email || 'admin@sanan.com'}</span>
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          title="Logout"
          onClick={handleLogout}
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  )
}

export default Header
