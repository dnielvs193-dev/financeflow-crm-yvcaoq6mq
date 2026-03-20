import { Badge } from '@/components/ui/badge'
import { getClientStatus } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export function ClientStatusBadge({
  expiryDate,
  status,
}: {
  expiryDate: string
  status?: string | null
}) {
  const currentStatus = getClientStatus(expiryDate, status)

  const styles: Record<string, string> = {
    Ativo: 'bg-green-500/15 text-green-600 hover:bg-green-500/25',
    Vencido: 'bg-red-500/15 text-red-600 hover:bg-red-500/25',
    Devedor: 'bg-orange-500/15 text-orange-600 hover:bg-orange-500/25',
    'Vencido +30d': 'bg-purple-500/15 text-purple-600 hover:bg-purple-500/25',
    Excluído: 'bg-gray-500/15 text-gray-600 hover:bg-gray-500/25',
  }

  return (
    <Badge className={cn('font-semibold border-0', styles[currentStatus] || styles['Ativo'])}>
      {currentStatus}
    </Badge>
  )
}
