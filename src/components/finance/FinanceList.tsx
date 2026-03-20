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
import { Trash } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FinanceList({ transactions }: { transactions: Transaction[] }) {
  const { banks, deleteTransaction } = useMainStore()
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    deleteTransaction(id)
    toast({
      title: 'Registro apagado',
      description: 'A transação foi removida e os saldos revertidos.',
    })
  }

  const getTypeColor = (type: string) => {
    if (type.includes('Renovação') || type.includes('Venda') || type === 'Outras Entradas')
      return 'bg-primary/15 text-primary'
    if (type.includes('Transferência'))
      return 'bg-secondary/15 text-secondary border-secondary/30 border'
    return 'bg-orange-500/15 text-orange-600'
  }

  return (
    <div className="rounded-md border bg-card overflow-x-auto">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            <TableHead>Data / Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Banco(s)</TableHead>
            <TableHead className="text-right">Finanças</TableHead>
            <TableHead className="text-right w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => {
            return (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="font-medium text-sm whitespace-nowrap">{formatDate(t.date)}</div>
                  <Badge variant="outline" className={`mt-1 text-[10px] ${getTypeColor(t.type)}`}>
                    {t.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium max-w-[350px] truncate" title={t.description}>
                    {t.description} {t.service ? `(${t.service})` : ''}
                  </div>
                  {t.obs && <div className="text-xs text-muted-foreground mt-0.5">{t.obs}</div>}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs font-medium">
                  {t.splitDistribution ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-orange-600">
                        Custo ➔{' '}
                        {banks.find((b) => b.id === t.splitDistribution?.costBankId)?.name || 'N/A'}
                      </span>
                      <span className="text-green-600">
                        Lucro ➔{' '}
                        {banks.find((b) => b.id === t.splitDistribution?.profitBankId)?.name ||
                          'N/A'}
                      </span>
                    </div>
                  ) : (
                    <span>{banks.find((b) => b.id === t.bankId)?.name}</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-0.5">
                    {t.entry > 0 && (
                      <div className="text-sm font-medium">Ent: {formatCurrency(t.entry)}</div>
                    )}
                    {t.splitDistribution ? (
                      <>
                        {t.splitDistribution.costAmount > 0 && (
                          <div className="text-[10px] text-orange-600 bg-orange-500/10 px-1 rounded">
                            Custo: {formatCurrency(t.splitDistribution.costAmount)}
                          </div>
                        )}
                        <div className="text-[10px] text-green-600 bg-green-500/10 px-1 rounded">
                          Lucro: {formatCurrency(t.splitDistribution.profitAmount)}
                        </div>
                      </>
                    ) : (
                      <>
                        {t.cost > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Custo: {formatCurrency(t.cost)}
                          </div>
                        )}
                        {(t.entry > 0 || t.cost > 0) && (
                          <div
                            className={`text-sm font-bold ${t.profit >= 0 ? 'text-primary' : 'text-destructive'}`}
                          >
                            {t.profit > 0 ? '+' : ''}
                            {formatCurrency(t.profit)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-destructive/30">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive flex items-center gap-2">
                          <Trash className="h-5 w-5" /> Excluir Lançamento
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Deseja excluir permanentemente este registro? <br />
                          Os saldos bancários e o estoque (se aplicável) serão revertidos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(t.id)}
                          className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )
          })}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Nenhum lançamento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
