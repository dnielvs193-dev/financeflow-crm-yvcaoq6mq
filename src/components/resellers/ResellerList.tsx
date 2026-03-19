import useMainStore from '@/stores/useMainStore'
import { ResellerCard } from './ResellerCard'

export function ResellerList() {
  const { filteredResellers } = useMainStore()

  if (filteredResellers.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground border rounded-lg border-dashed mt-6 bg-card/50">
        Nenhuma revenda encontrada para os filtros selecionados.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6 animate-fade-in-up">
      {filteredResellers.map((reseller) => (
        <ResellerCard key={reseller.id} reseller={reseller} />
      ))}
    </div>
  )
}
