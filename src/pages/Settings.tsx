import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useMainStore from '@/stores/useMainStore'
import { useToast } from '@/hooks/use-toast'
import { Save } from 'lucide-react'

export default function Settings() {
  const { templates, updateTemplates } = useMainStore()
  const { toast } = useToast()
  const [formData, setFormData] = useState(templates)

  useEffect(() => {
    setFormData(templates)
  }, [templates])

  const handleSave = () => {
    updateTemplates(formData)
    toast({ title: 'Configurações salvas com sucesso!' })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Templates de Comunicação</h2>
        <p className="text-muted-foreground text-sm">
          Personalize as mensagens padrão enviadas para os clientes via WhatsApp.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Variáveis Disponíveis</CardTitle>
          <CardDescription>
            Use estas variáveis nos textos abaixo para personalização automática:
            <br />
            <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded mr-2">
              {'{{nome}}'}
            </span>
            <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded mr-2">
              {'{{vencimento}}'}
            </span>
            <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded mr-2">
              {'{{servico}}'}
            </span>
            <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded mr-2">
              {'{{usuario}}'}
            </span>
            <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded mr-2">
              {'{{senha}}'}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base">Mensagem para Cliente Ativo</Label>
            <Textarea
              rows={3}
              value={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.value })}
              placeholder="Digite o template..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base text-red-600">Mensagem para Cliente Vencido/Devedor</Label>
            <Textarea
              rows={3}
              value={formData.expired}
              onChange={(e) => setFormData({ ...formData, expired: e.target.value })}
              placeholder="Digite o template..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base text-gray-500">Mensagem para Cliente Excluído</Label>
            <Textarea
              rows={3}
              value={formData.deleted}
              onChange={(e) => setFormData({ ...formData, deleted: e.target.value })}
              placeholder="Digite o template..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base text-blue-600">Envio de Credenciais</Label>
            <Textarea
              rows={5}
              value={formData.credentials}
              onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
              placeholder="Digite o template..."
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" /> Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
