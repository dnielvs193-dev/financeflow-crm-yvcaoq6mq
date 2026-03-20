import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import { Transaction } from '@/types'
import { formatCurrency } from '@/lib/formatters'

export function SummaryCards({ transactions = [] }: { transactions?: Transaction[] }) {
  const getEffType = (t: Transaction) =>
    t.type === 'Estorno Financeiro' && t.originalTxId
      ? transactions.find((x) => x.id === t.originalTxId)?.type || t.type
      : t.type

  const metrics = (transactions || []).reduce(
    (acc, t) => {
      const effType = getEffType(t)
      if (['Renovação de Cliente', 'Venda para Revenda', 'Taxa de Ativação'].includes(effType)) {
        acc.faturamento += t.entry
        acc.lucro += t.profit
      }
      if (['Compra de Estoque', 'Compra de Ativação'].includes(effType)) {
        acc.custoEstoque += t.cost || Math.abs(t.profit)
      }
      if (['Gastos Avulsos', 'Pagamento de Contas', 'Outras Saídas'].includes(effType)) {
        acc.outrosCustos += t.cost || Math.abs(t.profit)
      }
      return acc
    },
    { faturamento: 0, lucro: 0, custoEstoque: 0, outrosCustos: 0 },
  )

  const cards = [
    {
      title: 'Faturamento Total',
      value: metrics.faturamento,
      icon: TrendingUp,
      trend: '+12%',
      color: 'text-primary',
    },
    {
      title: 'Lucro Líquido',
      value: metrics.lucro,
      icon: ArrowUpRight,
      trend: '+8%',
      color: 'text-green-500',
    },
    {
      title: 'Custo de Estoque',
      value: metrics.custoEstoque,
      icon: Wallet,
      trend: '-2%',
      color: 'text-orange-500',
    },
    {
      title: 'Outros Custos',
      value: metrics.outrosCustos,
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
