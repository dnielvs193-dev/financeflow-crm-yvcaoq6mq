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
      description: 'Mensagem recebida e processada pelo Agente de IA.',
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
        <Button variant="outline" className="gap-2">
          <Play className="h-4 w-4" /> Testar Webhook IA
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simulador de Payload WhatsApp</DialogTitle>
          <DialogDescription>
            Simule o recebimento de uma mensagem para ver como a IA classifica a intenção e executa
            regras de negócio.
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
            <Label>Telefone de Origem (Ex: 5551999999991)</Label>
            <Input required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Mensagem de Texto</Label>
            <Input required value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={hasMedia} onCheckedChange={setHasMedia} id="media-mode" />
            <Label htmlFor="media-mode" className="cursor-pointer">
              Incluir anexo de mídia (imagem/pdf)
            </Label>
          </div>
          <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md mt-4">
            <strong>Como funciona:</strong> A IA tentará identificar o cliente pelo número. Se a
            intenção for envio de comprovante e for um cliente conhecido, gerará um <em>Receipt</em>{' '}
            para validação (se o comprovante for válido e houver estoque). Se não encontrar o
            cliente ou for uma dúvida complexa, a intenção será encaminhada para humano. Logs de
            auditoria serão gerados.
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" className="gap-2">
              Disparar Webhook
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
