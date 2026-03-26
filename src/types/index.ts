export type PlanId = 'basic' | 'silver' | 'gold' | 'diamond'

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
  lastContactedDate?: string
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

export type MessageTemplates = {
  active: string
  expired: string
  deleted: string
  credentials: string
}

export type MetaApiConfig = {
  accessToken: string
  phoneNumberId: string
  wabaId: string
  verifyToken: string
}

export type EvolutionApiConfig = {
  instanceUrl: string
  apiKey: string
  instanceName: string
}

export type WApiConfig = {
  instanceId: string
  instanceToken: string
  instanceName: string
  pixKey?: string
  extraKnowledge?: string
  isActive?: boolean
}

export type InteractionIntent =
  | 'solicitar informações sobre vencimento'
  | 'consultar status do pagamento'
  | 'solicitar segunda via'
  | 'informar pagamento'
  | 'enviar comprovante'
  | 'pedir confirmação de renovação'
  | 'solicitar suporte humano'
  | 'dúvidas gerais'
  | 'suporte técnico'
  | 'vendas e financeiro'
  | 'consultar dados'

export type InteractionStatus =
  | 'novo_contato'
  | 'cliente_identificado'
  | 'aguardando_comprovante'
  | 'comprovante_recebido'
  | 'comprovante_em_analise'
  | 'pagamento_validado'
  | 'pagamento_nao_validado'
  | 'renovacao_executada'
  | 'aguardando_atendimento_humano'
  | 'em_atendimento_humano'
  | 'encerrado'

export type AuditLog = {
  id: string
  timestamp: string
  action: string
  actor: 'System' | 'AI' | 'User'
  correlationId: string
  details?: string
}

export type ChatMessage = {
  id: string
  role: 'user' | 'system' | 'human' | 'ai'
  text: string
  timestamp: string
  hasMedia?: boolean
}

export type Interaction = {
  id: string
  conversationId: string
  clientId?: string
  phone: string
  channel: 'whatsapp'
  message: string
  intent?: InteractionIntent
  aiConfidence: number
  receiptId?: string
  actionExecuted?: string
  status: InteractionStatus
  timestamp: string
  correlationId: string
  isOutbound: boolean
  errorLog?: string
  chatHistory?: ChatMessage[]
  auditLogs?: AuditLog[]
}

export type ReceiptStatus =
  | 'comprovante_recebido'
  | 'comprovante_em_analise'
  | 'pagamento_validado'
  | 'pagamento_nao_validado'

export type Receipt = {
  id: string
  clientId?: string
  phone: string
  timestamp: string
  fileAttachment: string
  notes?: string
  status: ReceiptStatus
}
