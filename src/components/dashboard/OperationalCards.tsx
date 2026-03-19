import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/formatters'
import useMainStore from '@/stores/useMainStore'
import { Building2, PlusCircle, AlertCircle } from 'lucide-react'

export function OperationalCards() {
  const { banks, transactions } = useMainStore()

  const dailyGoal = 1000
  const currentDaily = (transactions || [])
    .filter(
      (t) =>
        new Date(t.date).toDateString() === new Date().toDateString() &&
        ['Renovação de Cliente', 'Venda para Revenda'].includes(t.type),
    )
    .reduce((a, c) => a + c.entry, 0)

  const outrasEntradasTotal = (transactions || [])
    .filter((t) => t.type === 'Outras Entradas')
    .reduce((a, c) => a + c.entry, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Meta Comercial Diária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(currentDaily)}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              / {formatCurrency(dailyGoal)}
            </span>
          </div>
          <Progress value={(currentDaily / dailyGoal) * 100} className="mt-4 h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round((currentDaily / dailyGoal) * 100)}% concluído hoje
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saldos Bancários (Auditado)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {banks.map((bank) => (
            <div key={bank.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-secondary/10 rounded text-secondary">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm">{bank.name}</span>
              </div>
              <span className="font-bold text-sm">{formatCurrency(bank.balance)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Contas a Pagar / Vencer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm border-b pb-2">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" /> Fornecedores
            </span>
            <span className="font-bold text-destructive">{formatCurrency(1250.0)}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b pb-2">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" /> Infraestrutura
            </span>
            <span className="font-bold text-destructive">{formatCurrency(450.0)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Próx. vencimento: Amanhã</span>
            <span className="font-medium text-foreground text-sm">Total: R$ 1.700,00</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Indicador Gerencial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div>
              <p className="text-sm font-medium flex items-center gap-1">
                <PlusCircle className="h-3.5 w-3.5 text-primary" /> Outras Entradas
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Sem impacto comercial</p>
            </div>
            <span className="font-bold text-lg text-primary">
              {formatCurrency(outrasEntradasTotal)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
