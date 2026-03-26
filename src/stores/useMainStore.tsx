import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react'
import {
  PlanId,
  Client,
  Transaction,
  Bank,
  InventoryItem,
  PriceTier,
  Reseller,
  Payable,
  MessageTemplates,
  MetaApiConfig,
  EvolutionApiConfig,
  WApiConfig,
  Interaction,
  Receipt,
  InteractionIntent,
  InteractionStatus,
  ReceiptStatus,
  AuditLog,
  ChatMessage,
} from '@/types'
import { getClientStatus, cleanPhone, formatDate } from '@/lib/formatters'
import {
  mockClients,
  mockBanks,
  mockTransactions,
  mockInventory,
  mockTiers,
  mockResellers,
  mockPayables,
  mockInteractions,
  mockReceipts,
} from '@/lib/mockData'

export type ProcessTxPayload =
  | { action: 'standard'; tx: Omit<Transaction, 'id' | 'date'> & { date?: string } }
  | { action: 'transfer'; fromBank: string; toBank: string; amount: number; desc: string }
  | { action: 'reverse'; originalId: string }

type MainStoreContextType = {
  currentPlan: PlanId
  setPlan: (plan: PlanId) => void
  clients: Client[]
  transactions: Transaction[]
  banks: Bank[]
  inventory: InventoryItem[]
  tiers: PriceTier[]
  resellers: Reseller[]
  payables: Payable[]
  templates: MessageTemplates
  metaConfig: MetaApiConfig
  evolutionConfig: EvolutionApiConfig
  wApiConfig: WApiConfig
  evolutionStatus: 'disconnected' | 'connecting' | 'connected'
  evolutionQrCode: string | null
  interactions: Interaction[]
  receipts: Receipt[]
  searchQuery: string
  setSearchQuery: (q: string) => void
  statusFilter: string
  setStatusFilter: (s: string) => void
  serviceFilter: string
  setServiceFilter: (s: string) => void
  filteredClients: Client[]
  txSearchQuery: string
  setTxSearchQuery: (q: string) => void
  txTypeFilter: string
  setTxTypeFilter: (t: string) => void
  txBankFilter: string
  setTxBankFilter: (b: string) => void
  txPeriodFilter: string
  setTxPeriodFilter: (p: string) => void
  filteredTransactions: Transaction[]
  resellerSearchQuery: string
  setResellerSearchQuery: (q: string) => void
  resellerStatusFilter: string
  setResellerStatusFilter: (s: string) => void
  resellerCityFilter: string
  setResellerCityFilter: (s: string) => void
  filteredResellers: Reseller[]
  intSearchQuery: string
  setIntSearchQuery: (q: string) => void
  intStatusFilter: string
  setIntStatusFilter: (s: string) => void
  filteredInteractions: Interaction[]
  activePayables: boolean
  setActivePayables: (v: boolean) => void
  addClient: (c: Omit<Client, 'id'>) => void
  updateClient: (id: string, u: Partial<Client>) => void
  deleteClient: (id: string) => void
  restoreClient: (id: string) => void
  hardDeleteClient: (id: string) => void
  deleteAllClients: () => void
  renewClient: (id: string, days: number) => void
  importClients: (newClients: Omit<Client, 'id'>[]) => void
  processTransaction: (p: ProcessTxPayload) => void
  deleteTransaction: (id: string) => void
  saveInventoryItem: (
    i: Omit<InventoryItem, 'id'>,
    itemTiers: Omit<PriceTier, 'id' | 'itemId'>[],
  ) => void
  updateInventoryItem: (
    id: string,
    item: Partial<InventoryItem>,
    itemTiers?: Omit<PriceTier, 'id' | 'itemId'>[],
  ) => void
  deleteTier: (id: string) => void
  addReseller: (r: Omit<Reseller, 'id' | 'registrationDate'>) => void
  updateReseller: (id: string, updates: Partial<Reseller>) => void
  deleteReseller: (id: string) => void
  addBank: (b: Omit<Bank, 'id'>) => void
  updateBank: (id: string, u: Partial<Bank>) => void
  deleteBank: (id: string) => void
  addPayable: (p: Omit<Payable, 'id'>) => void
  updatePayable: (id: string, u: Partial<Payable>) => void
  deletePayable: (id: string) => void
  payPayable: (id: string) => void
  updateTemplates: (t: MessageTemplates) => void
  updateMetaConfig: (c: MetaApiConfig) => void
  updateEvolutionConfig: (c: EvolutionApiConfig) => void
  updateWApiConfig: (c: WApiConfig) => void
  resetWApiConfig: () => void
  generateEvolutionQr: () => void
  simulateEvolutionConnect: () => void
  disconnectEvolution: () => void
  simulateWebhookMessage: (
    phone: string,
    text: string,
    hasMedia: boolean,
    source?: 'Meta' | 'Evolution' | 'W-API',
    senderLid?: string,
  ) => boolean
  sendManualMessage: (interactionId: string, text: string) => void
  updateReceiptStatus: (id: string, status: ReceiptStatus, actor?: 'User' | 'System') => void
  updateInteractionStatus: (id: string, status: InteractionStatus) => void
}

const MainStoreContext = createContext<MainStoreContextType | undefined>(undefined)

const defaultTemplates: MessageTemplates = {
  active:
    'Olá {{nome}}, tudo bem? Seu plano {{servico}} vence em {{vencimento}}. Para não ficar sem acesso, realize o pagamento.',
  expired:
    'Olá {{nome}}! Notamos que seu plano {{servico}} venceu em {{vencimento}}. Deseja renovar seu acesso?',
  deleted: 'Olá {{nome}}, sua conta do serviço {{servico}} foi desativada.',
  credentials:
    'Olá {{nome}}!\n\nAqui estão seus dados de acesso para o {{servico}}:\n*Usuário:* {{usuario}}\n*Senha:* {{senha}}\n\nQualquer dúvida, estamos à disposição!',
}

export const MainStoreProvider = ({ children }: { children: ReactNode }) => {
  const [currentPlan, setCurrentPlan] = useState<PlanId>('diamond')

  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:clients')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse clients from local storage', e)
    }
    return mockClients
  })

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:transactions')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse transactions from local storage', e)
    }
    return mockTransactions
  })

  const [banks, setBanks] = useState<Bank[]>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:banks')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse banks from local storage', e)
    }
    return mockBanks
  })

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:inventory')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse inventory from local storage', e)
    }
    return mockInventory
  })

  const [tiers, setTiers] = useState<PriceTier[]>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:tiers')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse tiers from local storage', e)
    }
    return mockTiers
  })

  const [resellers, setResellers] = useState<Reseller[]>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:resellers')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse resellers from local storage', e)
    }
    return mockResellers
  })

  const [payables, setPayables] = useState<Payable[]>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:payables')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse payables from local storage', e)
    }
    return mockPayables
  })

  const [templates, setTemplates] = useState<MessageTemplates>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:templates')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse templates from local storage', e)
    }
    return defaultTemplates
  })

  const [metaConfig, setMetaConfig] = useState<MetaApiConfig>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:metaConfig')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse metaConfig from local storage', e)
    }
    return { accessToken: '', phoneNumberId: '', wabaId: '', verifyToken: '' }
  })

  const [evolutionConfig, setEvolutionConfig] = useState<EvolutionApiConfig>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:evolutionConfig')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse evolutionConfig', e)
    }
    return { instanceUrl: '', apiKey: '', instanceName: '' }
  })

  const [wApiConfig, setWApiConfig] = useState<WApiConfig>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:wApiConfig')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse wApiConfig', e)
    }
    return {
      instanceId: 'LITE-D8WI1J-39WIQX',
      instanceToken: 'XrkcBDO35lX4MoVvOdfh6aEt7SjduvlPo',
      instanceName: 'SKIP',
      pixKey: '12.345.678/0001-90',
      extraKnowledge:
        'Nosso horário de atendimento é das 08h às 18h. Para assinaturas anuais, oferecemos 10% de desconto.',
      isActive: true,
    }
  })

  const [evolutionStatus, setEvolutionStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected')
  const [evolutionQrCode, setEvolutionQrCode] = useState<string | null>(null)

  const [interactions, setInteractions] = useState<Interaction[]>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:interactions')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse interactions from local storage', e)
    }
    return mockInteractions
  })

  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:receipts')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse receipts from local storage', e)
    }
    return mockReceipts
  })

  useEffect(() => {
    localStorage.setItem('@financeflow:currentPlan', currentPlan)
  }, [currentPlan])
  useEffect(() => {
    localStorage.setItem('@financeflow:clients', JSON.stringify(clients))
  }, [clients])
  useEffect(() => {
    localStorage.setItem('@financeflow:transactions', JSON.stringify(transactions))
  }, [transactions])
  useEffect(() => {
    localStorage.setItem('@financeflow:banks', JSON.stringify(banks))
  }, [banks])
  useEffect(() => {
    localStorage.setItem('@financeflow:inventory', JSON.stringify(inventory))
  }, [inventory])
  useEffect(() => {
    localStorage.setItem('@financeflow:tiers', JSON.stringify(tiers))
  }, [tiers])
  useEffect(() => {
    localStorage.setItem('@financeflow:resellers', JSON.stringify(resellers))
  }, [resellers])
  useEffect(() => {
    localStorage.setItem('@financeflow:payables', JSON.stringify(payables))
  }, [payables])
  useEffect(() => {
    localStorage.setItem('@financeflow:templates', JSON.stringify(templates))
  }, [templates])
  useEffect(() => {
    localStorage.setItem('@financeflow:metaConfig', JSON.stringify(metaConfig))
  }, [metaConfig])
  useEffect(() => {
    localStorage.setItem('@financeflow:evolutionConfig', JSON.stringify(evolutionConfig))
  }, [evolutionConfig])
  useEffect(() => {
    localStorage.setItem('@financeflow:wApiConfig', JSON.stringify(wApiConfig))
  }, [wApiConfig])
  useEffect(() => {
    localStorage.setItem('@financeflow:interactions', JSON.stringify(interactions))
  }, [interactions])
  useEffect(() => {
    localStorage.setItem('@financeflow:receipts', JSON.stringify(receipts))
  }, [receipts])

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')

  const [txSearchQuery, setTxSearchQuery] = useState('')
  const [txTypeFilter, setTxTypeFilter] = useState('all')
  const [txBankFilter, setTxBankFilter] = useState('all')
  const [txPeriodFilter, setTxPeriodFilter] = useState('all')

  const [resellerSearchQuery, setResellerSearchQuery] = useState('')
  const [resellerStatusFilter, setResellerStatusFilter] = useState('all')
  const [resellerCityFilter, setResellerCityFilter] = useState('all')

  const [intSearchQuery, setIntSearchQuery] = useState('')
  const [intStatusFilter, setIntStatusFilter] = useState('all')

  const [activePayables, setActivePayables] = useState(false)

  const setPlan = (plan: PlanId) => setCurrentPlan(plan)

  const updateBankBalance = (bankId: string, amount: number) =>
    setBanks((prev) =>
      prev.map((b) => (b.id === bankId ? { ...b, balance: b.balance + amount } : b)),
    )

  const updateStock = (itemId: string, qty: number, isIncrease: boolean) =>
    setInventory((prev) =>
      prev.map((i) =>
        i.id === itemId && i.stockControl
          ? { ...i, currentStock: i.currentStock + (isIncrease ? qty : -qty) }
          : i,
      ),
    )

  const addBank = (b: Omit<Bank, 'id'>) => {
    let newBanks = [...banks]
    if (b.isDefault)
      newBanks = newBanks.map((x) => (x.type === b.type ? { ...x, isDefault: false } : x))
    setBanks([...newBanks, { ...b, id: Math.random().toString(36).substr(2, 9) }])
  }

  const updateBank = (id: string, u: Partial<Bank>) => {
    setBanks((prev) => {
      let updated = [...prev]
      const current = updated.find((x) => x.id === id)
      const isNowDefault = u.isDefault !== undefined ? u.isDefault : current?.isDefault
      const typeNow = u.type !== undefined ? u.type : current?.type

      if (isNowDefault) {
        updated = updated.map((x) =>
          x.type === typeNow && x.id !== id ? { ...x, isDefault: false } : x,
        )
      }
      return updated.map((b) => (b.id === id ? { ...b, ...u } : b))
    })
  }

  const deleteBank = (id: string) => setBanks((prev) => prev.filter((b) => b.id !== id))

  const processTransaction = (payload: ProcessTxPayload) => {
    const now = new Date().toISOString()
    const genId = () => Math.random().toString(36).substr(2, 9)

    if (payload.action === 'transfer') {
      const id1 = genId()
      const id2 = genId()
      const tx1: Transaction = {
        id: id1,
        date: now,
        type: 'Transferência Interna',
        entry: 0,
        cost: payload.amount,
        profit: -payload.amount,
        bankId: payload.fromBank,
        description: `Saída: Transferência enviada - ${payload.desc}`,
        linkedTransferId: id2,
      }
      const tx2: Transaction = {
        id: id2,
        date: now,
        type: 'Transferência Interna',
        entry: payload.amount,
        cost: 0,
        profit: payload.amount,
        bankId: payload.toBank,
        description: `Entrada: Transferência recebida - ${payload.desc}`,
        linkedTransferId: id1,
      }
      setTransactions((prev) => [tx2, tx1, ...prev])
      updateBankBalance(payload.fromBank, -payload.amount)
      updateBankBalance(payload.toBank, payload.amount)
      return
    }

    if (payload.action === 'reverse') {
      const orig = transactions.find((t) => t.id === payload.originalId)
      if (!orig) return
      const revTx: Transaction = {
        ...orig,
        id: genId(),
        date: now,
        type: 'Estorno Financeiro',
        entry: -orig.entry,
        cost: -orig.cost,
        profit: -orig.profit,
        description: `ESTORNO: ${orig.description}`,
        isReversal: true,
        originalTxId: orig.id,
      }
      setTransactions((prev) => [revTx, ...prev])

      if (orig.splitDistribution) {
        if (orig.splitDistribution.costBankId)
          updateBankBalance(orig.splitDistribution.costBankId, -orig.splitDistribution.costAmount)
        if (orig.splitDistribution.profitBankId)
          updateBankBalance(
            orig.splitDistribution.profitBankId,
            -orig.splitDistribution.profitAmount,
          )
      } else {
        updateBankBalance(orig.bankId, -orig.profit)
      }

      if (orig.itemId && orig.qty) {
        const isSales = ['Venda para Revenda', 'Taxa de Ativação', 'Renovação de Cliente'].includes(
          orig.type,
        )
        updateStock(orig.itemId, orig.qty, isSales)
      }
      return
    }

    if (payload.action === 'standard') {
      const { tx } = payload
      const pct = tx.entry > 0 ? (tx.profit / tx.entry) * 100 : 0
      const newTx: Transaction = { ...tx, id: genId(), date: tx.date || now, profitPercentage: pct }

      const isSale = ['Venda para Revenda', 'Taxa de Ativação', 'Renovação de Cliente'].includes(
        tx.type,
      )

      if (isSale && (tx.entry > 0 || tx.cost > 0)) {
        const defaultCusto = banks.find((b) => b.type === 'Custo' && b.isDefault)
        const defaultDisponivel = banks.find((b) => b.type === 'Disponível' && b.isDefault)
        const defaultContas = banks.find((b) => b.type === 'Contas' && b.isDefault)

        const targetCostBankId = defaultCusto?.id || tx.bankId
        const targetProfitBankId =
          activePayables && defaultContas ? defaultContas.id : defaultDisponivel?.id || tx.bankId

        updateBankBalance(targetCostBankId, tx.cost)
        updateBankBalance(targetProfitBankId, tx.profit)

        newTx.splitDistribution = {
          costBankId: targetCostBankId,
          profitBankId: targetProfitBankId,
          costAmount: tx.cost,
          profitAmount: tx.profit,
        }
      } else {
        updateBankBalance(tx.bankId, tx.profit)
      }

      setTransactions((prev) => [newTx, ...prev])

      if (tx.itemId && tx.qty) {
        if (isSale) updateStock(tx.itemId, tx.qty, false)
        if (['Compra de Estoque', 'Compra de Ativação'].includes(tx.type))
          updateStock(tx.itemId, tx.qty, true)
      }
    }
  }

  const deleteTransaction = (id: string) => {
    const orig = transactions.find((t) => t.id === id)
    if (!orig) return
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    if (orig.splitDistribution) {
      if (orig.splitDistribution.costBankId)
        updateBankBalance(orig.splitDistribution.costBankId, -orig.splitDistribution.costAmount)
      if (orig.splitDistribution.profitBankId)
        updateBankBalance(orig.splitDistribution.profitBankId, -orig.splitDistribution.profitAmount)
    } else {
      updateBankBalance(orig.bankId, -orig.profit)
    }
    if (orig.itemId && orig.qty) {
      const isSales = ['Venda para Revenda', 'Taxa de Ativação', 'Renovação de Cliente'].includes(
        orig.type,
      )
      updateStock(orig.itemId, orig.qty, isSales)
    }
  }

  const saveInventoryItem = (
    item: Omit<InventoryItem, 'id'>,
    itemTiers: Omit<PriceTier, 'id' | 'itemId'>[],
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    setInventory((prev) => [{ ...item, id }, ...prev])
    setTiers((prev) => [
      ...itemTiers.map((t) => ({ ...t, id: Math.random().toString(36).substr(2, 9), itemId: id })),
      ...prev,
    ])
  }

  const updateInventoryItem = (
    id: string,
    item: Partial<InventoryItem>,
    itemTiers?: Omit<PriceTier, 'id' | 'itemId'>[],
  ) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, ...item } : i)))
    if (itemTiers) {
      setTiers((prev) => prev.filter((t) => t.itemId !== id))
      setTiers((prev) => [
        ...itemTiers.map((t) => ({
          ...t,
          id: Math.random().toString(36).substr(2, 9),
          itemId: id,
        })),
        ...prev,
      ])
    }
  }

  const deleteTier = (id: string) => {
    setTiers((prev) => prev.filter((t) => t.id !== id))
  }

  const addReseller = (r: Omit<Reseller, 'id' | 'registrationDate'>) => {
    setResellers((prev) => [
      {
        ...r,
        id: Math.random().toString(36).substr(2, 9),
        registrationDate: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const updateReseller = (id: string, updates: Partial<Reseller>) => {
    setResellers((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
  }

  const deleteReseller = (id: string) => {
    setResellers((prev) => prev.filter((r) => r.id !== id))
  }

  const addClient = (c: Omit<Client, 'id'>) =>
    setClients([...clients, { ...c, id: Math.random().toString(36).substr(2, 9) }])
  const updateClient = (id: string, u: Partial<Client>) =>
    setClients(clients.map((c) => (c.id === id ? { ...c, ...u } : c)))
  const deleteClient = (id: string) => updateClient(id, { deleted: true })
  const restoreClient = (id: string) => updateClient(id, { deleted: false })
  const hardDeleteClient = (id: string) => setClients((prev) => prev.filter((c) => c.id !== id))
  const deleteAllClients = () => setClients([])

  const importClients = (newClients: Omit<Client, 'id'>[]) => {
    const clientsWithId = newClients.map((c) => ({
      ...c,
      id: Math.random().toString(36).substr(2, 9),
    }))
    setClients((prev) => [...clientsWithId, ...prev])
  }

  const renewClient = (id: string, days: number) => {
    const client = clients.find((c) => c.id === id)
    if (!client) return

    let baseDate = new Date(client.expiryDate)
    const isManualAdjust = [-1, 1].includes(days)

    if (isManualAdjust) {
      baseDate.setDate(baseDate.getDate() + days)
      updateClient(id, { expiryDate: baseDate.toISOString() })
      return
    }

    const currentStatus = getClientStatus(client.expiryDate, client.status)
    if (['Vencido', 'Vencido +30d'].includes(currentStatus || '')) baseDate = new Date()
    baseDate.setDate(baseDate.getDate() + days)

    if ([15, 30, 31].includes(days)) {
      const invItem = inventory.find((i) => i.name.toLowerCase() === client.service.toLowerCase())
      const actualCost = invItem ? invItem.unitCost : client.cost || 0

      processTransaction({
        action: 'standard',
        tx: {
          type: 'Renovação de Cliente',
          entry: client.price,
          cost: actualCost,
          profit: client.price - actualCost,
          bankId: banks[0]?.id || '',
          description: `Renovação Auto - ${client.name}`,
          clientId: client.id,
          service: client.service,
          itemId: invItem?.id,
          qty: 1,
        },
      })
    }
    updateClient(id, {
      expiryDate: baseDate.toISOString(),
      lastExpiryDate: client.expiryDate,
      status: client.status === 'Devedor' ? 'Devedor' : null,
    })
  }

  const addPayable = (p: Omit<Payable, 'id'>) =>
    setPayables((prev) => [{ ...p, id: Math.random().toString(36).substr(2, 9) }, ...prev])
  const updatePayable = (id: string, u: Partial<Payable>) =>
    setPayables((prev) => prev.map((x) => (x.id === id ? { ...x, ...u } : x)))
  const deletePayable = (id: string) => setPayables((prev) => prev.filter((x) => x.id !== id))
  const payPayable = (id: string) => {
    const p = payables.find((x) => x.id === id)
    if (!p) return
    const defaultContas = banks.find((b) => b.type === 'Contas' && b.isDefault) || banks[0]
    processTransaction({
      action: 'standard',
      tx: {
        type: 'Pagamento de Contas',
        entry: 0,
        cost: p.amount,
        profit: -p.amount,
        bankId: defaultContas?.id || '',
        description: `Pagamento: ${p.description}`,
      },
    })
    updatePayable(id, { status: 'Pago', paymentDate: new Date().toISOString() })
  }

  const updateTemplates = (newTemplates: MessageTemplates) => setTemplates(newTemplates)
  const updateMetaConfig = (config: MetaApiConfig) => setMetaConfig(config)
  const updateEvolutionConfig = (config: EvolutionApiConfig) => setEvolutionConfig(config)

  const updateWApiConfig = (config: WApiConfig) => setWApiConfig(config)
  const resetWApiConfig = () =>
    setWApiConfig({
      instanceId: '',
      instanceToken: '',
      instanceName: '',
      pixKey: '',
      extraKnowledge: '',
      isActive: false,
    })

  const generateEvolutionQr = () => {
    setEvolutionStatus('connecting')
    setEvolutionQrCode('https://img.usecurling.com/i?q=qrcode&shape=lineal-color')
  }

  const simulateEvolutionConnect = () => {
    setEvolutionStatus('connected')
    setEvolutionQrCode(null)
  }

  const disconnectEvolution = () => {
    setEvolutionStatus('disconnected')
    setEvolutionQrCode(null)
  }

  const addAuditLogToInteraction = (interactionId: string | undefined, log: AuditLog) => {
    if (!interactionId) return
    setInteractions((prev) =>
      prev.map((i) =>
        i.id === interactionId ? { ...i, auditLogs: [...(i.auditLogs || []), log] } : i,
      ),
    )
  }

  const sendManualMessage = (interactionId: string, text: string) => {
    setInteractions((prev) =>
      prev.map((i) => {
        if (i.id === interactionId) {
          const newMessage: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            role: 'human',
            text,
            timestamp: new Date().toISOString(),
          }
          const activeSource = wApiConfig.isActive
            ? 'W-API'
            : evolutionStatus === 'connected'
              ? 'Evolution API'
              : 'Meta API'

          return {
            ...i,
            status: 'em_atendimento_humano',
            chatHistory: [...(i.chatHistory || []), newMessage],
            auditLogs: [
              ...(i.auditLogs || []),
              {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString(),
                action: 'Mensagem Manual Enviada',
                actor: 'User',
                correlationId: i.correlationId,
                details: `Enviado via ${activeSource}: ${text}`,
              },
            ],
          }
        }
        return i
      }),
    )
  }

  const simulateWebhookMessage = (
    phone: string,
    text: string,
    hasMedia: boolean,
    source: 'Meta' | 'Evolution' | 'W-API' = 'W-API',
    senderLid?: string,
  ): boolean => {
    if (source === 'W-API') {
      if (!wApiConfig.isActive) return false
      if (!wApiConfig.instanceId || !wApiConfig.instanceToken) return false
    }

    const primaryIdentifier = senderLid || phone
    let cleanedPhone = cleanPhone(primaryIdentifier)
    if (!cleanedPhone.includes('@lid')) {
      if (cleanedPhone.startsWith('0')) cleanedPhone = cleanedPhone.substring(1)
      if (!cleanedPhone.startsWith('55')) cleanedPhone = `55${cleanedPhone}`
    }

    const clientMatch = clients.find((c) => {
      const cPhone = cleanPhone(c.phone)
      if (cPhone.includes('@lid') || cleanedPhone.includes('@lid')) {
        return cPhone === cleanedPhone
      }
      return (
        cPhone === cleanedPhone ||
        '55' + cPhone === cleanedPhone ||
        cPhone === cleanedPhone.substring(2)
      )
    })

    const isDiamond = currentPlan === 'diamond'

    let existingInteraction = interactions.find(
      (i) => i.phone === cleanedPhone && i.status !== 'encerrado',
    )
    const interactionId = existingInteraction
      ? existingInteraction.id
      : Math.random().toString(36).substr(2, 9)
    const correlationId = existingInteraction
      ? existingInteraction.correlationId
      : 'sim_' + Date.now()

    let intent: InteractionIntent = 'dúvidas gerais'
    let confidence = 0.85
    let status: InteractionStatus = existingInteraction
      ? existingInteraction.status
      : clientMatch
        ? 'cliente_identificado'
        : 'novo_contato'
    const textLower = text.toLowerCase()

    let aiResponse = ''
    let isTroubleshooting = false
    let autoRenewed = false

    if (
      textLower.includes('humano') ||
      textLower.includes('atendente') ||
      textLower.includes('falar com')
    ) {
      intent = 'solicitar suporte humano'
      status = 'aguardando_atendimento_humano'
      confidence = 0.95
      aiResponse = 'Transferindo para um atendente humano. Aguarde um momento.'
    } else if (
      hasMedia ||
      textLower.includes('comprovante') ||
      textLower.includes('pix') ||
      textLower.includes('recibo')
    ) {
      intent = 'enviar comprovante'
      status = 'comprovante_recebido'
      if (isDiamond && hasMedia && clientMatch) {
        autoRenewed = true
        status = 'renovacao_executada'
      }
    } else if (
      textLower.includes('travando') ||
      textLower.includes('travamento') ||
      textLower.includes('fora do ar') ||
      textLower.includes('lenta')
    ) {
      intent = 'suporte técnico'
      if (isDiamond) {
        aiResponse = 'Certo, já estou verificando a sua conexão.'
        isTroubleshooting = true
      }
    } else if (
      textLower.includes('vencimento') ||
      textLower.includes('vence') ||
      textLower.includes('quando vence')
    ) {
      intent = 'solicitar informações sobre vencimento'
      if (isDiamond) {
        aiResponse = clientMatch
          ? `Seu plano vence em ${formatDate(clientMatch.expiryDate)}.`
          : 'Não encontrei seu cadastro. Por favor, informe seu usuário ou nome completo.'
      }
    } else if (
      textLower.includes('usuário') ||
      textLower.includes('usuario') ||
      textLower.includes('senha') ||
      textLower.includes('dados')
    ) {
      intent = 'consultar dados'
      if (isDiamond) {
        aiResponse = clientMatch
          ? `Aqui estão seus dados de acesso:\n*Usuário:* ${clientMatch.user || 'Não definido'}\n*Senha:* ${clientMatch.password || 'Não definida'}`
          : 'Não encontrei seu cadastro para informar os dados de acesso.'
      }
    } else if (
      textLower.includes('preço') ||
      textLower.includes('valor') ||
      textLower.includes('comprar') ||
      textLower.includes('planos')
    ) {
      intent = 'vendas e financeiro'
      if (isDiamond) {
        const prices = inventory
          .filter((i) => i.category === 'Revenda' || i.category === 'Serviço Recorrente')
          .map((i) => `- ${i.name}: R$ ${i.unitCost.toFixed(2)}`)
          .join('\n')
        const pix = wApiConfig.pixKey || 'Não configurada'
        aiResponse = `Nossos serviços disponíveis:\n${prices}\n\nPara pagar, utilize nossa chave PIX: ${pix}`
      }
    } else if (
      textLower.includes('oi') ||
      textLower.includes('ola') ||
      textLower.includes('olá') ||
      textLower.includes('boa tarde') ||
      textLower.includes('bom dia')
    ) {
      intent = 'dúvidas gerais'
      if (isDiamond) {
        aiResponse = clientMatch
          ? `Boa tarde, ${clientMatch.name}, no que podemos ajudar?`
          : 'Olá! Sou o assistente virtual. Como posso ajudar você hoje?'
      }
    } else {
      if (isDiamond && wApiConfig.extraKnowledge && textLower.length > 5) {
        intent = 'dúvidas gerais'
        aiResponse = `Baseado em nossas diretrizes: ${wApiConfig.extraKnowledge}`
      } else {
        intent = 'dúvidas gerais'
        aiResponse = 'Como posso ajudar?'
      }
    }

    if (
      !clientMatch &&
      status !== 'aguardando_atendimento_humano' &&
      status !== 'novo_contato' &&
      !autoRenewed &&
      status !== 'em_atendimento_humano'
    ) {
      confidence = 0.4
      status = 'aguardando_atendimento_humano'
    }

    let receiptId = existingInteraction?.receiptId
    const sourceName =
      source === 'Evolution' ? 'Evolution API' : source === 'W-API' ? 'W-API' : 'Meta Cloud API'

    const newLogs: AuditLog[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        action: 'Webhook Recebido',
        actor: 'System',
        correlationId,
        details: `Payload ${sourceName} processado via /api/webhook. (Destino: 5551996111046)`,
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        action: 'Classificação de Intenção (IA)',
        actor: 'AI',
        correlationId,
        details: `Intenção classificada como '${intent}' (Confiança: ${(confidence * 100).toFixed(0)}%).`,
      },
    ]

    if (intent === 'enviar comprovante' && hasMedia) {
      receiptId = Math.random().toString(36).substr(2, 9)
      let recStatus: ReceiptStatus = autoRenewed ? 'pagamento_validado' : 'comprovante_recebido'
      let recNotes = autoRenewed
        ? 'Auto-renovado +30d e lançamento gerado no financeiro (IA).'
        : undefined

      const newReceipt: Receipt = {
        id: receiptId,
        clientId: clientMatch?.id,
        phone: cleanedPhone,
        timestamp: new Date().toISOString(),
        fileAttachment: 'https://img.usecurling.com/p/400/600?q=receipt&color=gray',
        status: recStatus,
        notes: recNotes,
      }
      setReceipts((prev) => [newReceipt, ...prev])

      if (autoRenewed && clientMatch) {
        renewClient(clientMatch.id, 30)
        let newExp = new Date(clientMatch.expiryDate)
        const curStatus = getClientStatus(clientMatch.expiryDate, clientMatch.status)
        if (['Vencido', 'Vencido +30d'].includes(curStatus || '')) newExp = new Date()
        newExp.setDate(newExp.getDate() + 30)

        aiResponse = `Recebi seu comprovante e já renovei seu acesso até ${formatDate(newExp.toISOString())}, obrigado!`

        newLogs.push({
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          action: 'Renovação Executada',
          actor: 'AI',
          correlationId,
          details: `Comprovante analisado via OCR. Cliente ${clientMatch.name} renovado +30d automaticamente.`,
        })
      } else {
        newLogs.push({
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          action: 'Comprovante Extraído',
          actor: 'System',
          correlationId,
          details: `Mídia recebida. Aguardando validação manual ou regras falharam.`,
        })
      }
    }

    if (!clientMatch) {
      newLogs.push({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        action: 'Cliente Não Identificado',
        actor: 'System',
        correlationId,
        details: `Número não encontrado na base. Solicitado dados adicionais.`,
      })
    }

    if (aiResponse) {
      newLogs.push({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        action: 'Resposta Enviada (IA)',
        actor: 'AI',
        correlationId,
        details: aiResponse,
      })
    }

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      text: text,
      timestamp: new Date().toISOString(),
      hasMedia,
    }

    let chatHistory = existingInteraction
      ? [...(existingInteraction.chatHistory || []), userMessage]
      : [userMessage]

    if (aiResponse) {
      chatHistory.push({
        id: Math.random().toString(36).substr(2, 9),
        role: 'ai',
        text: aiResponse,
        timestamp: new Date().toISOString(),
      })
    }

    if (existingInteraction) {
      setInteractions((prev) =>
        prev.map((i) =>
          i.id === interactionId
            ? {
                ...i,
                message: text,
                intent,
                aiConfidence: confidence,
                status,
                receiptId: receiptId || i.receiptId,
                chatHistory,
                auditLogs: [...(i.auditLogs || []), ...newLogs],
              }
            : i,
        ),
      )
    } else {
      const newInteraction: Interaction = {
        id: interactionId,
        conversationId: Math.random().toString(36).substr(2, 9),
        clientId: clientMatch?.id,
        phone: cleanedPhone,
        channel: 'whatsapp',
        message: text,
        intent,
        aiConfidence: confidence,
        receiptId,
        status,
        timestamp: new Date().toISOString(),
        correlationId,
        isOutbound: false,
        chatHistory,
        auditLogs: newLogs,
      }
      setInteractions((prev) => [newInteraction, ...prev])
    }

    if (clientMatch) {
      updateClient(clientMatch.id, { lastContactedDate: new Date().toISOString() })
    }

    if (isTroubleshooting) {
      setTimeout(() => {
        setInteractions((prev) =>
          prev.map((i) => {
            if (i.id === interactionId) {
              const followUpText =
                'Fizemos uma atualização, só precisamos que tire o modem da tomada e a TV também, me retorne se deu certo.'
              return {
                ...i,
                chatHistory: [
                  ...(i.chatHistory || []),
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    role: 'ai',
                    text: followUpText,
                    timestamp: new Date().toISOString(),
                  },
                ],
                auditLogs: [
                  ...(i.auditLogs || []),
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: new Date().toISOString(),
                    action: 'Follow-up Enviado (IA)',
                    actor: 'AI',
                    correlationId,
                    details: followUpText,
                  },
                ],
              }
            }
            return i
          }),
        )
      }, 60000)
    }

    return true
  }

  const updateReceiptStatus = (
    id: string,
    status: ReceiptStatus,
    actor: 'User' | 'System' = 'User',
  ) => {
    const receipt = receipts.find((r) => r.id === id)
    if (!receipt) return

    const interaction = interactions.find((i) => i.receiptId === id)
    const correlationId = interaction ? interaction.correlationId : `sys_${Date.now()}`

    if (status === 'pagamento_validado') {
      let rulesMet = false
      let clientMatch = null
      let invItemMatch = null

      if (receipt.clientId) {
        clientMatch = clients.find((c) => c.id === receipt.clientId)
        if (clientMatch) {
          invItemMatch = inventory.find(
            (i) => i.name.toLowerCase() === clientMatch!.service.toLowerCase(),
          )
          if (invItemMatch) {
            rulesMet = !invItemMatch.stockControl || invItemMatch.currentStock > 0
          } else {
            rulesMet = true
          }
        }
      }

      if (rulesMet && clientMatch) {
        renewClient(clientMatch.id, 30)
        setReceipts((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'pagamento_validado',
                  notes: 'Auto-renovado +30d e lançamento gerado no financeiro.',
                }
              : r,
          ),
        )
        if (interaction) {
          setInteractions((prev) =>
            prev.map((i) =>
              i.id === interaction.id
                ? {
                    ...i,
                    status: 'renovacao_executada',
                    actionExecuted: 'Renovado +30 dias',
                  }
                : i,
            ),
          )
        }
        addAuditLogToInteraction(interaction?.id, {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          action: 'Renovação Executada',
          actor,
          correlationId,
          details: `Cliente ${clientMatch.name} renovado por 30 dias. Saldo/Estoque atualizado e transação gerada.`,
        })
      } else {
        setReceipts((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'comprovante_em_analise',
                  notes: 'Estoque insuficiente ou cliente não mapeado.',
                }
              : r,
          ),
        )
        if (interaction) {
          setInteractions((prev) =>
            prev.map((i) =>
              i.id === interaction.id
                ? {
                    ...i,
                    status: 'aguardando_atendimento_humano',
                    errorLog: 'Falha Auto-Renovação: Regras não atendidas.',
                  }
                : i,
            ),
          )
        }
        addAuditLogToInteraction(interaction?.id, {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          action: 'Falha na Regra de Renovação',
          actor: 'System',
          correlationId,
          details: `Bloqueado por regras de negócio. Encaminhado para humano.`,
        })
      }
    } else {
      setReceipts((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))

      let interactionStatus: InteractionStatus = interaction?.status || 'encerrado'
      if (status === 'pagamento_nao_validado') interactionStatus = 'pagamento_nao_validado'
      if (status === 'comprovante_em_analise') interactionStatus = 'comprovante_em_analise'

      if (interaction) {
        setInteractions((prev) =>
          prev.map((i) => (i.id === interaction.id ? { ...i, status: interactionStatus } : i)),
        )
      }

      addAuditLogToInteraction(interaction?.id, {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        action: `Status alterado para ${status}`,
        actor,
        correlationId,
        details: `O status do comprovante foi atualizado manualmente ou pelo sistema.`,
      })
    }
  }

  const updateInteractionStatus = (id: string, status: InteractionStatus) => {
    setInteractions((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  const filteredClients = useMemo(
    () =>
      clients.filter((c) => {
        if (c.deleted) return false
        const st = getClientStatus(c.expiryDate, c.status)
        if (statusFilter !== 'all' && st !== statusFilter) return false
        if (serviceFilter !== 'all' && c.service !== serviceFilter) return false
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          return (
            c.name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            c.service.toLowerCase().includes(q) ||
            (st && st.toLowerCase().includes(q))
          )
        }
        return true
      }),
    [clients, searchQuery, statusFilter, serviceFilter],
  )

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((t) => {
      if (txTypeFilter !== 'all' && t.type !== txTypeFilter) return false
      if (txBankFilter !== 'all' && t.bankId !== txBankFilter) return false
      if (txPeriodFilter !== 'all') {
        const now = new Date()
        const txDate = new Date(t.date)
        if (txPeriodFilter === '7d' && (now.getTime() - txDate.getTime()) / 86400000 > 7)
          return false
        if (txPeriodFilter === '30d' && (now.getTime() - txDate.getTime()) / 86400000 > 30)
          return false
      }
      if (txSearchQuery) {
        const q = txSearchQuery.toLowerCase()
        return (
          t.description.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q) ||
          t.service?.toLowerCase().includes(q) ||
          t.obs?.toLowerCase().includes(q)
        )
      }
      return true
    })
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, txSearchQuery, txTypeFilter, txBankFilter, txPeriodFilter])

  const filteredResellers = useMemo(() => {
    let filtered = resellers.filter((r) => {
      if (resellerStatusFilter !== 'all' && r.status !== resellerStatusFilter) return false
      if (resellerCityFilter !== 'all' && r.city !== resellerCityFilter) return false
      if (resellerSearchQuery) {
        const q = resellerSearchQuery.toLowerCase()
        return r.name.toLowerCase().includes(q)
      }
      return true
    })
    return filtered.sort(
      (a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime(),
    )
  }, [resellers, resellerSearchQuery, resellerStatusFilter, resellerCityFilter])

  const filteredInteractions = useMemo(() => {
    let filtered = interactions.filter((i) => {
      if (intStatusFilter !== 'all' && i.status !== intStatusFilter) return false
      if (intSearchQuery) {
        const q = intSearchQuery.toLowerCase()
        const clientName = clients.find((c) => c.id === i.clientId)?.name?.toLowerCase() || ''
        return (
          i.phone.includes(q) ||
          i.message.toLowerCase().includes(q) ||
          i.intent?.toLowerCase().includes(q) ||
          clientName.includes(q)
        )
      }
      return true
    })
    return filtered.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  }, [interactions, intSearchQuery, intStatusFilter, clients])

  return (
    <MainStoreContext.Provider
      value={{
        currentPlan,
        setPlan,
        clients,
        transactions,
        banks,
        inventory,
        tiers,
        resellers,
        payables,
        templates,
        metaConfig,
        evolutionConfig,
        wApiConfig,
        evolutionStatus,
        evolutionQrCode,
        interactions,
        receipts,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        serviceFilter,
        setServiceFilter,
        filteredClients,
        txSearchQuery,
        setTxSearchQuery,
        txTypeFilter,
        setTxTypeFilter,
        txBankFilter,
        setTxBankFilter,
        txPeriodFilter,
        setTxPeriodFilter,
        filteredTransactions,
        resellerSearchQuery,
        setResellerSearchQuery,
        resellerStatusFilter,
        setResellerStatusFilter,
        resellerCityFilter,
        setResellerCityFilter,
        filteredResellers,
        intSearchQuery,
        setIntSearchQuery,
        intStatusFilter,
        setIntStatusFilter,
        filteredInteractions,
        activePayables,
        setActivePayables,
        addClient,
        updateClient,
        deleteClient,
        restoreClient,
        hardDeleteClient,
        deleteAllClients,
        importClients,
        renewClient,
        processTransaction,
        deleteTransaction,
        saveInventoryItem,
        updateInventoryItem,
        deleteTier,
        addReseller,
        updateReseller,
        deleteReseller,
        addBank,
        updateBank,
        deleteBank,
        addPayable,
        updatePayable,
        deletePayable,
        payPayable,
        updateTemplates,
        updateMetaConfig,
        updateEvolutionConfig,
        updateWApiConfig,
        resetWApiConfig,
        generateEvolutionQr,
        simulateEvolutionConnect,
        disconnectEvolution,
        simulateWebhookMessage,
        sendManualMessage,
        updateReceiptStatus,
        updateInteractionStatus,
      }}
    >
      {children}
    </MainStoreContext.Provider>
  )
}

export default function useMainStore() {
  const context = useContext(MainStoreContext)
  if (!context) throw new Error('useMainStore must be used within a MainStoreProvider')
  return context
}
