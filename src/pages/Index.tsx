import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { OperationalCards } from '@/components/dashboard/OperationalCards'
import { DashboardUsage } from '@/components/dashboard/DashboardUsage'
import useMainStore from '@/stores/useMainStore'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { PLANS } from '@/lib/plans'

export default function Index() {
  const {
    filteredTransactions,
    txSearchQuery,
    txTypeFilter,
    txBankFilter,
    txPeriodFilter,
    currentPlan,
  } = useMainStore()

  const isFiltered =
    txSearchQuery || txTypeFilter !== 'all' || txBankFilter !== 'all' || txPeriodFilter !== 'all'

  const hasFinance = PLANS[currentPlan].features.includes('finance')

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <DashboardUsage />

      {!hasFinance && (
        <div className="p-8 text-center border rounded-lg bg-muted/30 border-dashed animate-fade-in-down mt-2">
          <h3 className="text-lg font-semibold mb-2">Visão Financeira Bloqueada</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Atualize para o plano Prata ou superior para acessar gráficos de receita, lucro e
            métricas financeiras detalhadas.
          </p>
          <Button asChild>
            <Link to="/billing">Conhecer Planos</Link>
          </Button>
        </div>
      )}

      {hasFinance && (
        <>
          {isFiltered && (
            <Alert className="bg-primary/5 border-primary/20 animate-fade-in-down">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary font-medium text-sm">
                Filtros financeiros ativos. Os indicadores abaixo estão refletindo apenas os dados
                do subconjunto filtrado.
              </AlertDescription>
            </Alert>
          )}
          <SummaryCards transactions={filteredTransactions} />
          <div className="grid gap-4 grid-cols-1">
            <RevenueChart transactions={filteredTransactions} />
          </div>
          <OperationalCards />
        </>
      )}
    </div>
  )
}
