
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'

import DashboardHeader from './components/DashboardHeader'
import DashboardStats from './components/DashboardStats'
import AIInsightBanner from './components/AIInsightBanner'
import DashboardInsights from './components/DashboardInsights'
import RecentActivities from './components/RecentActivities'
import DashboardQuote from './components/DashboardQuote'

import type { DashboardStatsData } from './components/types'

export default function DashboardPage() {
  const router = useRouter()

  const [stats, setStats] = useState<DashboardStatsData>({
    totalStores: 0,
    activeStores: 0,
    totalProducts: 0,
    totalHampers: 0,
    recentActivities: [],
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const res = await api.dashboard.getStats()

      if (res.success && res.data) {
        setStats(res.data)
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <DashboardHeader />

      <DashboardStats
        stats={stats}
        loading={loading}
      />

      <AIInsightBanner />

      <DashboardInsights />

      <div className="dashboard-grid insight-spacing">
        <RecentActivities
          activities={stats.recentActivities}
          loading={loading}
          onViewAll={() => router.push('/audit-log')}
        />

        <DashboardQuote />
      </div>
    </div>
  )
}
