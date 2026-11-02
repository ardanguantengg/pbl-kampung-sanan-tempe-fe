'use client'

import { useState, useEffect, useCallback } from 'react'
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

// Batas harus sama dengan di HampersFormModal.tsx
const MAX_PRICE = 1_000_000_000
const MAX_ITEMS = 100

interface ProductOption {
  id: number
  store_id: number
}

interface StoreOption {
  id: number
  name: string
}

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
  const [availableProducts, setAvailableProducts] = useState<ProductOption[]>([])
  const [availableStores, setAvailableStores] = useState<StoreOption[]>([])

  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)

  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<HamperFormData>(defaultForm)

  const fetchHampers = useCallback(async () => {
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
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.products.getAll()

      if (res.success) {
        setAvailableProducts(res.data)
      }
    } catch (err) {
      console.error('Failed to load products:', err)
    }
  }, [])

  const fetchStores = useCallback(async () => {
    try {
      const res = await api.stores.getAll()

      if (res.success) {
        setAvailableStores(res.data)
      }
    } catch (err) {
      console.error('Failed to load stores:', err)
    }
  }, [])

  useEffect(() => {
    fetchHampers()
    fetchProducts()
    fetchStores()
  }, [fetchHampers, fetchProducts, fetchStores])

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

    // Validasi harga (lapisan kedua, selain validasi di input)
    const priceNumber = Number(formData.price)

    if (!formData.price || Number.isNaN(priceNumber) || priceNumber <= 0) {
      setFormError('Harga harus lebih dari 0')
      return
    }

    if (priceNumber > MAX_PRICE) {
      setFormError(`Harga maksimal Rp ${MAX_PRICE.toLocaleString('en-US')}`)
      return
    }

    // Validasi jumlah produk (boleh kosong, nanti dianggap 1)
    if (formData.jumlahProduk) {
      const itemsNumber = Number(formData.jumlahProduk)

      if (
        Number.isNaN(itemsNumber) ||
        itemsNumber < 1 ||
        itemsNumber > MAX_ITEMS
      ) {
        setFormError(`Jumlah produk harus antara 1 sampai ${MAX_ITEMS}`)
        return
      }
    }

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
    } catch (err: unknown) {
      console.error('Error saving hamper:', err)

      const message =
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan hampers'

      setFormError(message)
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
      // Math.floor biar harga "20000.00" dari database jadi "20000"
      price: String(Math.floor(Number(hamper.price))),
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