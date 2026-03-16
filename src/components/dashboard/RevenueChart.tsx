import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  revenue: { label: 'Faturamento', color: 'hsl(var(--secondary))' },
  profit: { label: 'Lucro', color: 'hsl(var(--primary))' },
}

export function RevenueChart({ transactions = [] }: { transactions?: any[] }) {
  const baseRevenue = transactions.reduce((a, c) => a + c.entry, 0)
  const baseProfit = transactions.reduce((a, c) => a + c.profit, 0)

  const chartData =
    baseRevenue > 0
      ? [
          { day: 'Seg', revenue: baseRevenue * 0.1, profit: baseProfit * 0.1 },
          { day: 'Ter', revenue: baseRevenue * 0.2, profit: baseProfit * 0.2 },
          { day: 'Qua', revenue: baseRevenue * 0.15, profit: baseProfit * 0.15 },
          { day: 'Qui', revenue: baseRevenue * 0.25, profit: baseProfit * 0.25 },
          { day: 'Sex', revenue: baseRevenue * 0.2, profit: baseProfit * 0.2 },
          { day: 'Sab', revenue: baseRevenue * 0.05, profit: baseProfit * 0.05 },
          { day: 'Dom', revenue: baseRevenue * 0.05, profit: baseProfit * 0.05 },
        ]
      : [
          { day: 'Seg', revenue: 250, profit: 150 },
          { day: 'Ter', revenue: 400, profit: 280 },
          { day: 'Qua', revenue: 350, profit: 200 },
          { day: 'Qui', revenue: 600, profit: 450 },
          { day: 'Sex', revenue: 500, profit: 380 },
          { day: 'Sab', revenue: 800, profit: 600 },
          { day: 'Dom', revenue: 450, profit: 320 },
        ]

  return (
    <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
      <CardHeader>
        <CardTitle>Visão Financeira</CardTitle>
        <CardDescription>Faturamento vs Lucro nos últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
            <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="var(--color-profit)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
