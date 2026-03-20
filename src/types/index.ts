export type ClientStatus =
  | 'Devedor'
  | 'Vencido +30d'
  | 'Vence Hoje'
  | 'Vence Amanhã'
  | 'Vencido'
  | 'Ativo'
  | 'Excluído'
  | null

export type Client = {
  id: string
  name: string
  service: string
  phone: string
  expiryDate: string
  lastExpiryDate?: string
  price: number
  cost: number
  status: ClientStatus
  user?: string
  password?: string
  obs1?: string
  obs2?: string
  city?: string
  mac?: string
  dkey?: string
  panel?: string
  deleted?: boolean
  classification?: string
}

export type TransactionType =
  | 'Renovação de Cliente'
  | 'Venda para Revenda'
  | 'Taxa de Ativação'
  | 'Transferência Interna'
  | 'Outras Entradas'
  | 'Compra de Estoque'
  | 'Compra de Ativação'
  | 'Pagamento de Contas'
  | 'Gastos Avulsos'
  | 'Outras Saídas'
  | 'Estorno Financeiro'

export type Transaction = {
  id: string
  date: string
  type: TransactionType
  entry: number
  cost: number
  profit: number
  profitPercentage?: number
  bankId: string
  description: string
  obs?: string
  clientId?: string
  service?: string
  itemId?: string
  qty?: number
  tierRef?: string
  isReversal?: boolean
  originalTxId?: string
  linkedTransferId?: string
  splitDistribution?: {
    costBankId?: string
    profitBankId?: string
    costAmount: number
    profitAmount: number
  }
}

export type BankType = 'Custo' | 'Disponível' | 'Contas' | 'Geral'

export type Bank = {
  id: string
  name: string
  balance: number
  type: BankType
  isDefault: boolean
}

export type InventoryCategory = 'Revenda' | 'Ativação' | 'Serviço Recorrente'

export type InventoryItem = {
  id: string
  name: string
  category: InventoryCategory
  status: 'Ativo' | 'Inativo'
  stockControl: boolean
  currentStock: number
  unitCost: number
  observations?: string
}

export type PriceTier = {
  id: string
  itemId: string
  startQty: number
  endQty: number | null
  unitPrice: number
}

export type ResellerStatus = 'Ativo' | 'Inativo' | 'Lead'

export type Reseller = {
  id: string
  name: string
  status: ResellerStatus
  phone: string
  city: string
  observations?: string
  clientCount: number
  purchaseIntention?: string
  registrationDate: string
}

export type PayableCategory = 'Contas Fixas' | 'Dívidas' | 'Outros Gastos'

export type PayableStatus = 'Pendente' | 'Pago'

export type Payable = {
  id: string
  description: string
  category: PayableCategory
  dueDate: string
  amount: number
  status: PayableStatus
  paymentDate?: string
}
