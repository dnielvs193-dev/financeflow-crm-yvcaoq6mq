import { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { Client, Transaction, Bank, InventoryItem, PriceTier } from '@/types'
import { getClientStatus } from '@/lib/formatters'
import { mockClients, mockBanks, mockTransactions, mockInventory, mockTiers } from '@/lib/mockData'

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
  searchQuery: string
  setSearchQuery: (q: string) => void
  statusFilter: string
  setStatusFilter: (s: string) => void
  serviceFilter: string
  setServiceFilter: (s: string) => void
  filteredClients: Client[]
  addClient: (c: Omit<Client, 'id'>) => void
  updateClient: (id: string, u: Partial<Client>) => void
  deleteClient: (id: string) => void
  restoreClient: (id: string) => void
  hardDeleteClient: (id: string) => void
  renewClient: (id: string, days: number) => void
  importClients: (newClients: Omit<Client, 'id'>[]) => void
  processTransaction: (p: ProcessTxPayload) => void
  saveInventoryItem: (
    i: Omit<InventoryItem, 'id'>,
    itemTiers: Omit<PriceTier, 'id' | 'itemId'>[],
  ) => void
}

const MainStoreContext = createContext<MainStoreContextType | undefined>(undefined)

export const MainStoreProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [banks, setBanks] = useState<Bank[]>(mockBanks)
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [tiers, setTiers] = useState<PriceTier[]>(mockTiers)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')

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
        cost: 0,
        profit: -payload.amount,
        bankId: payload.fromBank,
        description: `Transferência enviada - ${payload.desc}`,
        linkedTransferId: id2,
      }
      const tx2: Transaction = {
        id: id2,
        date: now,
        type: 'Transferência Interna',
        entry: 0,
        cost: 0,
        profit: payload.amount,
        bankId: payload.toBank,
        description: `Transferência recebida - ${payload.desc}`,
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
      updateBankBalance(orig.bankId, -orig.profit)
      if (orig.itemId && orig.qty) {
        const isSales = ['Venda para Revenda', 'Taxa de Ativação'].includes(orig.type)
        updateStock(orig.itemId, orig.qty, isSales) // Reverte o estoque
      }
      return
    }

    if (payload.action === 'standard') {
      const { tx } = payload
      const pct = tx.entry > 0 ? (tx.profit / tx.entry) * 100 : 0
      const newTx: Transaction = { ...tx, id: genId(), date: tx.date || now, profitPercentage: pct }
      setTransactions((prev) => [newTx, ...prev])
      updateBankBalance(tx.bankId, tx.profit)

      if (tx.itemId && tx.qty) {
        if (['Venda para Revenda', 'Taxa de Ativação'].includes(tx.type))
          updateStock(tx.itemId, tx.qty, false)
        if (['Compra de Estoque', 'Compra de Ativação'].includes(tx.type))
          updateStock(tx.itemId, tx.qty, true)
      }
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
    if (currentStatus === 'Vencido' || currentStatus === 'Vencido +30d') baseDate = new Date()
    baseDate.setDate(baseDate.getDate() + days)

    if ([15, 30, 31].includes(days)) {
      processTransaction({
        action: 'standard',
        tx: {
          type: 'Renovação de Cliente',
          entry: client.price,
          cost: client.cost,
          profit: client.price - client.cost,
          bankId: banks[0]?.id || '',
          description: `Renovação - ${client.name} - ${client.service}`,
          clientId: client.id,
          service: client.service,
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
            st.toLowerCase().includes(q)
          )
        }
        return true
      }),
    [clients, searchQuery, statusFilter, serviceFilter],
  )

  return (
    <MainStoreContext.Provider
      value={{
        clients,
        transactions,
        banks,
        inventory,
        tiers,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        serviceFilter,
        setServiceFilter,
        filteredClients,
        addClient,
        updateClient,
        deleteClient,
        restoreClient,
        hardDeleteClient,
        importClients,
        renewClient,
        processTransaction,
        saveInventoryItem,
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
