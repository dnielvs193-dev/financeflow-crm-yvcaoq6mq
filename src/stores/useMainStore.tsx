import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export type Client = {
  id: string
  name: string
  service: string
  phone: string
  expiryDate: string
  price: number
  cost: number
  isDebtor: boolean
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
  addClient: (client: Omit<Client, 'id'>) => void
  updateClient: (id: string, updates: Partial<Client>) => void
  deleteClient: (id: string) => void
  restoreClient: (id: string) => void
  hardDeleteClient: (id: string) => void
  renewClient: (id: string, days: number) => void
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  addBank: (b: Omit<Bank, 'id'>) => void
}

const MainStoreContext = createContext<MainStoreContextType | undefined>(undefined)

const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    service: 'IPTV Premium',
    phone: '11999999999',
    expiryDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    price: 35,
    cost: 10,
    isDebtor: false,
  },
  {
    id: '2',
    name: 'Maria Souza',
    service: 'P2P Basic',
    phone: '11988888888',
    expiryDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    price: 25,
    cost: 8,
    isDebtor: false,
  },
  {
    id: '3',
    name: 'Pedro Santos',
    service: 'IPTV Premium',
    phone: '11977777777',
    expiryDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    price: 35,
    cost: 10,
    isDebtor: true,
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
    description: 'Renovação: Ana Costa - IPTV Premium',
  },
]

export const MainStoreProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [banks, setBanks] = useState<Bank[]>(mockBanks)

  const addClient = (client: Omit<Client, 'id'>) =>
    setClients([...clients, { ...client, id: Math.random().toString(36).substr(2, 9) }])
  const updateClient = (id: string, updates: Partial<Client>) =>
    setClients(clients.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  const deleteClient = (id: string) => updateClient(id, { deleted: true })
  const restoreClient = (id: string) => updateClient(id, { deleted: false })
  const hardDeleteClient = (id: string) => setClients(clients.filter((c) => c.id !== id))

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    setTransactions([{ ...t, id: Math.random().toString(36).substr(2, 9) }, ...transactions])
    setBanks(banks.map((b) => (b.id === t.bankId ? { ...b, balance: b.balance + t.profit } : b)))
  }

  const addBank = (b: Omit<Bank, 'id'>) =>
    setBanks([...banks, { ...b, id: Math.random().toString(36).substr(2, 9) }])

  const renewClient = (id: string, days: number) => {
    const client = clients.find((c) => c.id === id)
    if (!client) return

    const newExpiry = new Date()
    newExpiry.setDate(newExpiry.getDate() + days)

    addTransaction({
      date: new Date().toISOString(),
      type: 'Clientes',
      entry: client.price,
      cost: client.cost,
      profit: client.price - client.cost,
      bankId: banks[0]?.id || '',
      description: `Renovação: ${client.name} - ${client.service}`,
      clientId: client.id,
    })

    updateClient(id, { expiryDate: newExpiry.toISOString(), isDebtor: false })
  }

  return (
    <MainStoreContext.Provider
      value={{
        clients,
        transactions,
        banks,
        addClient,
        updateClient,
        deleteClient,
        restoreClient,
        hardDeleteClient,
        renewClient,
        addTransaction,
        addBank,
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
