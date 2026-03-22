import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useMainStore from '@/stores/useMainStore'
import { useToast } from '@/hooks/use-toast'
import { Save, QrCode, Unplug } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EvolutionApiTab() {
  const {
    evolutionConfig,
    updateEvolutionConfig,
    evolutionStatus,
    evolutionQrCode,
    generateEvolutionQr,
    simulateEvolutionConnect,
    disconnectEvolution,
  } = useMainStore()
  const { toast } = useToast()
  const [evoData, setEvoData] = useState(evolutionConfig)

  useEffect(() => {
    setEvoData(evolutionConfig)
  }, [evolutionConfig])

  const handleSaveEvolution = () => {
    updateEvolutionConfig(evoData)
    toast({ title: 'Configurações do Evolution API salvas com sucesso!' })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Evolution API (WhatsApp Web)</CardTitle>
            <CardDescription>
              Conecte seu WhatsApp pessoal ou business escaneando o QR Code, sem custos de API
              oficial.
            </CardDescription>
          </div>
          <Badge
            className={cn(
              'whitespace-nowrap font-medium px-3 py-1',
              evolutionStatus === 'connected'
                ? 'bg-green-500 hover:bg-green-600'
                : evolutionStatus === 'connecting'
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-gray-500 hover:bg-gray-600',
            )}
          >
            {evolutionStatus === 'connected'
              ? 'Conectado'
              : evolutionStatus === 'connecting'
                ? 'Aguardando QR Code'
                : 'Desconectado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>URL da Instância</Label>
            <Input
              value={evoData.instanceUrl}
              onChange={(e) => setEvoData({ ...evoData, instanceUrl: e.target.value })}
              placeholder="Ex: https://api.meudominio.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Nome da Instância</Label>
            <Input
              value={evoData.instanceName}
              onChange={(e) => setEvoData({ ...evoData, instanceName: e.target.value })}
              placeholder="Ex: crm-financeflow"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>API Key (Autenticação)</Label>
          <Input
            type="password"
            value={evoData.apiKey}
            onChange={(e) => setEvoData({ ...evoData, apiKey: e.target.value })}
            placeholder="Sua chave de API secreta (Global ou da Instância)"
          />
        </div>

        <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-center border-t border-border gap-4">
          <div className="w-full sm:w-auto">
            {evolutionStatus === 'disconnected' && (
              <Button
                variant="outline"
                onClick={generateEvolutionQr}
                className="gap-2 w-full sm:w-auto"
              >
                <QrCode className="h-4 w-4" /> Gerar QR Code
              </Button>
            )}
            {evolutionStatus === 'connected' && (
              <Button
                variant="destructive"
                onClick={disconnectEvolution}
                className="gap-2 w-full sm:w-auto"
              >
                <Unplug className="h-4 w-4" /> Desconectar
              </Button>
            )}
          </div>
          <Button onClick={handleSaveEvolution} className="gap-2 w-full sm:w-auto bg-primary">
            <Save className="h-4 w-4" /> Salvar Configurações
          </Button>
        </div>

        {evolutionQrCode && evolutionStatus === 'connecting' && (
          <div className="mt-6 flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/30 animate-in fade-in zoom-in duration-300">
            <p className="text-sm font-medium mb-4 text-center">
              Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e escaneie o código abaixo:
            </p>
            <img
              src={evolutionQrCode}
              alt="QR Code"
              className="w-56 h-56 bg-white p-3 rounded-xl shadow-sm border"
            />
            <Button variant="secondary" className="mt-6 gap-2" onClick={simulateEvolutionConnect}>
              Simular Leitura (Teste)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
