'use client'

interface DeleteConfirmationProps {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteConfirmation({
  isOpen,
  onCancel,
  onConfirm,
}: DeleteConfirmationProps) {
  if (!isOpen) return null

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        className="confirm-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <h3>Hapus produk?</h3>

        <p>
          Apakah Anda yakin ingin menghapus data produk ini dari katalog?
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