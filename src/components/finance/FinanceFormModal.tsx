import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useMainStore from '@/stores/useMainStore'
import { TransactionType } from '@/types'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FinanceFormModal() {
  const { processTransaction, banks, inventory, tiers } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const initialForm = {
    type: '' as TransactionType | '',
    bankId: '',
    itemId: 'none',
    qty: '1',
    entry: '',
    cost: '',
    desc: '',
  }
  const [formData, setFormData] = useState(initialForm)
  const [tierError, setTierError] = useState('')

  const isStockTx = [
    'Venda para Revenda',
    'Taxa de Ativação',
    'Compra de Estoque',
    'Compra de Ativação',
  ].includes(formData.type)
  const isPurchase = ['Compra de Estoque', 'Compra de Ativação'].includes(formData.type)

  useEffect(() => {
    if (isStockTx && formData.itemId !== 'none' && formData.qty) {
      const qty = Number(formData.qty)
      const itemTiers = tiers.filter((t) => t.itemId === formData.itemId)
      const matchedTier = itemTiers.find(
        (t) => qty >= t.startQty && (t.endQty === null || qty <= t.endQty),
      )

      if (matchedTier) {
        setTierError('')
        if (isPurchase) {
          setFormData((p) => ({ ...p, entry: '0', cost: (matchedTier.unitCost * qty).toString() }))
        } else {
          setFormData((p) => ({
            ...p,
            entry: (matchedTier.unitPrice * qty).toString(),
            cost: (matchedTier.unitCost * qty).toString(),
          }))
        }
      } else {
        setTierError('Qtd não coberta pelas faixas de preço.')
      }
    }
  }, [formData.type, formData.itemId, formData.qty, isStockTx, isPurchase, tiers])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tierError)
      return toast({
        title: 'Erro de precificação',
        description: tierError,
        variant: 'destructive',
      })

    const entry = Number(formData.entry) || 0
    const cost = Number(formData.cost) || 0

    processTransaction({
      action: 'standard',
      tx: {
        type: formData.type as TransactionType,
        entry,
        cost,
        profit: entry - cost,
        bankId: formData.bankId,
        description: formData.desc,
        ...(isStockTx && formData.itemId !== 'none'
          ? { itemId: formData.itemId, qty: Number(formData.qty) }
          : {}),
      },
    })
    toast({ title: 'Lançamento registrado!' })
    setOpen(false)
    setFormData(initialForm)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Lançamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Novo Lançamento / Operação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Tipo de Operação</Label>
              <Select
                required
                onValueChange={(v) => setFormData({ ...formData, type: v as TransactionType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Venda para Revenda">Venda para Revenda</SelectItem>
                  <SelectItem value="Taxa de Ativação">Taxa de Ativação</SelectItem>
                  <SelectItem value="Compra de Estoque">Compra de Estoque</SelectItem>
                  <SelectItem value="Outras Entradas">Outras Entradas</SelectItem>
                  <SelectItem value="Gastos Avulsos">Gastos Avulsos</SelectItem>
                  <SelectItem value="Pagamento de Contas">Pagamento de Contas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isStockTx && (
              <>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label>Item / Serviço</Label>
                  <Select required onValueChange={(v) => setFormData({ ...formData, itemId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha..." />
                    </SelectTrigger>
                    <SelectContent>
                      {inventory.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                  />
                </div>
                {tierError && <p className="text-xs text-destructive col-span-2">{tierError}</p>}
              </>
            )}

            <div className="space-y-2 col-span-2">
              <Label>Conta Bancária</Label>
              <Select required onValueChange={(v) => setFormData({ ...formData, bankId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Entrada (R$)</Label>
              <Input
                type="number"
                step="0.01"
                required
                value={formData.entry}
                readOnly={isPurchase || (isStockTx && !!formData.itemId)}
                onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Custo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                required
                value={formData.cost}
                readOnly={isStockTx && !!formData.itemId}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Descrição</Label>
              <Input
                required
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" disabled={!!tierError}>
            Registrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
