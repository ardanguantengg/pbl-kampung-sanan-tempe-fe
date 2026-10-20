'use client'

interface DeleteConfirmationProps {
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteConfirmation({
  onCancel,
  onConfirm,
}: DeleteConfirmationProps) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        className="confirm-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <h3>Hapus toko?</h3>
        <p>
          Apakah Anda yakin ingin menghapus data toko ini? Semua produk
          yang terhubung ke toko ini juga akan terhapus.
        </p>

        <div className="confirm-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Batal
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={onConfirm}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}