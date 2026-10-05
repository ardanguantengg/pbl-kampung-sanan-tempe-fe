import React, { useState, useEffect } from 'react'
import { Search, Plus, Pencil, Trash2, X, SlidersHorizontal, Loader2, AlertCircle } from 'lucide-react'
import { api, getFullImageUrl } from '../services/api'
import kripikDefault from '../assets/Produk/kripiktempe.jpg'

export interface ProductItem {
  id: number
  store_id: number
  store_name?: string
  name: string
  image?: string
  price: number
  variant?: string
  size?: string
  description?: string
  status: string
}

export interface ProductFormData {
  store_id: string
  name: string
  price: string
  variant: string
  size: string
  description: string
  status: string
  image: string
  imageFile?: File | null
}

function Produk() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<string>('Semua')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState<ProductFormData>({
    store_id: '',
    name: '',
    price: '',
    variant: '',
    size: '250g',
    description: '',
    status: 'Tersedia',
    image: '',
    imageFile: null,
  })

  useEffect(() => {
    fetchStores()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [selectedStoreFilter])

  const fetchStores = async () => {
    try {
      const res = await api.stores.getAll()
      if (res.success) {
        setStores(res.data)
        if (res.data.length > 0 && !formData.store_id) {
          setFormData((prev) => ({ ...prev, store_id: String(res.data[0].id) }))
        }
      }
    } catch (err) {
      console.error('Failed to load stores:', err)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.products.getAll({
        search: searchQuery || undefined,
        store_id: selectedStoreFilter !== 'Semua' ? parseInt(selectedStoreFilter, 10) : undefined,
      })
      if (res.success) {
        setProducts(res.data)
      }
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts()
  }

  const resetForm = () => {
    setFormData({
      store_id: stores.length > 0 ? String(stores[0].id) : '',
      name: '',
      price: '',
      variant: '',
      size: '250g',
      description: '',
      status: 'Tersedia',
      image: '',
      imageFile: null,
    })
    setEditingId(null)
    setFormError(null)
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    const inputElement = event.target as HTMLInputElement

    if (inputElement.files && inputElement.files[0]) {
      const file = inputElement.files[0]
      const fileUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, image: fileUrl, imageFile: file }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      const data = new FormData()
      data.append('store_id', formData.store_id)
      data.append('name', formData.name.trim())
      data.append('price', formData.price)
      data.append('variant', formData.variant.trim())
      data.append('size', formData.size.trim())
      data.append('description', formData.description.trim())
      data.append('status', formData.status)

      if (formData.imageFile) {
        data.append('image', formData.imageFile)
      } else if (formData.image && formData.image.startsWith('http')) {
        data.append('image', formData.image)
      }

      if (editingId !== null) {
        await api.products.update(editingId, data)
      } else {
        await api.products.create(data)
      }

      resetForm()
      setIsFormOpen(false)
      fetchProducts()
    } catch (err: any) {
      console.error('Error saving product:', err)
      setFormError(err.message || 'Gagal menyimpan data produk')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product: ProductItem) => {
    setEditingId(product.id)
    setFormData({
      store_id: String(product.store_id),
      name: product.name,
      price: String(product.price),
      variant: product.variant || '',
      size: product.size || '',
      description: product.description || '',
      status: product.status,
      image: product.image ? getFullImageUrl(product.image) || '' : '',
      imageFile: null,
    })
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (deleteTargetId === null) return
    try {
      await api.products.delete(deleteTargetId)
      setDeleteTargetId(null)
      fetchProducts()
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }

  return (
    <div>
      {/* HEADER HALAMAN */}
      <div className="page-title-row">
        <div>
          <h1>Manajemen Produk Olahan Tempe</h1>
          <p>
            Kelola katalog seluruh produk keripik tempe dari setiap toko di Sentra Sanan.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            resetForm()
            setIsFormOpen(true)
          }}
        >
          <Plus size={17} />
          Tambah Produk
        </button>
      </div>

      {/* SEARCH DAN FILTER */}
      <form className="toolbar" onSubmit={handleSearch}>
        <div className="search-box">
          <Search size={17} />
          <input
            type="text"
            placeholder="Cari produk, varian rasa, nama toko..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--card-bg)',
              color: 'var(--text-color)',
              fontSize: '13px',
              cursor: 'pointer',
            }}
            value={selectedStoreFilter}
            onChange={(e) => setSelectedStoreFilter(e.target.value)}
          >
            <option value="Semua">Semua Toko</option>
            {stores.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.name}
              </option>
            ))}
          </select>

          <button type="submit" className="filter-button">
            <SlidersHorizontal size={16} />
            Filter
          </button>
        </div>
      </form>

      {/* DATA PRODUK */}
      <div className="data-panel">
        <div className="data-table">
          <div className="data-head">
            <span>PRODUK</span>
            <span>TOKO PENGHASIL</span>
            <span>VARIAN / UKURAN</span>
            <span>HARGA</span>
            <span>STATUS</span>
            <span>AKSI</span>
          </div>

          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Loader2 className="animate-spin" size={24} style={{ display: 'inline', marginRight: 8 }} />
              Memuat data produk...
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Tidak ada produk yang sesuai
            </div>
          ) : (
            products.map((product, index) => (
              <div className="data-row" key={product.id || index}>
                <div className="store-name">
                  <img
                    src={product.image ? getFullImageUrl(product.image) : kripikDefault}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = kripikDefault
                    }}
                  />
                  <div>
                    <strong>{product.name}</strong>
                    <small>{product.description || 'Olahan Tempe Sanan'}</small>
                  </div>
                </div>

                <div>
                  <strong>{product.store_name || '-'}</strong>
                </div>

                <div>
                  <span className="badge category-badge">
                    {product.variant || 'Original'} {product.size ? `(${product.size})` : ''}
                  </span>
                </div>

                <div>
                  <strong>Rp{Number(product.price).toLocaleString('id-ID')}</strong>
                </div>

                <div>
                  <span
                    className={`status-badge ${
                      product.status === 'Tersedia' ? 'active-status' : 'waiting-status'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                <div className="row-actions">
                  <button
                    title="Edit"
                    type="button"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    title="Hapus"
                    type="button"
                    onClick={() => setDeleteTargetId(product.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pagination">
          <span>Menampilkan {products.length} dari {products.length} Produk</span>
        </div>
      </div>

      {/* DRAWER FORM PRODUK */}
      {isFormOpen && (
        <div className="drawer-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="drawer-panel" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="eyebrow">FORM PRODUK</span>
                <h2>{editingId === null ? 'Tambah Produk Baru' : 'Edit Produk'}</h2>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() => setIsFormOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {formError && (
              <div
                style={{
                  margin: '16px 24px 0',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form className="drawer-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label className="field" style={{ gridColumn: 'span 2' }}>
                  <span>Pilih Toko Pemilik *</span>
                  <select
                    name="store_id"
                    value={formData.store_id}
                    onChange={handleChange}
                    required
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={String(s.id)}>
                        {s.name} ({s.owner})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field" style={{ gridColumn: 'span 2' }}>
                  <span>Nama Produk *</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="contoh: Keripik Tempe Balado Pedas"
                    required
                  />
                </label>

                <label className="field">
                  <span>Harga (Rp) *</span>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="20000"
                    required
                  />
                </label>

                <label className="field">
                  <span>Status Ketersediaan</span>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Tersedia">Tersedia</option>
                    <option value="Habis">Habis</option>
                    <option value="Pre-Order">Pre-Order</option>
                  </select>
                </label>

                <label className="field">
                  <span>Varian / Rasa</span>
                  <input
                    name="variant"
                    value={formData.variant}
                    onChange={handleChange}
                    placeholder="Original / Balado / BBQ"
                  />
                </label>

                <label className="field">
                  <span>Ukuran / Berat</span>
                  <input
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="250g / 500g"
                  />
                </label>

                <label className="field" style={{ gridColumn: 'span 2' }}>
                  <span>Foto Produk</span>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleChange}
                  />

                  {formData.image && (
                    <div className="image-preview-box" style={{ marginTop: '8px' }}>
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="image-preview"
                      />
                    </div>
                  )}
                </label>

                <label className="field" style={{ gridColumn: 'span 2' }}>
                  <span>Deskripsi Produk</span>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Keterangan rasa, komposisi, atau kemasan..."
                  />
                </label>
              </div>

              <div className="drawer-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={submitting}
                >
                  Batal
                </button>

                <button type="submit" className="primary-button" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : editingId === null ? 'Simpan Produk' : 'Update Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE DIALOG */}
      {deleteTargetId !== null && (
        <div className="confirm-overlay" onClick={() => setDeleteTargetId(null)}>
          <div className="confirm-dialog" onClick={(event) => event.stopPropagation()}>
            <h3>Hapus produk?</h3>
            <p>Apakah Anda yakin ingin menghapus data produk ini dari katalog?</p>

            <div className="confirm-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setDeleteTargetId(null)}
              >
                Batal
              </button>
              <button type="button" className="primary-button" onClick={handleDelete}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Produk
