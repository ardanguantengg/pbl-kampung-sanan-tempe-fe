'use client'

import KnowledgeHeader from './components/KnowledgeHeader'
import KnowledgeCard, {
  type ArticleItem,
} from './components/KnowledgeCard'

export default function PengetahuanPage() {
  const articles: ArticleItem[] = [
    {
      title: 'Sejarah Kampung Sentra Keripik Tempe Sanan',
      category: 'Sejarah Sanan',
      status: 'Dipublikasi',
    },
    {
      title: 'Mengenal Tempe dan Perkembangannya',
      category: 'Tempe',
      status: 'Dipublikasi',
    },
    {
      title: 'Proses Pembuatan Keripik Tempe',
      category: 'Proses Produksi',
      status: 'Draft',
    },
    {
      title: 'Tips Menyimpan Keripik Tempe',
      category: 'Tips',
      status: 'Dipublikasi',
    },
  ]

  return (
    <div>
      <KnowledgeHeader />

      <div className="card-grid">
        {articles.map((article) => (
          <KnowledgeCard
            key={article.title}
            article={article}
          />
        ))}
      </div>
    </div>
  )
}