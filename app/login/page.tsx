'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'

import LoginHeader from './components/LoginHeader'
import LoginError from './components/LoginError'
import LoginForm from './components/LoginForm'

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    try {
      await api.auth.login({ email, password })
      router.push('/dashboard')
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal masuk. Periksa email dan password Anda.'

      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <LoginHeader />

        <LoginError message={errorMessage} />

        <LoginForm
          email={email}
          password={password}
          showPassword={showPassword}
          loading={loading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onTogglePassword={() =>
            setShowPassword((prev) => !prev)
          }
          onSubmit={handleLogin}
        />
      </div>
    </div>
  )
}