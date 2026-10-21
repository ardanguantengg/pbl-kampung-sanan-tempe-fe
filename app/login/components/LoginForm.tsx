import React from 'react'
import { LockKeyhole, Eye, EyeOff } from 'lucide-react'

interface LoginFormProps {
  email: string
  password: string
  showPassword: boolean
  loading: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onTogglePassword: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function LoginForm({
  email,
  password,
  showPassword,
  loading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <label>Email</label>
      <input
        type="email"
        placeholder="email@sanan.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
      />

      <label>Password</label>

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          style={{
            width: '100%',
            paddingRight: '36px',
          }}
          required
        />

        <button
          type="button"
          onClick={onTogglePassword}
          title={
            showPassword
              ? 'Sembunyikan password'
              : 'Tampilkan password'
          }
          style={{
            position: 'absolute',
            right: '8px',
            background: 'transparent',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#81756d',
          }}
        >
          {showPassword
            ? <EyeOff size={16} />
            : <Eye size={16} />}
        </button>
      </div>

      <button
        type="submit"
        className="primary-button login-button"
        disabled={loading}
      >
        <LockKeyhole size={16} />
        {loading ? 'Memproses...' : 'Login Admin'}
      </button>
    </form>
  )
}