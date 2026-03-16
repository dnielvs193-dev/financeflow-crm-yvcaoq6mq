import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { OperationalCards } from '@/components/dashboard/OperationalCards'
import useMainStore from '@/stores/useMainStore'

export default function Index() {
  const { transactions } = useMainStore()

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards transactions={transactions} />
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <RevenueChart />
        {/* Placeholder for Client Status Distribution Chart */}
        <div className="hidden lg:flex rounded-lg border bg-card text-card-foreground shadow-sm items-center justify-center p-6 bg-muted/10 border-dashed">
          <p className="text-muted-foreground text-sm">
            Gráfico de Distribuição de Status em desenvolvimento...
          </p>
        </div>
      </div>
      <OperationalCards />
    </div>
  )
}
