import { AdminGuardLayout } from '@/components/vente/AdminGuardLayout'

export default function TutoLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuardLayout>{children}</AdminGuardLayout>
}
