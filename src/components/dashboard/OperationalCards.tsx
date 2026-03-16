import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/formatters'
import useMainStore from '@/stores/useMainStore'
import { Building2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function OperationalCards() {
  const { banks } = useMainStore()
  const dailyGoal = 500
  const currentDaily = 350

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Meta Diária</CardTitle>
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
            {Math.round((currentDaily / dailyGoal) * 100)}% concluído
          </p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Saldos Bancários
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

      <Card className="border-none shadow-sm md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Contas a Pagar (Semana)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Servidor Dedicado</p>
              <p className="text-xs text-muted-foreground">Vence amanhã</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-destructive">{formatCurrency(350)}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
              >
                <CheckCircle2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
