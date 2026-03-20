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
    id: 'inv_ativ',
    name: 'Ativação Padrão',
    category: 'Ativação',
    status: 'Ativo',
    stockControl: false,
    currentStock: 0,
    unitCost: 2.0,
  },
]

export const mockTiers: PriceTier[] = [
  { id: 't_g1', itemId: 'inv_goat', startQty: 5, endQty: 9, unitPrice: 9.0 },
  { id: 't_g2', itemId: 'inv_goat', startQty: 10, endQty: 29, unitPrice: 7.0 },
  { id: 't_g3', itemId: 'inv_goat', startQty: 30, endQty: 49, unitPrice: 6.5 },

  { id: 't_a1', itemId: 'inv_ativ', startQty: 1, endQty: null, unitPrice: 5.0 },
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
    mac: '00:1A:2B:3C:4D:5E',
    obs1: 'Cliente antigo',
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
    password: 'password123',
    dkey: 'DK-98765',
  },
]

export const mockBanks: Bank[] = [
  { id: 'b1', name: 'Nubank Disponível', balance: 3250.5, type: 'Disponível', isDefault: true },
  { id: 'b2', name: 'Cofre Estoque', balance: 1400.0, type: 'Custo', isDefault: true },
  { id: 'b3', name: 'Provisão Contas', balance: 0.0, type: 'Contas', isDefault: true },
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
    splitDistribution: {
      costBankId: 'b2',
      profitBankId: 'b1',
      costAmount: 3.5,
      profitAmount: 31.5,
    },
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
]
