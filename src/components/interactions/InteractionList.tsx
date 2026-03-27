import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { useState } from 'react'

export function InteractionList({ interactions = [] }: { interactions?: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredInteractions = interactions.filter((int) => {
    if (statusFilter !== 'all' && int.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const clientName = int.expand?.client?.name?.toLowerCase() || ''
      const phone = int.expand?.client?.phone || int.expand?.client?.lid || ''
      const text = int.content?.toLowerCase() || ''
      const intent = int.intent?.toLowerCase() || ''
      return text.includes(q) || clientName.includes(q) || phone.includes(q) || intent.includes(q)
    }
    return true
  })

  const getStatusBadge = (status: string) => {
    if (!status) return null
    if (status === 'novo_contato')
      return (
        <Badge className="bg-gray-500/15 text-gray-600 hover:bg-gray-500/25 border-0">
          Novo Contato
        </Badge>
      )
    if (status === 'received')
      return (
        <Badge className="bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-0">
          Recebida
        </Badge>
      )
    return <Badge variant="outline">{status}</Badge>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por telefone, mensagem, cliente ou intenção..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="received">Recebida</SelectItem>
            <SelectItem value="novo_contato">Novo Contato</SelectItem>
            <SelectItem value="processado">Processado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Cliente / Contato</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Direção</TableHead>
              <TableHead>Status & Intenção</TableHead>
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
                  }).format(new Date(int.created))}
                </TableCell>
                <TableCell>
                  <div className="font-medium flex items-center gap-1">
                    {int.expand?.client?.name || 'Desconhecido'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {int.expand?.client?.phone || int.expand?.client?.lid}
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate" title={int.content}>
                  {int.content}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      int.direction === 'inbound'
                        ? 'border-blue-200 text-blue-600 bg-blue-50'
                        : 'border-green-200 text-green-600 bg-green-50'
                    }
                  >
                    {int.direction === 'inbound' ? 'Inbound' : 'Outbound'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    {getStatusBadge(int.status)}
                    {int.intent && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 border-purple-200"
                      >
                        Intenção: {int.intent}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredInteractions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma mensagem encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
