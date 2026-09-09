/** Classes partagées pour harmoniser les 3 cartes de la Home. */
export const homeCard = {
  root: 'flex h-full min-h-0 flex-col overflow-hidden border-border/80 shadow-sm',
  header:
    'shrink-0 space-y-1 border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent px-3 py-2',
  titleRow: 'flex min-h-5 min-w-0 items-center gap-1.5',
  titleIcon: 'h-4 w-4 shrink-0 text-[#E94C16]',
  title: '!text-sm !font-semibold !leading-5 !tracking-normal text-foreground',
  badge:
    'h-5 max-w-[8.5rem] shrink-0 truncate rounded-full border border-[#E94C16]/30 bg-transparent px-1.5 py-0 text-[10px] font-normal leading-5 text-[#E94C16]',
  subtitle: 'min-h-4 text-[11px] leading-4 text-muted-foreground',
  content: 'flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-3',
  sectionTitle:
    '!mb-1.5 !mt-0 flex items-center gap-1.5 !text-xs !font-semibold !leading-4 !text-foreground',
  sectionIcon: 'h-3.5 w-3.5 shrink-0 text-[#E94C16]',
  body: 'text-xs leading-snug text-foreground',
  bodyMuted: 'text-[11px] leading-snug text-muted-foreground',
  option:
    'flex min-w-0 items-center gap-1.5 rounded-md border border-border/80 px-2 py-1.5 text-xs leading-snug',
  panel: 'rounded-md border border-border/80 px-2 py-1.5 text-xs leading-snug',
  button: 'h-8 text-xs',
} as const
