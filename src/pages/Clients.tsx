import { ClientFormModal } from '@/components/clients/ClientFormModal'
import { ClientList } from '@/components/clients/ClientList'
import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'

export default function Clients() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Clientes</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie assinaturas e controle os vencimentos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none" size="sm">
            <Upload className="mr-2 h-4 w-4" /> Importar
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none" size="sm">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <ClientFormModal />
        </div>
      </div>

      <ClientList />
    </div>
  )
}
