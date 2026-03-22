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
import { Check, X, Eye, FileText } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function ReceiptsList() {
  const { receipts, clients, validateReceipt } = useMainStore()

  const getClientName = (id?: string) => {
    if (id) {
      const c = clients.find((c) => c.id === id)
      if (c) return c.name
    }
    return 'Desconhecido'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recebido':
        return (
          <Badge className="bg-orange-500/15 text-orange-600 hover:bg-orange-500/25 border-0">
            Aguardando Análise
          </Badge>
        )
      case 'em_analise':
        return (
          <Badge className="bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-0">
            Requer Atenção (Estoque/Dados)
          </Badge>
        )
      case 'validado':
        return (
          <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-0">
            Validado (Renovado)
          </Badge>
        )
      case 'rejeitado':
        return (
          <Badge className="bg-red-500/15 text-red-600 hover:bg-red-500/25 border-0">
            Rejeitado
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
            <TableHead>Data Recebimento</TableHead>
            <TableHead>Cliente / Contato</TableHead>
            <TableHead>Anexo (Mídia)</TableHead>
            <TableHead>Status / Automação</TableHead>
            <TableHead className="text-right">Ação Manual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((rec) => (
            <TableRow key={rec.id}>
              <TableCell className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(rec.timestamp))}
              </TableCell>
              <TableCell>
                <div className="font-medium">{getClientName(rec.clientId)}</div>
                <div className="text-xs text-muted-foreground">{maskPhone(rec.phone)}</div>
              </TableCell>
              <TableCell>
                <a
                  href={rec.fileAttachment}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
                >
                  <Eye className="h-4 w-4" /> Ver Mídia
                </a>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 items-start">
                  {getStatusBadge(rec.status)}
                  {rec.notes && (
                    <Tooltip>
                      <TooltipTrigger className="cursor-help flex items-center gap-1 text-[10px] text-muted-foreground font-medium bg-muted px-1.5 py-0.5 rounded">
                        <FileText className="h-3 w-3" /> Notas
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{rec.notes}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                {rec.status === 'recebido' || rec.status === 'em_analise' ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => validateReceipt(rec.id, true)}
                      className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                      title="Aprova pagamento e executa renovação automática de 30 dias (se houver estoque)."
                    >
                      <Check className="h-4 w-4" /> Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => validateReceipt(rec.id, false)}
                      className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" /> Rejeitar
                    </Button>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground mr-4">Processado</span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {receipts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Nenhum comprovante na fila.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
