import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import useMainStore from '@/stores/useMainStore'
import { formatCurrency } from '@/lib/formatters'

export function InventoryList() {
  const { inventory, tiers } = useMainStore()

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Revenda':
        return 'bg-blue-500/15 text-blue-600'
      case 'Ativação':
        return 'bg-orange-500/15 text-orange-600'
      default:
        return 'bg-primary/15 text-primary'
    }
  }

  return (
    <div className="rounded-md border bg-card overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead>Item / Serviço</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Estoque Atual</TableHead>
            <TableHead>Faixas de Preço (Tiers)</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => {
            const itemTiers = tiers
              .filter((t) => t.itemId === item.id)
              .sort((a, b) => a.startQty - b.startQty)
            return (
              <TableRow key={item.id} className={item.status === 'Inativo' ? 'opacity-60' : ''}>
                <TableCell className="font-medium">
                  {item.name}
                  {item.observations && (
                    <div className="text-xs text-muted-foreground font-normal mt-1">
                      Obs: {item.observations}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`border-0 ${getCategoryColor(item.category)}`}
                  >
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.stockControl ? (
                    <span
                      className={
                        item.currentStock < 10 ? 'text-destructive font-bold' : 'font-medium'
                      }
                    >
                      {item.currentStock} un
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm font-medium">Ilimitado</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {itemTiers.map((t) => (
                      <div
                        key={t.id}
                        className="text-xs bg-muted/40 p-1 px-2 rounded flex justify-between w-[240px] items-center"
                      >
                        <span className="text-muted-foreground">
                          {t.startQty} {t.endQty ? `- ${t.endQty}` : '+'} un:
                        </span>
                        <span className="font-medium flex flex-col items-end">
                          <span>Venda: {formatCurrency(t.unitPrice)}</span>
                          <span className="text-[10px] text-muted-foreground">
                            Custo: {formatCurrency(t.unitCost)}
                          </span>
                        </span>
                      </div>
                    ))}
                    {itemTiers.length === 0 && (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.status === 'Ativo' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
          {inventory.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Nenhum item cadastrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
