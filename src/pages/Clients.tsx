import { ClientFormModal } from '@/components/clients/ClientFormModal'
import { ClientList } from '@/components/clients/ClientList'
import { ClientDataActions } from '@/components/clients/ClientDataActions'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useMainStore from '@/stores/useMainStore'
import { Search, Users, UserCheck, Clock, UserX } from 'lucide-react'
import { getClientStatus } from '@/lib/formatters'

export default function Clients() {
  const {
    clients,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
  } = useMainStore()

  const activeClients = clients.filter((c) => !c.deleted)
  const total = activeClients.length
  const ativos = activeClients.filter((c) =>
    ['Ativo', 'Vence Hoje', 'Vence Amanhã'].includes(getClientStatus(c.expiryDate, c.status) || ''),
  ).length
  const vencidos = activeClients.filter(
    (c) => getClientStatus(c.expiryDate, c.status) === 'Vencido',
  ).length
  const devedores = activeClients.filter((c) =>
    ['Devedor', 'Vencido +30d'].includes(getClientStatus(c.expiryDate, c.status) || ''),
  ).length

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Clientes</h2>
          <div className="text-muted-foreground text-sm">
            Gerencie assinaturas, controle vencimentos e automatize renovações.
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <ClientDataActions />
          <ClientFormModal />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border shadow-sm flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-md">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Clientes</div>
            <div className="text-xl font-bold">{total}</div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border shadow-sm flex items-center gap-3">
          <div className="p-2 bg-green-500/10 text-green-500 rounded-md">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Ativos</div>
            <div className="text-xl font-bold">{ativos}</div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border shadow-sm flex items-center gap-3">
          <div className="p-2 bg-red-500/10 text-red-500 rounded-md">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Vencidos</div>
            <div className="text-xl font-bold">{vencidos}</div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border shadow-sm flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 text-orange-500 rounded-md">
            <UserX className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Devedores</div>
            <div className="text-xl font-bold">{devedores}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, telefone ou serviço..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Vence Hoje">Vence Hoje</SelectItem>
            <SelectItem value="Vence Amanhã">Vence Amanhã</SelectItem>
            <SelectItem value="Vencido">Vencido</SelectItem>
            <SelectItem value="Devedor">Devedor</SelectItem>
            <SelectItem value="Vencido +30d">Vencido +30d</SelectItem>
            <SelectItem value="Excluído">Excluído</SelectItem>
          </SelectContent>
        </Select>
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por Serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Serviços</SelectItem>
            <SelectItem value="IPTV Premium">IPTV Premium</SelectItem>
            <SelectItem value="P2P Basic">P2P Basic</SelectItem>
            <SelectItem value="P2P Plus">P2P Plus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ClientList />
    </div>
  )
}
