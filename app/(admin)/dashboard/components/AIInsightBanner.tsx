
import { Sparkles } from 'lucide-react'

export default function AIInsightBanner() {
  return (
    <div className="ai-banner">
      <div className="ai-icon">
        <Sparkles size={24} />
      </div>

      <div>
        <span>AI ANALYSIS</span>

        <h2>Insight Kampung Sanan</h2>

        <p>
          Sistem menganalisis data toko, produk, dan transaksi
          untuk memantau pertumbuhan sentra keripik tempe
          Sanan secara real-time.
        </p>
      </div>
    </div>
  )
}
