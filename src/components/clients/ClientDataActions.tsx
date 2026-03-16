import { useState } from 'react'
import { Download, Upload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export function ClientDataActions() {
  const { filteredClients, importClients } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)

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

  const handleSimulateImport = () => {
    setStep(2)
  }

  const handleConfirmImport = () => {
    importClients([
      {
        name: 'Cliente Importado 1',
        phone: '11900000001',
        service: 'IPTV Premium',
        price: 35,
        cost: 10,
        expiryDate: new Date().toISOString(),
        status: null,
      },
      {
        name: 'Cliente Importado 2',
        phone: '11900000002',
        service: 'P2P Basic',
        price: 25,
        cost: 8,
        expiryDate: new Date().toISOString(),
        status: null,
      },
    ])
    toast({ title: '2 clientes importados com sucesso!' })
    setOpen(false)
    setStep(1)
  }

  return (
    <div className="flex gap-2 w-full lg:w-auto">
      <Dialog
        open={open}
        onOpenChange={(op) => {
          setOpen(op)
          if (!op) setStep(1)
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
            <div className="space-y-4 py-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">Arraste sua planilha CSV ou Excel aqui</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Mapeamento de colunas automático habilitado
                </p>
                <Button onClick={handleSimulateImport}>Selecionar Arquivo Fictício</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <p className="text-sm font-medium">Revisão de Importação</p>
              <div className="bg-muted p-4 rounded-md text-sm space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Registros encontrados:</span>{' '}
                  <strong>2</strong>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Colunas mapeadas:</span>{' '}
                  <strong>Nome, Telefone, Serviço</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duplicatas ignoradas:</span>{' '}
                  <strong>0</strong>
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
