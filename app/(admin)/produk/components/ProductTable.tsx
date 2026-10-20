'use client'

import { Loader2, Pencil, Trash2 } from 'lucide-react'
import { getFullImageUrl } from '@/services/api'
import type { ProductItem } from './types'

interface ProductTableProps {
  products: ProductItem[]
  loading: boolean
  onEdit: (product: ProductItem) => void
  onDelete: (id: number) => void
}

export default function ProductTable({
  products,
  loading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="data-panel">
      <div className="data-table">
        <div className="data-head">
          <span>PRODUK</span>
          <span>TOKO PENGHASIL</span>
          <span>VARIAN / UKURAN</span>
          <span>HARGA</span>
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
              style={{
                display: 'inline',
                marginRight: 8,
              }}
            />
            Memuat data produk...
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            Tidak ada produk yang sesuai
          </div>
        ) : (
          products.map((product, index) => (
            <div className="data-row" key={product.id}>
              <div className="store-name">
                {product.image ? (
                  <img
                    src={getFullImageUrl(product.image) || ''}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <div
                    className="product-image"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </div>
                )}

                <div>
                  <strong>{product.name}</strong>
                  <small>
                    {product.description || 'Olahan Tempe Sanan'}
                  </small>
                </div>
              </div>

              <div>
                <strong>{product.store_name || '-'}</strong>
              </div>

              <div>
                <span className="badge category-badge">
                  {product.variant || 'Original'}
                  {product.size ? ` (${product.size})` : ''}
                </span>
              </div>

              <div>
                <strong>
                  Rp{Number(product.price).toLocaleString('id-ID')}
                </strong>
              </div>

              <div>
                <span
                  className={`status-badge ${
                    product.status === 'Tersedia'
                      ? 'active-status'
                      : 'waiting-status'
                  }`}
                >
                  {product.status}
                </span>
              </div>

              <div className="row-actions">
                <button
                  title="Edit"
                  type="button"
                  onClick={() => onEdit(product)}
                >
                  <Pencil size={16} />
                </button>

                <button
                  title="Hapus"
                  type="button"
                  onClick={() => onDelete(product.id)}
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
          Menampilkan {products.length} dari {products.length} Produk
        </span>
      </div>
    </div>
  )
}