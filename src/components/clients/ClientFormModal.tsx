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
import useMainStore, { Client } from '@/stores/useMainStore'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function ClientFormModal() {
  const { addClient } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    price: '',
    cost: '',
    expiryDate: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addClient({
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      price: Number(formData.price),
      cost: Number(formData.cost),
      expiryDate: formData.expiryDate || new Date().toISOString(),
      isDebtor: false,
    })
    toast({ title: 'Cliente adicionado com sucesso!' })
    setOpen(false)
    setFormData({ name: '', phone: '', service: '', price: '', cost: '', expiryDate: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Cadastro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Cadastro de Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Nome Completo</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: João da Silva"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label>Serviço</Label>
              <Input
                required
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                placeholder="Ex: IPTV Premium"
              />
            </div>
            <div className="space-y-2">
              <Label>Preço (R$)</Label>
              <Input
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Custo (R$)</Label>
              <Input
                required
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Data de Vencimento</Label>
              <Input
                required
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="mt-2">
            Salvar Cliente
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
