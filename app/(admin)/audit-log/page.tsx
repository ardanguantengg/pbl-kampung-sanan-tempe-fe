
'use client'

import { useEffect, useState } from 'react'
import { api } from '@/services/api'

import AuditLogHeader from './components/AuditLogHeader'
import AuditLogTable from './components/AuditLogTable'
import AuditLogPagination from './components/AuditLogPagination'

import type { ActivityLogItem } from '@/types/audit-log'

export default function AuditLogPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchLogs(page)
  }, [page])

  const fetchLogs = async (currentPage: number) => {
    try {
      setLoading(true)

      const res = await api.activity.getAll(currentPage, 15)

      if (res.success) {
        setLogs(res.data)

        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1)
        }
      }
    } catch (err) {
      console.error('Failed to fetch activity logs:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <AuditLogHeader
        loading={loading}
        onRefresh={() => fetchLogs(page)}
      />

      <div className="data-panel">
        <AuditLogTable
          logs={logs}
          loading={loading}
        />

        <AuditLogPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
