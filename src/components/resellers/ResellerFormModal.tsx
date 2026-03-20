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
import { Reseller, ResellerStatus } from '@/types'
import useMainStore from '@/stores/useMainStore'
import { useToast } from '@/hooks/use-toast'
import { Edit, Plus } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export function ResellerFormModal({ reseller }: { reseller?: Reseller }) {
  const { addReseller, updateReseller } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    status: 'Lead' as ResellerStatus,
    phone: '',
    city: '',
    clientCount: 0,
    purchaseIntention: '',
    observations: '',
  })

  useEffect(() => {
    if (reseller && open) {
      setFormData({
        name: reseller.name,
        status: reseller.status,
        phone: reseller.phone,
        city: reseller.city,
        clientCount: reseller.clientCount,
        purchaseIntention: reseller.purchaseIntention || '',
        observations: reseller.observations || '',
      })
    } else if (!reseller && open) {
      setFormData({
        name: '',
        status: 'Lead',
        phone: '',
        city: '',
        clientCount: 0,
        purchaseIntention: '',
        observations: '',
      })
    }
  }, [reseller, open])

  const handleSubmit = () => {
    if (!formData.name) {
      toast({ title: 'Nome é obrigatório', variant: 'destructive' })
      return
    }

    if (reseller) {
      updateReseller(reseller.id, formData)
      toast({ title: 'Revenda atualizada!' })
    } else {
      addReseller(formData)
      toast({ title: 'Revenda cadastrada!' })
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {reseller ? (
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" /> Editar
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Nova Revenda
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{reseller ? 'Editar Revenda' : 'Cadastrar Revenda'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Nome</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome do revendedor"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v: ResellerStatus) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Qtd. Clientes</Label>
              <Input
                type="number"
                min="0"
                value={formData.clientCount}
                onChange={(e) =>
                  setFormData({ ...formData, clientCount: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>WhatsApp/Contato</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="grid gap-2">
              <Label>Cidade</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Ex: São Paulo"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Intenção de Compra</Label>
            <Input
              value={formData.purchaseIntention}
              onChange={(e) => setFormData({ ...formData, purchaseIntention: e.target.value })}
              placeholder="Ex: Alta, Baixa, Estudando propostas"
            />
          </div>
          <div className="grid gap-2">
            <Label>Observações</Label>
            <Textarea
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Anotações sobre a revenda..."
              rows={3}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full mt-4">
            {reseller ? 'Salvar Alterações' : 'Cadastrar Revenda'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
