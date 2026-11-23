
import { Search } from 'lucide-react'

interface HampersSearchProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedStoreFilter: string
  onStoreFilterChange: (value: string) => void
  stores: Array<{ id: number; name: string }>
}

export default function HampersSearch({
  searchQuery,
  onSearchChange,
  selectedStoreFilter,
  onStoreFilterChange,
  stores,
}: HampersSearchProps) {
  return (
    <form
      className="toolbar"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="search-box">
        <Search size={17} />

        <input
          type="text"
          placeholder="Cari paket....."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="product-store-filter"
        value={selectedStoreFilter}
        onChange={(event) => onStoreFilterChange(event.target.value)}
        aria-label="Filter berdasarkan toko"
      >
        <option value="">Semua Toko</option>
        {stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>
    </form>
  )
}
