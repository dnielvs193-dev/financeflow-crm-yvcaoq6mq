import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, RefreshCcw, Copy, ShieldAlert, Loader2, Plug, Unplug } from 'lucide-react'
import { cn } from '@/lib/utils'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export function WApiTab() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<any>(null)
  const [showToken, setShowToken] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [tempData, setTempData] = useState({ api_key: '', webhook_secret: '' })

  const generateApiKey = () =>
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const record = await pb.collection('app_settings').getFirstListItem('')
      setSettings(record)
      setTempData({
        api_key: record.api_key || '',
        webhook_secret: record.webhook_secret || '',
      })
    } catch (e: any) {
      setSettings(null)
      if (e.status !== 404) {
        toast({
          title: 'Erro ao carregar configurações',
          description: getErrorMessage(e),
          variant: 'destructive',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (pb.authStore.isValid) {
      loadSettings()
    } else {
      setIsLoading(false)
    }
  }, [])

  useRealtime('app_settings', (e) => {
    if (pb.authStore.isValid) {
      if (e.action === 'update' || e.action === 'create') {
        setSettings(e.record)
        setTempData({
          api_key: e.record.api_key || '',
          webhook_secret: e.record.webhook_secret || '',
        })
      }
    }
  })

  if (!pb.authStore.isValid) {
    return (
      <div className="p-8 mt-2 text-center border rounded-lg bg-red-500/10 border-red-500/30 w-full flex flex-col items-center justify-center gap-2">
        <ShieldAlert className="h-10 w-10 text-red-500 mb-2" />
        <h3 className="text-lg font-semibold text-red-600">Acesso Restrito</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Sua sessão expirou ou você não possui permissão para acessar estas configurações. Por
          favor, faça login novamente.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card className="mt-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  const handleInitialize = async () => {
    try {
      setIsSaving(true)
      const newRecord = await pb.collection('app_settings').create({
        wapi_active: false,
        api_key: generateApiKey(),
        webhook_secret: generateApiKey(),
      })
      setSettings(newRecord)
      setTempData({
        api_key: newRecord.api_key || '',
        webhook_secret: newRecord.webhook_secret || '',
      })
      toast({ title: 'Configuração W-API inicializada com sucesso!' })
    } catch (err: any) {
      toast({
        title: 'Erro ao inicializar',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleConnect = async () => {
    if (!tempData.api_key) {
      toast({ title: 'A API Key é obrigatória.', variant: 'destructive' })
      return
    }

    if (!settings?.id) return

    try {
      setIsSaving(true)
      const updated = await pb.collection('app_settings').update(settings.id, {
        api_key: tempData.api_key,
        wapi_active: true,
      })
      setSettings(updated)
      setTempData((prev) => ({
        ...prev,
        api_key: updated.api_key || '',
      }))
      toast({ title: 'Conectado à W-API com sucesso!' })
    } catch (err: any) {
      toast({
        title: 'Erro ao conectar',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDisconnect = async () => {
    if (!settings?.id) return

    try {
      setIsSaving(true)
      const updated = await pb.collection('app_settings').update(settings.id, {
        wapi_active: false,
      })
      setSettings(updated)
      toast({ title: 'Desconectado da W-API.' })
    } catch (err: any) {
      toast({
        title: 'Erro ao desconectar',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRefreshKey = () => {
    setTempData({
      ...tempData,
      api_key: generateApiKey(),
    })
    toast({
      title: 'Nova API Key gerada temporariamente.',
      description: 'Clique em Conectar para aplicar e salvar as alterações.',
    })
  }

  const isActive = settings?.wapi_active || false
  const webhookUrl = 'https://financeflow-crm-da222.goskip.app/backend/v1/webhook/w-api'
  const isFormDisabled = isSaving || !settings?.id || isActive

  return (
    <Card className="mt-2">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>W-API (WhatsApp API)</CardTitle>
            <CardDescription>
              Configure sua conexão direta com instâncias da W-API para envio e recebimento de
              mensagens.
            </CardDescription>
          </div>
          <Badge
            className={cn(
              'whitespace-nowrap font-medium px-3 py-1',
              isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600',
            )}
          >
            {isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!settings?.id ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg border-dashed bg-muted/30">
            <Plug className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Conexão Não Inicializada</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              O sistema não encontrou o registro de configurações da W-API. Clique abaixo para gerar
              as credenciais iniciais.
            </p>
            <Button onClick={handleInitialize} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Inicializar Configurações
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label>API Key (Requerida)</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showToken ? 'text' : 'password'}
                    value={tempData.api_key}
                    onChange={(e) => setTempData({ ...tempData, api_key: e.target.value })}
                    disabled={isFormDisabled}
                    placeholder="Sua API Key..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowToken(!showToken)}
                    disabled={isFormDisabled}
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRefreshKey}
                  disabled={isFormDisabled}
                  title="Gerar nova chave"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Webhook Secret (Validação de Payload)</Label>
              <div className="flex items-center gap-2">
                <Input readOnly value={tempData.webhook_secret} className="bg-muted font-mono" />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(tempData.webhook_secret)
                    toast({ title: 'Webhook Secret copiado!' })
                  }}
                  title="Copiar Secret"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Label className="text-muted-foreground mb-2 block">
                Webhook Endpoint URL (Recebimento)
              </Label>
              <div className="flex gap-2">
                <Input readOnly value={webhookUrl} className="bg-muted font-mono text-sm" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(webhookUrl)
                    toast({ title: 'URL do Webhook copiada!' })
                  }}
                  title="Copiar URL"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Configure esta URL no painel da W-API para receber os eventos via POST.
              </p>
            </div>

            <div className="pt-4 flex justify-end border-t border-border">
              {isActive ? (
                <Button
                  variant="destructive"
                  onClick={handleDisconnect}
                  disabled={isSaving}
                  className="gap-2 w-full sm:w-auto"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Unplug className="h-4 w-4" />
                  )}
                  Desconectar
                </Button>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={isSaving || !tempData.api_key}
                  className="gap-2 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plug className="h-4 w-4" />
                  )}
                  Conectar
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
