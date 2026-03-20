import { Bar, BarChart, CartesianGrid, XAxis, Tooltip as RechartsTooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { Transaction } from '@/types'
import { useState, useMemo } from 'react'
import { formatCurrency } from '@/lib/formatters'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const chartConfig = {
  clientes: { label: 'Clientes', color: 'hsl(var(--primary))' },
  revendas: { label: 'Revendas', color: 'hsl(var(--secondary))' },
  ativacoes: { label: 'Ativações', color: 'hsl(var(--chart-3, 210, 80%, 50%))' },
}

export function RevenueChart({ transactions = [] }: { transactions?: Transaction[] }) {
  const [filter, setFilter] = useState<'day' | 'week' | 'month' | 'year'>('month')

  const chartData = useMemo(() => {
    const now = new Date()
    let daysToSubtract = 30
    if (filter === 'day') daysToSubtract = 1
    if (filter === 'week') daysToSubtract = 7
    if (filter === 'year') daysToSubtract = 365

    const cutoff = new Date(now.getTime() - daysToSubtract * 86400000)

    const filtered = transactions.filter(
      (t) =>
        new Date(t.date) >= cutoff &&
        ['Renovação de Cliente', 'Venda para Revenda', 'Taxa de Ativação'].includes(t.type),
    )

    const grouped: Record<
      string,
      { name: string; clientes: number; revendas: number; ativacoes: number }
    > = {}

    filtered.forEach((t) => {
      const d = new Date(t.date)
      let key = ''
      if (filter === 'year') key = `${d.getMonth() + 1}/${d.getFullYear()}`
      else key = `${d.getDate()}/${d.getMonth() + 1}`

      if (!grouped[key]) grouped[key] = { name: key, clientes: 0, revendas: 0, ativacoes: 0 }

      if (t.type === 'Renovação de Cliente') grouped[key].clientes += t.entry
      if (t.type === 'Venda para Revenda') grouped[key].revendas += t.entry
      if (t.type === 'Taxa de Ativação') grouped[key].ativacoes += t.entry
    })

    const result = Object.values(grouped).sort((a, b) => {
      const [da, ma] = a.name.split('/')
      const [db, mb] = b.name.split('/')
      if (filter === 'year')
        return (
          new Date(Number(ma), Number(da) - 1).getTime() -
          new Date(Number(mb), Number(db) - 1).getTime()
        )
      return (
        new Date(now.getFullYear(), Number(ma) - 1, Number(da)).getTime() -
        new Date(now.getFullYear(), Number(mb) - 1, Number(db)).getTime()
      )
    })

    if (result.length === 0) {
      return [{ name: 'Sem dados', clientes: 0, revendas: 0, ativacoes: 0 }]
    }
    return result
  }, [transactions, filter])

  const totalFaturamento = chartData.reduce(
    (acc, curr) => acc + curr.clientes + curr.revendas + curr.ativacoes,
    0,
  )

  return (
    <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <CardTitle>
            Faturamento Total:{' '}
            <span className="text-primary">{formatCurrency(totalFaturamento)}</span>
          </CardTitle>
          <CardDescription>
            Detalhamento de faturamento por categoria (Clientes, Revendas, Ativações).
          </CardDescription>
        </div>
        <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
          <SelectTrigger className="w-[140px] mt-2 sm:mt-0">
            <SelectValue placeholder="Filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Hoje</SelectItem>
            <SelectItem value="week">Últimos 7 dias</SelectItem>
            <SelectItem value="month">Últimos 30 dias</SelectItem>
            <SelectItem value="year">Este Ano</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            <RechartsTooltip
              cursor={{ fill: 'var(--color-muted)' }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Bar
              dataKey="clientes"
              name="Clientes"
              stackId="a"
              fill="var(--color-clientes)"
              radius={[0, 0, 4, 4]}
            />
            <Bar dataKey="revendas" name="Revendas" stackId="a" fill="var(--color-revendas)" />
            <Bar
              dataKey="ativacoes"
              name="Ativações"
              stackId="a"
              fill="var(--color-ativacoes)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
