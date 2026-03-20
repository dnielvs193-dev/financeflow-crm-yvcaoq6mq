import { useState } from 'react'
import { Download, Upload, FileText, CheckCircle2, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
  const { filteredClients, importClients, inventory, deleteAllClients } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [previewData, setPreviewData] = useState<Omit<Client, 'id'>[]>([])

  const handleExport = () => {
    const header = [
      'Serviço',
      'Status',
      'Nome',
      'Usuário',
      'Senha',
      'Vencimento',
      'Telefone',
      'Obs1',
      'Obs2',
      'Cidade',
      'MAC',
      'D_Key',
      'Preço',
      'Custo',
    ].join(';')

    const rows = filteredClients.map((c) => {
      const expDate = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(c.expiryDate))

      return `${c.service};${getClientStatus(c.expiryDate, c.status)};${c.name};${c.user || ''};${c.password || ''};${expDate};${c.phone};${c.obs1 || ''};${c.obs2 || ''};${c.city || ''};${c.mac || ''};${c.dkey || ''};${c.price};${c.cost}`
    })

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
      // Use robust regex to split lines to ensure full data processing without limits
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
      if (lines.length < 2) {
        return toast({ title: 'Arquivo vazio ou inválido', variant: 'destructive' })
      }

      const delimiter = lines[0].includes(';') ? ';' : ','

      // Custom split function to handle optional quotes inside CSV columns
      const splitLine = (line: string) => {
        const result = []
        let current = ''
        let inQuotes = false
        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === delimiter && !inQuotes) {
            result.push(current)
            current = ''
          } else {
            current += char
          }
        }
        result.push(current)
        return result.map((v) => v.trim())
      }

      const headers = splitLine(lines[0]).map((h) => h.toLowerCase())

      const parsed = lines.slice(1).map((line) => {
        const values = splitLine(line)
        const obj: Record<string, string> = {}
        headers.forEach((h, i) => {
          obj[h] = values[i] || ''
        })
        return { row: obj, values }
      })

      const mappedClients = parsed.map(({ row, values }) => {
        const findKey = (keys: string[]) =>
          headers.find((h) => keys.some((k) => h === k || h.includes(k)))
        const nameKey = findKey(['nome', 'name'])
        const phoneKey = findKey(['whatsapp', 'telefone', 'celular', 'phone'])
        const statusKey = findKey(['status'])
        const passKey = findKey(['senha', 'password'])
        const dateKey = findKey(['vencimento', 'data', 'expiry'])
        const userKey = findKey(['usuário', 'usuario', 'user'])
        const cityKey = findKey(['cidade', 'city'])
        const macKey = findKey(['mac'])
        const dkeyKey = findKey(['d_key', 'dkey', 'd-key'])
        const priceKey = findKey(['preço', 'preco', 'mensalidade', 'valor', 'price', 'preço m'])
        const panelKey = findKey(['painel', 'panel'])
        const obs1Key = findKey(['obs1', 'observação', 'observacao', 'obs'])
        const obs2Key = findKey(['obs2'])

        const parseCurrency = (val: string) => {
          if (!val) return 0
          let str = val
            .toString()
            .trim()
            .replace(/R\$\s*/g, '')
          if (/,/.test(str) && /\./.test(str)) {
            str = str.replace(/\./g, '').replace(',', '.')
          } else if (/,/.test(str)) {
            str = str.replace(',', '.')
          }
          return parseFloat(str) || 0
        }

        const price =
          priceKey && row[priceKey] !== undefined && row[priceKey] !== ''
            ? parseCurrency(row[priceKey])
            : 0

        // Service Mapping: Explicitly read from Column A (Index 0)
        const rawService = values[0] || ''
        const srvName = rawService !== '' ? rawService : 'Padrão'

        // Relational check with Inventory Items
        const invItem = inventory.find((i) => i.name.toLowerCase() === srvName.toLowerCase())

        // Cost Mapping: Explicitly read from Column N (Index 13)
        const rawCost = values.length > 13 ? values[13] : ''
        let cost = 0

        // CSV value takes precedence over system default
        if (rawCost !== '') {
          cost = parseCurrency(rawCost)
        } else if (invItem) {
          cost = invItem.unitCost
        }

        const statusRaw = statusKey ? row[statusKey] : ''
        let parsedStatus = null
        let isDeleted = false
        if (statusRaw.toLowerCase().includes('devedor')) parsedStatus = 'Devedor'
        if (statusRaw.toLowerCase().includes('+30')) parsedStatus = 'Vencido +30d'
        if (
          statusRaw.toLowerCase().includes('excluido') ||
          statusRaw.toLowerCase().includes('excluído')
        ) {
          parsedStatus = 'Excluído'
          isDeleted = false // Keep them visible
        }

        return {
          name: nameKey && row[nameKey] ? row[nameKey] : 'Desconhecido',
          phone: phoneKey && row[phoneKey] ? row[phoneKey] : '',
          service: srvName,
          price: price,
          cost: cost,
          expiryDate: dateKey && row[dateKey] ? parseDate(row[dateKey]) : new Date().toISOString(),
          status: parsedStatus as any,
          deleted: isDeleted,
          user: userKey && row[userKey] ? row[userKey] : '',
          password: passKey && row[passKey] ? row[passKey] : '',
          city: cityKey && row[cityKey] ? row[cityKey] : '',
          mac: macKey && row[macKey] ? row[macKey] : '',
          dkey: dkeyKey && row[dkeyKey] ? row[dkeyKey] : '',
          panel: panelKey && row[panelKey] ? row[panelKey] : '',
          obs1: obs1Key && row[obs1Key] ? row[obs1Key] : '',
          obs2: obs2Key && row[obs2Key] ? row[obs2Key] : '',
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="flex-1 lg:flex-none">
            <Trash className="mr-2 h-4 w-4" /> Excluir Todos
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir todos os clientes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all clients? This action is permanent and cannot be
              undone. (Tem certeza de que deseja excluir todos os clientes? Esta ação é permanente e
              não pode ser desfeita.)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteAllClients()
                toast({
                  title: 'Ação concluída',
                  description: 'Todos os clientes foram excluídos com sucesso.',
                })
              }}
            >
              Excluir Todos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                <div className="text-sm font-medium mb-1">
                  Clique ou arraste seu arquivo .CSV aqui
                </div>
                <div className="text-xs text-muted-foreground mb-4">
                  O sistema reconhecerá automaticamente: Coluna A (Serviço) e Coluna N (Custo).
                  Nenhum limite de registros.
                </div>
                <Button variant="secondary" className="pointer-events-none">
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4 animate-fade-in-up">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle2 className="h-5 w-5" />
                <div className="text-sm font-medium">Arquivo processado com sucesso</div>
              </div>
              <div className="bg-muted p-4 rounded-md text-sm space-y-2">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Registros encontrados:</span>{' '}
                  <strong className="text-lg">{previewData.length}</strong>
                </div>
                <div className="text-xs text-muted-foreground pt-1">
                  Os valores importados como <strong>Serviço</strong> (Coluna A) e{' '}
                  <strong>Custo</strong> (Coluna N) serão mapeados e preservados de forma
                  relacional.
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
