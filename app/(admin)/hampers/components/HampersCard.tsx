
import { Gift, Pencil, Trash2 } from 'lucide-react'
import type { HamperItem } from '@/types/hampers'

interface HampersCardProps {
  hamper: HamperItem
  onEdit: (hamper: HamperItem) => void
  onDelete: (id: number) => void
}

export default function HampersCard({
  hamper,
  onEdit,
  onDelete,
}: HampersCardProps) {
  const storeName =
    (hamper.items?.length ?? 0) > 0
      ? hamper.items?.[0]?.store_name || hamper.description || ''
      : hamper.description || ''

  const productCount =
    hamper.items?.length ?? hamper.item_count ?? 0

  const badgeClass =
    hamper.status === 'Aktif'
      ? 'hampers-badge-aktif'
      : hamper.status === 'Habis'
        ? 'hampers-badge-habis'
        : 'hampers-badge-nonaktif'

  return (
    <div className="hampers-card">
      <div className="hampers-card-top">
        <div className="hampers-card-icon">
          <Gift size={20} />
        </div>

        <span className={`hampers-badge ${badgeClass}`}>
          {hamper.status}
        </span>
      </div>

      <div className="hampers-card-body">
        <h3 className="hampers-card-name">{hamper.name}</h3>

        {storeName && (
          <p className="hampers-card-store">{storeName}</p>
        )}
      </div>

      <div className="hampers-card-meta">
        <span className="hampers-count">
          {productCount} Produk
        </span>

        <span className="hampers-price">
          Rp{Number(hamper.price).toLocaleString('id-ID')}
        </span>
      </div>

      <div className="hampers-card-divider" />

      <div className="hampers-card-actions">
        <button
          type="button"
          className="hampers-btn-edit"
          onClick={() => onEdit(hamper)}
        >
          <Pencil size={13} />
          Edit
        </button>

        <button
          type="button"
          className="hampers-btn-delete"
          onClick={() => onDelete(hamper.id)}
        >
          <Trash2 size={13} />
          Hapus
        </button>
      </div>
    </div>
  )
}
