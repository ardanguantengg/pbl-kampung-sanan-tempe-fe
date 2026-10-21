
'use client'

import { useState, useEffect } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { api, getFullImageUrl } from '@/services/api'

import HampersHeader from './components/HampersHeader'
import HampersSearch from './components/HampersSearch'
import HampersList from './components/HampersList'
import HampersFormModal from './components/HampersFormModal'
import HampersDeleteModal from './components/HampersDeleteModal'

import type {
  HamperItem,
  HamperFormData,
} from '@/types/hampers'
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

export default function HampersPage() {
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
  const [formData, setFormData] =
    useState<HamperFormData>(defaultForm)

  useEffect(() => {
    fetchHampers()
    fetchProducts()
    fetchStores()
  }, [])

  const fetchHampers = async () => {
    try {
      setLoading(true)
      const res = await api.hampers.getAll()

      if (res.success) {
        setHampers(res.data)
      }
    } catch (err) {
      console.error('Failed to load hampers:', err)
    } finally {
      setLoading(false)
    }
  }

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

  const fetchStores = async () => {
    try {
      const res = await api.stores.getAll()

      if (res.success) {
        setAvailableStores(res.data)
      }
    } catch (err) {
      console.error('Failed to load stores:', err)
    }
  }

  const resetForm = () => {
    setFormData({ ...defaultForm })
    setEditingId(null)
    setFormError(null)
  }

  const closeForm = () => {
    if (submitting) return

    setIsFormOpen(false)
    resetForm()
  }

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target
    const inputEl = event.target as HTMLInputElement

    if (inputEl.files && inputEl.files[0]) {
      const file = inputEl.files[0]
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

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      const storeProducts = formData.storeId
        ? availableProducts.filter(
            (p) =>
              String(p.store_id) === String(formData.storeId)
          )
        : availableProducts

      const count = Math.max(
        1,
        parseInt(formData.jumlahProduk, 10) || 1
      )

      const itemsToUse = storeProducts.slice(0, count)

      const items =
        itemsToUse.length > 0
          ? itemsToUse.map((p) => ({
              product_id: p.id,
              quantity: 1,
            }))
          : availableProducts.length > 0
            ? [
                {
                  product_id: availableProducts[0].id,
                  quantity: 1,
                },
              ]
            : []

      const data = new FormData()

      data.append('name', formData.name.trim())
      data.append('price', formData.price)
      data.append('description', formData.description.trim())
      data.append('status', formData.status)
      data.append('items', JSON.stringify(items))

      if (formData.imageFile) {
        data.append('image', formData.imageFile)
      } else if (formData.image.startsWith('http')) {
        data.append('image', formData.image)
      }

      if (editingId !== null) {
        await api.hampers.update(editingId, data)
      } else {
        await api.hampers.create(data)
      }

      setIsFormOpen(false)
      resetForm()
      await fetchHampers()
    } catch (err: any) {
      console.error('Error saving hamper:', err)
      setFormError(err.message || 'Gagal menyimpan hampers')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (hamper: HamperItem) => {
    setEditingId(hamper.id)

    const firstItem = hamper.items?.[0]

    const storeId = firstItem
      ? String(
          availableProducts.find(
            (p) => p.id === firstItem.product_id
          )?.store_id || ''
        )
      : ''

    setFormData({
      name: hamper.name,
      storeId,
      jumlahProduk: String(
        hamper.items?.length || hamper.item_count || ''
      ),
      price: String(hamper.price),
      status: hamper.status,
      image: hamper.image
        ? getFullImageUrl(hamper.image) || ''
        : '',
      imageFile: null,
      description: hamper.description || '',
    })

    setFormError(null)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (deleteTargetId === null) return

    try {
      await api.hampers.delete(deleteTargetId)
      setDeleteTargetId(null)
      await fetchHampers()
    } catch (err) {
      console.error('Failed to delete hamper:', err)
    }
  }

  const filteredHampers = hampers.filter((hamper) =>
    hamper.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <HampersHeader
        onAdd={() => {
          resetForm()
          setIsFormOpen(true)
        }}
      />

      <HampersSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <HampersList
        hampers={filteredHampers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={setDeleteTargetId}
      />

      <HampersFormModal
        isOpen={isFormOpen}
        editingId={editingId}
        formData={formData}
        availableStores={availableStores}
        formError={formError}
        submitting={submitting}
        onClose={closeForm}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <HampersDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
