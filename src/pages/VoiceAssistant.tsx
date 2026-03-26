import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, Volume2 } from 'lucide-react'

export default function VoiceAssistant() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Assistente por Voz</h2>
        <p className="text-muted-foreground text-sm">Comande o CRM utilizando voz e IA.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" /> Reconhecimento de Voz Ativo
            </CardTitle>
            <CardDescription>
              Pressione o botão para falar um comando como "Adicionar novo cliente João" ou "Resumo
              financeiro de hoje".
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-6 border-2 border-dashed rounded-lg m-6 mt-0">
            <div className="p-6 bg-primary/10 rounded-full animate-pulse cursor-pointer hover:bg-primary/20 transition-colors">
              <Mic className="h-12 w-12 text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Aguardando comando...</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-primary" /> Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm p-3 bg-background rounded border">
                "Cadastrar revenda Maria Santos"{' '}
                <span className="block text-xs text-green-600 mt-1">Executado com sucesso</span>
              </div>
              <div className="text-sm p-3 bg-background rounded border">
                "Qual meu saldo do Nubank?"{' '}
                <span className="block text-xs text-primary mt-1">Resposta: R$ 3.250,50</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
