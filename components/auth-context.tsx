'use client'

import { createContext, useContext } from 'react'

type AuthAccessContextValue = {
  isAdmin: boolean
  authReady: boolean
}

export const AuthAccessContext = createContext<AuthAccessContextValue>({
  isAdmin: false,
  authReady: false,
})

export function useAuthAccess() {
  return useContext(AuthAccessContext)
}
