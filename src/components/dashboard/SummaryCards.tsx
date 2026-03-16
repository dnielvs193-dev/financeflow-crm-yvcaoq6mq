import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'

export function SummaryCards({ transactions }: { transactions: any[] }) {
  const commercialTypes = ['Clientes', 'Revendas']

  const totalRevenue = transactions.reduce(
    (acc, curr) => acc + (commercialTypes.includes(curr.type) ? curr.entry : 0),
    0,
  )

  const totalCost = transactions.reduce(
    (acc, curr) => acc + (commercialTypes.includes(curr.type) ? curr.cost : 0),
    0,
  )

  const totalProfit = totalRevenue - totalCost

  const totalExpenses = transactions.reduce(
    (acc, curr) => acc + (!commercialTypes.includes(curr.type) && curr.entry > 0 ? curr.entry : 0),
    0,
  )

  const cards = [
    {
      title: 'Faturamento',
      value: totalRevenue,
      icon: TrendingUp,
      trend: '+12%',
      color: 'text-primary',
    },
    {
      title: 'Lucro Líquido',
      value: totalProfit,
      icon: ArrowUpRight,
      trend: '+8%',
      color: 'text-primary',
    },
    {
      title: 'Custo de Operação',
      value: totalCost,
      icon: Wallet,
      trend: '-2%',
      color: 'text-secondary',
    },
    {
      title: 'Gastos Fixos/Saídas',
      value: totalExpenses,
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
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                card.value,
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span
                className={
                  card.trend.startsWith('+') && !card.title.includes('Gastos')
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
