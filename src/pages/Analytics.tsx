import { Store, Package, Search } from 'lucide-react'

function Analytics() {
  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Analytics</h1>
          <p>
            Pantau aktivitas dan perkembangan informasi
            Kampung Keripik Tempe Sanan.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Store size={19} />
          </div>

          <div className="stat-label">Toko Terpopuler</div>
          <div className="stat-value">Bu Noer</div>
          <div className="stat-desc">Berdasarkan kunjungan</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Package size={19} />
          </div>

          <div className="stat-label">Produk Terpopuler</div>
          <div className="stat-value">Original</div>
          <div className="stat-desc">Paling banyak dilihat</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Search size={19} />
          </div>

          <div className="stat-label">Pencarian</div>
          <div className="stat-value">328</div>
          <div className="stat-desc">Bulan ini</div>
        </div>
      </div>

      <div className="analytics-panel">
        <div className="panel-header">
          <div>
            <h2>Aktivitas Pengunjung</h2>
            <p>Ringkasan aktivitas aplikasi mobile</p>
          </div>
        </div>

        <div className="fake-chart">
          <div style={{ height: '35%' }}></div>
          <div style={{ height: '55%' }}></div>
          <div style={{ height: '45%' }}></div>
          <div style={{ height: '70%' }}></div>
          <div style={{ height: '62%' }}></div>
          <div style={{ height: '82%' }}></div>
          <div style={{ height: '76%' }}></div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
