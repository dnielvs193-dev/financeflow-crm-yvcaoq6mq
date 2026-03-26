import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Sparkles, AlertCircle } from 'lucide-react'
import useMainStore from '@/stores/useMainStore'
import { PLANS } from '@/lib/plans'
import { PlanId } from '@/types'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/formatters'

export default function Billing() {
  const { currentPlan, setPlan } = useMainStore()
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = () => {
    setIsProcessing(true)
    setTimeout(() => {
      if (selectedPlan) {
        setPlan(selectedPlan)
        toast({
          title: 'Plano atualizado!',
          description: `Você agora está no plano ${PLANS[selectedPlan].name}.`,
        })
      }
      setIsProcessing(false)
      setCheckoutOpen(false)
    }, 1500)
  }

  const openCheckout = (planId: PlanId) => {
    setSelectedPlan(planId)
    setCheckoutOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Assinaturas e Planos</h2>
        <p className="text-muted-foreground text-sm">
          Gerencie seu plano atual, limites de uso e histórico de faturas.
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20 shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Seu Plano Atual:{' '}
              <Badge className="bg-primary text-white text-sm">{PLANS[currentPlan].name}</Badge>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{PLANS[currentPlan].description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {formatCurrency(PLANS[currentPlan].price)}
              <span className="text-sm font-normal text-muted-foreground">/mês</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-4">
        {Object.values(PLANS).map((plan) => {
          const isActive = currentPlan === plan.id
          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${isActive ? 'border-primary shadow-md ring-1 ring-primary/20' : 'border-border'} ${plan.id === 'diamond' ? 'bg-gradient-to-b from-background to-slate-900/5' : ''}`}
            >
              {plan.id === 'diamond' && (
                <div className="absolute -top-3 inset-x-0 flex justify-center">
                  <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3" /> Recomendado
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2 flex items-baseline text-3xl font-extrabold">
                  {formatCurrency(plan.price)}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">/mês</span>
                </div>
                <CardDescription className="pt-2 min-h-[40px]">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2 items-start">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>
                      {plan.maxClients === Infinity
                        ? 'Clientes Ilimitados'
                        : `Até ${plan.maxClients} clientes`}
                    </span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>
                      {plan.maxResellers === Infinity
                        ? 'Revendas Ilimitadas'
                        : `Até ${plan.maxResellers} revendas`}
                    </span>
                  </li>
                  <li
                    className={`flex gap-2 items-start ${plan.features.includes('finance') ? '' : 'text-muted-foreground opacity-50'}`}
                  >
                    {plan.features.includes('finance') ? (
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    )}
                    <span>Gestão Financeira & Estoque</span>
                  </li>
                  <li
                    className={`flex gap-2 items-start ${plan.features.includes('voice') ? '' : 'text-muted-foreground opacity-50'}`}
                  >
                    {plan.features.includes('voice') ? (
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    )}
                    <span>Assistente de Voz IA</span>
                  </li>
                  <li
                    className={`flex gap-2 items-start ${plan.features.includes('evolution_api') ? '' : 'text-muted-foreground opacity-50'}`}
                  >
                    {plan.features.includes('evolution_api') ? (
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    )}
                    <span>WhatsApp AI Bot (Evolution)</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={isActive ? 'outline' : plan.id === 'diamond' ? 'default' : 'secondary'}
                  disabled={isActive}
                  onClick={() => openCheckout(plan.id)}
                >
                  {isActive ? 'Plano Atual' : 'Fazer Upgrade'}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Assinatura</DialogTitle>
            <DialogDescription>
              Você está prestes a alterar seu plano para{' '}
              <strong>{selectedPlan ? PLANS[selectedPlan].name : ''}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              No ambiente de produção, este passo o redirecionaria para o gateway de pagamento
              (Stripe/Pagar.me). Para simular a compra agora, clique em "Confirmar Pagamento".
            </p>
            <div className="w-full p-4 border rounded-lg flex justify-between items-center bg-card shadow-sm">
              <span className="font-medium">Total a pagar hoje:</span>
              <span className="font-bold text-xl">
                {selectedPlan ? formatCurrency(PLANS[selectedPlan].price) : ''}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCheckoutOpen(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button onClick={handleCheckout} disabled={isProcessing}>
              {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
