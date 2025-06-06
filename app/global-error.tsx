'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 p-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Une erreur critique est survenue
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {error.message}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => reset()}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 