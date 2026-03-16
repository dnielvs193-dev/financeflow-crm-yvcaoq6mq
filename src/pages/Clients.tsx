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
import { Search } from 'lucide-react'

export default function Clients() {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
  } = useMainStore()

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Clientes</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie assinaturas, controle vencimentos e automatize renovações.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <ClientDataActions />
          <ClientFormModal />
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
            <SelectItem value="Vencido">Vencido</SelectItem>
            <SelectItem value="Devedor">Devedor</SelectItem>
            <SelectItem value="Vencido +30d">Vencido +30d</SelectItem>
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
