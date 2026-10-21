
interface AuditLogPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function AuditLogPagination({
  page,
  totalPages,
  onPageChange,
}: AuditLogPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <span>
        Halaman {page} dari {totalPages}
      </span>

      <div className="pagination-buttons">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          ‹
        </button>

        <button type="button" className="current">
          {page}
        </button>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() =>
            onPageChange(Math.min(totalPages, page + 1))
          }
        >
          ›
        </button>
      </div>
    </div>
  )
}
