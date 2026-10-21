
import { Search } from 'lucide-react'

interface HampersSearchProps {
  searchQuery: string
  onSearchChange: (value: string) => void
}

export default function HampersSearch({
  searchQuery,
  onSearchChange,
}: HampersSearchProps) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{ marginBottom: '24px' }}
    >
      <div className="search-box" style={{ maxWidth: '340px' }}>
        <Search size={17} />

        <input
          type="text"
          placeholder="Cari paket....."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </form>
  )
}
