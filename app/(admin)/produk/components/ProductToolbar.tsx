'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import type { StoreOption } from '@/types/produk'

interface ProductToolbarProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  selectedStoreFilter: string
  setSelectedStoreFilter: (value: string) => void
  stores: StoreOption[]
  onSearch: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function ProductToolbar({
  searchQuery,
  setSearchQuery,
  selectedStoreFilter,
  setSelectedStoreFilter,
  stores,
  onSearch,
}: ProductToolbarProps) {
  return (
    <form className="toolbar" onSubmit={onSearch}>
      <div className="search-box">
        <Search size={17} />

        <input
          type="text"
          placeholder="Cari produk, varian rasa, nama toko..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <select
          className="product-store-filter"
          value={selectedStoreFilter}
          onChange={(event) =>
            setSelectedStoreFilter(event.target.value)
          }
        >
          <option value="Semua">Semua Toko</option>

          {stores.map((store) => (
            <option key={store.id} value={String(store.id)}>
              {store.name}
            </option>
          ))}
        </select>

        <button type="submit" className="filter-button">
          <SlidersHorizontal size={16} />
          Filter
        </button>
      </div>
    </form>
  )
}