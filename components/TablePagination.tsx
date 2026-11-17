'use client'

import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { FormEvent } from 'react'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  perPage: number
  info?: string
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
}

function getPageItems(currentPage: number, totalPages: number): number[] {
  const pageCount = Math.min(totalPages, 5)
  const startPage = Math.max(
    1,
    Math.min(currentPage - Math.floor(pageCount / 2), totalPages - pageCount + 1)
  )

  return Array.from({ length: pageCount }, (_, index) => startPage + index)
}

export default function TablePagination({
  currentPage,
  totalPages,
  perPage,
  info,
  onPageChange,
  onPerPageChange,
}: TablePaginationProps) {
  const pageItems = getPageItems(currentPage, totalPages)

  const handleGoToPage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const requestedPage = Number(new FormData(form).get('page'))

    if (
      Number.isInteger(requestedPage) &&
      requestedPage >= 1 &&
      requestedPage <= totalPages
    ) {
      onPageChange(requestedPage)
      form.reset()
    }
  }

  return (
    <div className="data-pagination">
      {info && <span className="data-pagination-info">{info}</span>}
      <nav className="data-pagination-controls" aria-label="Navigasi halaman">
        <button
          className="data-pagination-arrow"
          type="button"
          aria-label="Halaman sebelumnya"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>

        <div className="data-pagination-pages">
          {pageItems.map((page) => (
            <button
              key={page}
              className={`data-pagination-page${currentPage === page ? ' is-current' : ''}`}
              type="button"
              aria-label={`Halaman ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          className="data-pagination-arrow"
          type="button"
          aria-label="Halaman selanjutnya"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </nav>

      <label className="data-pagination-size">
        <select
          aria-label="Jumlah data per halaman"
          value={perPage}
          onChange={(event) => onPerPageChange(Number(event.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span aria-hidden="true">{perPage}</span>
        <span>/ page</span>
        <ChevronDown size={14} aria-hidden="true" />
      </label>

      <form className="data-pagination-goto" onSubmit={handleGoToPage}>
        <label htmlFor="data-pagination-page-input">Go to</label>
        <input
          id="data-pagination-page-input"
          name="page"
          type="number"
          min={1}
          max={totalPages}
          aria-label="Nomor halaman tujuan"
          disabled={totalPages === 0}
          required
        />
        <span>Page</span>
      </form>
    </div>
  )
}
