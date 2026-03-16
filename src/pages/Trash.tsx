import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import useMainStore from '@/stores/useMainStore'
import { RotateCcw, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Trash() {
  const { clients, restoreClient, hardDeleteClient } = useMainStore()
  const { toast } = useToast()
  const deletedClients = clients.filter((c) => c.deleted)

  const handleRestore = (id: string) => {
    restoreClient(id)
    toast({ title: 'Cliente restaurado!' })
  }

  const handleHardDelete = (id: string) => {
    if (
      confirm('Tem certeza que deseja excluir definitivamente? Esta ação não pode ser desfeita.')
    ) {
      hardDeleteClient(id)
      toast({ title: 'Cliente excluído permanentemente.' })
    }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Lixeira</h2>
        <p className="text-muted-foreground text-sm">
          Itens excluídos recentemente. Exclusões permanentes não podem ser desfeitas.
        </p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deletedClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium text-muted-foreground">{client.name}</TableCell>
                <TableCell className="text-muted-foreground">{client.service}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(client.id)}
                    className="gap-1"
                  >
                    <RotateCcw className="h-4 w-4" /> Restaurar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleHardDelete(client.id)}
                    className="gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> Excluir Definitivo
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {deletedClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  A lixeira está vazia.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
