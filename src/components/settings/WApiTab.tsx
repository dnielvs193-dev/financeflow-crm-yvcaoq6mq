import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import useMainStore from '@/stores/useMainStore'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, RefreshCcw, MoreVertical, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WApiTab() {
  const { wApiConfig, updateWApiConfig, resetWApiConfig } = useMainStore()
  const { toast } = useToast()
  const [formData, setFormData] = useState(wApiConfig)
  const [showToken, setShowToken] = useState(false)

  useEffect(() => {
    setFormData(wApiConfig)
  }, [wApiConfig])

  const handleSave = () => {
    updateWApiConfig(formData)
    toast({ title: 'Configurações W-API salvas com sucesso!' })
  }

  const handleReset = () => {
    resetWApiConfig()
    toast({ title: 'Configurações resetadas.', variant: 'destructive' })
  }

  const handleRefresh = () => {
    setFormData({
      ...formData,
      instanceToken:
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    })
    toast({
      title: 'Novo token gerado temporariamente.',
      description: 'Clique em Salvar para manter as alterações.',
    })
  }

  return (
    <div className="bg-[#1c1c1c] text-zinc-100 rounded-xl p-6 border border-zinc-800 shadow-xl w-full max-w-2xl font-sans mt-2">
      <div className="flex justify-between items-start sm:items-center mb-6 flex-col sm:flex-row gap-4">
        <div>
          <p className="text-zinc-400 text-xs mb-0.5">Data de criação:</p>
          <p className="text-sm font-semibold tracking-wide">26/03/2026 14:16</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#facc15] bg-[#3a2f14] px-3 py-1 rounded-full text-xs font-semibold border border-yellow-500/10 tracking-wide">
            Instância LITE
          </span>
          <button className="text-zinc-400 hover:text-zinc-200 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="border border-green-500/30 bg-green-500/10 rounded-xl p-4 mb-6 flex justify-between items-center">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <h4 className="text-zinc-100 font-medium text-[15px]">
            Expira em <span className="font-bold">30 dias</span>
          </h4>
          <div className="h-4 w-px bg-green-500/30 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <Switch
              id="wapi-connection-toggle"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              className="data-[state=checked]:bg-green-500"
            />
            <Label
              htmlFor="wapi-connection-toggle"
              className={cn(
                'text-xs font-semibold uppercase tracking-wider cursor-pointer',
                formData.isActive ? 'text-green-400' : 'text-zinc-400',
              )}
            >
              Conexão W-API
            </Label>
          </div>
        </div>
        <Button className="bg-[#10b981] hover:bg-[#059669] text-white rounded-full px-6 h-9 font-semibold border-none transition-colors hidden sm:flex">
          Renovar
        </Button>
      </div>

      <div className="bg-[#262626] rounded-xl border border-zinc-800/80 overflow-hidden mb-6">
        <div className="p-4 pb-3 border-b border-zinc-700/50">
          <label className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1 block">
            ID da instância
          </label>
          <input
            value={formData.instanceId}
            onChange={(e) => setFormData({ ...formData, instanceId: e.target.value })}
            className="bg-transparent w-full text-[15px] font-medium text-zinc-100 outline-none border-none p-0 focus:ring-0"
            placeholder="Ex: LITE-XXXXXX"
          />
        </div>

        <div className="p-4 pb-3 border-b border-zinc-700/50">
          <label className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1 block">
            Token da instância
          </label>
          <div className="relative flex items-center">
            <input
              type={showToken ? 'text' : 'password'}
              value={formData.instanceToken}
              onChange={(e) => setFormData({ ...formData, instanceToken: e.target.value })}
              className="bg-transparent w-full text-[15px] font-medium text-zinc-100 outline-none border-none p-0 pr-20 focus:ring-0 tracking-wider"
              placeholder="Ex: 75xqmYu..."
            />
            <div className="absolute right-0 flex items-center gap-4 text-zinc-400">
              <button
                onClick={() => setShowToken(!showToken)}
                type="button"
                className="hover:text-zinc-200 transition-colors"
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
                className="hover:text-zinc-200 transition-colors"
                title="Gerar novo token"
              >
                <RefreshCcw className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 pb-3 border-b border-zinc-700/50">
          <label className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1 block">
            Nome da instância
          </label>
          <input
            value={formData.instanceName}
            onChange={(e) => setFormData({ ...formData, instanceName: e.target.value })}
            className="bg-transparent w-full text-[15px] font-medium text-zinc-100 outline-none border-none p-0 focus:ring-0"
            placeholder="Nome interno"
          />
        </div>

        <div className="p-4 pb-3 bg-[#1e1e1e]">
          <label className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1 block">
            Webhook Endpoint URL (Recebimento)
          </label>
          <div className="flex gap-2 mt-1.5">
            <input
              readOnly
              value="https://financeflow-crm-da222.goskip.app/api/webhook"
              className="bg-[#262626] w-full text-[13px] font-mono text-zinc-300 outline-none border border-zinc-700/50 rounded px-3 py-2 focus:ring-0"
            />
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(
                  'https://financeflow-crm-da222.goskip.app/api/webhook',
                )
                toast({ title: 'URL do Webhook copiada!' })
              }}
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

      <div className="bg-[#262626] rounded-xl border border-zinc-800/80 overflow-hidden mb-6">
        <div className="p-4 pb-3 border-b border-zinc-700/50">
          <label className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1 block">
            Chave PIX (Para Vendas)
          </label>
          <input
            value={formData.pixKey || ''}
            onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
            className="bg-transparent w-full text-[15px] font-medium text-zinc-100 outline-none border-none p-0 focus:ring-0"
            placeholder="Ex: 000.000.000-00 ou email@empresa.com"
          />
        </div>

        <div className="p-4 pb-3">
          <label className="text-zinc-400 text-[11px] uppercase tracking-wider font-semibold mb-1 block">
            Conhecimento Extra (Regras da IA)
          </label>
          <textarea
            value={formData.extraKnowledge || ''}
            onChange={(e) => setFormData({ ...formData, extraKnowledge: e.target.value })}
            className="bg-transparent w-full text-[15px] font-medium text-zinc-100 outline-none border-none p-0 focus:ring-0 min-h-[60px] resize-none"
            placeholder="Descreva regras de negócio, horários, promoções, etc."
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-[2px] rounded-full">
            <img
              src="https://img.usecurling.com/i?q=whatsapp&color=spring-green&shape=fill"
              className="w-8 h-8 rounded-full"
              alt="Profile"
            />
          </div>
          <span className="font-semibold text-[15px] tracking-wide text-zinc-200">
            555196111046
          </span>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            onClick={handleReset}
            className="bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg px-5 h-10 font-bold border-none transition-colors w-full sm:w-auto"
          >
            Desconectar
          </Button>
          <Button
            onClick={handleReset}
            className="bg-[#eab308] hover:bg-[#ca8a04] text-zinc-950 rounded-lg px-5 h-10 font-bold border-none transition-colors w-full sm:w-auto"
          >
            Resetar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg px-5 h-10 font-bold border-none transition-colors w-full sm:w-auto"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )
}
