import React from 'react'
import { AlertCircle } from 'lucide-react'

interface LoginErrorProps {
  message: string | null
}

export default function LoginError({
  message,
}: LoginErrorProps) {
  if (!message) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        padding: '10px 14px',
        color: '#ef4444',
        fontSize: '13px',
        marginBottom: '16px',
      }}
    >
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  )
}