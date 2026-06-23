'use client'

import { createContext, useContext } from 'react'
import type { AppPermission } from '@/lib/permissions'
import type { UserRole } from '@/lib/roles'

type AuthAccessContextValue = {
  isAdmin: boolean
  isClient: boolean
  role: UserRole | null
  userName: string | null
  authReady: boolean
  hasPermission: (permission: AppPermission) => boolean
}

export const AuthAccessContext = createContext<AuthAccessContextValue>({
  isAdmin: false,
  isClient: false,
  role: null,
  userName: null,
  authReady: false,
  hasPermission: () => false,
})

export function useAuthAccess() {
  return useContext(AuthAccessContext)
}
