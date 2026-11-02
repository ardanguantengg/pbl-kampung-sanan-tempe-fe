'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'
import type { ProductFormData, StoreOption } from '@/types/produk'

// Batas maksimal harga (Rp 1 miliar), bebas diganti sesuai kebutuhan
const MAX_PRICE = 1_000_000_000

// Tampilkan angka dengan koma tiap 3 digit: 12000 -> 12,000
const formatPrice = (value: string | number | null | undefined) => {
  if (value === '' || value === null || value === undefined) return ''
  const num = Number(value)
  if (Number.isNaN(num)) return ''
  return Math.floor(num).toLocaleString('en-US')
}

interface ProductFormProps {
  isOpen: boolean
  editingId: number | null
  formData: ProductFormData
  stores: StoreOption[]
  formError: string | null
  submitting: boolean
  onClose: () => void
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function ProductForm({
  isOpen,
  editingId,
  formData,
  stores,
  formError,
  submitting,
  onClose,
  onChange,
  onSubmit,
}: ProductFormProps) {
  const [priceError, setPriceError] = useState<string | null>(null)

  // Reset pesan error harga setiap form dibuka
  useEffect(() => {
    if (isOpen) setPriceError(null)
  }, [isOpen])

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Buang semua selain angka (otomatis nolak minus, huruf, titik, koma)
    // lalu hapus nol di depan (007 -> 7)
    const digits = event.target.value
      .replace(/\D/g, '')
      .replace(/^0+(?=\d)/, '')

    if (digits && Number(digits) > MAX_PRICE) {
      setPriceError(`Harga maksimal Rp ${MAX_PRICE.toLocaleString('en-US')}`)
      return
    }

    setPriceError(null)

    // Kirim ke parent sebagai angka murni (tanpa koma)
    onChange({
      target: { name: 'price', value: digits, type: 'text', files: null },
    } as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  const handleClose = () => {
    setPriceError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="drawer-overlay" onClick={handleClose}>
      <div
        className="drawer-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <span className="eyebrow">FORM PRODUK</span>
            <h2>
              {editingId === null ? 'Tambah Produk Baru' : 'Edit Produk'}
            </h2>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={handleClose}
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

        <form className="drawer-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <label className="field" style={{ gridColumn: 'span 2' }}>
              <span>Pilih Toko Pemilik *</span>

              <select
                name="store_id"
                value={formData.store_id}
                onChange={onChange}
                required
              >
                {stores.map((store) => (
                  <option key={store.id} value={String(store.id)}>
                    {store.name}
                    {store.owner ? ` (${store.owner})` : ''}
                  </option>
                ))}
              </select>
            </label>

            <label className="field" style={{ gridColumn: 'span 2' }}>
              <span>Nama Produk *</span>

              <input
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Contoh: Keripik Tempe Balado Pedas"
                required
              />
            </label>

            <label className="field">
              <span>Harga (Rp) *</span>

              <input
                name="price"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={formatPrice(formData.price)}
                onChange={handlePriceChange}
                placeholder="20,000"
                required
              />
              {priceError && (
                <small
                  style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}
                >
                  {priceError}
                </small>
              )}
            </label>

            <label className="field">
              <span>Status Ketersediaan</span>

              <select
                name="status"
                value={formData.status}
                onChange={onChange}
              >
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
                onChange={onChange}
                placeholder="Original / Balado / BBQ"
              />
            </label>

            <label className="field">
              <span>Ukuran / Berat</span>

              <input
                name="size"
                value={formData.size}
                onChange={onChange}
                placeholder="250g / 500g"
              />
            </label>

            <label className="field" style={{ gridColumn: 'span 2' }}>
              <span>Foto Produk</span>

              <input
                type="file"
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                name="image"
                onChange={onChange}
              />

              {formData.image && (
                <div
                  className="image-preview-box"
                  style={{ marginTop: '8px' }}
                >
                  <img
                    src={formData.image}
                    alt="Preview produk"
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
                onChange={onChange}
                placeholder="Keterangan rasa, komposisi, atau kemasan..."
              />
            </label>
          </div>

          <div className="drawer-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={handleClose}
              disabled={submitting}
            >
              Batal
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting || stores.length === 0}
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
  )
}