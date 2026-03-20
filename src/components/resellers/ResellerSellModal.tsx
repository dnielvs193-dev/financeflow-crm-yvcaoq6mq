import { useState, useMemo } from 'react'
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
import { Reseller } from '@/types'
import useMainStore from '@/stores/useMainStore'
import { useToast } from '@/hooks/use-toast'
import { ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'

export function ResellerSellModal({ reseller }: { reseller: Reseller }) {
  const { inventory, tiers, banks, processTransaction } = useMainStore()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [qtyStr, setQtyStr] = useState('1')
  const [bankId, setBankId] = useState('')

  const revendaItems = useMemo(
    () =>
      inventory.filter(
        (i) => (i.category === 'Revenda' || i.category === 'Ativação') && i.status === 'Ativo',
      ),
    [inventory],
  )

  const qty = parseInt(qtyStr) || 0

  const pricing = useMemo(() => {
    if (!itemId || qty <= 0) return null
    const item = inventory.find((i) => i.id === itemId)
    const itemTiers = tiers.filter((t) => t.itemId === itemId)
    const tier = itemTiers.find((t) => qty >= t.startQty && (t.endQty === null || qty <= t.endQty))
    if (!tier || !item) return null
    return {
      unitPrice: tier.unitPrice,
      unitCost: item.unitCost,
      totalPrice: tier.unitPrice * qty,
      totalCost: item.unitCost * qty,
    }
  }, [itemId, qty, tiers, inventory])

  const handleSell = () => {
    if (!itemId || !bankId || qty <= 0 || !pricing) return
    const item = inventory.find((i) => i.id === itemId)
    if (!item) return

    processTransaction({
      action: 'standard',
      tx: {
        type: item.category === 'Ativação' ? 'Taxa de Ativação' : 'Venda para Revenda',
        entry: pricing.totalPrice,
        cost: pricing.totalCost,
        profit: pricing.totalPrice - pricing.totalCost,
        bankId,
        description: `Venda Revenda - ${reseller.name} - ${item.name}`,
        itemId,
        qty,
      },
    })

    toast({ title: 'Venda realizada com sucesso!' })
    setOpen(false)
    setItemId('')
    setQtyStr('1')
    setBankId('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 gap-2">
          <ShoppingCart className="h-4 w-4" /> Vender Serviço
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vender para {reseller.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Serviço / Ativação</Label>
            <Select value={itemId} onValueChange={setItemId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {revendaItems.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.name} ({i.category})
                  </SelectItem>
                ))}
                {revendaItems.length === 0 && (
                  <SelectItem value="none" disabled>
                    Nenhum item ativo
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Quantidade</Label>
            <Input
              type="number"
              min="1"
              value={qtyStr}
              onChange={(e) => setQtyStr(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Conta Recebedora (Principal)</Label>
            <Select value={bankId} onValueChange={setBankId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a conta bancária" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-1">
              O valor será distribuído automaticamente entre as contas Padrão configuradas, caso
              existam.
            </p>
          </div>

          {pricing ? (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2 animate-fade-in-up">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Valor Unitário</span>
                <span>{formatCurrency(pricing.unitPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total a Cobrar</span>
                <span className="text-primary">{formatCurrency(pricing.totalPrice)}</span>
              </div>
            </div>
          ) : itemId && qty > 0 ? (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm animate-fade-in-up">
              Nenhuma faixa de preço (Tier) encontrada para esta quantidade. Verifique o cadastro do
              produto.
            </div>
          ) : null}

          <Button
            className="w-full mt-2"
            onClick={handleSell}
            disabled={!itemId || !bankId || qty <= 0 || !pricing}
          >
            Confirmar Venda
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
