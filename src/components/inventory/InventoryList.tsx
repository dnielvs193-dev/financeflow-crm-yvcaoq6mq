import { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import useMainStore from '@/stores/useMainStore'
import { formatCurrency } from '@/lib/formatters'
import { Edit, Trash } from 'lucide-react'
import { InventoryFormModal } from './InventoryFormModal'
import { InventoryItem } from '@/types'

export function InventoryList() {
  const { inventory, tiers, deleteTier } = useMainStore()
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  const rows = useMemo(() => {
    const generatedRows: any[] = []

    inventory.forEach((item) => {
      const itemTiers = tiers
        .filter((t) => t.itemId === item.id)
        .sort((a, b) => a.startQty - b.startQty)

      if (itemTiers.length === 0) {
        generatedRows.push({
          id: `no-tier-${item.id}`,
          isItemOnly: true,
          itemObj: item,
          serviceName: item.name,
          startQty: '-',
          endQty: '-',
          unitPrice: null,
        })
      } else {
        itemTiers.forEach((tier) => {
          generatedRows.push({
            id: tier.id,
            isItemOnly: false,
            itemObj: item,
            serviceName: item.name,
            tierId: tier.id,
            startQty: tier.startQty,
            endQty: tier.endQty,
            unitPrice: tier.unitPrice,
          })
        })
      }
    })

    return generatedRows.sort((a, b) => {
      const nameCmp = a.serviceName.localeCompare(b.serviceName)
      if (nameCmp !== 0) return nameCmp
      if (a.isItemOnly) return -1
      if (b.isItemOnly) return 1
      return (a.startQty as number) - (b.startQty as number)
    })
  }, [inventory, tiers])

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Revenda':
        return 'text-blue-600 border-blue-200 bg-blue-50'
      case 'Ativação':
        return 'text-orange-600 border-orange-200 bg-orange-50'
      default:
        return 'text-primary border-primary/20 bg-primary/5'
    }
  }

  return (
    <div className="rounded-md border bg-card overflow-x-auto">
      {editingItem && (
        <InventoryFormModal
          itemToEdit={editingItem}
          open={!!editingItem}
          onOpenChange={(op) => !op && setEditingItem(null)}
        />
      )}
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead>Serviço</TableHead>
            <TableHead>Qtd Mínima</TableHead>
            <TableHead>Qtd Máxima</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className={row.itemObj.status === 'Inativo' ? 'opacity-60' : ''}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span>{row.serviceName}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] py-0 px-1.5 h-4 ${getCategoryColor(
                      row.itemObj.category,
                    )}`}
                  >
                    {row.itemObj.category}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{row.startQty}</TableCell>
              <TableCell className="text-muted-foreground">
                {row.endQty || (row.isItemOnly ? '-' : '∞')}
              </TableCell>
              <TableCell className="font-medium">
                {row.unitPrice !== null ? formatCurrency(row.unitPrice) : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingItem(row.itemObj)}
                    title="Editar Item"
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  {!row.isItemOnly && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Excluir Faixa de Preço"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir faixa de preço?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Você tem certeza que deseja excluir esta faixa de preço do serviço{' '}
                            <span className="font-medium text-foreground">{row.serviceName}</span>?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteTier(row.tierId)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Nenhum serviço ou faixa de preço cadastrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
