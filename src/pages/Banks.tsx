import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useMainStore from '@/stores/useMainStore'
import { Building2, Plus, ArrowRightLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/formatters'

export default function Banks() {
  const { banks } = useMainStore()
  const totalBalance = banks.reduce((acc, b) => acc + b.balance, 0)

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bancos e Contas</h2>
          <p className="text-muted-foreground text-sm">Gerencie seus saldos e carteiras.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Nova Conta
        </Button>
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
            <Button variant="secondary" className="mt-4 sm:mt-0 gap-2">
              <ArrowRightLeft className="h-4 w-4" /> Transferência
            </Button>
          </CardContent>
        </Card>

        {banks.map((bank) => (
          <Card
            key={bank.id}
            className="border-none shadow-sm hover:shadow-md transition-all group"
          >
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-secondary/10 rounded-lg text-secondary group-hover:scale-110 transition-transform">
                  <Building2 className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{bank.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mt-2">{formatCurrency(bank.balance)}</div>
              <p className="text-xs text-muted-foreground mt-1 cursor-pointer hover:text-primary">
                Ver extrato
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
