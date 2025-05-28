import AuthForm from '@/components/auth/AuthForm'

export default function AuthPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Bienvenue</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Connectez-vous pour accéder à votre espace de formation
        </p>
        <AuthForm />
      </div>
    </div>
  )
} 