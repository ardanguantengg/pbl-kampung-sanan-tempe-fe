'use client'

import { Search, SlidersHorizontal, Loader2 } from 'lucide-react'

interface TokoSearchProps {
  searchQuery: string
  setSearchQuery: (value: string) => void
  onSearch: (event: React.FormEvent<HTMLFormElement>) => void
  loading: boolean
}

export default function TokoSearch({
  searchQuery,
  setSearchQuery,
  onSearch,
  loading,
}: TokoSearchProps) {
  return (
    <form className="toolbar" onSubmit={onSearch}>
      <div className="search-box">
        <Search size={17} />
        <input
          type="text"
          placeholder="Cari toko, pemilik, alamat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button type="submit" className="filter-button" disabled={loading}>
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <SlidersHorizontal size={16} />
        )}
        {loading ? 'Mencari...' : 'Cari Toko'}
      </button>
    </form>
  )
}