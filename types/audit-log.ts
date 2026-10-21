
export interface ActivityLogItem {
  id: number
  user_name?: string
  user_role?: string
  action: string
  module: string
  description: string
  created_at: string
}
