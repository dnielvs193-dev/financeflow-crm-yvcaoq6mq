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
import { Client, ClientStatus } from '@/types'
import { Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ClientFormModalProps {
  client?: Client
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

const EMOJIS = [
  { val: 'none', label: 'Sem Classificação' },
  { val: '🟢', label: 'Bom Pagador 🟢' },
  { val: '🔴', label: 'Ruim 🔴' },
  { val: '😒', label: 'Chato 😒' },
  { val: '😫', label: 'Estressado 😫' },
  { val: '😇', label: 'Gente Boa 😇' },
  { val: '💸', label: 'Inadimplente 💸' },
]

export function ClientFormModal({
  client,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
}: ClientFormModalProps) {
  const { addClient, updateClient, clients, inventory } = useMainStore()
  const { toast } = useToast()
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen

  const uniqueCities = Array.from(
    new Set(clients.map((c) => c.city).filter(Boolean)),
  ).sort() as string[]
  const uniquePanels = Array.from(
    new Set(clients.map((c) => c.panel).filter(Boolean)),
  ).sort() as string[]
  const uniqueServices = Array.from(
    new Set([...clients.map((c) => c.service), ...inventory.map((i) => i.name)]),
  )
    .filter(Boolean)
    .sort() as string[]

  const [showNewCity, setShowNewCity] = useState(false)
  const [showNewPanel, setShowNewPanel] = useState(false)
  const [showNewService, setShowNewService] = useState(false)

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
    classification: 'none',
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
        obs1: client.obs1 || '',
        obs2: client.obs2 || '',
        classification: client.classification || 'none',
      })
      setShowNewCity(!uniqueCities.includes(client.city || '') && !!client.city)
      setShowNewPanel(!uniquePanels.includes(client.panel || '') && !!client.panel)
      setShowNewService(!uniqueServices.includes(client.service || '') && !!client.service)
    } else if (!open) {
      setFormData(defaultForm)
      setShowNewCity(false)
      setShowNewPanel(false)
      setShowNewService(false)
    }
  }, [client, open])

  const handleServiceChange = (val: string) => {
    if (val === 'outra') {
      setShowNewService(true)
      setFormData((f) => ({ ...f, service: '' }))
    } else {
      const inv = inventory.find((i) => i.name === val)
      setFormData((f) => ({ ...f, service: val, cost: inv ? inv.unitCost.toString() : f.cost }))
    }
  }

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
      classification: formData.classification === 'none' ? undefined : formData.classification,
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
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? 'Editar Cliente' : 'Novo Cadastro'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp / Telefone *</Label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Classificação (Emoji)</Label>
                <Select
                  value={formData.classification}
                  onValueChange={(v) => setFormData({ ...formData, classification: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMOJIS.map((e) => (
                      <SelectItem key={e.val} value={e.val}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                {!showNewCity ? (
                  <Select
                    value={
                      uniqueCities.includes(formData.city)
                        ? formData.city
                        : formData.city
                          ? 'outra'
                          : ''
                    }
                    onValueChange={(v) => {
                      if (v === 'outra') {
                        setShowNewCity(true)
                        setFormData({ ...formData, city: '' })
                      } else setFormData({ ...formData, city: v })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueCities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                      <SelectItem value="outra" className="font-semibold text-primary">
                        + Nova
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex gap-1">
                    <Input
                      autoFocus
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowNewCity(false)
                        setFormData({ ...formData, city: '' })
                      }}
                    >
                      X
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Serviço *</Label>
                {!showNewService ? (
                  <Select
                    value={
                      uniqueServices.includes(formData.service)
                        ? formData.service
                        : formData.service
                          ? 'outra'
                          : ''
                    }
                    onValueChange={handleServiceChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueServices.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                      <SelectItem value="outra" className="font-semibold text-primary">
                        + Novo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex gap-1">
                    <Input
                      required
                      autoFocus
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowNewService(false)
                        setFormData({ ...formData, service: '' })
                      }}
                    >
                      X
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Painel</Label>
                {!showNewPanel ? (
                  <Select
                    value={
                      uniquePanels.includes(formData.panel)
                        ? formData.panel
                        : formData.panel
                          ? 'outra'
                          : ''
                    }
                    onValueChange={(v) => {
                      if (v === 'outra') {
                        setShowNewPanel(true)
                        setFormData({ ...formData, panel: '' })
                      } else setFormData({ ...formData, panel: v })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {uniquePanels.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                      <SelectItem value="outra" className="font-semibold text-primary">
                        + Novo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex gap-1">
                    <Input
                      autoFocus
                      value={formData.panel}
                      onChange={(e) => setFormData({ ...formData, panel: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowNewPanel(false)
                        setFormData({ ...formData, panel: '' })
                      }}
                    >
                      X
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <div className="space-y-2 flex-1">
                  <Label>Usuário</Label>
                  <Input
                    value={formData.user}
                    onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>Senha</Label>
                  <Input
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="space-y-2 flex-1">
                  <Label>MAC</Label>
                  <Input
                    value={formData.mac}
                    onChange={(e) => setFormData({ ...formData, mac: e.target.value })}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>D_Key</Label>
                  <Input
                    value={formData.dkey}
                    onChange={(e) => setFormData({ ...formData, dkey: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Vencimento *</Label>
                <Input
                  required
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <div className="space-y-2 flex-1">
                  <Label>Preço M (R$) *</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>Custo (R$)</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status Manual</Label>
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
                    <SelectItem value="Excluído">Excluído (Manual)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Observação 1</Label>
                <Input
                  value={formData.obs1}
                  onChange={(e) => setFormData({ ...formData, obs1: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Observação 2</Label>
                <Input
                  value={formData.obs2}
                  onChange={(e) => setFormData({ ...formData, obs2: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 border-t pt-4">
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
