
import {
  Store,
  Package,
  Gift,
  Loader2,
} from 'lucide-react'
import type { DashboardStatsData } from './types'

interface DashboardStatsProps {
  stats: DashboardStatsData
  loading: boolean
}

export default function DashboardStats({
  stats,
  loading,
}: DashboardStatsProps) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-top">
          <div className="stat-icon">
            <Store size={19} />
          </div>

          <span className="badge success">
            {stats.activeStores} Aktif
          </span>
        </div>

        <div className="stat-label">Jumlah Toko</div>

        <div className="stat-value">
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            stats.totalStores
          )}
        </div>

        <div className="stat-desc">
          Sentra &amp; Mitra Terdaftar
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <div className="stat-icon">
            <Package size={19} />
          </div>

          <span className="badge neutral">Tersedia</span>
        </div>

        <div className="stat-label">Jumlah Produk</div>

        <div className="stat-value">
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            stats.totalProducts
          )}
        </div>

        <div className="stat-desc">
          Varian &amp; Olahan Tempe
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <div className="stat-icon">
            <Gift size={19} />
          </div>

          <span className="badge success">Paket</span>
        </div>

        <div className="stat-label">Jumlah Hampers</div>

        <div className="stat-value">
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            stats.totalHampers
          )}
        </div>

        <div className="stat-desc">
          Paket Oleh-Oleh Eksklusif
        </div>
      </div>
    </div>
  )
}
