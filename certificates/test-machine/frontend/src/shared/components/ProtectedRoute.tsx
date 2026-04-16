import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../hooks/useStore.js'

interface Props {
  children: React.ReactNode
  requireRole?: 'admin' | 'candidate'
}

export function ProtectedRoute({ children, requireRole }: Props) {
  const { user, token } = useAppSelector(s => s.auth)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
