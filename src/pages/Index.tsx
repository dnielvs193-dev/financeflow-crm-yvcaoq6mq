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
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {isFiltered && (
        <Alert className="bg-primary/5 border-primary/20 animate-fade-in-down">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary font-medium text-sm">
            Filtros financeiros ativos. Os indicadores abaixo estão refletindo apenas os dados do
            subconjunto filtrado.
          </AlertDescription>
        </Alert>
      )}
      <SummaryCards transactions={filteredTransactions} />
      <div className="grid gap-4 grid-cols-1">
        <RevenueChart transactions={filteredTransactions} />
      </div>
      <OperationalCards />
    </div>
  )
}
