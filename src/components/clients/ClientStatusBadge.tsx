import { Badge } from '@/components/ui/badge'
import { getClientStatus } from '@/lib/formatters'

export function ClientStatusBadge({
  expiryDate,
  isDebtor,
}: {
  expiryDate: string
  isDebtor: boolean
}) {
  const status = getClientStatus(expiryDate, isDebtor)

  if (status === 'Ativo') {
    return (
      <Badge className="bg-primary/15 text-primary hover:bg-primary/25 font-semibold border-0">
        Ativo
      </Badge>
    )
  }
  if (status === 'Vencido') {
    return (
      <Badge className="bg-destructive/15 text-destructive hover:bg-destructive/25 font-semibold border-0">
        Vencido
      </Badge>
    )
  }
  return (
    <Badge className="bg-orange-500/15 text-orange-600 hover:bg-orange-500/25 font-semibold border-0">
      Devedor
    </Badge>
  )
}
