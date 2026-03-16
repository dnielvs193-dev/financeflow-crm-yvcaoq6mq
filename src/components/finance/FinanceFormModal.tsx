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
import useMainStore from '@/stores/useMainStore'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FinanceFormModal() {
  const { addTransaction, banks } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    entry: '',
    cost: '',
    description: '',
    bankId: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const entry = Number(formData.entry)
    const cost = Number(formData.cost) || 0
    addTransaction({
      date: new Date().toISOString(),
      type: formData.type,
      entry,
      cost,
      profit: entry - cost,
      description: formData.description,
      bankId: formData.bankId,
    })
    toast({ title: 'Transação adicionada com sucesso!' })
    setOpen(false)
    setFormData({ type: '', entry: '', cost: '', description: '', bankId: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Lançamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select required onValueChange={(v) => setFormData({ ...formData, type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gastos e despesas fixas">Gastos Fixos</SelectItem>
                <SelectItem value="Compra de estoque">Compra de Estoque</SelectItem>
                <SelectItem value="Outras entradas">Outras Entradas</SelectItem>
                <SelectItem value="Outras saídas">Outras Saídas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Banco/Conta</Label>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor Entrada</Label>
              <Input
                required
                type="number"
                step="0.01"
                value={formData.entry}
                onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor Custo</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit" className="mt-2">
            Salvar Lançamento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
