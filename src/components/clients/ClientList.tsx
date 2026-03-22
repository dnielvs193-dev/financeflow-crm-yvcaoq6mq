import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import useMainStore from '@/stores/useMainStore'
import { Client } from '@/types'
import { ClientStatusBadge } from './ClientStatusBadge'
import {
  formatDate,
  formatCurrency,
  getClientStatus,
  maskPhone,
  cleanPhone,
  generateMessage,
} from '@/lib/formatters'
import { MoreVertical, Phone, Trash, Edit, Key, MessageCircleHeart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClientFormModal } from './ClientFormModal'
import { Badge } from '@/components/ui/badge'

const getPreviewDate = (currentDate: string, days: number) => {
  let base = new Date(currentDate)
  const status = getClientStatus(currentDate)
  if (status === 'Vencido' || status === 'Vencido +30d') base = new Date()
  base.setDate(base.getDate() + days)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(base)
}

const isRecentContact = (date?: string) => {
  if (!date) return false
  const diff = new Date().getTime() - new Date(date).getTime()
  return diff < 86400000 * 2 // 48 hours
}

export function ClientList() {
  const { clients, filteredClients, renewClient, deleteClient, templates, updateClient } =
    useMainStore()
  const { toast } = useToast()

  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [sortCol, setSortCol] = useState<'name' | 'service' | 'expiryDate'>('expiryDate')
  const [sortDesc, setSortDesc] = useState(false)

  const nameCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    clients
      .filter((c) => !c.deleted)
      .forEach((c) => {
        const name = c.name.trim().toLowerCase()
        counts[name] = (counts[name] || 0) + 1
      })
    return counts
  }, [clients])

  const handleRenew = (id: string, days: number) => {
    renewClient(id, days)
    const isManual = [-1, 1].includes(days)
    toast({
      title: isManual ? 'Data ajustada' : 'Renovação concluída',
      description: isManual
        ? `Ajuste de ${days > 0 ? '+' : ''}${days}d aplicado.`
        : `Adicionado +${days} dias e lançamento gerado no Extrato financeiro.`,
    })
  }

  const handleWaClick = (client: Client, type: 'status' | 'credentials') => {
    let phone = cleanPhone(client.phone)
    if (phone.startsWith('0')) phone = phone.substring(1)
    if (!phone.startsWith('55')) phone = `55${phone}`

    if (phone.length < 12) {
      return toast({
        title: 'Telefone inválido',
        description: 'O número não possui dígitos suficientes para ser válido com DDD.',
        variant: 'destructive',
      })
    }

    let template = templates.active
    if (type === 'credentials') {
      template = templates.credentials
    } else {
      const st = getClientStatus(client.expiryDate, client.status)
      if (st === 'Vencido' || st === 'Vencido +30d' || st === 'Devedor')
        template = templates.expired
      else if (st === 'Excluído') template = templates.deleted
      else template = templates.active
    }

    const msg = generateMessage(template, client)
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`

    // Log outbound contact
    updateClient(client.id, { lastContactedDate: new Date().toISOString() })

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleSort = (col: 'name' | 'service' | 'expiryDate') => {
    if (sortCol === col) setSortDesc(!sortDesc)
    else {
      setSortCol(col)
      setSortDesc(false)
    }
  }

  const sortedClients = [...filteredClients].sort((a, b) => {
    let aVal = a[sortCol] || ''
    let bVal = b[sortCol] || ''
    if (sortCol === 'expiryDate') {
      aVal = new Date(a.expiryDate).getTime().toString()
      bVal = new Date(b.expiryDate).getTime().toString()
    }
    const compare = aVal.localeCompare(bVal, undefined, { numeric: true })
    return sortDesc ? -compare : compare
  })

  return (
    <div className="space-y-4">
      <ClientFormModal
        client={editingClient || undefined}
        open={!!editingClient}
        onOpenChange={(op) => !op && setEditingClient(null)}
      />

      <div className="hidden lg:block rounded-md border bg-card overflow-x-auto">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('name')}
              >
                Cliente {sortCol === 'name' && (sortDesc ? '↓' : '↑')}
              </TableHead>
              <TableHead>Serviço / Venda (Custo)</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50 w-[220px]"
                onClick={() => handleSort('expiryDate')}
              >
                Vencimento / Status {sortCol === 'expiryDate' && (sortDesc ? '↓' : '↑')}
              </TableHead>
              <TableHead className="w-[300px]">Renovação Rápida</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClients.map((client) => {
              const count = nameCounts[client.name.trim().toLowerCase()] || 0
              const isRecent = isRecentContact(client.lastContactedDate)
              return (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {client.classification && (
                        <span className="text-lg">{client.classification}</span>
                      )}
                      <div className="font-bold text-base flex items-center gap-2">
                        {client.name}
                        {isRecent && (
                          <MessageCircleHeart
                            className="h-4 w-4 text-green-500"
                            title="Contatado recentemente via IA/Bot"
                          />
                        )}
                      </div>
                      {count > 1 && (
                        <Badge
                          variant="secondary"
                          className="bg-orange-500/15 text-orange-600 border-0 h-5 px-1.5 text-[10px]"
                        >
                          {count} points
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                      <Phone className="h-3 w-3" /> {maskPhone(client.phone)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold text-primary">{client.service}</div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      {formatCurrency(client.price)}{' '}
                      <span className="opacity-60">| Custo: {formatCurrency(client.cost)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm mb-1">{formatDate(client.expiryDate)}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <ClientStatusBadge
                        expiryDate={client.expiryDate}
                        status={client.status}
                        onClick={() => handleWaClick(client, 'status')}
                        showIcon
                      />
                      <Badge
                        variant="outline"
                        className="cursor-pointer bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 gap-1 h-5 text-[10px] px-1.5"
                        onClick={() => handleWaClick(client, 'credentials')}
                      >
                        <Key className="w-3 h-3" /> Credenciais
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {[15, 30, 31].map((d) => (
                        <Button
                          key={d}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs px-2 flex-1 border-primary/20 text-primary hover:bg-primary/10"
                          onClick={() => handleRenew(client.id, d)}
                        >
                          +{d}d ({getPreviewDate(client.expiryDate, d)})
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => setEditingClient(client)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteClient(client.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
            {sortedClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {sortedClients.map((client) => {
          const count = nameCounts[client.name.trim().toLowerCase()] || 0
          const isRecent = isRecentContact(client.lastContactedDate)
          return (
            <Card key={client.id} className="border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-base flex items-center gap-1">
                      {client.classification} {client.name}
                      {isRecent && <MessageCircleHeart className="h-4 w-4 text-green-500 ml-1" />}
                    </h3>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                      <Phone className="h-3 w-3" /> {maskPhone(client.phone)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {client.service} • Venda: {formatCurrency(client.price)} | Custo:{' '}
                      {formatCurrency(client.cost)}
                    </div>
                    {count > 1 && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-500/15 text-orange-600 border-0 mt-1 text-[10px]"
                      >
                        {count} points
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3 mt-2 flex-wrap">
                  <ClientStatusBadge
                    expiryDate={client.expiryDate}
                    status={client.status}
                    onClick={() => handleWaClick(client, 'status')}
                    showIcon
                  />
                  <Badge
                    variant="outline"
                    className="cursor-pointer bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 gap-1 h-5 text-[10px] px-1.5"
                    onClick={() => handleWaClick(client, 'credentials')}
                  >
                    <Key className="w-3 h-3" /> Credenciais
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[15, 30, 31].map((d) => (
                    <Button
                      key={d}
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                      onClick={() => handleRenew(client.id, d)}
                    >
                      +{d}d ({getPreviewDate(client.expiryDate, d)})
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => setEditingClient(client)}
                  >
                    <Edit className="h-3 w-3 mr-2" /> Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
