'use client'

import { AlertCircle, ExternalLink, X } from 'lucide-react'
import type { StoreFormData } from '@/types/toko'

interface TokoFormProps {
  formData: StoreFormData
  setFormData: React.Dispatch<React.SetStateAction<StoreFormData>>
  editingId: number | null
  formError: string | null
  submitting: boolean
  onClose: () => void
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function TokoForm({
  formData,
  editingId,
  formError,
  submitting,
  onClose,
  onChange,
  onSubmit,
}: TokoFormProps) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <span className="eyebrow">FORM TOKO</span>
            <h2>
              {editingId === null ? 'Tambah Toko Baru' : 'Edit Toko'}
            </h2>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
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
            <label className="field">
              <span>Nama Toko *</span>
              <input
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="contoh: Keripik Tempe Rohani"
                required
              />
            </label>

            <label className="field">
              <span>Nama Pemilik *</span>
              <input
                name="owner"
                value={formData.owner}
                onChange={onChange}
                placeholder="contoh: H. Rohani"
                required
              />
            </label>

            <label className="field" style={{ gridColumn: 'span 2' }}>
              <span>Alamat Lengkap *</span>
              <input
                name="address"
                value={formData.address}
                onChange={onChange}
                placeholder="contoh: Jl. Sanan No. 125, Purwantoro, Blimbing"
                required
              />
            </label>

            <label className="field" style={{ gridColumn: 'span 2' }}>
              <span>Link Google Maps (Opsional)</span>
              <input
                name="gmaps_link"
                value={formData.gmaps_link}
                onChange={onChange}
                placeholder="contoh: https://maps.app.goo.gl/..."
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
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={10} />
                    Tes buka link Google Maps
                  </a>
                </div>
              )}
            </label>

            <label className="field">
              <span>Kawasan *</span>
              <select
                name="area"
                value={formData.area}
                onChange={onChange}
              >
                <option value="Sentra Utama Sanan">
                  Sentra Utama Sanan
                </option>
                <option value="Sanan Gang 3">Sanan Gang 3</option>
                <option value="Kawasan Timur">Kawasan Timur</option>
                <option value="Purwantoro, Blimbing">
                  Purwantoro, Blimbing
                </option>
              </select>
            </label>

            <label className="field">
              <span>WhatsApp (+ dan angka) *</span>
              <input
                name="whatsapp"
                value={formData.whatsapp}
                onChange={onChange}
                placeholder="+6281234567890"
                required
              />
            </label>

            <label className="field" style={{ gridColumn: 'span 2' }}>
              <span>Status Toko</span>
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
              >
                <option value="Aktif">Aktif</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Tutup Sementara">Tutup Sementara</option>
              </select>
            </label>

            <label className="field" style={{ gridColumn: 'span 2' }}>
              <span>Foto Toko (Upload File)</span>
              <input
                type="file"
                accept="image/*"
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
                    alt="Preview toko"
                    className="image-preview"
                  />
                </div>
              )}
            </label>

            <label className="field" style={{ gridColumn: 'span 2' }}>
              <span>Deskripsi Toko</span>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={onChange}
                placeholder="Profil singkat atau keunikan toko..."
              />
            </label>
          </div>

          <div className="drawer-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={submitting}
            >
              Batal
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting
                ? 'Menyimpan...'
                : editingId === null
                  ? 'Simpan Toko'
                  : 'Update Toko'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}