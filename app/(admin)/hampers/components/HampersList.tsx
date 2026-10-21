
import { Gift, Loader2 } from 'lucide-react'
import HampersCard from './HampersCard'
import type { HamperItem } from './types'

interface HampersListProps {
  hampers: HamperItem[]
  loading: boolean
  onEdit: (hamper: HamperItem) => void
  onDelete: (id: number) => void
}

export default function HampersList({
  hampers,
  loading,
  onEdit,
  onDelete,
}: HampersListProps) {
  if (loading) {
    return (
      <div
        style={{
          padding: '48px',
          textAlign: 'center',
          color: '#9b8d84',
        }}
      >
        <Loader2
          size={28}
          style={{ display: 'inline', marginRight: 8 }}
        />
        Memuat data paket...
      </div>
    )
  }

  if (hampers.length === 0) {
    return (
      <div
        style={{
          padding: '48px',
          textAlign: 'center',
          color: '#9b8d84',
        }}
      >
        <Gift
          size={40}
          style={{
            display: 'block',
            margin: '0 auto 12px',
            opacity: 0.3,
          }}
        />
        Belum ada paket hampers
      </div>
    )
  }

  return (
    <div className="hampers-card-grid">
      {hampers.map((hamper) => (
        <HampersCard
          key={hamper.id}
          hamper={hamper}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
