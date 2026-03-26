import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Play } from 'lucide-react'
import useMainStore from '@/stores/useMainStore'
import { useToast } from '@/hooks/use-toast'

export function SimulatorModal() {
  const { simulateWebhookMessage } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState('5551999999991')
  const [message, setMessage] = useState('Boa tarde')
  const [hasMedia, setHasMedia] = useState(false)
  const [source, setSource] = useState<'Meta' | 'Evolution'>('Evolution')

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault()
    simulateWebhookMessage(phone, message, hasMedia, source)
    toast({
      title: `Webhook Simulado (${source})`,
      description: 'Mensagem recebida e processada pelo Agente de IA.',
    })
    setOpen(false)
  }

  const loadScenario = (
    scenario: 'comprovante' | 'duvida' | 'humano' | 'suporte' | 'dados' | 'vendas' | 'saudacao',
  ) => {
    if (scenario === 'comprovante') {
      setPhone('5551999999991') // Known client
      setMessage('Segue o pix do vencimento de hoje')
      setHasMedia(true)
    } else if (scenario === 'duvida') {
      setPhone('5551999999992') // Known client
      setMessage('Quando vence meu plano?')
      setHasMedia(false)
    } else if (scenario === 'humano') {
      setPhone('5511988887777') // Unknown client
      setMessage('Quero falar com um atendente agora')
      setHasMedia(false)
    } else if (scenario === 'suporte') {
      setPhone('5551999999991') // Known client
      setMessage('Minha internet tá lenta e os canais tão travando')
      setHasMedia(false)
    } else if (scenario === 'dados') {
      setPhone('5551999999992') // Known client
      setMessage('Qual meu usuário e senha?')
      setHasMedia(false)
    } else if (scenario === 'vendas') {
      setPhone('5511988887777') // Unknown client
      setMessage('Quero comprar, qual o preço e o pix?')
      setHasMedia(false)
    } else if (scenario === 'saudacao') {
      setPhone('5551999999991') // Known client
      setMessage('Boa tarde')
      setHasMedia(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/50 hover:bg-primary/10">
          <Play className="h-4 w-4 text-primary" /> Testar IA do Webhook
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simulador de Mensagens via API</DialogTitle>
          <DialogDescription>
            Simule o recebimento de mensagens do WhatsApp para testar a IA de atendimento, OCR e
            automações do plano Diamante.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 pb-2 border-b overflow-x-auto hide-scrollbar">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadScenario('saudacao')}
            className="text-xs whitespace-nowrap"
          >
            Saudação
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadScenario('comprovante')}
            className="text-xs whitespace-nowrap"
          >
            Comprovante (OCR)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadScenario('suporte')}
            className="text-xs whitespace-nowrap"
          >
            Suporte (Travamento)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadScenario('duvida')}
            className="text-xs whitespace-nowrap"
          >
            Data Vencimento
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadScenario('dados')}
            className="text-xs whitespace-nowrap"
          >
            Dados de Acesso
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadScenario('vendas')}
            className="text-xs whitespace-nowrap"
          >
            Vendas / PIX
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadScenario('humano')}
            className="text-xs whitespace-nowrap"
          >
            Chamar Humano
          </Button>
        </div>

        <form onSubmit={handleSimulate} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Telefone (Remetente)</Label>
              <Input required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Origem (Integração)</Label>
              <Select value={source} onValueChange={(v: 'Meta' | 'Evolution') => setSource(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Evolution">Evolution API (QR Code)</SelectItem>
                  <SelectItem value="Meta">Meta Cloud API (Oficial)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Mensagem de Texto</Label>
            <Input required value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={hasMedia} onCheckedChange={setHasMedia} id="media-mode" />
            <Label htmlFor="media-mode" className="cursor-pointer">
              Simular anexo de mídia (Comprovante/Imagem)
            </Label>
          </div>
          <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md mt-4 space-y-2">
            <p>
              <strong>Como testar:</strong> Selecione um cenário ou digite livremente. O bot
              reconhece palavras-chave, dados do cliente e regras extras da página Configurações.
            </p>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" className="gap-2 bg-primary text-primary-foreground">
              Disparar Webhook
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
