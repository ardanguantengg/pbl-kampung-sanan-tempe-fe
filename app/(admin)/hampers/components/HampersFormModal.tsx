
import { AlertCircle, X } from 'lucide-react'
import type { ChangeEvent, FormEvent } from 'react'
import type { HamperFormData } from '@/types/hampers'

interface HampersFormModalProps {
  isOpen: boolean
  editingId: number | null
  formData: HamperFormData
  availableStores: any[]
  formError: string | null
  submitting: boolean
  onClose: () => void
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export default function HampersFormModal({
  isOpen,
  editingId,
  formData,
  availableStores,
  formError,
  submitting,
  onClose,
  onChange,
  onSubmit,
}: HampersFormModalProps) {
  if (!isOpen) return null

  return (
    <div className="hf-overlay" onClick={onClose}>
      <div className="hf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hf-header">
          <div>
            <span className="hf-eyebrow">FORM INPUT</span>
            <h2 className="hf-title">
              {editingId === null
                ? 'Tambah paket baru'
                : 'Edit paket hampers'}
            </h2>
          </div>

          <button
            type="button"
            className="hf-close"
            onClick={onClose}
            disabled={submitting}
          >
            <X size={16} />
          </button>
        </div>

        {formError && (
          <div className="hf-error">
            <AlertCircle size={15} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="hf-form">
          <div className="hf-grid">
            <label className="hf-field">
              <span>Nama paket</span>
              <input
                name="name"
                placeholder="Keripik Tempe Original"
                value={formData.name}
                onChange={onChange}
                required
              />
            </label>

            <label className="hf-field">
              <span>Toko</span>
              <select
                name="storeId"
                value={formData.storeId}
                onChange={onChange}
              >
                <option value="">-- Pilih Toko --</option>
                {availableStores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="hf-field">
              <span>Jumlah produk</span>
              <input
                name="jumlahProduk"
                type="number"
                min="1"
                placeholder="5"
                value={formData.jumlahProduk}
                onChange={onChange}
              />
            </label>

            <label className="hf-field">
              <span>Harga</span>
              <input
                name="price"
                type="number"
                min="0"
                placeholder="9000"
                value={formData.price}
                onChange={onChange}
                required
              />
            </label>

            <label className="hf-field hf-full">
              <span>Deskripsi paket</span>
              <input
                name="description"
                placeholder="Isi paket terdiri dari 3 produk unggulan"
                value={formData.description}
                onChange={onChange}
              />
            </label>

            <label className="hf-field">
              <span>Status</span>
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
              >
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
                onChange={onChange}
              />

              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview hampers"
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              )}
            </label>
          </div>

          <div className="hf-actions">
            <button
              type="button"
              className="hf-btn-cancel"
              onClick={onClose}
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
  )
}
