import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import useMainStore from '@/stores/useMainStore'
import { formatDate, formatCurrency } from '@/lib/formatters'

export function FinanceList() {
  const { transactions, banks } = useMainStore()

  const getTypeColor = (type: string) => {
    if (['Clientes', 'Outras entradas', 'Revendas'].includes(type))
      return 'bg-primary/15 text-primary'
    return 'bg-destructive/15 text-destructive'
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Banco</TableHead>
            <TableHead className="text-right">Entrada</TableHead>
            <TableHead className="text-right">Lucro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                {formatDate(t.date)}
              </TableCell>
              <TableCell className="font-medium max-w-[200px] truncate">{t.description}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`border-0 ${getTypeColor(t.type)}`}>
                  {t.type}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {banks.find((b) => b.id === t.bankId)?.name || '-'}
              </TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(t.entry)}</TableCell>
              <TableCell
                className={`text-right font-bold ${t.profit >= 0 ? 'text-primary' : 'text-destructive'}`}
              >
                {t.profit > 0 ? '+' : ''}
                {formatCurrency(t.profit)}
              </TableCell>
            </TableRow>
          ))}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhuma transação encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
