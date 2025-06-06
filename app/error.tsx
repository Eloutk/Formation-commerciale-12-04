'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Une erreur est survenue
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error.message}
          </p>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => reset()}
            variant="outline"
          >
            Réessayer
          </Button>
        </div>
      </div>
    </div>
  )
} 