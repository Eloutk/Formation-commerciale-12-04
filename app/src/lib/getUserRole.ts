// src/lib/getUserRole.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Role } from "./access";

/**
 * Lit le role dans public.profiles pour l'utilisateur connecté.
 * Retourne null si pas connecté.
 */
export async function getUserRole(): Promise<Role | null> {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // App Router (server components) : on ne set pas ici.
          // Les refresh de session se gèrent ailleurs si besoin.
        },
      },
    }
  );

  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile?.role) return null;

  return profile.role as Role;
}
