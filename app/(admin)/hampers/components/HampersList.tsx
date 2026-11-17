
import { Gift, Loader2 } from 'lucide-react'
import TablePagination from '@/components/TablePagination'
import HampersCard from './HampersCard'
import type { HamperItem } from '@/types/hampers'

interface HampersListProps {
  hampers: HamperItem[]
  loading: boolean
  totalData: number
  currentPage: number
  perPage: number
  totalPages: number
  onEdit: (hamper: HamperItem) => void
  onDelete: (id: number) => void
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

export default function HampersList({
  hampers,
  loading,
  totalData,
  currentPage,
  perPage,
  totalPages,
  onEdit,
  onDelete,
  onPageChange,
  onPerPageChange,
}: HampersListProps) {
  return (
    <div>
      {loading ? (
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
      ) : hampers.length === 0 ? (
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
      ) : (
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
      )}

      <TablePagination
        info={`Menampilkan ${hampers.length} dari ${totalData} Hampers`}
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
      />
    </div>
  )
}
