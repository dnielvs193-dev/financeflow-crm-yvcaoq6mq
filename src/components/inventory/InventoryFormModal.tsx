import { useState } from 'react'
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
import { Switch } from '@/components/ui/switch'
import useMainStore from '@/stores/useMainStore'
import { InventoryCategory } from '@/types'
import { Plus, Trash } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function InventoryFormModal() {
  const { saveInventoryItem } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Revenda' as InventoryCategory,
    status: 'Ativo' as 'Ativo' | 'Inativo',
    stockControl: true,
    currentStock: '0',
    obs: '',
  })
  const [tierData, setTierData] = useState([
    { startQty: 1, endQty: '', unitPrice: '', unitCost: '' },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedTiers = tierData.map((t) => ({
      startQty: Number(t.startQty),
      endQty: t.endQty ? Number(t.endQty) : null,
      unitPrice: Number(t.unitPrice),
      unitCost: Number(t.unitCost),
    }))

    saveInventoryItem(
      {
        name: formData.name,
        category: formData.category,
        stockControl: formData.stockControl,
        currentStock: Number(formData.currentStock) || 0,
        status: formData.status,
        observations: formData.obs,
      },
      parsedTiers,
    )
    toast({ title: 'Item cadastrado com sucesso!' })
    setOpen(false)
    setFormData({
      name: '',
      category: 'Revenda',
      status: 'Ativo',
      stockControl: true,
      currentStock: '0',
      obs: '',
    })
    setTierData([{ startQty: 1, endQty: '', unitPrice: '', unitCost: '' }])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Estoque / Serviço</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>Nome do Item</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(v) =>
                  setFormData({ ...formData, category: v as InventoryCategory })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Revenda">Revenda</SelectItem>
                  <SelectItem value="Ativação">Ativação</SelectItem>
                  <SelectItem value="Serviço Recorrente">Serviço Recorrente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) =>
                  setFormData({ ...formData, status: v as 'Ativo' | 'Inativo' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label>Observações</Label>
              <Input
                placeholder="Detalhes internos..."
                value={formData.obs}
                onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-lg border">
            <Switch
              id="stock-ctrl"
              checked={formData.stockControl}
              onCheckedChange={(c) => setFormData({ ...formData, stockControl: c })}
            />
            <Label htmlFor="stock-ctrl" className="flex-1 cursor-pointer">
              Controlar Quantidade em Estoque?
            </Label>
            {formData.stockControl && (
              <Input
                type="number"
                className="w-24 h-8"
                placeholder="Qtd Inicial"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              />
            )}
          </div>

          <div className="space-y-3 mt-2 border-t pt-4">
            <Label className="text-base font-semibold">Faixas de Preço (Tiers)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Defina o preço de venda e custo de acordo com a quantidade (ex: 1-9 un, 10+ un).
            </p>
            {tierData.map((tier, idx) => (
              <div key={idx} className="flex gap-2 items-end bg-muted/10 p-2 rounded border">
                <div className="space-y-1 flex-1">
                  <Label className="text-xs text-muted-foreground">De (Qtd)</Label>
                  <Input
                    type="number"
                    required
                    min="1"
                    value={tier.startQty}
                    onChange={(e) => {
                      const n = [...tierData]
                      n[idx].startQty = Number(e.target.value)
                      setTierData(n)
                    }}
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs text-muted-foreground">Até (Vazio = Infinito)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={tier.endQty}
                    onChange={(e) => {
                      const n = [...tierData]
                      n[idx].endQty = e.target.value
                      setTierData(n)
                    }}
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs text-muted-foreground">Venda un. (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={tier.unitPrice}
                    onChange={(e) => {
                      const n = [...tierData]
                      n[idx].unitPrice = e.target.value
                      setTierData(n)
                    }}
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs text-muted-foreground">Custo un. (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={tier.unitCost}
                    onChange={(e) => {
                      const n = [...tierData]
                      n[idx].unitCost = e.target.value
                      setTierData(n)
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-10"
                  onClick={() => setTierData(tierData.filter((_, i) => i !== idx))}
                  disabled={tierData.length === 1}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setTierData([...tierData, { startQty: 1, endQty: '', unitPrice: '', unitCost: '' }])
              }
              className="w-full border-dashed mt-2"
            >
              + Adicionar Faixa de Preço
            </Button>
          </div>
          <Button type="submit" className="mt-4">
            Salvar Item
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
