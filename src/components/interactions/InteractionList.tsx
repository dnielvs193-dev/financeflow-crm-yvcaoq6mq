import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import useMainStore from '@/stores/useMainStore'
import { maskPhone } from '@/lib/formatters'
import { Check, UserCircle, Bot } from 'lucide-react'

export function InteractionList() {
  const { interactions, clients, updateInteractionStatus } = useMainStore()

  const getClientName = (id?: string, phone?: string) => {
    if (id) {
      const c = clients.find((c) => c.id === id)
      if (c) return c.name
    }
    return 'Desconhecido'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'bot_handled':
        return (
          <Badge className="bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-0">
            Bot Resolveu
          </Badge>
        )
      case 'requires_human':
        return (
          <Badge className="bg-red-500/15 text-red-600 hover:bg-red-500/25 border-0">
            Atenção Humana
          </Badge>
        )
      case 'resolved':
        return (
          <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-0">
            Resolvido (Humano)
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Cliente / Telefone</TableHead>
            <TableHead>Mensagem (Webhook)</TableHead>
            <TableHead>Intenção (IA)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interactions.map((int) => (
            <TableRow key={int.id}>
              <TableCell className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(int.timestamp))}
              </TableCell>
              <TableCell>
                <div className="font-medium">{getClientName(int.clientId, int.phone)}</div>
                <div className="text-xs text-muted-foreground">{maskPhone(int.phone)}</div>
              </TableCell>
              <TableCell className="max-w-[250px] truncate" title={int.message}>
                {int.message}
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium capitalize">{int.intent}</div>
                <div className="text-xs text-muted-foreground">
                  Confiança: {(int.aiConfidence * 100).toFixed(0)}%
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(int.status)}</TableCell>
              <TableCell className="text-right space-x-2">
                {int.status === 'requires_human' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateInteractionStatus(int.id, 'resolved')}
                    className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" /> Marcar Resolvido
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled
                    className="gap-1 opacity-50 cursor-not-allowed"
                  >
                    <Bot className="h-4 w-4" /> OK
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {interactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhuma interação registrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
