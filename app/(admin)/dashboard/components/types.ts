
export interface DashboardActivity {
  id: number | string
  module?: string
  action?: string
  description?: string
  created_at?: string
}

export interface DashboardStatsData {
  totalStores: number
  activeStores: number
  totalProducts: number
  totalHampers: number
  recentActivities: DashboardActivity[]
}
