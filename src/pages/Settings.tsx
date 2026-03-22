import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useMainStore from '@/stores/useMainStore'
import { useToast } from '@/hooks/use-toast'
import { Save, Copy } from 'lucide-react'

export default function Settings() {
  const { templates, updateTemplates, metaConfig, updateMetaConfig } = useMainStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState(templates)
  const [metaData, setMetaData] = useState(metaConfig)

  useEffect(() => {
    setFormData(templates)
  }, [templates])

  useEffect(() => {
    setMetaData(metaConfig)
  }, [metaConfig])

  const handleSaveTemplates = () => {
    updateTemplates(formData)
    toast({ title: 'Templates salvos com sucesso!' })
  }

  const handleSaveMeta = () => {
    updateMetaConfig(metaData)
    toast({ title: 'Configurações da API da Meta salvas!' })
  }

  const copyWebhook = () => {
    navigator.clipboard.writeText('https://financeflow-crm-da222.goskip.app/api/webhook')
    toast({ title: 'URL do Webhook copiada!' })
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground text-sm">
          Gerencie os templates de comunicação e a integração com a API Oficial do WhatsApp (Meta).
        </p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="templates">Templates Padrão</TabsTrigger>
          <TabsTrigger value="meta">Integração (Meta API)</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Variáveis Disponíveis</CardTitle>
              <CardDescription>
                Use estas variáveis nos textos abaixo para personalização automática:
                <br />
                <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded mr-2 mt-1 inline-block">
                  {'{{nome}}'}
                </span>
                <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded mr-2 mt-1 inline-block">
                  {'{{vencimento}}'}
                </span>
                <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded mr-2 mt-1 inline-block">
                  {'{{servico}}'}
                </span>
                <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded mr-2 mt-1 inline-block">
                  {'{{usuario}}'}
                </span>
                <span className="font-mono text-primary bg-primary/10 px-1 py-0.5 rounded mr-2 mt-1 inline-block">
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
                <Label className="text-base text-red-600">
                  Mensagem para Cliente Vencido/Devedor
                </Label>
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
                <Button onClick={handleSaveTemplates} className="gap-2">
                  <Save className="h-4 w-4" /> Salvar Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integração Backend: Meta Cloud API</CardTitle>
              <CardDescription>
                Configure as credenciais do seu aplicativo na plataforma Meta para receber
                interações reais do WhatsApp no número oficial (5551996111046).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Permanent Access Token</Label>
                <Input
                  type="password"
                  value={metaData.accessToken}
                  onChange={(e) => setMetaData({ ...metaData, accessToken: e.target.value })}
                  placeholder="EAA..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number ID</Label>
                  <Input
                    value={metaData.phoneNumberId}
                    onChange={(e) => setMetaData({ ...metaData, phoneNumberId: e.target.value })}
                    placeholder="Ex: 104928471928"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WABA ID (WhatsApp Business Account)</Label>
                  <Input
                    value={metaData.wabaId}
                    onChange={(e) => setMetaData({ ...metaData, wabaId: e.target.value })}
                    placeholder="Ex: 192847102938"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Verify Token (Para validação do Webhook)</Label>
                <Input
                  value={metaData.verifyToken}
                  onChange={(e) => setMetaData({ ...metaData, verifyToken: e.target.value })}
                  placeholder="Token de verificação aleatório"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <Label className="text-muted-foreground mb-2 block">
                  Webhook Endpoint URL (Gerado)
                </Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value="https://financeflow-crm-da222.goskip.app/api/webhook"
                    className="bg-muted font-mono text-sm"
                  />
                  <Button variant="outline" onClick={copyWebhook} title="Copiar URL">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Insira esta URL no painel de desenvolvedor da Meta para receber notificações em
                  tempo real. O backend processará os eventos POST automaticamente para o CRM.
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleSaveMeta}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4" /> Salvar Credenciais Seguras
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
