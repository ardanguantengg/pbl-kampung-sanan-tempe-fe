import { BookOpen, Plus, Pencil } from 'lucide-react'

interface ArticleItem {
  title: string
  category: string
  status: string
}

function Pengetahuan() {
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

      <div className="card-grid">
        {articles.map((article, index) => (
          <div className="content-card" key={index}>
            <div className="content-icon">
              <BookOpen size={20} />
            </div>

            <span
              className={`status-badge ${
                article.status === 'Dipublikasi'
                  ? 'active-status'
                  : 'waiting-status'
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
        ))}
      </div>
    </div>
  )
}

export default Pengetahuan
