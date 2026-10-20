'use client'

import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { api, getFullImageUrl } from '@/services/api'

import type {
  ProductItem,
  ProductFormData,
  StoreOption,
} from './components/types'

import ProductToolbar from './components/ProductToolbar'
import ProductTable from './components/ProductTable'
import ProductForm from './components/ProductForm'
import DeleteConfirmation from './components/DeleteConfirmation'

export default function ProdukPage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [stores, setStores] = useState<StoreOption[]>([])
  const [loading, setLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStoreFilter, setSelectedStoreFilter] =
    useState<string>('Semua')

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

        if (res.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            store_id: prev.store_id || String(res.data[0].id),
          }))
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
        store_id:
          selectedStoreFilter !== 'Semua'
            ? parseInt(selectedStoreFilter, 10)
            : undefined,
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

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
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
      } else if (formData.image.startsWith('http')) {
        data.append('image', formData.image)
      }

      if (editingId !== null) {
        await api.products.update(editingId, data)
      } else {
        await api.products.create(data)
      }

      setIsFormOpen(false)
      resetForm()
      await fetchProducts()
    } catch (err: unknown) {
      console.error('Error saving product:', err)

      setFormError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan data produk'
      )
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
      image: product.image
        ? getFullImageUrl(product.image) || ''
        : '',
      imageFile: null,
    })

    setFormError(null)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (deleteTargetId === null) return

    try {
      await api.products.delete(deleteTargetId)

      setDeleteTargetId(null)
      await fetchProducts()
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Manajemen Produk Olahan Tempe</h1>
          <p>
            Kelola katalog seluruh produk keripik tempe dari setiap toko
            di Sentra Sanan.
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
          Tambah Produk
        </button>
      </div>

      <ProductToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStoreFilter={selectedStoreFilter}
        setSelectedStoreFilter={setSelectedStoreFilter}
        stores={stores}
        onSearch={handleSearch}
      />

      <ProductTable
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={setDeleteTargetId}
      />

      <ProductForm
        isOpen={isFormOpen}
        editingId={editingId}
        formData={formData}
        stores={stores}
        formError={formError}
        submitting={submitting}
        onClose={() => {
          if (!submitting) {
            setIsFormOpen(false)
            setFormError(null)
          }
        }}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmation
        isOpen={deleteTargetId !== null}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}