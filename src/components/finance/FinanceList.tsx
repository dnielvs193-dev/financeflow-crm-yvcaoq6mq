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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import useMainStore from '@/stores/useMainStore'
import { Transaction } from '@/types'
import { formatDate, formatCurrency } from '@/lib/formatters'
import { RotateCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FinanceList({ transactions }: { transactions: Transaction[] }) {
  const { banks, processTransaction, inventory } = useMainStore()
  const { toast } = useToast()

  const handleReversal = (id: string) => {
    processTransaction({ action: 'reverse', originalId: id })
    toast({
      title: 'Estorno realizado com sucesso.',
      description: 'Saldos e estoque foram atualizados.',
      variant: 'destructive',
    })
  }

  const getTypeColor = (type: string) => {
    if (type.includes('Renovação') || type.includes('Venda') || type === 'Outras Entradas')
      return 'bg-primary/15 text-primary'
    if (type.includes('Estorno'))
      return 'bg-destructive/15 text-destructive border-destructive/30 border'
    if (type.includes('Transferência'))
      return 'bg-secondary/15 text-secondary border-secondary/30 border'
    return 'bg-orange-500/15 text-orange-600'
  }

  return (
    <div className="rounded-md border bg-card overflow-x-auto">
      <Table className="min-w-[1000px]">
        <TableHeader>
          <TableRow>
            <TableHead>Data / Tipo</TableHead>
            <TableHead>Descrição / Item</TableHead>
            <TableHead>Banco</TableHead>
            <TableHead className="text-right">Entrada / Qtd</TableHead>
            <TableHead className="text-right">Lucro Líquido</TableHead>
            <TableHead className="text-right w-[80px]">Estorno</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => {
            const isReversible =
              t.type !== 'Estorno Financeiro' &&
              !t.isReversal &&
              !transactions.some((rt) => revCheck(rt, t.id))
            const item = t.itemId ? inventory.find((i) => i.id === t.itemId) : null

            return (
              <TableRow
                key={t.id}
                className={t.type === 'Estorno Financeiro' ? 'opacity-70 bg-destructive/5' : ''}
              >
                <TableCell>
                  <div className="font-medium text-sm whitespace-nowrap">{formatDate(t.date)}</div>
                  <Badge variant="outline" className={`mt-1 text-[10px] ${getTypeColor(t.type)}`}>
                    {t.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium max-w-[280px] truncate" title={t.description}>
                    {t.description}
                  </div>
                  {(t.service || item) && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {t.service || item?.name} {t.qty ? `(x${t.qty})` : ''}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {banks.find((b) => b.id === t.bankId)?.name}
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
                  {t.profitPercentage !== undefined && t.profitPercentage > 0 && (
                    <div className="text-[10px] text-muted-foreground font-medium">
                      {t.profitPercentage.toFixed(0)}% margem
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isReversible && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-destructive/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-destructive flex items-center gap-2">
                            <RotateCcw className="h-5 w-5" /> Confirmar reversão e envio
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-foreground pt-2">
                            O estorno desfará os impactos desta transação nos saldos e estoque.
                            Criará um registro de compensação cruzado. <br />
                            <br />
                            <strong>Esta ação é irreversível.</strong>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleReversal(t.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Confirmar e enviar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function revCheck(rt: Transaction, id: string) {
  return rt.type === 'Estorno Financeiro' && rt.originalTxId === id
}
