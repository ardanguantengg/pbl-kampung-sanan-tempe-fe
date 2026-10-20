'use client'

import {
  Eye,
  Pencil,
  Trash2,
  MapPin,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { getFullImageUrl } from '@/services/api'
import type { StoreItem } from './types'

interface TokoTableProps {
  stores: StoreItem[]
  loading: boolean
  loadError: string | null
  onDetail: (store: StoreItem) => void
  onEdit: (store: StoreItem) => void
  onDelete: (id: number) => void
}

export default function TokoTable({
  stores,
  loading,
  loadError,
  onDetail,
  onEdit,
  onDelete,
}: TokoTableProps) {
  return (
    <div className="data-panel">
      <div className="data-table">
        <div className="data-head">
          <span>NAMA TOKO</span>
          <span>ALAMAT &amp; LOKASI</span>
          <span>KONTAK WHATSAPP</span>
          <span>JUMLAH PRODUK</span>
          <span>STATUS</span>
          <span>AKSI</span>
        </div>

        {loading ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <Loader2
              className="animate-spin"
              size={24}
              style={{ display: 'inline', marginRight: 8 }}
            />
            Memuat data toko...
          </div>
        ) : loadError ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: 'var(--danger, #b42318)',
            }}
          >
            {loadError}
          </div>
        ) : stores.length === 0 ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Tidak ada data toko yang sesuai
          </div>
        ) : (
          stores.map((store, index) => (
            <div className="data-row" key={store.id || index}>
              <div
                className="store-name"
                style={{ cursor: 'pointer' }}
                onClick={() => onDetail(store)}
              >
                {store.image ? (
                  <img
                    src={getFullImageUrl(store.image)}
                    alt={store.name}
                    className="store-image"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
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
                      <MapPin size={11} />
                      Buka Google Maps
                      <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>

              <div>{store.whatsapp}</div>

              <div>
                {store.product_count !== undefined
                  ? `${store.product_count} Produk`
                  : '-'}
              </div>

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

              <div className="row-actions">
                <button
                  title="Detail Toko"
                  type="button"
                  onClick={() => onDetail(store)}
                >
                  <Eye size={16} />
                </button>

                <button
                  title="Edit"
                  type="button"
                  onClick={() => onEdit(store)}
                >
                  <Pencil size={16} />
                </button>

                <button
                  title="Hapus"
                  type="button"
                  onClick={() => onDelete(store.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <span>
          Menampilkan {stores.length} dari {stores.length} Toko
        </span>
      </div>
    </div>
  )
}