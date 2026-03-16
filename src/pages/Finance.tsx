import { FinanceFormModal } from '@/components/finance/FinanceFormModal'
import { FinanceList } from '@/components/finance/FinanceList'

export default function Finance() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Extrato Financeiro</h2>
          <p className="text-muted-foreground text-sm">
            Controle de receitas e despesas detalhado.
          </p>
        </div>
        <FinanceFormModal />
      </div>

      <FinanceList />
    </div>
  )
}
