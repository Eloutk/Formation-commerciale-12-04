import { AdminGuardLayout } from '@/components/vente/AdminGuardLayout'
import { Vente2AppShell } from '@/components/vente/Vente2AppShell'

export default function AdminCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuardLayout>
      <Vente2AppShell>{children}</Vente2AppShell>
    </AdminGuardLayout>
  )
}
