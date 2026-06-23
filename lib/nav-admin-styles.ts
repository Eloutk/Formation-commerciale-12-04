import { cn } from '@/lib/utils'

/** Classes communes pour les onglets et entrées de menu réservés aux administrateurs */
export const adminNavTextClass = 'text-violet-600'
export const adminNavHoverClass = 'hover:bg-violet-50 hover:text-violet-700'
export const adminNavActiveClass = 'bg-violet-50 text-violet-700'

export function adminNavTriggerClass(active?: boolean, accent?: boolean) {
  return cn(
    adminNavTextClass,
    adminNavHoverClass,
    (accent || active) && adminNavActiveClass,
  )
}

export function adminNavTabClass(active?: boolean, className?: string) {
  return cn(
    'rounded-md font-medium',
    adminNavTextClass,
    adminNavHoverClass,
    active && adminNavActiveClass,
    className,
  )
}

export function adminNavItemClass(isActive?: boolean) {
  return cn(adminNavTextClass, isActive && cn('font-medium', adminNavActiveClass))
}
