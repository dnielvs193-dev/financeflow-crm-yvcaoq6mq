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
import { Check, X, Eye, FileText, MoreVertical } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ReceiptsList() {
  const { receipts, clients, updateReceiptStatus } = useMainStore()

  const getClientName = (id?: string) => {
    if (id) {
      const c = clients.find((c) => c.id === id)
      if (c) return c.name
    }
    return 'Desconhecido'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'comprovante_recebido':
        return (
          <Badge className="bg-orange-500/15 text-orange-600 hover:bg-orange-500/25 border-0">
            Aguardando Validação
          </Badge>
        )
      case 'comprovante_em_analise':
        return (
          <Badge className="bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-0">
            Requer Análise (Estoque/Dados)
          </Badge>
        )
      case 'pagamento_validado':
        return (
          <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-0">
            Validado (Renovado)
          </Badge>
        )
      case 'pagamento_nao_validado':
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
                {rec.status === 'comprovante_recebido' ||
                rec.status === 'comprovante_em_analise' ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => updateReceiptStatus(rec.id, 'pagamento_validado', 'User')}
                        className="text-green-600"
                      >
                        <Check className="mr-2 h-4 w-4" /> Aprovar e Renovar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateReceiptStatus(rec.id, 'comprovante_em_analise', 'User')
                        }
                        className="text-yellow-600"
                      >
                        <FileText className="mr-2 h-4 w-4" /> Colocar em Análise
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateReceiptStatus(rec.id, 'pagamento_nao_validado', 'User')
                        }
                        className="text-red-600"
                      >
                        <X className="mr-2 h-4 w-4" /> Rejeitar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
