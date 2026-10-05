import React, { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  SlidersHorizontal,
  X,
  Eye,
  Phone,
  MapPin,
  Package,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { api, getFullImageUrl } from '../services/api'

export interface StoreItem {
  id: number
  name: string
  owner: string
  address: string
  gmaps_link?: string
  area: string
  whatsapp: string
  description?: string
  image?: string
  product_count?: number
  status: string
  products?: any[]
}

export interface StoreFormData {
  name: string
  owner: string
  address: string
  gmaps_link: string
  area: string
  whatsapp: string
  description: string
  status: string
  image: string
  imageFile?: File | null
}

function Toko() {
  const [stores, setStores] = useState<StoreItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [loadError, setLoadError] = useState<string | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    owner: '',
    address: '',
    gmaps_link: '',
    area: 'Sentra Utama Sanan',
    whatsapp: '',
    description: '',
    status: 'Aktif',
    image: '',
    imageFile: null,
  })

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      setLoadError(null)
      const res = await api.stores.getAll({
        search: appliedSearch || undefined,
        status: statusFilter !== 'Semua' ? statusFilter : undefined,
      })
      if (res.success) {
        setStores(res.data)
      } else {
        setLoadError('Data toko gagal dimuat. Silakan coba lagi.')
      }
    } catch (err) {
      console.error('Failed to load stores:', err)
      setLoadError(err instanceof Error ? err.message : 'Data toko gagal dimuat. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }, [appliedSearch, statusFilter])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const nextSearch = searchQuery.trim()
    if (nextSearch === appliedSearch) {
      fetchStores()
    } else {
      setAppliedSearch(nextSearch)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      owner: '',
      address: '',
      gmaps_link: '',
      area: 'Sentra Utama Sanan',
      whatsapp: '',
      description: '',
      status: 'Aktif',
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

      setFormData((prev) => ({
        ...prev,
        image: fileUrl,
        imageFile: file,
      }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      const data = new FormData()
      data.append('name', formData.name.trim())
      data.append('owner', formData.owner.trim())
      data.append('address', formData.address.trim())
      data.append('gmaps_link', formData.gmaps_link.trim())
      data.append('area', formData.area)
      data.append('whatsapp', formData.whatsapp.trim())
      data.append('description', formData.description.trim())
      data.append('status', formData.status)

      if (formData.imageFile) {
        data.append('image', formData.imageFile)
      } else if (formData.image && formData.image.startsWith('http')) {
        data.append('image', formData.image)
      }

      if (editingId !== null) {
        await api.stores.update(editingId, data)
      } else {
        await api.stores.create(data)
      }

      resetForm()
      setIsFormOpen(false)
      fetchStores()
    } catch (err: any) {
      console.error('Error saving store:', err)
      setFormError(err.message || 'Gagal menyimpan data toko')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (store: StoreItem) => {
    setEditingId(store.id)
    setFormData({
      name: store.name,
      owner: store.owner,
      address: store.address,
      gmaps_link: store.gmaps_link || '',
      area: store.area,
      whatsapp: store.whatsapp,
      description: store.description || '',
      status: store.status,
      image: store.image ? getFullImageUrl(store.image) || '' : '',
      imageFile: null,
    })
    setIsDetailOpen(false)
    setIsFormOpen(true)
  }

  const handleOpenDetail = async (store: StoreItem) => {
    try {
      const res = await api.stores.getById(store.id)
      if (res.success) {
        setSelectedStore(res.data)
      } else {
        setSelectedStore(store)
      }
    } catch {
      setSelectedStore(store)
    }
    setIsDetailOpen(true)
  }

  const handleDelete = async () => {
    if (deleteTargetId === null) return
    try {
      await api.stores.delete(deleteTargetId)
      setDeleteTargetId(null)
      if (selectedStore?.id === deleteTargetId) {
        setIsDetailOpen(false)
      }
      fetchStores()
    } catch (err) {
      console.error('Failed to delete store:', err)
    }
  }

  const activeCount = stores.filter((s) => s.status === 'Aktif').length

  return (
    <div>
      {/* HEADER HALAMAN */}
      <div className="page-title-row">
        <div>
          <h1>Daftar Toko & Sentra</h1>
          <p>
            Kelola dan pantau seluruh toko penghasil keripik tempe di Kawasan Sentra Sanan.
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
          Tambah Toko
        </button>
      </div>

      {/* SEARCH DAN FILTER */}
      <form className="toolbar" onSubmit={handleSearch}>
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
          {loading ? <Loader2 size={16} className="animate-spin" /> : <SlidersHorizontal size={16} />}
          {loading ? 'Mencari...' : 'Cari Toko'}
        </button>
      </form>

      {/* TAB FILTER */}
      <div className="tabs">
        <button
          className={`tab ${statusFilter === 'Semua' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Semua')}
        >
          Semua Toko <span>{stores.length}</span>
        </button>

        <button
          className={`tab ${statusFilter === 'Aktif' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Aktif')}
        >
          Toko Aktif <span>{activeCount}</span>
        </button>
      </div>

      {/* DATA TOKO */}
      <div className="data-panel">
        <div className="data-table">
          {/* HEADER TABEL */}
          <div className="data-head">
            <span>NAMA TOKO</span>
            <span>ALAMAT & LOKASI</span>
            <span>KONTAK WHATSAPP</span>
            <span>JUMLAH PRODUK</span>
            <span>STATUS</span>
            <span>AKSI</span>
          </div>

          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Loader2 className="animate-spin" size={24} style={{ display: 'inline', marginRight: 8 }} />
              Memuat data toko...
            </div>
          ) : loadError ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--danger, #b42318)' }}>
              {loadError}
            </div>
          ) : stores.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Tidak ada data toko yang sesuai
            </div>
          ) : (
            stores.map((store, index) => (
              <div className="data-row" key={store.id || index}>
                {/* NAMA + FOTO TOKO */}
                <div
                  className="store-name"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenDetail(store)}
                >
                  {store.image ? (
                    <img
                      src={getFullImageUrl(store.image)}
                      alt={store.name}
                      className="store-image"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="store-image store-image-empty">
                      <span>{index + 1}</span>
                    </div>
                  )}

                  <div>
                    <strong>{store.name}</strong>
                    <small>
                      {store.owner} • {store.area}
                    </small>
                  </div>
                </div>

                {/* ALAMAT */}
                <div>
                  <strong>{store.address}</strong>
                  <small>{store.area}</small>
                  {store.gmaps_link && (
                    <div style={{ marginTop: '4px' }}>
                      <a
                        href={store.gmaps_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#9a5d2c',
                          fontSize: '11px',
                          textDecoration: 'none',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <MapPin size={11} /> Buka Google Maps <ExternalLink size={10} />
                      </a>
                    </div>
                  )}
                </div>

                {/* WHATSAPP */}
                <div>{store.whatsapp}</div>

                {/* PRODUK COUNT */}
                <div>{store.product_count !== undefined ? `${store.product_count} Produk` : '-'}</div>

                {/* STATUS */}
                <div>
                  <span
                    className={`status-badge ${
                      store.status === 'Aktif' ? 'active-status' : 'waiting-status'
                    }`}
                  >
                    {store.status}
                  </span>
                </div>

                {/* AKSI */}
                <div className="row-actions">
                  <button
                    title="Detail Toko"
                    type="button"
                    onClick={() => handleOpenDetail(store)}
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    title="Edit"
                    type="button"
                    onClick={() => handleEdit(store)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    title="Hapus"
                    type="button"
                    onClick={() => setDeleteTargetId(store.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="pagination">
          <span>
            Menampilkan {stores.length} dari {stores.length} Toko
          </span>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {isDetailOpen && selectedStore && (
        <div className="drawer-overlay" onClick={() => setIsDetailOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="eyebrow">DETAIL TOKO</span>
                <h2>{selectedStore.name}</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setIsDetailOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedStore.image && (
                <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden' }}>
                  <img
                    src={getFullImageUrl(selectedStore.image)}
                    alt={selectedStore.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Pemilik Toko</small>
                  <p style={{ fontWeight: 600 }}>{selectedStore.owner}</p>
                </div>
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Status</small>
                  <div>
                    <span
                      className={`status-badge ${
                        selectedStore.status === 'Aktif' ? 'active-status' : 'waiting-status'
                      }`}
                    >
                      {selectedStore.status}
                    </span>
                  </div>
                </div>
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Kontak WhatsApp</small>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <Phone size={14} /> {selectedStore.whatsapp}
                  </p>
                </div>
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Kawasan</small>
                  <p style={{ fontWeight: 600 }}>{selectedStore.area}</p>
                </div>
              </div>

              <div>
                <small style={{ color: 'var(--text-muted)' }}>Alamat Lengkap</small>
                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <MapPin size={14} /> {selectedStore.address}
                </p>
                {selectedStore.gmaps_link && (
                  <div style={{ marginTop: '8px' }}>
                    <a
                      href={selectedStore.gmaps_link}
                      target="_blank"
                      rel="noreferrer"
                      className="secondary-button"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        fontSize: '12px',
                        padding: '6px 12px'
                      }}
                    >
                      <MapPin size={14} /> Buka Link Google Maps <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>

              {selectedStore.description && (
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Deskripsi</small>
                  <p style={{ marginTop: '4px', fontSize: '13px', lineHeight: 1.6 }}>
                    {selectedStore.description}
                  </p>
                </div>
              )}

              {/* DAFTAR PRODUK MILIK TOKO */}
              <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={16} /> Daftar Produk Toko ({selectedStore.products?.length || 0})
                </h3>

                {selectedStore.products && selectedStore.products.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedStore.products.map((p: any) => (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                        }}
                      >
                        <div>
                          <strong>{p.name}</strong>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {p.variant || 'Standard'} • {p.size || 'Regular'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 600, color: '#e07a3f' }}>
                            Rp{Number(p.price).toLocaleString('id-ID')}
                          </span>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Belum ada produk terdaftar untuk toko ini.</p>
                )}
              </div>

              <div className="drawer-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Tutup
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => handleEdit(selectedStore)}
                >
                  <Pencil size={15} /> Edit Toko
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / DRAWER TAMBAH & EDIT TOKO */}
      {isFormOpen && (
        <div className="drawer-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="drawer-panel" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="eyebrow">FORM TOKO</span>
                <h2>{editingId === null ? 'Tambah Toko Baru' : 'Edit Toko'}</h2>
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
                {/* NAMA */}
                <label className="field">
                  <span>Nama Toko *</span>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="contoh: Keripik Tempe Rohani"
                    required
                  />
                </label>

                {/* PEMILIK */}
                <label className="field">
                  <span>Nama Pemilik *</span>
                  <input
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    placeholder="contoh: H. Rohani"
                    required
                  />
                </label>

                {/* ALAMAT */}
                <label className="field" style={{ gridColumn: 'span 2' }}>
                  <span>Alamat Lengkap *</span>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="contoh: Jl. Sanan No. 125, Purwantoro, Blimbing"
                    required
                  />
                </label>

                {/* LINK GOOGLE MAPS */}
                <label className="field" style={{ gridColumn: 'span 2' }}>
                  <span>Link Google Maps (Opsional)</span>
                  <input
                    name="gmaps_link"
                    value={formData.gmaps_link}
                    onChange={handleChange}
                    placeholder="contoh: https://maps.app.goo.gl/... atau https://goo.gl/maps/..."
                  />
                  {formData.gmaps_link && (
                    <div style={{ marginTop: '4px' }}>
                      <a
                        href={formData.gmaps_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#9a5d2c',
                          fontSize: '11px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={10} /> Tes buka link Google Maps
                      </a>
                    </div>
                  )}
                </label>

                {/* KAWASAN */}
                <label className="field">
                  <span>Kawasan *</span>
                  <select name="area" value={formData.area} onChange={handleChange}>
                    <option value="Sentra Utama Sanan">Sentra Utama Sanan</option>
                    <option value="Sanan Gang 3">Sanan Gang 3</option>
                    <option value="Kawasan Timur">Kawasan Timur</option>
                    <option value="Purwantoro, Blimbing">Purwantoro, Blimbing</option>
                  </select>
                </label>

                {/* WHATSAPP */}
                <label className="field">
                  <span>WhatsApp (+ dan angka) *</span>
                  <input
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="+6281234567890"
                    required
                  />
                </label>

                {/* STATUS */}
                <label className="field" style={{ gridColumn: 'span 2' }}>
                  <span>Status Toko</span>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="Aktif">Aktif</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Tutup Sementara">Tutup Sementara</option>
                  </select>
                </label>

                {/* GAMBAR */}
                <label className="field" style={{ gridColumn: 'span 2' }}>
                  <span>Foto Toko (Upload File)</span>
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
                        alt="Preview toko"
                        className="image-preview"
                      />
                    </div>
                  )}
                </label>

                {/* DESKRIPSI */}
                <label className="field" style={{ gridColumn: 'span 2' }}>
                  <span>Deskripsi Toko</span>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Profil singkat atau keunikan toko..."
                  />
                </label>
              </div>

              {/* BUTTON */}
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
                  {submitting ? 'Menyimpan...' : editingId === null ? 'Simpan Toko' : 'Update Toko'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteTargetId !== null && (
        <div className="confirm-overlay" onClick={() => setDeleteTargetId(null)}>
          <div className="confirm-dialog" onClick={(event) => event.stopPropagation()}>
            <h3>Hapus toko?</h3>
            <p>
              Apakah Anda yakin ingin menghapus data toko ini? Semua produk yang terhubung ke toko ini juga akan terhapus.
            </p>

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

export default Toko
