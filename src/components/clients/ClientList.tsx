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
import { ClientStatusBadge } from './ClientStatusBadge'
import { formatDate, formatCurrency } from '@/lib/formatters'
import { CalendarClock, MoreVertical, Phone, Trash } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ClientList() {
  const { clients, renewClient, deleteClient } = useMainStore()
  const { toast } = useToast()
  const activeClients = clients.filter((c) => !c.deleted)

  const handleRenew = (id: string, days: number) => {
    renewClient(id, days)
    toast({
      title: 'Renovado com sucesso!',
      description: `Adicionado +${days} dias e gerado lançamento financeiro.`,
    })
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Renovação Rápida</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  {client.name}
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Phone className="h-3 w-3" /> {client.phone}
                  </div>
                </TableCell>
                <TableCell>{client.service}</TableCell>
                <TableCell>
                  <ClientStatusBadge expiryDate={client.expiryDate} isDebtor={client.isDebtor} />
                </TableCell>
                <TableCell>{formatDate(client.expiryDate)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={() => handleRenew(client.id, 15)}
                    >
                      +15d
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-7 text-xs px-2 bg-primary/10 text-primary hover:bg-primary/20"
                      onClick={() => handleRenew(client.id, 30)}
                    >
                      +30d
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => deleteClient(client.id)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {activeClients.map((client) => (
          <Card key={client.id} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  <p className="text-xs text-muted-foreground">{client.service}</p>
                </div>
                <ClientStatusBadge expiryDate={client.expiryDate} isDebtor={client.isDebtor} />
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="flex items-center text-muted-foreground">
                  <CalendarClock className="mr-1 h-4 w-4" /> {formatDate(client.expiryDate)}
                </span>
                <span className="font-medium text-primary">{formatCurrency(client.price)}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 text-xs"
                  variant="outline"
                  onClick={() => handleRenew(client.id, 15)}
                >
                  +15d
                </Button>
                <Button
                  className="flex-1 text-xs bg-primary/10 text-primary hover:bg-primary/20"
                  onClick={() => handleRenew(client.id, 30)}
                >
                  +30d
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteClient(client.id)}
                  className="text-destructive h-9 w-9 border"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
