import React, { useState, useEffect } from 'react'
import { Gift, Plus, Pencil, Trash2, X, Search, Loader2, AlertCircle, Package } from 'lucide-react'
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
  price: string
  status: string
  image: string
  imageFile?: File | null
  description: string
  selectedProducts: { product_id: number; quantity: number }[]
}

function Hampers() {
  const [hampers, setHampers] = useState<HamperItem[]>([])
  const [availableProducts, setAvailableProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState<HamperFormData>({
    name: '',
    price: '',
    status: 'Aktif',
    image: '',
    imageFile: null,
    description: '',
    selectedProducts: [],
  })

  useEffect(() => {
    fetchHampers()
    fetchProducts()
  }, [statusFilter])

  const fetchProducts = async () => {
    try {
      const res = await api.products.getAll()
      if (res.success) {
        setAvailableProducts(res.data)
      }
    } catch (err) {
      console.error('Failed to load products:', err)
    }
  }

  const fetchHampers = async () => {
    try {
      setLoading(true)
      const res = await api.hampers.getAll({
        search: searchQuery || undefined,
        status: statusFilter !== 'Semua' ? statusFilter : undefined,
      })
      if (res.success) {
        setHampers(res.data)
      }
    } catch (err) {
      console.error('Failed to load hampers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchHampers()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      status: 'Aktif',
      image: '',
      imageFile: null,
      description: '',
      selectedProducts: availableProducts.length > 0 ? [{ product_id: availableProducts[0].id, quantity: 1 }] : [],
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

  const handleAddProductRow = () => {
    if (availableProducts.length === 0) return
    setFormData((prev) => ({
      ...prev,
      selectedProducts: [...prev.selectedProducts, { product_id: availableProducts[0].id, quantity: 1 }],
    }))
  }

  const handleRemoveProductRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter((_, i) => i !== index),
    }))
  }

  const handleProductChange = (index: number, productId: number, quantity: number) => {
    setFormData((prev) => {
      const updated = [...prev.selectedProducts]
      updated[index] = { product_id: productId, quantity }
      return { ...prev, selectedProducts: updated }
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      const data = new FormData()
      data.append('name', formData.name.trim())
      data.append('price', formData.price)
      data.append('description', formData.description.trim())
      data.append('status', formData.status)
      data.append('items', JSON.stringify(formData.selectedProducts))

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
    const currentItems = (hamper.items || []).map((i) => ({
      product_id: i.product_id,
      quantity: i.quantity,
    }))

    setFormData({
      name: hamper.name,
      price: String(hamper.price),
      status: hamper.status,
      image: hamper.image ? getFullImageUrl(hamper.image) || '' : '',
      imageFile: null,
      description: hamper.description || '',
      selectedProducts: currentItems.length > 0 ? currentItems : (availableProducts.length > 0 ? [{ product_id: availableProducts[0].id, quantity: 1 }] : []),
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

  return (
    <div>
      {/* HEADER HALAMAN */}
      <div className="page-title-row">
        <div>
          <h1>Paket Hampers & Oleh-Oleh</h1>
          <p>
            Kelola paket bundling keripik tempe khas Sanan untuk oleh-oleh dan bingkisan eksklusif.
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
          Tambah Hampers
        </button>
      </div>

      {/* TOOLBAR */}
      <form className="toolbar" onSubmit={handleSearch}>
        <div className="search-box">
          <Search size={17} />
          <input
            type="text"
            placeholder="Cari paket hampers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="tabs" style={{ marginBottom: 0 }}>
          <button
            type="button"
            className={`tab ${statusFilter === 'Semua' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Semua')}
          >
            Semua <span>{hampers.length}</span>
          </button>
          <button
            type="button"
            className={`tab ${statusFilter === 'Aktif' ? 'active' : ''}`}
            onClick={() => setStatusFilter('Aktif')}
          >
            Aktif <span>{hampers.filter((h) => h.status === 'Aktif').length}</span>
          </button>
        </div>
      </form>

      {/* DATA HAMPERS */}
      <div className="data-panel">
        <div className="data-table">
          <div className="data-head">
            <span>NAMA HAMPERS</span>
            <span>ISI PRODUK</span>
            <span>HARGA PAKET</span>
            <span>STATUS</span>
            <span>AKSI</span>
          </div>

          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Loader2 className="animate-spin" size={24} style={{ display: 'inline', marginRight: 8 }} />
              Memuat data hampers...
            </div>
          ) : hampers.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Belum ada paket hampers
            </div>
          ) : (
            hampers.map((hamper, index) => (
              <div className="data-row" key={hamper.id || index}>
                <div className="store-name">
                  {hamper.image ? (
                    <img
                      src={getFullImageUrl(hamper.image)}
                      alt={hamper.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image store-image-empty">
                      <Gift size={20} />
                    </div>
                  )}

                  <div>
                    <strong>{hamper.name}</strong>
                    <small>{hamper.description || 'Paket oleh-oleh khas Sanan'}</small>
                  </div>
                </div>

                <div>
                  <span className="badge neutral">
                    <Package size={12} style={{ marginRight: 4, display: 'inline' }} />
                    {hamper.items?.length || hamper.item_count || 0} Macam Produk
                  </span>
                  {hamper.items && hamper.items.length > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {hamper.items.map((it: any) => `${it.product_name} (${it.quantity}x)`).join(', ')}
                    </div>
                  )}
                </div>

                <div>
                  <strong>Rp{Number(hamper.price).toLocaleString('id-ID')}</strong>
                </div>

                <div>
                  <span
                    className={`status-badge ${
                      hamper.status === 'Aktif' ? 'active-status' : 'waiting-status'
                    }`}
                  >
                    {hamper.status}
                  </span>
                </div>

                <div className="row-actions">
                  <button
                    title="Edit"
                    type="button"
                    onClick={() => handleEdit(hamper)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    title="Hapus"
                    type="button"
                    onClick={() => setDeleteTargetId(hamper.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pagination">
          <span>Menampilkan {hampers.length} dari {hampers.length} Paket Hampers</span>
        </div>
      </div>

      {/* FORM DRAWER HAMPERS */}
      {isFormOpen && (
        <div className="drawer-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="drawer-panel" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="eyebrow">FORM HAMPERS</span>
                <h2>{editingId === null ? 'Tambah Paket Hampers' : 'Edit Hampers'}</h2>
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
                  <span>Nama Paket Hampers *</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="contoh: Paket Hampers Sanan Komplit"
                    required
                  />
                </label>

                <label className="field">
                  <span>Harga Paket (Rp) *</span>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="65000"
                    required
                  />
                </label>

                <label className="field">
                  <span>Status</span>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                    <option value="Habis">Habis</option>
                  </select>
                </label>

                {/* RELASI PRODUK DI DALAM HAMPERS */}
                <div style={{ gridColumn: 'span 2', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>Isi Produk dalam Paket</span>
                    <button
                      type="button"
                      className="secondary-button"
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                      onClick={handleAddProductRow}
                    >
                      + Tambah Produk
                    </button>
                  </div>

                  {formData.selectedProducts.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                      <select
                        style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                        value={item.product_id}
                        onChange={(e) => handleProductChange(idx, parseInt(e.target.value, 10), item.quantity)}
                      >
                        {availableProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.store_name || 'Toko'}) - Rp{Number(p.price).toLocaleString('id-ID')}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        style={{ width: '70px', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-color)' }}
                        value={item.quantity}
                        onChange={(e) => handleProductChange(idx, item.product_id, parseInt(e.target.value, 10) || 1)}
                      />

                      <button
                        type="button"
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                        onClick={() => handleRemoveProductRow(idx)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="field" style={{ gridColumn: 'span 2' }}>
                  <span>Foto Paket Hampers</span>
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
                  <span>Deskripsi Paket</span>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Isi rincian kemasan box, pita, atau kartu ucapan..."
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
                  {submitting ? 'Menyimpan...' : editingId === null ? 'Simpan Hampers' : 'Update Hampers'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {deleteTargetId !== null && (
        <div className="confirm-overlay" onClick={() => setDeleteTargetId(null)}>
          <div className="confirm-dialog" onClick={(event) => event.stopPropagation()}>
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
