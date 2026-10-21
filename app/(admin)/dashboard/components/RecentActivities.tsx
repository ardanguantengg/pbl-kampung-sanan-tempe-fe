
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import type { DashboardActivity } from './types'

interface RecentActivitiesProps {
  activities: DashboardActivity[]
  loading: boolean
  onViewAll: () => void
}

function formatTime(dateStr?: string) {
  if (!dateStr) return 'Baru saja'

  const date = new Date(dateStr)

  if (Number.isNaN(date.getTime())) return 'Baru saja'

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getActivityItemName(description?: string) {
  return description?.match(/"([^"]+)"/)?.[1]
}

export default function RecentActivities({
  activities,
  loading,
  onViewAll,
}: RecentActivitiesProps) {
  return (
    <section className="panel activity-panel">
      <div className="panel-header">
        <div>
          <h2>Aktivitas Data Terbaru</h2>
          <p>
            Catatan perubahan data toko, produk, dan hampers
            terkini dari database
          </p>
        </div>

        <button
          className="text-button"
          onClick={onViewAll}
        >
          Lihat Semua
          <ArrowUpRight size={15} />
        </button>
      </div>

      <div className="activity-table">
        <div className="table-head">
          <span>Modul</span>
          <span>Keterangan</span>
          <span>Waktu</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Memuat data aktivitas...
          </div>
        ) : activities.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Belum ada aktivitas tercatat
          </div>
        ) : (
          activities.map((item, index) => {
            const itemName = getActivityItemName(item.description)

            return (
              <div
                className="activity-row"
                key={item.id || index}
              >
                <span>{item.module || 'Sistem'}</span>

                <span className="activity-name">
                  {item.action}

                  {itemName && (
                    <small className="activity-item-name">
                      {itemName}
                    </small>
                  )}
                </span>

                <span>{formatTime(item.created_at)}</span>

                <span>
                  <span className="status success-status">
                    <CheckCircle2 size={12} />
                    Tercatat
                  </span>
                </span>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
