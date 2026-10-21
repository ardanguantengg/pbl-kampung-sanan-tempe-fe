'use client'

import { BookOpen, Pencil } from 'lucide-react'

export interface ArticleItem {
  title: string
  category: string
  status: string
}

interface KnowledgeCardProps {
  article: ArticleItem
}

export default function KnowledgeCard({
  article,
}: KnowledgeCardProps) {
  const isPublished = article.status === 'Dipublikasi'

  return (
    <div className="content-card">
      <div className="content-icon">
        <BookOpen size={20} />
      </div>

      <span
        className={`status-badge ${
          isPublished ? 'active-status' : 'waiting-status'
        }`}
      >
        {article.status}
      </span>

      <small>{article.category}</small>

      <h3>{article.title}</h3>

      <p>
        Informasi edukatif yang dapat ditampilkan
        kepada pengguna aplikasi mobile.
      </p>

      <button className="outline-button">
        <Pencil size={15} />
        Edit Konten
      </button>
    </div>
  )
}