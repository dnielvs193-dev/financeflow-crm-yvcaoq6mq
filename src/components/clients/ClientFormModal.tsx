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
import useMainStore, { Client, ClientStatus } from '@/stores/useMainStore'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ClientFormModalProps {
  client?: Client
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function ClientFormModal({
  client,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: ClientFormModalProps) {
  const { addClient, updateClient } = useMainStore()
  const { toast } = useToast()
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen

  const defaultForm = {
    name: '',
    phone: '',
    service: '',
    panel: '',
    city: '',
    price: '',
    cost: '',
    expiryDate: '',
    status: 'Automático',
    user: '',
    password: '',
    mac: '',
    dkey: '',
    obs1: '',
    obs2: '',
  }

  const [formData, setFormData] = useState(defaultForm)

  useEffect(() => {
    if (client && open) {
      setFormData({
        ...defaultForm,
        name: client.name || '',
        phone: client.phone || '',
        service: client.service || '',
        panel: client.panel || '',
        city: client.city || '',
        price: client.price?.toString() || '',
        cost: client.cost?.toString() || '',
        expiryDate: client.expiryDate ? client.expiryDate.split('T')[0] : '',
        status: client.status || 'Automático',
        user: client.user || '',
        password: client.password || '',
        mac: client.mac || '',
        dkey: client.dkey || '',
      })
    } else if (!open) {
      setFormData(defaultForm)
    }
  }, [client, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const parsedStatus = formData.status === 'Automático' ? null : (formData.status as ClientStatus)

    const clientData = {
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      panel: formData.panel,
      city: formData.city,
      price: Number(formData.price),
      cost: Number(formData.cost),
      expiryDate: formData.expiryDate
        ? new Date(formData.expiryDate).toISOString()
        : new Date().toISOString(),
      status: parsedStatus,
      user: formData.user,
      password: formData.password,
      mac: formData.mac,
      dkey: formData.dkey,
      obs1: formData.obs1,
      obs2: formData.obs2,
    }

    if (client) {
      updateClient(client.id, clientData)
      toast({ title: 'Cliente atualizado com sucesso!' })
    } else {
      addClient(clientData)
      toast({ title: 'Cliente adicionado com sucesso!' })
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !isControlled ? (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Novo Cadastro
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? 'Editar Cliente' : 'Novo Cadastro'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome / WhatsApp *</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome Completo"
              />
              <Input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Telefone / WhatsApp"
                className="mt-2"
              />
            </div>
            <div className="space-y-2">
              <Label>Acesso</Label>
              <Input
                value={formData.user}
                onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                placeholder="Usuário"
              />
              <Input
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Senha"
                type="password"
                className="mt-2"
              />
            </div>
            <div className="space-y-2">
              <Label>Serviço / Painel *</Label>
              <Select
                value={formData.service}
                onValueChange={(v) => setFormData({ ...formData, service: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o Serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IPTV Premium">IPTV Premium</SelectItem>
                  <SelectItem value="P2P Basic">P2P Basic</SelectItem>
                  <SelectItem value="P2P Plus">P2P Plus</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={formData.panel}
                onValueChange={(v) => setFormData({ ...formData, panel: v })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione o Painel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Painel 1">Painel 1</SelectItem>
                  <SelectItem value="Painel 2">Painel 2</SelectItem>
                  <SelectItem value="Painel 3">Painel 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status / Vencimento *</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automático">Automático (por data)</SelectItem>
                  <SelectItem value="Devedor">Devedor (Manual)</SelectItem>
                  <SelectItem value="Vencido +30d">Vencido +30d (Manual)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                required
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="mt-2"
              />
            </div>
            <div className="space-y-2">
              <Label>Financeiro *</Label>
              <div className="flex gap-2">
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Venda (R$)"
                />
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="Custo (R$)"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="button" variant="outline" className="mr-2" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">{client ? 'Salvar Alterações' : 'Salvar Cliente'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
