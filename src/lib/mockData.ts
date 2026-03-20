import { Client, Bank, Transaction, InventoryItem, PriceTier, Reseller } from '@/types'

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv_goat',
    name: 'Goat',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: true,
    currentStock: 1500,
    unitCost: 3.5,
  },
  {
    id: 'inv_five',
    name: 'Five',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: true,
    currentStock: 2000,
    unitCost: 4.0,
  },
  {
    id: 'inv_live',
    name: 'Live',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: true,
    currentStock: 1200,
    unitCost: 3.8,
  },
  {
    id: 'inv_uniplay',
    name: 'UniPlay',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: true,
    currentStock: 800,
    unitCost: 4.5,
  },
  {
    id: 'inv_unitv',
    name: 'UniTV',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: true,
    currentStock: 650,
    unitCost: 7.0,
  },
]

export const mockTiers: PriceTier[] = [
  { id: 't_g1', itemId: 'inv_goat', startQty: 5, endQty: 9, unitPrice: 9.0 },
  { id: 't_g2', itemId: 'inv_goat', startQty: 10, endQty: 29, unitPrice: 7.0 },
  { id: 't_g3', itemId: 'inv_goat', startQty: 30, endQty: 49, unitPrice: 6.5 },
  { id: 't_g4', itemId: 'inv_goat', startQty: 50, endQty: 99, unitPrice: 6.0 },
  { id: 't_g5', itemId: 'inv_goat', startQty: 100, endQty: 499, unitPrice: 5.0 },
  { id: 't_g6', itemId: 'inv_goat', startQty: 500, endQty: 999, unitPrice: 4.5 },
  { id: 't_g7', itemId: 'inv_goat', startQty: 1000, endQty: 4999, unitPrice: 4.25 },
  { id: 't_g8', itemId: 'inv_goat', startQty: 5000, endQty: 100000, unitPrice: 4.0 },

  { id: 't_f1', itemId: 'inv_five', startQty: 5, endQty: 9, unitPrice: 12.0 },
  { id: 't_f2', itemId: 'inv_five', startQty: 10, endQty: 29, unitPrice: 10.0 },
  { id: 't_f3', itemId: 'inv_five', startQty: 30, endQty: 99, unitPrice: 8.0 },
  { id: 't_f4', itemId: 'inv_five', startQty: 100, endQty: 300, unitPrice: 7.0 },
  { id: 't_f5', itemId: 'inv_five', startQty: 301, endQty: 1000, unitPrice: 6.0 },
  { id: 't_f6', itemId: 'inv_five', startQty: 1001, endQty: 100000, unitPrice: 5.0 },

  { id: 't_l1', itemId: 'inv_live', startQty: 50, endQty: 150, unitPrice: 9.0 },
  { id: 't_l2', itemId: 'inv_live', startQty: 151, endQty: 300, unitPrice: 8.0 },
  { id: 't_l3', itemId: 'inv_live', startQty: 301, endQty: 700, unitPrice: 7.0 },
  { id: 't_l4', itemId: 'inv_live', startQty: 701, endQty: 1000, unitPrice: 6.0 },
  { id: 't_l5', itemId: 'inv_live', startQty: 1001, endQty: 100000, unitPrice: 5.0 },

  { id: 't_up1', itemId: 'inv_uniplay', startQty: 10, endQty: 49, unitPrice: 12.0 },
  { id: 't_up2', itemId: 'inv_uniplay', startQty: 50, endQty: 99, unitPrice: 10.0 },
  { id: 't_up3', itemId: 'inv_uniplay', startQty: 100, endQty: 299, unitPrice: 8.0 },
  { id: 't_up4', itemId: 'inv_uniplay', startQty: 300, endQty: 999, unitPrice: 7.0 },
  { id: 't_up5', itemId: 'inv_uniplay', startQty: 1000, endQty: 2999, unitPrice: 6.0 },
  { id: 't_up6', itemId: 'inv_uniplay', startQty: 3000, endQty: 5999, unitPrice: 5.0 },

  { id: 't_ut1', itemId: 'inv_unitv', startQty: 5, endQty: 9, unitPrice: 12.0 },
  { id: 't_ut2', itemId: 'inv_unitv', startQty: 10, endQty: 49, unitPrice: 10.0 },
  { id: 't_ut3', itemId: 'inv_unitv', startQty: 50, endQty: 99, unitPrice: 9.5 },
  { id: 't_ut4', itemId: 'inv_unitv', startQty: 100, endQty: 499, unitPrice: 8.75 },
  { id: 't_ut5', itemId: 'inv_unitv', startQty: 500, endQty: 100000, unitPrice: 8.5 },
]

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    service: 'Goat',
    panel: 'Painel 1',
    phone: '11999999999',
    expiryDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    price: 35,
    cost: 3.5,
    status: null,
    city: 'São Paulo',
    user: 'joao.silva',
  },
  {
    id: '2',
    name: 'Maria Souza',
    service: 'Five',
    panel: 'Painel 2',
    phone: '11988888888',
    expiryDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    price: 30,
    cost: 4.0,
    status: null,
    city: 'Rio de Janeiro',
    user: 'maria.s',
  },
]

export const mockBanks: Bank[] = [
  { id: 'b1', name: 'Nubank PJ', balance: 3250.5 },
  { id: 'b2', name: 'Itaú Caixa', balance: 1400.0 },
]

export const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    date: new Date().toISOString(),
    type: 'Renovação de Cliente',
    entry: 35,
    cost: 3.5,
    profit: 31.5,
    profitPercentage: 90,
    bankId: 'b1',
    description: 'Renovação - João Silva - Goat',
    service: 'Goat',
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
