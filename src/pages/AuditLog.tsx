import { useEffect, useState } from 'react'
import { ClipboardList, Loader2, RefreshCw } from 'lucide-react'
import { api } from '../services/api'

interface ActivityLogItem {
  id: number
  user_name?: string
  user_role?: string
  action: string
  module: string
  description: string
  created_at: string
}

function AuditLog() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLogs(page)
  }, [page])

  const fetchLogs = async (currentPage: number) => {
    try {
      setLoading(true)
      const res = await api.activity.getAll(currentPage, 15)
      if (res.success) {
        setLogs(res.data)
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1)
        }
      }
    } catch (err) {
      console.error('Failed to fetch activity logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Audit Log & Riwayat Aktivitas</h1>
          <p>
            Catatan riwayat otomatis seluruh perubahan data toko, produk, hampers, dan sistem.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() => fetchLogs(page)}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Segarkan
        </button>
      </div>

      <div className="data-panel">
        <div className="audit-table">
          <div className="audit-head">
            <span>ADMIN / USER</span>
            <span>MODUL</span>
            <span>AKTIVITAS & RINCIAN</span>
            <span>WAKTU</span>
            <span>STATUS</span>
          </div>

          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Loader2 className="animate-spin" size={24} style={{ display: 'inline', marginRight: 8 }} />
              Memuat log aktivitas...
            </div>
          ) : logs.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Belum ada riwayat aktivitas
            </div>
          ) : (
            logs.map((log) => (
              <div className="audit-row" key={log.id}>
                <div>
                  <strong>{log.user_name || 'Admin'}</strong>
                  <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '11px' }}>
                    {log.user_role || 'admin'}
                  </small>
                </div>

                <span>
                  <span className="badge category-badge">{log.module}</span>
                </span>

                <div>
                  <strong>{log.action}</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {log.description}
                  </p>
                </div>

                <span>{formatTime(log.created_at)}</span>

                <span>
                  <span className="status success-status">
                    <ClipboardList size={12} />
                    Tercatat
                  </span>
                </span>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <span>Halaman {page} dari {totalPages}</span>
            <div className="pagination-buttons">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              <button type="button" className="current">
                {page}
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditLog
