import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, RefreshCcw, Copy, ShieldAlert, Loader2, Plug, Unplug, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { getErrorMessage } from '@/lib/pocketbase/errors'

export function WApiTab() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<any>(null)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [instanceIdInput, setInstanceIdInput] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const generateApiKey = () =>
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const records = await pb.collection('app_settings').getFullList()
      const record = records.length > 0 ? records[0] : null

      if (record) {
        setSettings(record)
        setApiKeyInput(record.api_key || '')
        setInstanceIdInput(record.instance_id || '')
      } else {
        setSettings(null)
        setApiKeyInput('')
        setInstanceIdInput('')
      }
    } catch (e: any) {
      setSettings(null)
      toast({
        title: 'Erro ao carregar configurações',
        description: getErrorMessage(e),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (pb.authStore.isValid) loadSettings()
    else setIsLoading(false)
  }, [])

  useRealtime('app_settings', (e) => {
    if (pb.authStore.isValid && (e.action === 'update' || e.action === 'create')) {
      setSettings(e.record)
      setApiKeyInput(e.record.api_key || '')
      setInstanceIdInput(e.record.instance_id || '')
    }
  })

  if (!pb.authStore.isValid) {
    return (
      <div className="p-8 mt-2 text-center border rounded-lg bg-red-500/10 border-red-500/30 w-full flex flex-col items-center justify-center gap-2">
        <ShieldAlert className="h-10 w-10 text-red-500 mb-2" />
        <h3 className="text-lg font-semibold text-red-600">Acesso Restrito</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Sua sessão expirou ou você não possui permissão para acessar estas configurações.
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

  const handleConnect = async () => {
    if (!apiKeyInput.trim() || !instanceIdInput.trim()) {
      toast({ title: 'Preencha todos os campos requeridos.', variant: 'destructive' })
      return
    }

    try {
      setIsSaving(true)
      const data = {
        api_key: apiKeyInput.trim(),
        instance_id: instanceIdInput.trim(),
        wapi_active: true,
      }

      let updated
      if (settings?.id) {
        updated = await pb.collection('app_settings').update(settings.id, data)
      } else {
        updated = await pb.collection('app_settings').create({
          ...data,
          webhook_secret: generateApiKey(),
        })
      }

      setSettings(updated)
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

  const isActive = settings?.wapi_active || false
  const isFormDisabled = isSaving || isActive
  const webhookUrl = 'https://financeflow-crm-da222.goskip.app/backend/v1/webhook/w-api'

  return (
    <Card className="mt-2">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>W-API (WhatsApp API)</CardTitle>
            <CardDescription>
              Configure sua conexão direta com instâncias da W-API para envio e recebimento de
              mensagens de forma inteligente.
            </CardDescription>
          </div>
          <Badge
            className={cn(
              'whitespace-nowrap font-medium px-3 py-1',
              isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600',
            )}
          >
            Status: {isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Instance ID (Requerido)</Label>
            <Input
              type="text"
              value={instanceIdInput}
              onChange={(e) => setInstanceIdInput(e.target.value)}
              disabled={isFormDisabled}
              placeholder="Ex: LITE-D8WI1J-39WIQX"
            />
          </div>

          <div className="space-y-2">
            <Label>API Key / Token (Requerido)</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type={showToken ? 'text' : 'password'}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  disabled={isFormDisabled}
                  placeholder="Ex: ynh5eSS14M2UpoDHDO6LpYd4UBnfKHmKF"
                  className="pr-20"
                />
                <div className="absolute right-0 top-0 h-full flex items-center">
                  {!isFormDisabled && apiKeyInput && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-full px-2 hover:bg-transparent text-muted-foreground hover:text-destructive"
                      onClick={async () => {
                        setApiKeyInput('')
                        if (settings?.id) {
                          try {
                            setIsSaving(true)
                            const updated = await pb
                              .collection('app_settings')
                              .update(settings.id, { api_key: '' })
                            setSettings(updated)
                            toast({ title: 'API Key removida do registro.' })
                          } catch (err: any) {
                            toast({
                              title: 'Erro ao limpar API Key',
                              description: getErrorMessage(err),
                              variant: 'destructive',
                            })
                          } finally {
                            setIsSaving(false)
                          }
                        }
                      }}
                      title="Limpar Token"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-full px-3 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowToken(!showToken)}
                    title={showToken ? 'Ocultar' : 'Mostrar'}
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-border">
          <Label>Webhook Secret (Validação de Payload)</Label>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={settings?.webhook_secret || 'Será gerado ao conectar'}
              className={cn(
                'bg-muted font-mono',
                !settings?.webhook_secret && 'text-muted-foreground',
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!settings?.id || !settings?.webhook_secret}
              onClick={() => {
                navigator.clipboard.writeText(settings?.webhook_secret || '')
                toast({ title: 'Webhook Secret copiado!' })
              }}
              title="Copiar Secret"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={!settings?.id}
              onClick={async () => {
                if (!settings?.id) return
                const newSecret = generateApiKey()
                await pb
                  .collection('app_settings')
                  .update(settings.id, { webhook_secret: newSecret })
                toast({ title: 'Novo Webhook Secret gerado!' })
              }}
              title="Gerar novo secret"
            >
              <RefreshCcw className="h-4 w-4" />
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
            Configure esta URL no painel da W-API para receber os eventos via POST. Certifique-se de
            incluir o Webhook Secret no Header ou no corpo da requisição.
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
              disabled={isSaving || !apiKeyInput.trim() || !instanceIdInput.trim()}
              className="gap-2 w-full sm:w-auto"
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
      </CardContent>
    </Card>
  )
}
