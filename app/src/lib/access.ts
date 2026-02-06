// src/lib/access.ts

export type Role = "createur" | "direction" | "force_de_vente";

/**
 * Matrice d'accès par "section" (onglet).
 * IMPORTANT : on utilise des clés stables (pas les labels affichés).
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

export function canAccess(section: keyof typeof ACCESS, role: Role) {
  return ACCESS[section].includes(role);
}
