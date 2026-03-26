import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import useMainStore from '@/stores/useMainStore'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, RefreshCcw, MoreVertical } from 'lucide-react'

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
    <div className="bg-[#1c1c1c] text-zinc-100 rounded-xl p-6 border border-zinc-800 shadow-xl max-w-2xl font-sans mt-2">
      <div className="flex justify-between items-start sm:items-center mb-6 flex-col sm:flex-row gap-4">
        <div>
          <p className="text-zinc-400 text-xs mb-0.5">Data de criação:</p>
          <p className="text-sm font-semibold tracking-wide">26/03/2026 14:16</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-500/20">
            Instância LITE
          </span>
          <button className="text-zinc-400 hover:text-zinc-200 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="border border-[#3d3419] bg-[#292211] rounded-xl p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="text-[#facc15] font-semibold mb-1 text-[15px]">Realize o pagamento</h4>
          <p className="text-zinc-300 text-sm">Pague R$ 19,90 para usar esta instância.</p>
        </div>
        <Button className="bg-[#22c55e] hover:bg-[#16a34a] text-zinc-950 rounded-full px-6 py-2 font-bold border-none transition-colors w-full sm:w-auto h-10">
          Assinar
        </Button>
      </div>

      <div className="bg-[#262626] rounded-xl border border-zinc-800/80 overflow-hidden mb-6">
        <div className="p-4 pb-3 border-b border-zinc-700/50">
          <label className="text-zinc-400 text-xs font-medium mb-1 block">ID da instância</label>
          <input
            value={formData.instanceId}
            onChange={(e) => setFormData({ ...formData, instanceId: e.target.value })}
            className="bg-transparent w-full text-[15px] font-medium text-zinc-100 outline-none border-none p-0 focus:ring-0"
            placeholder="Ex: LITE-XXXXXX"
          />
        </div>

        <div className="p-4 pb-3 border-b border-zinc-700/50">
          <label className="text-zinc-400 text-xs font-medium mb-1 block">Token da instância</label>
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

        <div className="p-4 pb-3">
          <label className="text-zinc-400 text-xs font-medium mb-1 block">Nome da instância</label>
          <input
            value={formData.instanceName}
            onChange={(e) => setFormData({ ...formData, instanceName: e.target.value })}
            className="bg-transparent w-full text-[15px] font-medium text-zinc-100 outline-none border-none p-0 focus:ring-0"
            placeholder="Nome interno"
          />
        </div>
      </div>

      <div className="flex justify-between sm:justify-end gap-3 items-center">
        <Button
          onClick={handleReset}
          variant="ghost"
          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 font-medium px-6 h-10 w-full sm:w-auto"
        >
          Resetar
        </Button>
        <Button
          onClick={handleSave}
          className="bg-[#eab308] hover:bg-[#ca8a04] text-zinc-950 font-bold px-8 h-10 w-full sm:w-auto rounded-lg"
        >
          Salvar
        </Button>
      </div>
    </div>
  )
}
