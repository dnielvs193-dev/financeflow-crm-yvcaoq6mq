import { Client, Bank, Transaction, InventoryItem, PriceTier, Reseller } from '@/types'

export const mockClients: Client[] = [
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
]

export const mockBanks: Bank[] = [
  { id: 'b1', name: 'Nubank PJ', balance: 3250.5 },
  { id: 'b2', name: 'Itaú Caixa', balance: 1400.0 },
]

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv1',
    name: 'Créditos P2P',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: true,
    currentStock: 150,
  },
  {
    id: 'inv2',
    name: 'Taxa de Ativação App',
    category: 'Ativação',
    status: 'Ativo',
    stockControl: false,
    currentStock: 0,
  },
]

export const mockTiers: PriceTier[] = [
  { id: 't1', itemId: 'inv1', startQty: 1, endQty: 9, unitPrice: 20, unitCost: 10 },
  { id: 't2', itemId: 'inv1', startQty: 10, endQty: null, unitPrice: 15, unitCost: 8 },
  { id: 't3', itemId: 'inv2', startQty: 1, endQty: null, unitPrice: 15, unitCost: 0 },
]

export const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    date: new Date().toISOString(),
    type: 'Renovação de Cliente',
    entry: 35,
    cost: 10,
    profit: 25,
    profitPercentage: 71.4,
    bankId: 'b1',
    description: 'Renovação - João Silva - IPTV Premium',
    service: 'IPTV Premium',
    qty: 1,
  },
]

export const mockResellers: Reseller[] = [
  {
    id: 'r1',
    name: 'Carlos Distribuidor',
    status: 'Ativo',
    phone: '11977777777',
    city: 'São Paulo',
    clientCount: 45,
    purchaseIntention: 'Alta',
    registrationDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    observations: 'Excelente pagador, compra semanalmente.',
  },
  {
    id: 'r2',
    name: 'Ana Silva Revendas',
    status: 'Lead',
    phone: '21966666666',
    city: 'Rio de Janeiro',
    clientCount: 0,
    purchaseIntention: 'Estudando painel',
    registrationDate: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
]
