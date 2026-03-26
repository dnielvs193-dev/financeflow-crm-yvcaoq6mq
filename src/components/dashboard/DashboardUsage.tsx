import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useMainStore from '@/stores/useMainStore'
import { PLANS } from '@/lib/plans'
import { Users, Network } from 'lucide-react'

export function DashboardUsage() {
  const { clients, resellers, currentPlan } = useMainStore()
  const plan = PLANS[currentPlan]

  const activeClients = clients.filter((c) => !c.deleted).length
  const clientsPct = plan.maxClients === Infinity ? 0 : (activeClients / plan.maxClients) * 100

  const activeResellers = resellers.length
  const resellersPct =
    plan.maxResellers === Infinity ? 0 : (activeResellers / plan.maxResellers) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-none shadow-sm bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Uso de Clientes
            </span>
            <span>
              {plan.maxClients === Infinity ? 'Ilimitado' : `${activeClients} / ${plan.maxClients}`}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {plan.maxClients !== Infinity ? (
            <Progress value={clientsPct} className="h-2" />
          ) : (
            <div className="text-sm text-muted-foreground">Você possui capacidade ilimitada.</div>
          )}
        </CardContent>
      </Card>
      <Card className="border-none shadow-sm bg-secondary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex justify-between">
            <span className="flex items-center gap-2">
              <Network className="h-4 w-4" /> Uso de Revendas
            </span>
            <span>
              {plan.maxResellers === Infinity
                ? 'Ilimitado'
                : `${activeResellers} / ${plan.maxResellers}`}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {plan.maxResellers !== Infinity ? (
            <Progress value={resellersPct} className="h-2" />
          ) : (
            <div className="text-sm text-muted-foreground">Você possui capacidade ilimitada.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
