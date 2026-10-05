import { Sparkles, ArrowRight } from 'lucide-react'

function AIInsight() {
  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>AI Insight</h1>
          <p>
            Ringkasan wawasan yang dihasilkan oleh sistem AI
            berdasarkan data aplikasi.
          </p>
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
            Sistem AI akan membantu menganalisis data dan
            memberikan wawasan yang dapat digunakan admin.
          </p>
        </div>
      </div>

      <div className="insight-grid">
        <div className="insight-card">
          <span>REKOMENDASI</span>

          <h3>
            Produk dengan minat pengguna tinggi
          </h3>

          <p>
            Keripik tempe dengan kategori gurih dan harga
            terjangkau menunjukkan minat yang tinggi.
          </p>

          <button className="text-button">
            Lihat Detail
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="insight-card">
          <span>RINGKASAN</span>

          <h3>Aktivitas toko</h3>

          <p>
            Data aktivitas toko akan dianalisis untuk
            memberikan informasi kepada admin.
          </p>

          <button className="text-button">
            Lihat Detail
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIInsight
