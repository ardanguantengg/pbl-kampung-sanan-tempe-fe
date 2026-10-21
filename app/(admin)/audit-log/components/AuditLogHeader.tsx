
import { RefreshCw } from 'lucide-react'

interface AuditLogHeaderProps {
  loading: boolean
  onRefresh: () => void
}

export default function AuditLogHeader({
  loading,
  onRefresh,
}: AuditLogHeaderProps) {
  return (
    <div className="page-title-row">
      <div>
        <h1>Audit Log &amp; Riwayat Aktivitas</h1>
        <p>
          Catatan riwayat otomatis seluruh perubahan data toko,
          produk, hampers, dan sistem.
        </p>
      </div>

      <button
        className="secondary-button"
        onClick={onRefresh}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <RefreshCw
          size={15}
          className={loading ? 'animate-spin' : ''}
        />
        Segarkan
      </button>
    </div>
  )
}
