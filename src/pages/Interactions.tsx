import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { InteractionList } from '@/components/interactions/InteractionList'
import { SimulatorModal } from '@/components/interactions/SimulatorModal'
import { Bot, MessageSquare, Wifi, Link } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { Skeleton } from '@/components/ui/skeleton'

export default function Interactions() {
  const [interactions, setInteractions] = useState<any[]>([])
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const items = await pb.collection('interactions').getFullList({
        sort: '-created',
        expand: 'client',
      })
      setInteractions(items)

      const setts = await pb.collection('app_settings').getFullList()
      if (setts.length > 0) setSettings(setts[0])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('interactions', () => loadData())
  useRealtime('app_settings', () => loadData())

  const isLive = settings?.wapi_active

  const inboundCount = interactions.filter((i) => i.direction === 'inbound').length
  const outboundCount = interactions.filter((i) => i.direction === 'outbound').length

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Atendimento Inteligente</h2>
            {isLive ? (
              <Badge className="bg-green-500 hover:bg-green-600 text-white gap-1 px-2 py-0.5 shadow-sm">
                <Wifi className="h-3 w-3 animate-pulse" /> Conectado (W-API)
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1 px-2 py-0.5 shadow-sm">
                <Link className="h-3 w-3" /> Desconectado
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Monitoramento de mensagens em tempo real integrado ao W-API via PocketBase.
          </p>
        </div>
        <SimulatorModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Mensagens</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{interactions.length}</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 text-green-600 rounded-lg">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recebidas (Inbound)</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-green-600">{inboundCount}</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-lg">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Enviadas (Outbound)</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-purple-600">{outboundCount}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <InteractionList interactions={interactions} />
      )}
    </div>
  )
}
