/** Conditions de vente réutilisées par le PDF SMS et le PDF rétroplanning */
export const SMS_SALES_CONDITIONS = [
  'Offre disponible en France métropolitaine (dont Corse).',
  '160 caractères MAXIMUM (dont mentions légales).',
  'Si 2ème campagne dans les 2 semaines (retargeting), -30 % sur la base de données.',
  '4 jours de mise en place minimum.',
  'Statistiques et résultats de campagne sous 48h.',
  'Rich SMS = Jeux concours (= notoriété + ventes + leads) // Store locator.',
  'Pour jeux concours : cadeaux INTÉRESSANTS obligatoires.',
] as const

export const RCS_SALES_CONDITIONS = [
  "Création et vérification d'agent OBLIGATOIRE si inexistant.",
  'Délai de création : 7 jours à partir de la réception du formulaire complété par le client.',
  'La créa visuelle est à fournir par le client ou par Link (1000x720px, peu de texte pour une bonne lisibilité sur mobile).',
  "Si besoin d’un agent « conversationnel », devis spécifique à prévoir : à privilégier le RCS classique pour éviter une hausse importante des coûts.",
  'Si le volume RCS est < 10 000 contacts, bascule possible sur une campagne SMS classique.',
  "ATTENTION : les frais de set up correspondent aux frais de paramétrage de la campagne (routage, agrégation, etc.) et ne doivent pas être confondus avec la créa, facturée en sus.",
] as const
