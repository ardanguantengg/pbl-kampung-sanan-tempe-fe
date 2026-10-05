import { useEffect, useState } from 'react'
import {
  Store,
  Package,
  Gift,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

interface DashboardStats {
  totalStores: number
  activeStores: number
  totalProducts: number
  totalHampers: number
  recentActivities: any[]
}

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    totalStores: 0,
    activeStores: 0,
    totalProducts: 0,
    totalHampers: 0,
    recentActivities: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await api.dashboard.getStats()
      if (res.success && res.data) {
        setStats(res.data)
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateStr: string) => {
    if (!dateStr) return 'Baru saja'
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">KAMPUNG SANAN DIGITAL HUB</span>
          <h1>Selamat Datang Kembali, Admin</h1>
          <p>
            Berikut adalah ringkasan data operasional dan aktivitas
            terkini di sentra keripik tempe Sanan.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon">
              <Store size={19} />
            </div>

            <span className="badge success">{stats.activeStores} Aktif</span>
          </div>

          <div className="stat-label">Jumlah Toko</div>
          <div className="stat-value">
            {loading ? <Loader2 className="animate-spin" size={24} /> : stats.totalStores}
          </div>
          <div className="stat-desc">Sentra & Mitra Terdaftar</div>
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
            {loading ? <Loader2 className="animate-spin" size={24} /> : stats.totalProducts}
          </div>
          <div className="stat-desc">Varian & Olahan Tempe</div>
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
            {loading ? <Loader2 className="animate-spin" size={24} /> : stats.totalHampers}
          </div>
          <div className="stat-desc">Paket Oleh-Oleh Eksklusif</div>
        </div>
      </div>

      <div className="ai-banner">
        <div className="ai-icon">
          <Sparkles size={24} />
        </div>

        <div>
          <span>AI ANALYSIS</span>
          <h2>Insight Kampung Sanan</h2>
          <p>
            Sistem menganalisis data toko, produk, dan transaksi
            untuk memantau pertumbuhan sentra keripik tempe Sanan secara real-time.
          </p>
        </div>
      </div>

      <div className="insight-grid">
        <div className="insight-card insight-card-featured">
          <span>REKOMENDASI</span>
          <h3>Produk paling diminati</h3>
          <p>
            Keripik tempe rasa gurih dan original menjadi produk dengan minat
            tertinggi berdasarkan aktivitas pelanggan dan interaksi toko saat ini.
          </p>
        </div>

        <div className="insight-card insight-card-featured">
          <span>POLA</span>
          <h3>Toko paling sering dikunjungi</h3>
          <p>
            Sentra utama dan toko terverifikasi menjadi titik paling sering dikunjungi,
            menandakan tingkat minat dan kunjungan yang paling konsisten dari pengguna.
          </p>
        </div>
      </div>

      <div className="dashboard-grid insight-spacing">
        <section className="panel activity-panel">
          <div className="panel-header">
            <div>
              <h2>Aktivitas Data Terbaru</h2>
              <p>Catatan perubahan data toko, produk, dan hampers terkini dari database</p>
            </div>

            <button className="text-button" onClick={() => navigate('/audit-log')}>
              Lihat Semua
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="activity-table">
            <div className="table-head">
              <span>Modul</span>
              <span>Aksi</span>
              <span>Keterangan</span>
              <span>Waktu</span>
              <span>Status</span>
            </div>

            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Memuat data aktivitas...
              </div>
            ) : stats.recentActivities.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Belum ada aktivitas tercatat
              </div>
            ) : (
              stats.recentActivities.map((item, index) => (
                <div className="activity-row" key={item.id || index}>
                  <span>{item.module || 'Sistem'}</span>
                  <span className="activity-name">{item.action}</span>
                  <span style={{ fontSize: '13px' }}>{item.description}</span>
                  <span>{formatTime(item.created_at)}</span>
                  <span>
                    <span className="status success-status">
                      <CheckCircle2 size={12} />
                      Tercatat
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="quote-card">
          <div className="quote-mark">99</div>

          <p>
            "Menjaga kualitas rasa tempe legendaris Malang
            melalui digitalisasi data terpadu."
          </p>

          <span>KAMPUNG SANAN HUB</span>
        </aside>
      </div>
    </div>
  )
}

export default Dashboard
