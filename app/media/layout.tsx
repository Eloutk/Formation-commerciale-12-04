import { AdminGuardLayout } from '@/components/vente/AdminGuardLayout'

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuardLayout>{children}</AdminGuardLayout>
}
