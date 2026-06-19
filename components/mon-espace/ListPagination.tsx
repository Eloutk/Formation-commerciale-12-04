import { Button } from '@/components/ui/button'

type MonEspaceListPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function MonEspaceListPagination({
  page,
  totalPages,
  onPageChange,
}: MonEspaceListPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Précédent
      </Button>
      <span className="text-sm text-muted-foreground tabular-nums">
        Page {page}/{totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Suivant
      </Button>
    </div>
  )
}
