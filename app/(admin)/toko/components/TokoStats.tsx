'use client'

interface TokoStatsProps {
  statusFilter: string
  setStatusFilter: (status: string) => void
  totalStores: number
  activeCount: number
}

export default function TokoStats({
  statusFilter,
  setStatusFilter,
  totalStores,
  activeCount,
}: TokoStatsProps) {
  return (
    <div className="tabs">
      <button
        type="button"
        className={`tab ${statusFilter === 'Semua' ? 'active' : ''}`}
        onClick={() => setStatusFilter('Semua')}
      >
        Semua Toko <span>{totalStores}</span>
      </button>

      <button
        type="button"
        className={`tab ${statusFilter === 'Aktif' ? 'active' : ''}`}
        onClick={() => setStatusFilter('Aktif')}
      >
        Toko Aktif <span>{activeCount}</span>
      </button>
    </div>
  )
}