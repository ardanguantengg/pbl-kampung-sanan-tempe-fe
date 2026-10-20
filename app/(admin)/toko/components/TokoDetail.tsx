'use client'

import {
  X,
  Phone,
  MapPin,
  Package,
  Pencil,
  ExternalLink,
} from 'lucide-react'
import { getFullImageUrl } from '@/services/api'
import type { StoreItem } from './types'

interface TokoDetailProps {
  store: StoreItem
  onClose: () => void
  onEdit: (store: StoreItem) => void
}

export default function TokoDetail({
  store,
  onClose,
  onEdit,
}: TokoDetailProps) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <span className="eyebrow">DETAIL TOKO</span>
            <h2>{store.name}</h2>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {store.image && (
            <div
              style={{
                width: '100%',
                height: '180px',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <img
                src={getFullImageUrl(store.image)}
                alt={store.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <div>
              <small style={{ color: 'var(--text-muted)' }}>
                Pemilik Toko
              </small>
              <p style={{ fontWeight: 600 }}>{store.owner}</p>
            </div>

            <div>
              <small style={{ color: 'var(--text-muted)' }}>
                Status
              </small>
              <div>
                <span
                  className={`status-badge ${
                    store.status === 'Aktif'
                      ? 'active-status'
                      : 'waiting-status'
                  }`}
                >
                  {store.status}
                </span>
              </div>
            </div>

            <div>
              <small style={{ color: 'var(--text-muted)' }}>
                Kontak WhatsApp
              </small>
              <p
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                }}
              >
                <Phone size={14} /> {store.whatsapp}
              </p>
            </div>

            <div>
              <small style={{ color: 'var(--text-muted)' }}>
                Kawasan
              </small>
              <p style={{ fontWeight: 600 }}>{store.area}</p>
            </div>
          </div>

          <div>
            <small style={{ color: 'var(--text-muted)' }}>
              Alamat Lengkap
            </small>
            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '4px',
              }}
            >
              <MapPin size={14} /> {store.address}
            </p>

            {store.gmaps_link && (
              <div style={{ marginTop: '8px' }}>
                <a
                  href={store.gmaps_link}
                  target="_blank"
                  rel="noreferrer"
                  className="secondary-button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    padding: '6px 12px',
                  }}
                >
                  <MapPin size={14} />
                  Buka Link Google Maps
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>

          {store.description && (
            <div>
              <small style={{ color: 'var(--text-muted)' }}>
                Deskripsi
              </small>
              <p
                style={{
                  marginTop: '4px',
                  fontSize: '13px',
                  lineHeight: 1.6,
                }}
              >
                {store.description}
              </p>
            </div>
          )}

          <div
            style={{
              marginTop: '12px',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '16px',
            }}
          >
            <h3
              style={{
                fontSize: '15px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Package size={16} />
              Daftar Produk Toko ({store.products?.length || 0})
            </h3>

            {store.products && store.products.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {store.products.map((product: any) => (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <strong>{product.name}</strong>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {product.variant || 'Standard'} •{' '}
                        {product.size || 'Regular'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontWeight: 600,
                          color: '#e07a3f',
                        }}
                      >
                        Rp{Number(product.price).toLocaleString('id-ID')}
                      </span>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {product.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}
              >
                Belum ada produk terdaftar untuk toko ini.
              </p>
            )}
          </div>

          <div className="drawer-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Tutup
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() => onEdit(store)}
            >
              <Pencil size={15} /> Edit Toko
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}