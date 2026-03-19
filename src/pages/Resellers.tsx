import { ResellerList } from '@/components/resellers/ResellerList'
import { ResellerFormModal } from '@/components/resellers/ResellerFormModal'
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
import { useMemo } from 'react'

export default function Resellers() {
  const {
    resellers,
    resellerSearchQuery,
    setResellerSearchQuery,
    resellerStatusFilter,
    setResellerStatusFilter,
    resellerCityFilter,
    setResellerCityFilter,
  } = useMainStore()

  const cities = useMemo(() => {
    const c = new Set(resellers.map((r) => r.city).filter(Boolean))
    return Array.from(c).sort()
  }, [resellers])

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Revendas</h2>
          <p className="text-muted-foreground text-sm">
            Acompanhe revendedores, gerencie leads e execute vendas diretas de serviços.
          </p>
        </div>
        <div className="flex w-full lg:w-auto">
          <ResellerFormModal />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome da revenda..."
            className="pl-9"
            value={resellerSearchQuery}
            onChange={(e) => setResellerSearchQuery(e.target.value)}
          />
        </div>
        <Select value={resellerStatusFilter} onValueChange={setResellerStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
            <SelectItem value="Lead">Lead</SelectItem>
          </SelectContent>
        </Select>
        <Select value={resellerCityFilter} onValueChange={setResellerCityFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por Cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Cidades</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ResellerList />
    </div>
  )
}
