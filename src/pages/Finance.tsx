import { FinanceFormModal } from '@/components/finance/FinanceFormModal'
import { TransferModal } from '@/components/finance/TransferModal'
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
  const {
    filteredTransactions,
    banks,
    txSearchQuery,
    setTxSearchQuery,
    txTypeFilter,
    setTxTypeFilter,
    txBankFilter,
    setTxBankFilter,
    txPeriodFilter,
    setTxPeriodFilter,
  } = useMainStore()

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Extrato Financeiro</h2>
          <p className="text-muted-foreground text-sm">
            Auditoria e controle detalhado de receitas, despesas e transferências.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <TransferModal />
          <FinanceFormModal />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar lançamentos..."
            className="pl-9"
            value={txSearchQuery}
            onChange={(e) => setTxSearchQuery(e.target.value)}
          />
        </div>
        <Select value={txTypeFilter} onValueChange={setTxTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de Movimento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="Renovação de Cliente">Renovação de Cliente</SelectItem>
            <SelectItem value="Venda para Revenda">Venda para Revenda</SelectItem>
            <SelectItem value="Transferência Interna">Transferência Interna</SelectItem>
            <SelectItem value="Compra de Estoque">Compra de Estoque</SelectItem>
            <SelectItem value="Pagamento de Contas">Pagamento de Contas</SelectItem>
            <SelectItem value="Estorno Financeiro">Estorno Financeiro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={txBankFilter} onValueChange={setTxBankFilter}>
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
        <Select value={txPeriodFilter} onValueChange={setTxPeriodFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo o Período</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <FinanceList transactions={filteredTransactions} />
    </div>
  )
}
