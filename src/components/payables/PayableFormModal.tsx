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
import { PayableCategory } from '@/types'
import useMainStore from '@/stores/useMainStore'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function PayableFormModal() {
  const { addPayable } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    description: '',
    category: 'Contas Fixas' as PayableCategory,
    dueDate: '',
    amount: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addPayable({
      description: formData.description,
      category: formData.category,
      dueDate: new Date(formData.dueDate).toISOString(),
      amount: Number(formData.amount),
      status: 'Pendente',
    })
    toast({ title: 'Conta a pagar adicionada!' })
    setOpen(false)
    setFormData({ description: '', category: 'Contas Fixas', dueDate: '', amount: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Adicionar Conta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nova Conta a Pagar</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(v: PayableCategory) => setFormData({ ...formData, category: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Contas Fixas">Contas Fixas</SelectItem>
                <SelectItem value="Dívidas">Dívidas</SelectItem>
                <SelectItem value="Outros Gastos">Outros Gastos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                required
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Vencimento</Label>
              <Input
                required
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="mt-4">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
