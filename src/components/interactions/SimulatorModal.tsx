import { useState, useEffect } from 'react'
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
import { Play } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'

export function SimulatorModal() {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState('5551999999991')
  const [senderLid, setSenderLid] = useState('')
  const [message, setMessage] = useState('Boa tarde, quero pagar via PIX')
  const [secret, setSecret] = useState('')

  useEffect(() => {
    if (open) {
      pb.collection('app_settings')
        .getFullList()
        .then((res) => {
          if (res.length > 0) setSecret(res[0].webhook_secret || '')
        })
        .catch(() => {})
    }
  }, [open])

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await pb.send('/backend/v1/webhook/w-api', {
        method: 'POST',
        body: {
          phone,
          senderLid,
          text: message,
          senderName: 'Simulador Teste',
          secret: secret,
        },
      })
      if (res.ignored) {
        toast({
          title: 'Webhook Ignorado',
          description: res.reason || 'A integração W-API está desativada nas configurações.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Webhook Simulado',
          description: 'Mensagem recebida e classificada com sucesso.',
        })
        setOpen(false)
      }
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: err?.message || 'Falha ao disparar webhook. Verifique as configurações.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/50 hover:bg-primary/10">
          <Play className="h-4 w-4 text-primary" /> Simular Webhook
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disparar Webhook de Teste</DialogTitle>
          <DialogDescription>
            Simule o recebimento de mensagens enviando um payload direto para o hook de
            processamento inteligente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSimulate} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>LID (Opcional)</Label>
              <Input
                value={senderLid}
                onChange={(e) => setSenderLid(e.target.value)}
                placeholder="Ex: 5551999999991@lid"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Mensagem</Label>
            <Input required value={message} onChange={(e) => setMessage(e.target.value)} />
            <p className="text-xs text-muted-foreground">
              Dica: Digite palavras como "PIX", "ajuda", "vencimento" para ver a classificação de
              intenção do bot.
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
