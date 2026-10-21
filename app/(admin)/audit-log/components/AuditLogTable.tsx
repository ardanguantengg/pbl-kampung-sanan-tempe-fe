
import { ClipboardList, Loader2 } from 'lucide-react'
import type { ActivityLogItem } from '@/types/audit-log'

interface AuditLogTableProps {
  logs: ActivityLogItem[]
  loading: boolean
}

function formatTime(dateStr: string) {
  if (!dateStr) return '-'

  const date = new Date(dateStr)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AuditLogTable({
  logs,
  loading,
}: AuditLogTableProps) {
  return (
    <div className="audit-table">
      <div className="audit-head">
        <span>ADMIN / USER</span>
        <span>MODUL</span>
        <span>AKTIVITAS &amp; RINCIAN</span>
        <span>WAKTU</span>
        <span>STATUS</span>
      </div>

      {loading ? (
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <Loader2
            className="animate-spin"
            size={24}
            style={{ display: 'inline', marginRight: 8 }}
          />
          Memuat log aktivitas...
        </div>
      ) : logs.length === 0 ? (
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          Belum ada riwayat aktivitas
        </div>
      ) : (
        logs.map((log) => (
          <div className="audit-row" key={log.id}>
            <div>
              <strong>{log.user_name || 'Admin'}</strong>
              <small
                style={{
                  display: 'block',
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                }}
              >
                {log.user_role || 'admin'}
              </small>
            </div>

            <span>
              <span className="badge category-badge">
                {log.module}
              </span>
            </span>

            <div>
              <strong>{log.action}</strong>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
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
  )
}
