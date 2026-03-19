import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import { Transaction } from '@/types'
import { formatCurrency } from '@/lib/formatters'

export function SummaryCards({ transactions = [] }: { transactions?: Transaction[] }) {
  const getEffType = (t: Transaction) =>
    t.type === 'Estorno Financeiro' && t.originalTxId
      ? transactions.find((x) => x.id === t.originalTxId)?.type || t.type
      : t.type

  const commTypes = ['Renovação de Cliente', 'Venda para Revenda', 'Taxa de Ativação']

  const metrics = (transactions || []).reduce(
    (acc, t) => {
      const effType = getEffType(t)
      if (commTypes.includes(effType)) {
        acc.commRev += t.entry
        acc.commCost += t.cost
      }
      if (
        [
          'Compra de Estoque',
          'Compra de Ativação',
          'Gastos Avulsos',
          'Pagamento de Contas',
        ].includes(effType)
      ) {
        // For expenses, absolute value of cost/profit depending on entry
        acc.opCost += Math.abs(t.profit < 0 ? t.profit : t.cost)
      }
      if (effType === 'Outras Entradas') {
        acc.otherIn += t.entry
      }
      return acc
    },
    { commRev: 0, commCost: 0, opCost: 0, otherIn: 0 },
  )

  const commProfit = metrics.commRev - metrics.commCost

  const cards = [
    {
      title: 'Faturamento Comercial',
      value: metrics.commRev,
      icon: TrendingUp,
      trend: '+12%',
      color: 'text-primary',
    },
    {
      title: 'Lucro Comercial',
      value: commProfit,
      icon: ArrowUpRight,
      trend: '+8%',
      color: 'text-primary',
    },
    {
      title: 'Custo Comercial (Tiers)',
      value: metrics.commCost,
      icon: Wallet,
      trend: '-2%',
      color: 'text-secondary',
    },
    {
      title: 'Custo Operacional',
      value: metrics.opCost,
      icon: ArrowDownRight,
      trend: '+5%',
      color: 'text-destructive',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
      {cards.map((card, i) => (
        <Card
          key={i}
          className="hover:shadow-md transition-shadow duration-200 border-none shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 bg-muted/50 rounded-md ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(card.value)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span
                className={
                  card.trend.startsWith('+') && !card.title.includes('Custo')
                    ? 'text-primary font-medium'
                    : 'text-destructive font-medium'
                }
              >
                {card.trend}
              </span>{' '}
              em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
