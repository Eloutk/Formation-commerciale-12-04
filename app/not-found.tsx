import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Page non trouvée
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            La page que vous recherchez n'existe pas.
          </p>
        </div>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/">
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 