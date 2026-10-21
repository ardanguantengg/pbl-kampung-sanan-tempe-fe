
import { Plus } from 'lucide-react'

interface HampersHeaderProps {
  onAdd: () => void
}

export default function HampersHeader({ onAdd }: HampersHeaderProps) {
  return (
    <div className="page-title-row">
      <div>
        <h1>Daftar Paket</h1>
        <p>
          Kelola paket dan rekomendasi oleh-oleh dari toko di Kampung Sanan.
        </p>
      </div>

      <button className="primary-button" onClick={onAdd}>
        <Plus size={17} />
        Tambah Produk
      </button>
    </div>
  )
}
