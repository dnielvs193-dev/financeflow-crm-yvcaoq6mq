import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, RefreshCcw, MoreVertical, Copy, ShieldAlert, Loader2 } from 'lucide-react'
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
      toast({
        title: 'Configuração não encontrada ou erro de conexão',
        description:
          e.status === 404
            ? 'Nenhum registro encontrado. Inicialize manualmente.'
            : getErrorMessage(e),
        variant: 'destructive',
      })
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
      <div className="p-8 mt-2 text-center border rounded-lg bg-red-500/10 border-red-500/30 w-full max-w-2xl flex flex-col items-center justify-center gap-2">
        <ShieldAlert className="h-10 w-10 text-red-500 mb-2" />
        <h3 className="text-lg font-semibold text-red-600">Acesso Restrito</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Sua sessão expirou ou você não possui permissão para acessar estas configurações. Por
          favor, faça login novamente.
        </p>
      </div>
    )
  }

  const handleToggle = async (checked: boolean) => {
    if (!settings?.id) {
      toast({ title: 'Configuração não encontrada ou erro de conexão', variant: 'destructive' })
      return
    }

    try {
      setIsSaving(true)
      const updated = await pb.collection('app_settings').update(settings.id, {
        wapi_active: checked,
      })
      setSettings(updated)
      toast({ title: checked ? 'Conexão W-API Ativada' : 'Conexão W-API Desativada' })
    } catch (err: any) {
      toast({
        title: 'Erro ao alterar status',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInitialize = async () => {
    try {
      setIsSaving(true)
      const newRecord = await pb.collection('app_settings').create({
        wapi_active: false,
        api_key: generateApiKey(),
        webhook_secret: '',
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

  const handleSave = async () => {
    if (!tempData.api_key) {
      toast({ title: 'A API Key é obrigatória.', variant: 'destructive' })
      return
    }

    if (!settings?.id) {
      toast({ title: 'Configuração não encontrada ou erro de conexão', variant: 'destructive' })
      return
    }

    try {
      setIsSaving(true)
      const updated = await pb.collection('app_settings').update(settings.id, {
        api_key: tempData.api_key,
        webhook_secret: tempData.webhook_secret || '',
      })
      setSettings(updated)
      setTempData({
        api_key: updated.api_key || '',
        webhook_secret: updated.webhook_secret || '',
      })
      toast({ title: 'Configurações W-API salvas com sucesso!' })
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar',
        description: getErrorMessage(err),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRefresh = () => {
    setTempData({
      ...tempData,
      api_key: generateApiKey(),
    })
    toast({
      title: 'Nova API Key gerada temporariamente.',
      description: 'Clique em Salvar para manter as alterações.',
    })
  }

  const isActive = settings?.wapi_active || false
  const webhookUrl = 'https://financeflow-crm-da222.goskip.app/backend/v1/webhook/w-api'
  const isFormDisabled = isLoading || isSaving || !settings?.id

  return (
    <div className="bg-[#1c1c1c] text-zinc-100 rounded-xl p-6 border border-zinc-800 shadow-xl w-full max-w-2xl font-sans mt-2 relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-[#1c1c1c]/50 flex items-center justify-center rounded-xl backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <div className="flex justify-between items-start sm:items-center mb-6 flex-col sm:flex-row gap-4">
        <div>
          <p className="text-zinc-400 text-xs mb-0.5">Status da Ponte:</p>
          <p className="text-sm font-semibold tracking-wide flex items-center gap-2">
            {isActive ? (
              <span className="text-green-500">Conectado</span>
            ) : (
              <span className="text-zinc-500">Desconectado</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#facc15] bg-[#3a2f14] px-3 py-1 rounded-full text-xs font-semibold border border-yellow-500/10 tracking-wide">
            Instância Diamond
          </span>
          <button
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
            disabled={isLoading || isSaving}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="border border-green-500/30 bg-green-500/10 rounded-xl p-4 mb-6 flex justify-between items-center">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <h4 className="text-zinc-100 font-medium text-[15px]">
            Habilitar <span className="font-bold">Recebimento</span>
          </h4>
          <div className="h-4 w-px bg-green-500/30 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <Switch
              id="wapi-connection-toggle"
              checked={isActive}
              onCheckedChange={handleToggle}
              disabled={isFormDisabled}
              className="data-[state=checked]:bg-green-500"
            />
            <Label
              htmlFor="wapi-connection-toggle"
              className={cn(
                'text-xs font-semibold uppercase tracking-wider cursor-pointer',
                isActive ? 'text-green-400' : 'text-zinc-400',
                isFormDisabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              Conexão W-API
            </Label>
          </div>
        </div>
      </div>

      <div className="bg-[#262626] rounded-xl border border-zinc-800/80 overflow-hidden mb-6">
        <div className="p-4 pb-3 border-b border-zinc-700/50">
          <label className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1 block">
            API Key (Requerida)
          </label>
          <div className="relative flex items-center">
            <input
              type={showToken ? 'text' : 'password'}
              value={tempData.api_key}
              onChange={(e) => setTempData({ ...tempData, api_key: e.target.value })}
              disabled={isFormDisabled}
              className="bg-transparent w-full text-[15px] font-medium text-zinc-100 outline-none border-none p-0 pr-20 focus:ring-0 tracking-wider disabled:opacity-50"
              placeholder="Ex: 75xqmYu..."
            />
            <div className="absolute right-0 flex items-center gap-4 text-zinc-400">
              <button
                onClick={() => setShowToken(!showToken)}
                type="button"
                disabled={isFormDisabled}
                className="hover:text-zinc-200 transition-colors disabled:opacity-50"
                title={showToken ? 'Ocultar' : 'Mostrar'}
              >
                {showToken ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isFormDisabled}
                className="hover:text-zinc-200 transition-colors disabled:opacity-50"
                title="Gerar novo token"
              >
                <RefreshCcw className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 pb-3 border-b border-zinc-700/50">
          <label className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1 block">
            Webhook Secret (Opcional)
          </label>
          <input
            value={tempData.webhook_secret}
            onChange={(e) => setTempData({ ...tempData, webhook_secret: e.target.value })}
            disabled={isFormDisabled}
            className="bg-transparent w-full text-[15px] font-medium text-zinc-100 outline-none border-none p-0 focus:ring-0 disabled:opacity-50"
            placeholder="Assinatura secreta para validar payload"
          />
        </div>

        <div className="p-4 pb-3 bg-[#1e1e1e]">
          <label className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1 block">
            Webhook Endpoint URL (Recebimento)
          </label>
          <div className="flex gap-2 mt-1.5">
            <input
              readOnly
              value={webhookUrl}
              className="bg-[#262626] w-full text-[13px] font-mono text-zinc-300 outline-none border border-zinc-700/50 rounded px-3 py-2 focus:ring-0"
            />
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl)
                toast({ title: 'URL do Webhook copiada!' })
              }}
              disabled={isLoading || isSaving}
              title="Copiar URL"
              className="h-[38px] bg-[#262626] text-zinc-300 border-zinc-700 hover:bg-[#333333] hover:text-zinc-100 px-3"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Configure esta URL no painel da W-API para receber os eventos via POST.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-4">
        <div className="flex items-center gap-3"></div>
        <div className="flex gap-3 w-full sm:w-auto">
          {!settings?.id && !isLoading ? (
            <Button
              onClick={handleInitialize}
              disabled={isSaving}
              variant="outline"
              className="bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700 hover:text-white rounded-lg px-5 h-10 font-bold transition-colors w-full sm:w-auto"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Inicializar
            </Button>
          ) : null}
          <Button
            onClick={handleSave}
            disabled={isFormDisabled}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg px-5 h-10 font-bold border-none transition-colors w-full sm:w-auto"
          >
            {isSaving && settings?.id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )
}
