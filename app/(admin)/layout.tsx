'use client'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { SidebarProvider, useSidebar } from '@/components/SidebarContext'

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className={`admin-container ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SidebarProvider>
  )
}
