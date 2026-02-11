import Link from "next/link"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function AdminPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        // App Router server components: we don't set cookies here.
        set: () => {},
        remove: () => {},
      },
    }
  )

  const { data: auth } = await supabase.auth.getUser()
  const user = auth?.user
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle()

  const role = (profile?.role as string | undefined) || "user"
  const isAdmin = role === "admin" || role === "super_admin"
  if (!isAdmin) redirect("/home")

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="text-muted-foreground">
          Accès réservé aux administrateurs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Contenu Home</CardTitle>
            <CardDescription>
              Gérer l’actu flash, succès, info digitale et nouveaux clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/newsletter">
              <Button className="w-full">Ouvrir</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

