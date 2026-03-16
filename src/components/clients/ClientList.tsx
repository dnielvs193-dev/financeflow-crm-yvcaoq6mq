import { useState } from 'react'
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
import useMainStore, { Client } from '@/stores/useMainStore'
import { ClientStatusBadge } from './ClientStatusBadge'
import { formatDate, formatCurrency } from '@/lib/formatters'
import {
  MoreVertical,
  Phone,
  Trash,
  Edit,
  MessageSquare,
  Tag,
  LifeBuoy,
  History,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClientFormModal } from './ClientFormModal'

export function ClientList() {
  const { filteredClients, renewClient, deleteClient } = useMainStore()
  const { toast } = useToast()

  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [sortCol, setSortCol] = useState<'name' | 'service' | 'expiryDate'>('expiryDate')
  const [sortDesc, setSortDesc] = useState(false) // Default ascending for expiry (critical first)

  const handleRenew = (id: string, days: number) => {
    renewClient(id, days)
    const isManual = [-1, 1].includes(days)
    toast({
      title: isManual ? 'Data ajustada' : 'Renovação concluída',
      description: isManual
        ? `Ajuste de ${days > 0 ? '+' : ''}${days}d aplicado.`
        : `Adicionado +${days} dias e lançamento gerado no Extrato.`,
    })
  }

  const placeholderAction = (action: string) => {
    toast({
      title: 'Ação Registrada',
      description: `Módulo "${action}" em desenvolvimento para futuras integrações.`,
    })
  }

  const handleSort = (col: 'name' | 'service' | 'expiryDate') => {
    if (sortCol === col) setSortDesc(!sortDesc)
    else {
      setSortCol(col)
      setSortDesc(col === 'name' || col === 'service' ? false : false)
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
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('name')}
              >
                Cliente {sortCol === 'name' && (sortDesc ? '↓' : '↑')}
              </TableHead>
              <TableHead>Acesso</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('service')}
              >
                Serviço / Painel {sortCol === 'service' && (sortDesc ? '↓' : '↑')}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('expiryDate')}
              >
                Status / Venc. {sortCol === 'expiryDate' && (sortDesc ? '↓' : '↑')}
              </TableHead>
              <TableHead>Financeiro</TableHead>
              <TableHead className="w-[240px]">Gestão de Vencimento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="h-3 w-3" /> {client.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{client.user || '-'}</div>
                  <div className="text-xs text-muted-foreground">
                    {client.password ? '***' : '-'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{client.service}</div>
                  <div className="text-xs text-muted-foreground">{client.panel || '-'}</div>
                </TableCell>
                <TableCell>
                  <ClientStatusBadge expiryDate={client.expiryDate} status={client.status} />
                  <div className="text-xs font-medium mt-1">{formatDate(client.expiryDate)}</div>
                  {client.lastExpiryDate && (
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <History className="h-3 w-3" /> Antigo: {formatDate(client.lastExpiryDate)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-primary">{formatCurrency(client.price)}</div>
                  <div className="text-xs text-muted-foreground">
                    Custo: {formatCurrency(client.cost)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                      {[-1, 1].map((d) => (
                        <Button
                          key={d}
                          variant="secondary"
                          size="sm"
                          className="h-6 text-[10px] px-1.5 flex-1"
                          onClick={() => handleRenew(client.id, d)}
                        >
                          {d > 0 ? `+${d}d` : `${d}d`}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {[15, 30, 31].map((d) => (
                        <Button
                          key={d}
                          variant="outline"
                          size="sm"
                          className="h-6 text-[10px] px-1.5 flex-1 border-primary/20 text-primary hover:bg-primary/10"
                          onClick={() => handleRenew(client.id, d)}
                        >
                          +{d}d
                        </Button>
                      ))}
                    </div>
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
                        <Edit className="mr-2 h-4 w-4" /> Editar Cliente
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => placeholderAction('Feed Whatsapp')}>
                        <MessageSquare className="mr-2 h-4 w-4 text-blue-500" /> Disparar Feed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => placeholderAction('Promoção')}>
                        <Tag className="mr-2 h-4 w-4 text-orange-500" /> Enviar Promoção
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => placeholderAction('Resgate de Cliente')}>
                        <LifeBuoy className="mr-2 h-4 w-4 text-green-500" /> Tentar Resgate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteClient(client.id)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Lixeira
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {sortedClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {sortedClients.map((client) => (
          <Card key={client.id} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <p className="text-xs text-muted-foreground">{client.service}</p>
                </div>
                <ClientStatusBadge expiryDate={client.expiryDate} status={client.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4 bg-muted/30 p-2 rounded">
                <div>
                  <span className="text-muted-foreground text-xs">Vencimento</span>
                  <div className="font-medium flex items-center gap-1">
                    {formatDate(client.expiryDate)}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Preço</span>
                  <div className="font-medium text-primary">{formatCurrency(client.price)}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {[15, 30].map((d) => (
                  <Button
                    key={d}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                    onClick={() => handleRenew(client.id, d)}
                  >
                    Renovar +{d}d
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
                <Button
                  variant="outline"
                  className="flex-1 text-xs text-blue-500 border-blue-500/20 hover:bg-blue-500/10"
                  onClick={() => placeholderAction('Ação Rápida')}
                >
                  <MessageSquare className="h-3 w-3 mr-2" /> Ações
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
