import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useMainStore from '@/stores/useMainStore'
import { Building2, Star, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/formatters'
import { TransferModal } from '@/components/finance/TransferModal'
import { BankFormModal } from '@/components/finance/BankFormModal'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function Banks() {
  const { banks, activePayables, setActivePayables, deleteBank } = useMainStore()
  const { toast } = useToast()

  const totalBalance = banks.reduce((acc, b) => acc + b.balance, 0)

  const getBankTypeColor = (type: string) => {
    switch (type) {
      case 'Custo':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
      case 'Disponível':
        return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'Contas':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const handleDelete = (id: string) => {
    deleteBank(id)
    toast({ title: 'Conta removida' })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bancos e Contas</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie seus saldos, contas padrão e regras de distribuição automática.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-card px-4 py-2 rounded-lg border shadow-sm w-full md:w-auto">
          <div className="flex flex-col">
            <Label htmlFor="payables-mode" className="font-semibold text-sm cursor-pointer">
              Contas a Pagar Ativas
            </Label>
            <span className="text-[10px] text-muted-foreground max-w-[180px]">
              Desvia o lucro para a conta "Contas" em vez de "Disponível".
            </span>
          </div>
          <Switch id="payables-mode" checked={activePayables} onCheckedChange={setActivePayables} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary text-primary-foreground border-none shadow-md col-span-full md:col-span-2 lg:col-span-3 mb-2">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium mb-1">
                Saldo Total Consolidado
              </p>
              <h3 className="text-4xl font-bold">{formatCurrency(totalBalance)}</h3>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-2">
              <TransferModal />
              <BankFormModal />
            </div>
          </CardContent>
        </Card>

        {banks.map((bank) => (
          <Card
            key={bank.id}
            className={`border-l-4 shadow-sm hover:shadow-md transition-all group ${bank.isDefault ? 'border-l-primary' : 'border-l-transparent border'}`}
          >
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-base flex items-center gap-1">
                    {bank.name}
                    {bank.isDefault && (
                      <Star
                        className="h-3 w-3 text-yellow-500 fill-yellow-500"
                        title="Conta Padrão"
                      />
                    )}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-[10px] w-fit mt-1 ${getBankTypeColor(bank.type)}`}
                  >
                    {bank.type}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <BankFormModal bank={bank} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(bank.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-2">{formatCurrency(bank.balance)}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
