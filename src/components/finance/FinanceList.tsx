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
  const { banks, processTransaction, inventory, tiers } = useMainStore()
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
      <Table className="min-w-[1100px]">
        <TableHeader>
          <TableRow>
            <TableHead>Data / Tipo</TableHead>
            <TableHead>Descrição / Obs</TableHead>
            <TableHead>Item / Serviço / Faixa</TableHead>
            <TableHead>Banco(s)</TableHead>
            <TableHead className="text-right">Finanças</TableHead>
            <TableHead className="text-right w-[80px]">Audit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => {
            const isReversible =
              t.type !== 'Estorno Financeiro' &&
              !t.isReversal &&
              !transactions.some((rt) => revCheck(rt, t.id))
            const item = t.itemId ? inventory.find((i) => i.id === t.itemId) : null
            const tier = t.tierRef ? tiers.find((ti) => ti.id === t.tierRef) : null

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
                  {t.obs && <div className="text-xs text-muted-foreground mt-0.5">{t.obs}</div>}
                </TableCell>
                <TableCell>
                  {(t.service || item) && (
                    <div className="font-medium text-sm">
                      {t.service || item?.name} {t.qty ? `(x${t.qty})` : ''}
                    </div>
                  )}
                  {tier && (
                    <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                      Ref: Tier {tier.startQty}-{tier.endQty || '∞'}
                    </div>
                  )}
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
                    {t.profitPercentage !== undefined && t.profitPercentage > 0 && (
                      <div className="text-[10px] bg-primary/10 text-primary px-1.5 rounded font-medium w-fit mt-0.5">
                        {t.profitPercentage.toFixed(0)}% mg
                      </div>
                    )}
                  </div>
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
                            <RotateCcw className="h-5 w-5" /> Confirmar reversão
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-foreground pt-2">
                            O estorno desfará os impactos desta transação nos saldos e estoque,
                            criando um registro de compensação cruzado. <br />
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
                            Confirmar Estorno
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Nenhum lançamento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function revCheck(rt: Transaction, id: string) {
  return rt.type === 'Estorno Financeiro' && rt.originalTxId === id
}
