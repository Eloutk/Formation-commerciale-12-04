// src/lib/access.ts

export type Role = "createur" | "direction" | "force_de_vente" | "admin" | "super_admin";

/**
 * Matrice d'accès par "section" (onglet).
 * IMPORTANT : on utilise des clés stables (pas les labels affichés).
 * Les rôles admin et super_admin ont toujours accès à toutes les pages (voir canAccess).
 */
export const ACCESS: Record<
  | "home"
  | "diffusion"
  | "chefferie"
  | "studio"
  | "pdv"
  | "document"
  | "glossaire"
  | "faq",
  Role[]
> = {
  home: ["createur"],
  diffusion: ["createur", "direction", "force_de_vente"],
  chefferie: ["createur"],
  studio: ["createur"],
  pdv: ["createur"],
  document: ["createur", "direction", "force_de_vente"],
  glossaire: ["createur", "direction", "force_de_vente"],
  faq: ["createur", "direction", "force_de_vente"],
};

/**
 * Retourne true si le rôle peut accéder à la section.
 * Les admin et super_admin ont toujours accès à toutes les pages du site.
 */
export function canAccess(section: keyof typeof ACCESS, role: Role) {
  if (role === "admin" || role === "super_admin") return true;
  return ACCESS[section].includes(role);
}
