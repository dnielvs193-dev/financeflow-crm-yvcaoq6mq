import { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { getClientStatus } from '@/lib/formatters'

export type ClientStatus = 'Devedor' | 'Vencido +30d' | null

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
}

export type Transaction = {
  id: string
  date: string
  type: string
  entry: number
  cost: number
  profit: number
  bankId: string
  description: string
  clientId?: string
  service?: string
  quantity?: number
}

export type Bank = {
  id: string
  name: string
  balance: number
}

type MainStoreContextType = {
  clients: Client[]
  transactions: Transaction[]
  banks: Bank[]
  searchQuery: string
  setSearchQuery: (q: string) => void
  statusFilter: string
  setStatusFilter: (s: string) => void
  serviceFilter: string
  setServiceFilter: (s: string) => void
  filteredClients: Client[]
  filteredTransactions: Transaction[]
  addClient: (client: Omit<Client, 'id'>) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void
  renewClient: (id: string, days: number) => void
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  importClients: (newClients: Omit<Client, 'id'>[]) => void
}

const MainStoreContext = createContext<MainStoreContextType | undefined>(undefined)

const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    service: 'IPTV Premium',
    panel: 'Painel 1',
    phone: '11999999999',
    expiryDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    price: 35,
    cost: 10,
    status: null,
    city: 'São Paulo',
    user: 'joao.silva',
  },
  {
    id: '2',
    name: 'Maria Souza',
    service: 'P2P Basic',
    panel: 'Painel 2',
    phone: '11988888888',
    expiryDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    price: 25,
    cost: 8,
    status: null,
    city: 'Rio de Janeiro',
    user: 'maria.s',
  },
  {
    id: '3',
    name: 'Pedro Santos',
    service: 'IPTV Premium',
    panel: 'Painel 1',
    phone: '11977777777',
    expiryDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    price: 35,
    cost: 10,
    status: 'Devedor',
    city: 'Belo Horizonte',
    user: 'pedro.santos',
  },
]

const mockBanks: Bank[] = [
  { id: 'b1', name: 'Nubank', balance: 1250.5 },
  { id: 'b2', name: 'Itaú', balance: 5400.0 },
]

const mockTransactions: Transaction[] = [
  {
    id: 't1',
    date: new Date().toISOString(),
    type: 'Clientes',
    entry: 35,
    cost: 10,
    profit: 25,
    bankId: 'b1',
    description: 'Renovação - Ana Costa - IPTV Premium',
    service: 'IPTV Premium',
    quantity: 1,
  },
]

export const MainStoreProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [banks, setBanks] = useState<Bank[]>(mockBanks)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')

  const addClient = (client: Omit<Client, 'id'>) =>
    setClients([...clients, { ...client, id: Math.random().toString(36).substr(2, 9) }])

  const updateClient = (id: string, updates: Partial<Client>) =>
    setClients(clients.map((c) => (c.id === id ? { ...c, ...updates } : c)))

  const deleteClient = (id: string) => updateClient(id, { deleted: true })

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    setTransactions([{ ...t, id: Math.random().toString(36).substr(2, 9) }, ...transactions])
    setBanks(banks.map((b) => (b.id === t.bankId ? { ...b, balance: b.balance + t.profit } : b)))
  }

  const renewClient = (id: string, days: number) => {
    const client = clients.find((c) => c.id === id)
    if (!client) return

    const isManualAdjust = [-1, 1].includes(days)
    let baseDate = new Date(client.expiryDate)

    if (isManualAdjust) {
      baseDate.setDate(baseDate.getDate() + days)
      updateClient(id, { expiryDate: baseDate.toISOString() })
      return
    }

    const currentStatus = getClientStatus(client.expiryDate, client.status)
    const lastDate = client.expiryDate

    if (currentStatus === 'Vencido' || currentStatus === 'Vencido +30d') {
      baseDate = new Date()
    }
    baseDate.setDate(baseDate.getDate() + days)

    addTransaction({
      date: new Date().toISOString(),
      type: 'Clientes',
      entry: client.price,
      cost: client.cost,
      profit: client.price - client.cost,
      bankId: banks[0]?.id || '',
      description: `Renovação - ${client.name} - ${client.service}`,
      clientId: client.id,
      service: client.service,
      quantity: 1,
    })

    const newStatus = client.status === 'Devedor' ? 'Devedor' : null
    updateClient(id, {
      expiryDate: baseDate.toISOString(),
      lastExpiryDate: lastDate,
      status: newStatus,
    })
  }

  const importClients = (newClients: Omit<Client, 'id'>[]) => {
    const clientsWithId = newClients.map((c) => ({
      ...c,
      id: Math.random().toString(36).substr(2, 9),
    }))
    setClients([...clientsWithId, ...clients])
  }

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
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
    })
  }, [clients, searchQuery, statusFilter, serviceFilter])

  const filteredTransactions = useMemo(() => {
    if (!searchQuery && statusFilter === 'all' && serviceFilter === 'all') return transactions
    const clientIds = new Set(filteredClients.map((c) => c.id))
    return transactions.filter((t) => (t.clientId ? clientIds.has(t.clientId) : true))
  }, [transactions, filteredClients, searchQuery, statusFilter, serviceFilter])

  return (
    <MainStoreContext.Provider
      value={{
        clients,
        transactions,
        banks,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        serviceFilter,
        setServiceFilter,
        filteredClients,
        filteredTransactions,
        addClient,
        updateClient,
        deleteClient,
        renewClient,
        addTransaction,
        importClients,
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
