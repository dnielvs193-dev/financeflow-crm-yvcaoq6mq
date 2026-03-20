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
import { Switch } from '@/components/ui/switch'
import useMainStore from '@/stores/useMainStore'
import { Bank, BankType } from '@/types'
import { Plus, Edit } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function BankFormModal({ bank }: { bank?: Bank }) {
  const { addBank, updateBank } = useMainStore()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    type: 'Geral' as BankType,
    balance: '',
    isDefault: false,
  })

  useEffect(() => {
    if (bank && open) {
      setFormData({
        name: bank.name,
        type: bank.type,
        balance: bank.balance.toString(),
        isDefault: bank.isDefault,
      })
    } else if (!open) {
      setFormData({ name: '', type: 'Geral', balance: '', isDefault: false })
    }
  }, [bank, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (bank) {
      updateBank(bank.id, {
        name: formData.name,
        type: formData.type,
        balance: Number(formData.balance),
        isDefault: formData.isDefault,
      })
      toast({ title: 'Conta atualizada com sucesso!' })
    } else {
      addBank({
        name: formData.name,
        type: formData.type,
        balance: Number(formData.balance),
        isDefault: formData.isDefault,
      })
      toast({ title: 'Conta criada com sucesso!' })
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {bank ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Nova Conta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{bank ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Nome do Banco / Carteira</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Nubank, Cofre Dinheiro..."
            />
          </div>
          <div className="space-y-2">
            <Label>Saldo Inicial (R$)</Label>
            <Input
              required
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              disabled={!!bank}
              title={bank ? 'Saldo só pode ser alterado via transferências ou lançamentos' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo de Conta</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => setFormData({ ...formData, type: v as BankType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Geral">Geral (Sem regra)</SelectItem>
                <SelectItem value="Disponível">Disponível (Lucro livre)</SelectItem>
                <SelectItem value="Custo">Custo (Reserva p/ Reposição)</SelectItem>
                <SelectItem value="Contas">Contas (Provisão p/ Boletos)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              O motor financeiro usará o tipo da conta para realizar o split automático
              (distribuição) do faturamento.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-lg border mt-2">
            <Switch
              id="is-default"
              checked={formData.isDefault}
              onCheckedChange={(c) => setFormData({ ...formData, isDefault: c })}
            />
            <div className="flex flex-col flex-1">
              <Label htmlFor="is-default" className="cursor-pointer font-semibold">
                Tornar conta Padrão ({formData.type})
              </Label>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                Ao ativar, esta conta receberá automaticamente a parcela de "{formData.type}" nas
                vendas.
              </span>
            </div>
          </div>
          <Button type="submit" className="mt-4">
            {bank ? 'Salvar Alterações' : 'Criar Conta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
