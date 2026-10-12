import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sanan Admin — Kampung Keripik Tempe Digital Hub',
  description: 'Kelola informasi, toko, produk, dan data Kampung Keripik Tempe Sanan.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
