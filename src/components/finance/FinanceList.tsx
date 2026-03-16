import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import useMainStore, { Transaction } from '@/stores/useMainStore'
import { formatDate, formatCurrency } from '@/lib/formatters'

export function FinanceList({ transactions }: { transactions: Transaction[] }) {
  const { banks } = useMainStore()
  const [sortCol, setSortCol] = useState<'date' | 'entry' | 'type'>('date')
  const [sortDesc, setSortDesc] = useState(true)

  const getTypeColor = (type: string) => {
    if (['Clientes', 'Outras entradas', 'Revendas'].includes(type))
      return 'bg-primary/15 text-primary'
    return 'bg-destructive/15 text-destructive'
  }

  const handleSort = (col: 'date' | 'entry' | 'type') => {
    if (sortCol === col) setSortDesc(!sortDesc)
    else {
      setSortCol(col)
      setSortDesc(col === 'date' ? true : false)
    }
  }

  const sortedData = [...transactions].sort((a, b) => {
    let aVal = a[sortCol]
    let bVal = b[sortCol]

    if (sortCol === 'date') {
      aVal = new Date(a.date).getTime()
      bVal = new Date(b.date).getTime()
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDesc ? bVal - aVal : aVal - bVal
    }
    return 0
  })

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('date')}
            >
              Data {sortCol === 'date' && (sortDesc ? '↓' : '↑')}
            </TableHead>
            <TableHead>Descrição / Serviço</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('type')}
            >
              Tipo {sortCol === 'type' && (sortDesc ? '↓' : '↑')}
            </TableHead>
            <TableHead>Banco</TableHead>
            <TableHead
              className="text-right cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('entry')}
            >
              Faturamento {sortCol === 'entry' && (sortDesc ? '↓' : '↑')}
            </TableHead>
            <TableHead className="text-right">Lucro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((t) => {
            const profitPercentage = t.entry > 0 ? (t.profit / t.entry) * 100 : 0
            return (
              <TableRow key={t.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                  {formatDate(t.date)}
                </TableCell>
                <TableCell>
                  <div className="font-medium max-w-[250px] truncate" title={t.description}>
                    {t.description}
                  </div>
                  {t.service && (
                    <div className="text-xs text-muted-foreground mt-0.5">{t.service}</div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`border-0 ${getTypeColor(t.type)}`}>
                    {t.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {banks.find((b) => b.id === t.bankId)?.name || '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium">{formatCurrency(t.entry)}</div>
                  {t.cost > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Custo: {formatCurrency(t.cost)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className={`font-bold ${t.profit >= 0 ? 'text-primary' : 'text-destructive'}`}
                  >
                    {t.profit > 0 ? '+' : ''}
                    {formatCurrency(t.profit)}
                  </div>
                  {t.type === 'Clientes' && (
                    <div className="text-[10px] text-muted-foreground font-medium">
                      {profitPercentage.toFixed(0)}% margem
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
          {sortedData.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhuma transação encontrada no período.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
