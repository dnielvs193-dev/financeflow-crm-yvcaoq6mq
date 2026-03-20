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
import { Button } from '@/components/ui/button'
import useMainStore from '@/stores/useMainStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { CheckCircle2, ChevronDown, ChevronRight, Trash } from 'lucide-react'
import { PayableCategory } from '@/types'

export function PayablesList() {
  const { payables, payPayable, deletePayable } = useMainStore()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Contas Fixas': true,
    Dívidas: true,
    'Outros Gastos': true,
  })

  const toggleCategory = (cat: string) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  const categories: PayableCategory[] = ['Contas Fixas', 'Dívidas', 'Outros Gastos']

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const next7Days = new Date(now)
  next7Days.setDate(next7Days.getDate() + 7)

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-4 shadow-sm border-orange-500/20">
        <h3 className="text-lg font-semibold mb-4 text-orange-600">
          Vencimentos (Próximos 7 Dias)
        </h3>
        <div className="space-y-2">
          {payables
            .filter((p) => p.status === 'Pendente')
            .filter((p) => {
              const d = new Date(p.dueDate)
              return d >= now && d <= next7Days
            })
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors rounded-lg border"
              >
                <div>
                  <p className="font-medium text-sm">{p.description}</p>
                  <p className="text-xs text-muted-foreground flex gap-2 mt-1">
                    <span>Vence em: {formatDate(p.dueDate)}</span>
                    <Badge variant="outline" className="text-[10px] h-4 py-0">
                      {p.category}
                    </Badge>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-destructive">{formatCurrency(p.amount)}</span>
                  <Button size="sm" onClick={() => payPayable(p.id)} className="h-8 text-xs gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Pagar
                  </Button>
                </div>
              </div>
            ))}
          {payables
            .filter((p) => p.status === 'Pendente')
            .filter((p) => {
              const d = new Date(p.dueDate)
              return d >= now && d <= next7Days
            }).length === 0 && (
            <p className="text-sm text-muted-foreground py-2 text-center">
              Nenhuma conta próxima do vencimento.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Todas as Contas (Por Categoria)</h3>
        {categories.map((cat) => {
          const items = payables.filter((p) => p.category === cat)
          if (items.length === 0) return null

          return (
            <div key={cat} className="border rounded-lg bg-card overflow-hidden">
              <div
                className="bg-muted/30 p-3 flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleCategory(cat)}
              >
                <h4 className="font-semibold flex items-center gap-2">
                  {expanded[cat] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  {cat}
                </h4>
                <div className="text-sm font-bold">
                  Total Pendente:{' '}
                  {formatCurrency(
                    items.filter((i) => i.status === 'Pendente').reduce((a, c) => a + c.amount, 0),
                  )}
                </div>
              </div>
              {expanded[cat] && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.description}</TableCell>
                        <TableCell>{formatDate(p.dueDate)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={p.status === 'Pago' ? 'default' : 'secondary'}
                            className={
                              p.status === 'Pago'
                                ? 'bg-green-500 hover:bg-green-600 border-0 text-white'
                                : 'bg-orange-500/15 text-orange-600 border-0'
                            }
                          >
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(p.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {p.status === 'Pendente' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => payPayable(p.id)}
                                className="h-8 text-xs border-primary/20 text-primary hover:bg-primary/10"
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" /> Pagar
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deletePayable(p.id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )
        })}
        {payables.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
            Nenhuma conta a pagar registrada.
          </div>
        )}
      </div>
    </div>
  )
}
