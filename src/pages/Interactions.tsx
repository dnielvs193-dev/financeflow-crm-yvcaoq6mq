import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { InteractionList } from '@/components/interactions/InteractionList'
import { ReceiptsList } from '@/components/interactions/ReceiptsList'
import { SimulatorModal } from '@/components/interactions/SimulatorModal'
import useMainStore from '@/stores/useMainStore'
import { Bot, FileCheck, CheckCircle2, AlertCircle, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default function Interactions() {
  const [activeTab, setActiveTab] = useState<'conversations' | 'receipts'>('conversations')
  const { interactions, receipts, metaConfig, evolutionStatus, wApiConfig, currentPlan } =
    useMainStore()

  const humanReqCount = interactions.filter(
    (i) => i.status === 'aguardando_atendimento_humano',
  ).length
  const pendingReceiptsCount = receipts.filter(
    (r) => r.status === 'comprovante_recebido' || r.status === 'comprovante_em_analise',
  ).length
  const autoRenewalsCount = interactions.filter((i) => i.status === 'renovacao_executada').length

  const isLive =
    currentPlan === 'diamond' &&
    (Boolean(metaConfig.accessToken && metaConfig.phoneNumberId) ||
      evolutionStatus === 'connected' ||
      wApiConfig.isActive)

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Atendimento Inteligente</h2>
            {isLive && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white gap-1 px-2 py-0.5 animate-in fade-in zoom-in shadow-sm">
                <Wifi className="h-3 w-3 animate-pulse" /> Live (Webhooks Ativos)
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Monitoramento unificado de Webhooks (W-API / Meta / Evolution), IA de conversação e
            Validação de Comprovantes.
          </p>
        </div>
        <SimulatorModal />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Interações</p>
              <p className="text-2xl font-bold">{interactions.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-600 rounded-lg">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Atenção Humana</p>
              <p className="text-2xl font-bold text-red-600">{humanReqCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 text-orange-600 rounded-lg">
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Comp. Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{pendingReceiptsCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 text-green-600 rounded-lg">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Renovações (Sucesso)</p>
              <p className="text-2xl font-bold text-green-600">{autoRenewalsCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b border-border mb-4">
        <button
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors border-b-2',
            activeTab === 'conversations'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
          onClick={() => setActiveTab('conversations')}
        >
          Monitor de Webhooks (Conversas)
        </button>
        <button
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors border-b-2',
            activeTab === 'receipts'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
          onClick={() => setActiveTab('receipts')}
        >
          Validação de Comprovantes
        </button>
      </div>

      {activeTab === 'conversations' ? <InteractionList /> : <ReceiptsList />}
    </div>
  )
}
