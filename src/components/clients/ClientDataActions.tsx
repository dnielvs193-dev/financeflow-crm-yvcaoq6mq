import { useState } from 'react'
import { Download, Upload, FileText, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import useMainStore from '@/stores/useMainStore'
import { getClientStatus } from '@/lib/formatters'
import { useToast } from '@/hooks/use-toast'
import { Client } from '@/types'

function parseDate(dateStr: string) {
  if (!dateStr) return new Date().toISOString()
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`)
    if (!isNaN(d.getTime())) return d.toISOString()
  }
  const d2 = new Date(dateStr)
  return isNaN(d2.getTime()) ? new Date().toISOString() : d2.toISOString()
}

export function ClientDataActions() {
  const { filteredClients, importClients } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [previewData, setPreviewData] = useState<Omit<Client, 'id'>[]>([])

  const handleExport = () => {
    const header = ['Nome', 'Telefone', 'Serviço', 'Status', 'Vencimento', 'Preço'].join(',')
    const rows = filteredClients.map(
      (c) =>
        `${c.name},${c.phone},${c.service},${getClientStatus(c.expiryDate, c.status)},${c.expiryDate},${c.price}`,
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'clientes_export.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast({ title: 'Exportação concluída!' })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      const lines = text.split('\n').filter((l) => l.trim().length > 0)
      if (lines.length < 2) {
        return toast({ title: 'Arquivo vazio ou inválido', variant: 'destructive' })
      }

      const delimiter = lines[0].includes(';') ? ';' : ','
      const headers = lines[0].split(delimiter).map((h) => h.trim().toLowerCase())

      const parsed = lines.slice(1).map((line) => {
        const values = line.split(delimiter)
        const obj: Record<string, string> = {}
        headers.forEach((h, i) => {
          obj[h] = values[i] ? values[i].trim() : ''
        })
        return obj
      })

      const mappedClients = parsed.map((row) => {
        const findKey = (keys: string[]) => headers.find((h) => keys.some((k) => h.includes(k)))
        const nameKey = findKey(['nome', 'name'])
        const phoneKey = findKey(['telefone', 'celular', 'whatsapp', 'phone'])
        const serviceKey = findKey(['serviço', 'servico', 'service'])
        const priceKey = findKey(['mensalidade', 'valor', 'price'])
        const dateKey = findKey(['vencimento', 'data', 'expiry'])
        const userKey = findKey(['usuário', 'usuario', 'user'])
        const passKey = findKey(['senha', 'password'])
        const cityKey = findKey(['cidade', 'city'])
        const obsKey = findKey(['observação', 'observacao', 'obs'])

        const priceStr = priceKey ? row[priceKey] : '0'
        const price = parseFloat(priceStr.replace('R$', '').replace(',', '.').trim()) || 0

        return {
          name: nameKey ? row[nameKey] : 'Desconhecido',
          phone: phoneKey ? row[phoneKey] : '',
          service: serviceKey ? row[serviceKey] : 'Padrão',
          price: price,
          cost: 0,
          expiryDate: dateKey ? parseDate(row[dateKey]) : new Date().toISOString(),
          status: null,
          user: userKey ? row[userKey] : '',
          password: passKey ? row[passKey] : '',
          city: cityKey ? row[cityKey] : '',
          obs1: obsKey ? row[obsKey] : '',
        }
      })

      setPreviewData(mappedClients)
      setStep(2)
    }
    reader.readAsText(file)
  }

  const handleConfirmImport = () => {
    importClients(previewData)
    toast({ title: `${previewData.length} clientes importados com sucesso!` })
    setOpen(false)
    setStep(1)
    setPreviewData([])
  }

  return (
    <div className="flex gap-2 w-full lg:w-auto">
      <Dialog
        open={open}
        onOpenChange={(op) => {
          setOpen(op)
          if (!op) {
            setStep(1)
            setPreviewData([])
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
            <Upload className="mr-2 h-4 w-4" /> Importar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Clientes via Planilha</DialogTitle>
          </DialogHeader>
          {step === 1 ? (
            <div className="space-y-4 py-4 animate-fade-in">
              <div className="relative border-2 border-dashed rounded-lg p-8 text-center bg-muted/30 hover:bg-muted/50 transition-colors">
                <Input
                  type="file"
                  accept=".csv"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileUpload}
                />
                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">Clique ou arraste seu arquivo .CSV aqui</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Colunas suportadas: nome, whatsapp, serviço, mensalidade, vencimento, usuário,
                  senha, cidade, observações
                </p>
                <Button variant="secondary" className="pointer-events-none">
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4 animate-fade-in-up">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm font-medium">Arquivo processado com sucesso</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-sm space-y-2">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Registros encontrados:</span>{' '}
                  <strong className="text-lg">{previewData.length}</strong>
                </div>
                <div className="text-xs text-muted-foreground pt-1">
                  Os valores da coluna <strong>Mensalidade</strong> foram mapeados para serem o
                  preço de faturamento de futuras renovações. Os custos serão puxados
                  automaticamente do inventário baseado no Serviço.
                </div>
              </div>
              <Button onClick={handleConfirmImport} className="w-full">
                Confirmar Injeção de Dados
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Button variant="outline" onClick={handleExport} size="sm" className="flex-1 lg:flex-none">
        <Download className="mr-2 h-4 w-4" /> Exportar
      </Button>
    </div>
  )
}
