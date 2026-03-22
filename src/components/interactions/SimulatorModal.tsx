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
import { Play } from 'lucide-react'
import useMainStore from '@/stores/useMainStore'
import { useToast } from '@/hooks/use-toast'

export function SimulatorModal() {
  const { simulateWebhookMessage } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState('5551999999991')
  const [message, setMessage] = useState('Segue o comprovante do pagamento.')
  const [hasMedia, setHasMedia] = useState(true)

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault()
    simulateWebhookMessage(phone, message, hasMedia)
    toast({
      title: 'Webhook Simulado',
      description: 'Mensagem recebida e processada pelo Agente de IA e Pipeline Financeiro.',
    })
    setOpen(false)
  }

  const loadScenario = (scenario: 'comprovante' | 'duvida' | 'humano') => {
    if (scenario === 'comprovante') {
      setPhone('5551999999991') // Known client
      setMessage('Segue o pix do vencimento de hoje')
      setHasMedia(true)
    } else if (scenario === 'duvida') {
      setPhone('5551999999992') // Known client
      setMessage('Quantos dias faltam para o meu vencimento?')
      setHasMedia(false)
    } else if (scenario === 'humano') {
      setPhone('5511988887777') // Unknown client
      setMessage('Quero falar com um atendente agora')
      setHasMedia(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/50 hover:bg-primary/10">
          <Play className="h-4 w-4 text-primary" /> Testar Webhook IA
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simulador de Payload WhatsApp</DialogTitle>
          <DialogDescription>
            Simule o recebimento de um evento da Meta API (POST) para testar a IA e a automação do
            sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 pb-2 border-b">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadScenario('comprovante')}
            className="text-xs"
          >
            Cenário: Comprovante
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadScenario('duvida')}
            className="text-xs"
          >
            Cenário: Dúvida
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadScenario('humano')}
            className="text-xs"
          >
            Cenário: Atendimento Humano
          </Button>
        </div>

        <form onSubmit={handleSimulate} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Telefone de Origem (Cliente)</Label>
            <Input required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Mensagem de Texto</Label>
            <Input required value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={hasMedia} onCheckedChange={setHasMedia} id="media-mode" />
            <Label htmlFor="media-mode" className="cursor-pointer">
              Simular anexo de mídia na requisição (imagem/pdf)
            </Label>
          </div>
          <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md mt-4 space-y-2">
            <p>
              <strong>Como funciona:</strong> Este formulário simula um POST recebido da Meta API no
              endpoint <code>/api/webhook</code>.
            </p>
            <p>
              O sistema monitora mensagens recebidas no número oficial configurado (
              <strong>5551996111046</strong>). A IA tentará identificar o cliente remetente, extrair
              os dados e, se for comprovante, vincular a transação ao módulo Financeiro.
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
