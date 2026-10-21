'use client'

import { Plus } from 'lucide-react'

export default function KnowledgeHeader() {
  return (
    <div className="page-title-row">
      <div>
        <h1>Pengetahuan</h1>
        <p>
          Kelola informasi edukatif tentang Kampung Sanan,
          tempe, dan keripik tempe.
        </p>
      </div>

      <button className="primary-button">
        <Plus size={17} />
        Tambah Informasi
      </button>
    </div>
  )
}