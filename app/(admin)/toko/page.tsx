'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { api, getFullImageUrl } from '@/services/api'

import type { StoreItem, StoreFormData } from '@/types/toko'
import TokoSearch from './components/TokoSearch'
import TokoStats from './components/TokoStats'
import TokoTable from './components/TokoTable'
import TokoDetail from './components/TokoDetail'
import TokoForm from './components/TokoForm'
import DeleteConfirmation from './components/DeleteConfirmation'

export default function TokoPage() {
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

  // Mengambil data toko dari API
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
      setLoadError(
        err instanceof Error
          ? err.message
          : 'Data toko gagal dimuat. Silakan coba lagi.'
      )
    } finally {
      setLoading(false)
    }
  }, [appliedSearch, statusFilter])

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  // Pencarian toko
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextSearch = searchQuery.trim()

    if (nextSearch === appliedSearch) {
      fetchStores()
    } else {
      setAppliedSearch(nextSearch)
    }
  }

  // Mengembalikan form ke kondisi awal
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

  // Menangani perubahan input dan upload gambar
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

  // Menyimpan toko baru atau perubahan toko
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
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
      } else if (
        formData.image &&
        formData.image.startsWith('http')
      ) {
        data.append('image', formData.image)
      }

      if (editingId !== null) {
        await api.stores.update(editingId, data)
      } else {
        await api.stores.create(data)
      }

      resetForm()
      setIsFormOpen(false)
      await fetchStores()
    } catch (err: unknown) {
      console.error('Error saving store:', err)

      setFormError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan data toko'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // Membuka form edit dengan data toko yang dipilih
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
      image: store.image
        ? getFullImageUrl(store.image) || ''
        : '',
      imageFile: null,
    })

    setIsDetailOpen(false)
    setIsFormOpen(true)
  }

  // Mengambil detail toko beserta produk
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

  // Menghapus toko
  const handleDelete = async () => {
    if (deleteTargetId === null) return

    try {
      await api.stores.delete(deleteTargetId)

      setDeleteTargetId(null)

      if (selectedStore?.id === deleteTargetId) {
        setIsDetailOpen(false)
        setSelectedStore(null)
      }

      await fetchStores()
    } catch (err) {
      console.error('Failed to delete store:', err)
    }
  }

  const activeCount = stores.filter(
    (store) => store.status === 'Aktif'
  ).length

  return (
    <div>
      {/* HEADER HALAMAN */}
      <div className="page-title-row">
        <div>
          <h1>Daftar Toko &amp; Sentra</h1>
          <p>
            Kelola dan pantau seluruh toko penghasil keripik tempe
            di Kawasan Sentra Sanan.
          </p>
        </div>

        <button
          type="button"
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

      {/* PENCARIAN */}
      <TokoSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* FILTER STATUS */}
      <TokoStats
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalStores={stores.length}
        activeCount={activeCount}
      />

      {/* TABEL TOKO */}
      <TokoTable
        stores={stores}
        loading={loading}
        loadError={loadError}
        onDetail={handleOpenDetail}
        onEdit={handleEdit}
        onDelete={setDeleteTargetId}
      />

      {/* MODAL DETAIL */}
      {isDetailOpen && selectedStore && (
        <TokoDetail
          store={selectedStore}
          onClose={() => setIsDetailOpen(false)}
          onEdit={handleEdit}
        />
      )}

      {/* MODAL FORM */}
      {isFormOpen && (
        <TokoForm
          formData={formData}
          setFormData={setFormData}
          editingId={editingId}
          formError={formError}
          submitting={submitting}
          onClose={() => setIsFormOpen(false)}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      )}

      {/* KONFIRMASI HAPUS */}
      {deleteTargetId !== null && (
        <DeleteConfirmation
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}