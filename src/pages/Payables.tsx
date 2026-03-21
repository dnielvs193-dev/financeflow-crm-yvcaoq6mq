import useMainStore from '@/stores/useMainStore'
import { PayableFormModal } from '@/components/payables/PayableFormModal'
import { PayablesList } from '@/components/payables/PayablesList'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import { Receipt, AlertCircle, CalendarClock } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Payables() {
  const { payables } = useMainStore()

  const pending = payables.filter((p) => p.status === 'Pendente')
  const fixas = pending
    .filter((p) => p.category === 'Contas Fixas')
    .reduce((a, c) => a + c.amount, 0)
  const dividas = pending.filter((p) => p.category === 'Dívidas').reduce((a, c) => a + c.amount, 0)
  const outros = pending
    .filter((p) => p.category === 'Outros Gastos')
    .reduce((a, c) => a + c.amount, 0)

  const todayStr = new Date().toISOString().split('T')[0]
  const todayItems = payables.filter((p) => p.dueDate.startsWith(todayStr))
  const goalAmount = todayItems.reduce((a, c) => a + c.amount, 0)
  const paidToday = todayItems.filter((p) => p.status === 'Pago').reduce((a, c) => a + c.amount, 0)
  const remaining = goalAmount - paidToday
  const accumulated = payables
    .filter((p) => p.status === 'Pendente')
    .reduce((a, c) => a + c.amount, 0)

  const isGoalMet = goalAmount > 0 && remaining <= 0
  const hasGoal = goalAmount > 0

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contas a Pagar</h2>
          <p className="text-muted-foreground text-sm">Agende, organize e pague suas despesas.</p>
        </div>
        <PayableFormModal />
      </div>

      <Card
        className={cn(
          'border shadow-sm transition-colors duration-300',
          hasGoal
            ? isGoalMet
              ? 'bg-green-500/10 border-green-500/50'
              : 'bg-red-500/10 border-red-500/50'
            : 'bg-card',
        )}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Meta Diária (Vence Hoje)</p>
              <p
                className={cn(
                  'text-2xl font-bold',
                  hasGoal ? (isGoalMet ? 'text-green-700' : 'text-red-700') : '',
                )}
              >
                {formatCurrency(goalAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pago Hoje</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(paidToday)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Falta Pagar</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(remaining)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Acumulado (Pendentes)</p>
              <p className="text-2xl font-bold">{formatCurrency(accumulated)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-blue-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contas Fixas</p>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(fixas)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-red-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-600 rounded-lg">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dívidas</p>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(dividas)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-orange-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 text-orange-600 rounded-lg">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Outros Gastos</p>
              <p className="text-2xl font-bold text-orange-700">{formatCurrency(outros)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <PayablesList />
    </div>
  )
}
