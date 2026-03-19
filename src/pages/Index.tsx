import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { OperationalCards } from '@/components/dashboard/OperationalCards'
import useMainStore from '@/stores/useMainStore'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

export default function Index() {
  const { filteredTransactions, txSearchQuery, txTypeFilter, txBankFilter, txPeriodFilter } =
    useMainStore()

  const isFiltered =
    txSearchQuery || txTypeFilter !== 'all' || txBankFilter !== 'all' || txPeriodFilter !== 'all'

  return (
    <div className="flex flex-col gap-6">
      {isFiltered && (
        <Alert className="bg-primary/5 border-primary/20 animate-fade-in-down">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary font-medium text-sm">
            Filtros financeiros ativos. Os indicadores abaixo estão refletindo apenas os dados do
            subconjunto filtrado (Extrato).
          </AlertDescription>
        </Alert>
      )}
      <SummaryCards transactions={filteredTransactions} />
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <RevenueChart transactions={filteredTransactions} />
        <div className="hidden lg:flex rounded-lg border bg-card text-card-foreground shadow-sm items-center justify-center p-6 bg-muted/10 border-dashed">
          <p className="text-muted-foreground text-sm">
            Gráfico de Distribuição de Custo e Lucro em desenvolvimento...
          </p>
        </div>
      </div>
      <OperationalCards />
    </div>
  )
}
