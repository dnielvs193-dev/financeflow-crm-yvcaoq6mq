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
import { ArrowRightLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function TransferModal() {
  const { banks, processTransaction } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ from: '', to: '', amount: '', desc: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.from === form.to) return toast({ title: 'Contas iguais', variant: 'destructive' })

    processTransaction({
      action: 'transfer',
      fromBank: form.from,
      toBank: form.to,
      amount: Number(form.amount),
      desc: form.desc || 'Transferência padrão',
    })
    toast({ title: 'Transferência concluída' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="gap-2">
          <ArrowRightLeft className="h-4 w-4" /> Transferência
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transferência Interna</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Origem (Sai de)</Label>
            <Select required onValueChange={(v) => setForm({ ...form, from: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o banco" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name} ({b.balance})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Destino (Entra em)</Label>
            <Select required onValueChange={(v) => setForm({ ...form, to: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o banco" />
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
            <Label>Valor (R$)</Label>
            <Input
              required
              type="number"
              step="0.01"
              min="0.01"
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Descrição (Opcional)</Label>
            <Input onChange={(e) => setForm({ ...form, desc: e.target.value })} />
          </div>
          <Button type="submit" className="mt-2">
            Confirmar Transferência
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
