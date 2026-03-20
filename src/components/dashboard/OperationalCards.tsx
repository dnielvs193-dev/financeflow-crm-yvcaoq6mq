import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/formatters'
import useMainStore from '@/stores/useMainStore'
import { Building2, PlusCircle, AlertCircle } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

export function OperationalCards() {
  const { banks, transactions, payables } = useMainStore()

  const currentDaily = (transactions || [])
    .filter(
      (t) =>
        new Date(t.date).toDateString() === new Date().toDateString() &&
        ['Renovação de Cliente', 'Venda para Revenda'].includes(t.type),
    )
    .reduce((a, c) => a + c.entry, 0)

  const outrasEntradasTotal = (transactions || [])
    .filter((t) => t.type === 'Outras Entradas')
    .reduce((a, c) => a + c.entry, 0)

  const activeBanks = banks.filter((b) => b.balance > 0)

  const { dailyTarget, pendingTotal } = useMemo(() => {
    let pending = 0
    const target = payables.reduce((acc, p) => {
      if (p.status === 'Pago') return acc
      pending += p.amount
      const due = new Date(p.dueDate)
      const today = new Date()
      due.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      const remainingDays = Math.max(1, diffDays)
      return acc + p.amount / remainingDays
    }, 0)
    return { dailyTarget: target, pendingTotal: pending }
  }, [payables])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Meta de Contas a Pagar (Diária)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(currentDaily)}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              / {formatCurrency(dailyTarget)}
            </span>
          </div>
          <Progress
            value={dailyTarget > 0 ? (currentDaily / dailyTarget) * 100 : 100}
            className="mt-4 h-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Baseado em vencimentos pendentes ({formatCurrency(pendingTotal)}).
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saldos Bancários
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[140px] overflow-y-auto pr-2">
          {activeBanks.length > 0 ? (
            activeBanks.map((bank) => (
              <div key={bank.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-secondary/10 rounded text-secondary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">{bank.name}</span>
                </div>
                <span className="font-bold text-sm">{formatCurrency(bank.balance)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-2">Nenhum saldo positivo.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group border-orange-500/10 hover:border-orange-500/30">
        <Link to="/payables" className="absolute inset-0 z-10" />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            Resumo Contas a Pagar{' '}
            <span className="text-xs font-normal ml-1">(Ver detalhes &rarr;)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm border-b pb-2">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" /> Pendentes
            </span>
            <span className="font-bold text-destructive">
              {payables.filter((p) => p.status === 'Pendente').length}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm border-b pb-2">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" /> Valor Total
            </span>
            <span className="font-bold text-destructive">{formatCurrency(pendingTotal)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Indicador Gerencial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div>
              <p className="text-sm font-medium flex items-center gap-1">
                <PlusCircle className="h-3.5 w-3.5 text-primary" /> Outras Entradas
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Sem impacto comercial</p>
            </div>
            <span className="font-bold text-lg text-primary">
              {formatCurrency(outrasEntradasTotal)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
