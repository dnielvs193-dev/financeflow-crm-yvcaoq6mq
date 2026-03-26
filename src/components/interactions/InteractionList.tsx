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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import useMainStore from '@/stores/useMainStore'
import { maskPhone } from '@/lib/formatters'
import { Check, UserCircle, Search, AlertTriangle, Paperclip, ShieldAlert } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ManualChatModal } from './ManualChatModal'

export function InteractionList() {
  const {
    filteredInteractions,
    clients,
    updateInteractionStatus,
    intSearchQuery,
    setIntSearchQuery,
    intStatusFilter,
    setIntStatusFilter,
  } = useMainStore()

  const getClientName = (id?: string, phone?: string) => {
    if (id) {
      const c = clients.find((c) => c.id === id)
      if (c) return c.name
    }
    return 'Desconhecido'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'novo_contato':
        return (
          <Badge className="bg-gray-500/15 text-gray-600 hover:bg-gray-500/25 border-0">
            Novo Contato
          </Badge>
        )
      case 'cliente_identificado':
        return (
          <Badge className="bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-0">
            Cliente Identificado
          </Badge>
        )
      case 'aguardando_comprovante':
        return (
          <Badge className="bg-orange-500/15 text-orange-600 hover:bg-orange-500/25 border-0">
            Aguardando Pagamento
          </Badge>
        )
      case 'comprovante_recebido':
        return (
          <Badge className="bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-0">
            Comp. Recebido
          </Badge>
        )
      case 'comprovante_em_analise':
        return (
          <Badge className="bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-0">
            Comp. em Análise
          </Badge>
        )
      case 'pagamento_validado':
        return (
          <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/25 border-0">
            Pagamento Validado
          </Badge>
        )
      case 'pagamento_nao_validado':
        return (
          <Badge className="bg-red-500/15 text-red-600 hover:bg-red-500/25 border-0">
            Pagamento Inválido
          </Badge>
        )
      case 'renovacao_executada':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-0">
            Renovação Executada
          </Badge>
        )
      case 'aguardando_atendimento_humano':
        return (
          <Badge className="bg-red-500/15 text-red-600 hover:bg-red-500/25 border-0">
            Atenção Humana
          </Badge>
        )
      case 'em_atendimento_humano':
        return (
          <Badge className="bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-0">
            Em Atendimento (Manual)
          </Badge>
        )
      case 'encerrado':
        return (
          <Badge className="bg-gray-500/15 text-gray-600 hover:bg-gray-500/25 border-0">
            Encerrado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por telefone, mensagem ou intenção..."
            className="pl-9"
            value={intSearchQuery}
            onChange={(e) => setIntSearchQuery(e.target.value)}
          />
        </div>
        <Select value={intStatusFilter} onValueChange={setIntStatusFilter}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="novo_contato">Novo Contato</SelectItem>
            <SelectItem value="cliente_identificado">Cliente Identificado</SelectItem>
            <SelectItem value="comprovante_recebido">Comprovante Recebido</SelectItem>
            <SelectItem value="aguardando_atendimento_humano">Atenção Humana</SelectItem>
            <SelectItem value="em_atendimento_humano">Em Atendimento</SelectItem>
            <SelectItem value="renovacao_executada">Renovação Executada</SelectItem>
            <SelectItem value="encerrado">Encerrado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Cliente / Telefone</TableHead>
              <TableHead>Mensagem (Webhook)</TableHead>
              <TableHead>Intenção (IA)</TableHead>
              <TableHead>Workflow / Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInteractions.map((int) => (
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
                  <div className="font-medium flex items-center gap-1">
                    {getClientName(int.clientId, int.phone)}
                    {int.clientId && <UserCircle className="w-3 h-3 text-muted-foreground" />}
                  </div>
                  <div className="text-xs text-muted-foreground">{maskPhone(int.phone)}</div>
                </TableCell>
                <TableCell className="max-w-[250px] truncate" title={int.message}>
                  {int.message}
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium capitalize">{int.intent || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">
                    Confiança: {(int.aiConfidence * 100).toFixed(0)}%
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    {getStatusBadge(int.status)}
                    {int.receiptId && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        <Paperclip className="h-3 w-3" /> Anexo (Mídia)
                      </span>
                    )}
                    {int.errorLog && (
                      <Tooltip>
                        <TooltipTrigger className="cursor-help flex items-center gap-1 text-[10px] text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded">
                          <AlertTriangle className="h-3 w-3" /> Log de Erro
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{int.errorLog}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <ManualChatModal interaction={int} />

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <ShieldAlert className="h-4 w-4" /> Logs
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Audit Logs: Interação</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="text-sm border rounded-md overflow-hidden">
                          <table className="w-full text-left">
                            <thead className="bg-muted">
                              <tr>
                                <th className="px-3 py-2 text-xs font-medium">Data/Hora</th>
                                <th className="px-3 py-2 text-xs font-medium">Ator</th>
                                <th className="px-3 py-2 text-xs font-medium">Ação / Detalhes</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {int.auditLogs?.map((log) => (
                                <tr key={log.id}>
                                  <td className="px-3 py-2 text-xs whitespace-nowrap text-muted-foreground">
                                    {new Intl.DateTimeFormat('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                    }).format(new Date(log.timestamp))}
                                  </td>
                                  <td className="px-3 py-2 text-xs font-medium">
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        'text-[10px] px-1 py-0 h-4',
                                        log.actor === 'AI'
                                          ? 'text-purple-600 border-purple-200 bg-purple-50'
                                          : log.actor === 'User'
                                            ? 'text-blue-600 border-blue-200 bg-blue-50'
                                            : 'text-gray-600 border-gray-200 bg-gray-50',
                                      )}
                                    >
                                      {log.actor}
                                    </Badge>
                                  </td>
                                  <td className="px-3 py-2">
                                    <div className="text-xs font-medium">{log.action}</div>
                                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                                      {log.details}
                                    </div>
                                    <div className="text-[9px] text-muted-foreground/50 mt-1 font-mono">
                                      ID: {log.correlationId}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                              {!int.auditLogs?.length && (
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="px-3 py-4 text-center text-xs text-muted-foreground"
                                  >
                                    Nenhum log registrado.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {int.status === 'em_atendimento_humano' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateInteractionStatus(int.id, 'encerrado')}
                      className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" /> Encerrar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredInteractions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma interação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
