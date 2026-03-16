import { useState, useMemo } from 'react'
import { FinanceFormModal } from '@/components/finance/FinanceFormModal'
import { FinanceList } from '@/components/finance/FinanceList'
import useMainStore from '@/stores/useMainStore'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

export default function Finance() {
  const { transactions, banks } = useMainStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [bankFilter, setBankFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')

  const uniqueServices = useMemo(() => {
    const s = new Set(transactions.map((t) => t.service).filter(Boolean) as string[])
    return Array.from(s)
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (bankFilter !== 'all' && t.bankId !== bankFilter) return false
      if (serviceFilter !== 'all' && t.service !== serviceFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return t.description.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)
      }
      return true
    })
  }, [transactions, searchQuery, typeFilter, bankFilter, serviceFilter])

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Extrato Financeiro</h2>
          <p className="text-muted-foreground text-sm">
            Auditoria, busca e controle de receitas e despesas.
          </p>
        </div>
        <FinanceFormModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar descrição..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de Movimento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="Clientes">Clientes (Renovações)</SelectItem>
            <SelectItem value="Gastos e despesas fixas">Gastos Fixos</SelectItem>
            <SelectItem value="Compra de estoque">Compra de Estoque</SelectItem>
            <SelectItem value="Outras entradas">Outras Entradas</SelectItem>
            <SelectItem value="Outras saídas">Outras Saídas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={bankFilter} onValueChange={setBankFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Conta Bancária" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Contas</SelectItem>
            {banks.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por Serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Serviços</SelectItem>
            {uniqueServices.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FinanceList transactions={filteredTransactions} />
    </div>
  )
}
