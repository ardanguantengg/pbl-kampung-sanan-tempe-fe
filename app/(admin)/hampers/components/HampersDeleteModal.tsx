
interface HampersDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function HampersDeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: HampersDeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div
        className="confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Hapus hampers?</h3>
        <p>
          Apakah Anda yakin ingin menghapus paket hampers ini?
        </p>

        <div className="confirm-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
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
