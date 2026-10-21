import React from 'react'
import { Store } from 'lucide-react'

export default function LoginHeader() {
  return (
    <>
      <div className="login-logo">
        <Store size={22} strokeWidth={2} />
      </div>

      <span className="eyebrow">
        KAMPUNG SANAN DIGITAL HUB
      </span>

      <h1>Sanan Admin</h1>

      <p>
        Kelola informasi, toko, produk, dan data
        Kampung Keripik Tempe Sanan.
      </p>
    </>
  )
}