import { InventoryList } from '@/components/inventory/InventoryList'
import { InventoryFormModal } from '@/components/inventory/InventoryFormModal'

export default function Inventory() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estoque & Serviços</h2>
          <p className="text-muted-foreground text-sm">
            Gerencie categorias, custos, itens de revenda e faixas de preços (tiers).
          </p>
        </div>
        <InventoryFormModal />
      </div>

      <InventoryList />
    </div>
  )
}
