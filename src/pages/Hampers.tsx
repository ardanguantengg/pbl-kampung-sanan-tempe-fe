import React, { useState, useEffect } from 'react'
import { Gift, Plus, Pencil, Trash2, X, Search, Loader2, AlertCircle } from 'lucide-react'
import { api, getFullImageUrl } from '../services/api'

export interface HamperItem {
  id: number
  name: string
  description?: string
  image?: string
  price: number
  status: string
  item_count?: number
  items?: any[]
}

export interface HamperFormData {
  name: string
  storeId: string
  jumlahProduk: string
  price: string
  status: string
  image: string
  imageFile?: File | null
  description: string
}

function Hampers() {
  const [hampers, setHampers] = useState<HamperItem[]>([])
  const [availableProducts, setAvailableProducts] = useState<any[]>([])
  const [availableStores, setAvailableStores] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const defaultForm: HamperFormData = {
    name: '',
    storeId: '',
    jumlahProduk: '',
    price: '',
    status: 'Aktif',
    image: '',
    imageFile: null,
    description: '',
  }

  const [formData, setFormData] = useState<HamperFormData>(defaultForm)

  useEffect(() => {
    fetchHampers()
    fetchProducts()
    fetchStores()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.products.getAll()
      if (res.success) setAvailableProducts(res.data)
    } catch (err) {
      console.error('Failed to load products:', err)
    }
  }

  const fetchStores = async () => {
    try {
      const res = await api.stores.getAll()
      if (res.success) setAvailableStores(res.data)
    } catch (err) {
      console.error('Failed to load stores:', err)
    }
  }

  const fetchHampers = async () => {
    try {
      setLoading(true)
      const res = await api.hampers.getAll()
      if (res.success) setHampers(res.data)
    } catch (err) {
      console.error('Failed to load hampers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const resetForm = () => {
    setFormData(defaultForm)
    setEditingId(null)
    setFormError(null)
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    const inputEl = event.target as HTMLInputElement

    if (inputEl.files && inputEl.files[0]) {
      const file = inputEl.files[0]
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
      // Build items array: pick products from selected store up to jumlahProduk count
      const storeProducts = formData.storeId
        ? availableProducts.filter((p) => String(p.store_id) === String(formData.storeId))
        : availableProducts

      const count = Math.max(1, parseInt(formData.jumlahProduk, 10) || 1)
      const itemsToUse = storeProducts.slice(0, count)

      const items = itemsToUse.length > 0
        ? itemsToUse.map((p) => ({ product_id: p.id, quantity: 1 }))
        : availableProducts.length > 0
        ? [{ product_id: availableProducts[0].id, quantity: 1 }]
        : []

      const data = new FormData()
      data.append('name', formData.name.trim())
      data.append('price', formData.price)
      data.append('description', formData.description.trim())
      data.append('status', formData.status)
      data.append('items', JSON.stringify(items))

      if (formData.imageFile) {
        data.append('image', formData.imageFile)
      } else if (formData.image && formData.image.startsWith('http')) {
        data.append('image', formData.image)
      }

      if (editingId !== null) {
        await api.hampers.update(editingId, data)
      } else {
        await api.hampers.create(data)
      }

      resetForm()
      setIsFormOpen(false)
      fetchHampers()
    } catch (err: any) {
      console.error('Error saving hamper:', err)
      setFormError(err.message || 'Gagal menyimpan hampers')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (hamper: HamperItem) => {
    setEditingId(hamper.id)

    // Guess the store from first item
    const firstItem = hamper.items && hamper.items[0]
    const storeId = firstItem
      ? String(
          availableProducts.find((p) => p.id === firstItem.product_id)?.store_id || ''
        )
      : ''

    setFormData({
      name: hamper.name,
      storeId,
      jumlahProduk: String(hamper.items?.length || hamper.item_count || ''),
      price: String(hamper.price),
      status: hamper.status,
      image: hamper.image ? getFullImageUrl(hamper.image) || '' : '',
      imageFile: null,
      description: hamper.description || '',
    })
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (deleteTargetId === null) return
    try {
      await api.hampers.delete(deleteTargetId)
      setDeleteTargetId(null)
      fetchHampers()
    } catch (err) {
      console.error('Failed to delete hamper:', err)
    }
  }

  const filteredHampers = hampers.filter((h) =>
    searchQuery ? h.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  )

  return (
    <div>
      {/* HEADER */}
      <div className="page-title-row">
        <div>
          <h1>Daftar Paket</h1>
          <p>Kelola paket dan rekomendasi oleh-oleh dari toko di Kampung Sanan.</p>
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

      {/* SEARCH */}
      <form onSubmit={handleSearch} style={{ marginBottom: '24px' }}>
        <div className="search-box" style={{ maxWidth: '340px' }}>
          <Search size={17} />
          <input
            type="text"
            placeholder="Cari paket....."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* CARD GRID */}
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#9b8d84' }}>
          <Loader2 size={28} style={{ display: 'inline', marginRight: 8 }} />
          Memuat data paket...
        </div>
      ) : filteredHampers.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#9b8d84' }}>
          <Gift size={40} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.3 }} />
          Belum ada paket hampers
        </div>
      ) : (
        <div className="hampers-card-grid">
          {filteredHampers.map((hamper, index) => {
            const storeName =
              hamper.items && hamper.items.length > 0
                ? hamper.items[0].store_name || hamper.description || ''
                : hamper.description || ''
            const productCount = hamper.items?.length ?? hamper.item_count ?? 0

            return (
              <div className="hampers-card" key={hamper.id || index}>
                <div className="hampers-card-top">
                  <div className="hampers-card-icon">
                    <Gift size={20} />
                  </div>
                  <span
                    className={`hampers-badge ${
                      hamper.status === 'Aktif'
                        ? 'hampers-badge-aktif'
                        : hamper.status === 'Habis'
                        ? 'hampers-badge-habis'
                        : 'hampers-badge-nonaktif'
                    }`}
                  >
                    {hamper.status}
                  </span>
                </div>

                <div className="hampers-card-body">
                  <h3 className="hampers-card-name">{hamper.name}</h3>
                  {storeName && <p className="hampers-card-store">{storeName}</p>}
                </div>

                <div className="hampers-card-meta">
                  <span className="hampers-count">{productCount} Produk</span>
                  <span className="hampers-price">
                    Rp{Number(hamper.price).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="hampers-card-divider" />

                <div className="hampers-card-actions">
                  <button
                    type="button"
                    className="hampers-btn-edit"
                    onClick={() => handleEdit(hamper)}
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="hampers-btn-delete"
                    onClick={() => setDeleteTargetId(hamper.id)}
                  >
                    <Trash2 size={13} />
                    Hapus
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── MODAL FORM ── */}
      {isFormOpen && (
        <div className="hf-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="hf-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="hf-header">
              <div>
                <span className="hf-eyebrow">FORM INPUT</span>
                <h2 className="hf-title">
                  {editingId === null ? 'Tambah paket baru' : 'Edit paket hampers'}
                </h2>
              </div>
              <button
                type="button"
                className="hf-close"
                onClick={() => setIsFormOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Error */}
            {formError && (
              <div className="hf-error">
                <AlertCircle size={15} />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="hf-form">
              {/* Row 1: Nama paket | Toko */}
              <div className="hf-grid">
                <label className="hf-field">
                  <span>Nama paket</span>
                  <input
                    name="name"
                    placeholder="Keripik Tempe Original"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="hf-field">
                  <span>Toko</span>
                  <select name="storeId" value={formData.storeId} onChange={handleChange}>
                    <option value="">-- Pilih Toko --</option>
                    {availableStores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Row 2: Jumlah produk | Harga */}
                <label className="hf-field">
                  <span>Jumlah produk</span>
                  <input
                    name="jumlahProduk"
                    type="number"
                    min="1"
                    placeholder="5"
                    value={formData.jumlahProduk}
                    onChange={handleChange}
                  />
                </label>

                <label className="hf-field">
                  <span>Harga</span>
                  <input
                    name="price"
                    type="number"
                    placeholder="9000"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </label>

                {/* Row 3: Deskripsi paket (full width) */}
                <label className="hf-field hf-full">
                  <span>Deskripsi paket</span>
                  <input
                    name="description"
                    placeholder="contoh: isi paket terdiri dari 3 produk varian unggulan"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </label>

                {/* Row 4: Status | Gambar Produk */}
                <label className="hf-field">
                  <span>Status</span>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                    <option value="Habis">Habis</option>
                  </select>
                </label>

                <label className="hf-field">
                  <span>Gambar Produk</span>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleChange}
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      style={{ marginTop: '8px', width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  )}
                </label>
              </div>

              {/* Actions */}
              <div className="hf-actions">
                <button
                  type="button"
                  className="hf-btn-cancel"
                  onClick={() => setIsFormOpen(false)}
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="hf-btn-submit"
                  disabled={submitting}
                >
                  {submitting
                    ? 'Menyimpan...'
                    : editingId === null
                    ? 'Simpan Produk'
                    : 'Update Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {deleteTargetId !== null && (
        <div className="confirm-overlay" onClick={() => setDeleteTargetId(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Hapus hampers?</h3>
            <p>Apakah Anda yakin ingin menghapus paket hampers ini?</p>
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

export default Hampers
