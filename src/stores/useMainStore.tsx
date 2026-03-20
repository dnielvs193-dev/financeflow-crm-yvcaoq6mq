import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react'
import { Client, Transaction, Bank, InventoryItem, PriceTier, Reseller, Payable } from '@/types'
import { getClientStatus } from '@/lib/formatters'
import {
  mockClients,
  mockBanks,
  mockTransactions,
  mockInventory,
  mockTiers,
  mockResellers,
  mockPayables,
} from '@/lib/mockData'

export type ProcessTxPayload =
  | { action: 'standard'; tx: Omit<Transaction, 'id' | 'date'> & { date?: string } }
  | { action: 'transfer'; fromBank: string; toBank: string; amount: number; desc: string }
  | { action: 'reverse'; originalId: string }

type MainStoreContextType = {
  clients: Client[]
  transactions: Transaction[]
  banks: Bank[]
  inventory: InventoryItem[]
  tiers: PriceTier[]
  resellers: Reseller[]
  payables: Payable[]
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
  activePayables: boolean
  setActivePayables: (v: boolean) => void
  addClient: (c: Omit<Client, 'id'>) => void
  updateClient: (id: string, u: Partial<Client>) => void
  deleteClient: (id: string) => void
  restoreClient: (id: string) => void
  hardDeleteClient: (id: string) => void
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
}

const MainStoreContext = createContext<MainStoreContextType | undefined>(undefined)

export const MainStoreProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('@financeflow:clients')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse clients from local storage', e)
    }
    return mockClients
  })
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [banks, setBanks] = useState<Bank[]>(mockBanks)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [tiers, setTiers] = useState<PriceTier[]>(mockTiers)
  const [resellers, setResellers] = useState<Reseller[]>(mockResellers)
  const [payables, setPayables] = useState<Payable[]>(mockPayables)

  useEffect(() => {
    localStorage.setItem('@financeflow:clients', JSON.stringify(clients))
  }, [clients])

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

  const [activePayables, setActivePayables] = useState(false)

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

  return (
    <MainStoreContext.Provider
      value={{
        clients,
        transactions,
        banks,
        inventory,
        tiers,
        resellers,
        payables,
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
        activePayables,
        setActivePayables,
        addClient,
        updateClient,
        deleteClient,
        restoreClient,
        hardDeleteClient,
        importClients,
        renewClient,
        processTransaction,
        deleteTransaction,
        saveInventoryItem,
        updateInventoryItem,
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
