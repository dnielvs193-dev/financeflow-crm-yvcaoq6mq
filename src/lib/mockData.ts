import {
  Client,
  Bank,
  Transaction,
  InventoryItem,
  PriceTier,
  Reseller,
  Payable,
  Interaction,
  Receipt,
} from '@/types'

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv_unitv',
    name: 'UniTV',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: false,
    currentStock: 0,
    unitCost: 8.75,
  },
  {
    id: 'inv_live',
    name: 'Live',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: false,
    currentStock: 0,
    unitCost: 8.0,
  },
  {
    id: 'inv_five',
    name: 'Five',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: false,
    currentStock: 0,
    unitCost: 8.0,
  },
  {
    id: 'inv_uniplay',
    name: 'UniPlay',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: false,
    currentStock: 0,
    unitCost: 10.0,
  },
  {
    id: 'inv_goat',
    name: 'Goat',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: true,
    currentStock: 10,
    unitCost: 6.0,
  },
  {
    id: 'inv_gsat',
    name: 'Gsat',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: false,
    currentStock: 0,
    unitCost: 7.0,
  },
  {
    id: 'inv_tvexpress',
    name: 'TVExpress',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: false,
    currentStock: 0,
    unitCost: 12.0,
  },
  {
    id: 'inv_redplay',
    name: 'RedPlay',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: false,
    currentStock: 0,
    unitCost: 11.0,
  },
  {
    id: 'inv_mfc',
    name: 'MFC',
    category: 'Revenda',
    status: 'Ativo',
    stockControl: false,
    currentStock: 0,
    unitCost: 9.0,
  },
  {
    id: 'inv_ativ',
    name: 'Taxa de Ativação Padrão',
    category: 'Ativação',
    status: 'Ativo',
    stockControl: false,
    currentStock: 0,
    unitCost: 2.0,
  },
]

export const mockTiers: PriceTier[] = [
  // Goat
  { id: 't_goat_1', itemId: 'inv_goat', startQty: 5, endQty: 9, unitPrice: 9.0 },
  { id: 't_goat_2', itemId: 'inv_goat', startQty: 10, endQty: 29, unitPrice: 7.0 },
  { id: 't_goat_3', itemId: 'inv_goat', startQty: 30, endQty: 49, unitPrice: 6.5 },
  { id: 't_goat_4', itemId: 'inv_goat', startQty: 50, endQty: 99, unitPrice: 6.0 },
  { id: 't_goat_5', itemId: 'inv_goat', startQty: 100, endQty: 499, unitPrice: 5.0 },
  { id: 't_goat_6', itemId: 'inv_goat', startQty: 500, endQty: 999, unitPrice: 4.5 },
  { id: 't_goat_7', itemId: 'inv_goat', startQty: 1000, endQty: 4999, unitPrice: 4.25 },
  { id: 't_goat_8', itemId: 'inv_goat', startQty: 5000, endQty: 100000, unitPrice: 4.0 },

  // Five
  { id: 't_five_1', itemId: 'inv_five', startQty: 10, endQty: 49, unitPrice: 12.0 },
  { id: 't_five_2', itemId: 'inv_five', startQty: 50, endQty: 99, unitPrice: 10.0 },
  { id: 't_five_3', itemId: 'inv_five', startQty: 100, endQty: 299, unitPrice: 8.0 },
  { id: 't_five_4', itemId: 'inv_five', startQty: 300, endQty: 999, unitPrice: 7.0 },
  { id: 't_five_5', itemId: 'inv_five', startQty: 1000, endQty: 4999, unitPrice: 6.0 },
  { id: 't_five_6', itemId: 'inv_five', startQty: 5000, endQty: 100000, unitPrice: 5.0 },

  // Live
  { id: 't_live_1', itemId: 'inv_live', startQty: 10, endQty: 50, unitPrice: 10.0 },
  { id: 't_live_2', itemId: 'inv_live', startQty: 51, endQty: 150, unitPrice: 9.0 },
  { id: 't_live_3', itemId: 'inv_live', startQty: 151, endQty: 300, unitPrice: 8.0 },
  { id: 't_live_4', itemId: 'inv_live', startQty: 301, endQty: 700, unitPrice: 7.0 },
  { id: 't_live_5', itemId: 'inv_live', startQty: 701, endQty: 1000, unitPrice: 6.0 },
  { id: 't_live_6', itemId: 'inv_live', startQty: 1001, endQty: 100000, unitPrice: 5.0 },

  // UniPlay
  { id: 't_uniplay_1', itemId: 'inv_uniplay', startQty: 10, endQty: 49, unitPrice: 12.0 },
  { id: 't_uniplay_2', itemId: 'inv_uniplay', startQty: 50, endQty: 99, unitPrice: 10.0 },
  { id: 't_uniplay_3', itemId: 'inv_uniplay', startQty: 100, endQty: 299, unitPrice: 8.0 },
  { id: 't_uniplay_4', itemId: 'inv_uniplay', startQty: 300, endQty: 999, unitPrice: 7.0 },
  { id: 't_uniplay_5', itemId: 'inv_uniplay', startQty: 1000, endQty: 2999, unitPrice: 6.0 },
  { id: 't_uniplay_6', itemId: 'inv_uniplay', startQty: 3000, endQty: 5999, unitPrice: 5.0 },

  // UniTV
  { id: 't_unitv_1', itemId: 'inv_unitv', startQty: 5, endQty: 5, unitPrice: 12.0 },
  { id: 't_unitv_2', itemId: 'inv_unitv', startQty: 10, endQty: 49, unitPrice: 10.0 },
  { id: 't_unitv_3', itemId: 'inv_unitv', startQty: 50, endQty: 99, unitPrice: 9.5 },
  { id: 't_unitv_4', itemId: 'inv_unitv', startQty: 100, endQty: 499, unitPrice: 8.75 },
  { id: 't_unitv_5', itemId: 'inv_unitv', startQty: 500, endQty: 100000, unitPrice: 8.5 },

  // Others
  { id: 't_gsat1', itemId: 'inv_gsat', startQty: 1, endQty: null, unitPrice: 30.0 },
  { id: 't_tvexpress1', itemId: 'inv_tvexpress', startQty: 1, endQty: null, unitPrice: 40.0 },
  { id: 't_redplay1', itemId: 'inv_redplay', startQty: 1, endQty: null, unitPrice: 38.0 },
  { id: 't_mfc1', itemId: 'inv_mfc', startQty: 1, endQty: null, unitPrice: 30.0 },
  { id: 't_ativ1', itemId: 'inv_ativ', startQty: 1, endQty: null, unitPrice: 5.0 },
]

const rawCsv = `Serviço;Status;Nome;Usuário;Senha;Vencimento;Telefone;Obs1;Obs2;Cidade;MAC;D_Key;Preço;Custo
Unitv;Ativo;Acacio V 21k9;2l1k9q;3wqpn;19/02/2026;55 51 999999991;;;Caxias;;;35,00;8,75
Unitv;Ativo;Ademir D z728;z7n28;r5dxq;21/02/2026;55 51 999999992;;;Caxias;;;35,00;8,75
Unitv;Devedor;Ademir T d6r5w;d6r5w;e7k2n;10/02/2026;55 51 999999993;Novo;;Caxias;;;35,00;8,75
Live;Ativo;Ademar P h1s9t;h1s9t;a5v2c;22/03/2026;55 51 999999994;Novo;;;;;35,00;8,00`

const parseDateString = (ds: string) => {
  if (!ds) return new Date().toISOString()
  const parts = ds.split('/')
  if (parts.length === 3) {
    const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`)
    if (!isNaN(d.getTime())) return d.toISOString()
  }
  return new Date().toISOString()
}

const lines = rawCsv.split('\n').filter((l) => l.trim().length > 0)
const headers = lines[0].split(';').map((h) => h.trim())

const importedImageClients: Client[] = lines.slice(1).map((line, idx) => {
  const v = line.split(';')
  const getCol = (name: string) => v[headers.indexOf(name)]?.trim() || ''

  const priceStr = getCol('Preço')
  const costStr = getCol('Custo')

  let st = getCol('Status')
  let statusVal: any = null
  let isDeleted = false

  if (st === 'Devedor') statusVal = 'Devedor'
  if (st === 'Vencido +30d' || st === 'Vencido +30') statusVal = 'Vencido +30d'
  if (st === 'Excluído' || st === 'Excluido') {
    statusVal = 'Excluído'
    isDeleted = false
  }

  const parseCurrency = (val: string) => {
    if (!val) return 0
    let str = val.trim().replace(/R\$\s*/g, '')
    if (/,/.test(str)) {
      str = str.replace(/\./g, '').replace(',', '.')
    }
    return parseFloat(str) || 0
  }

  return {
    id: `img_import_${idx}`,
    service: getCol('Serviço'),
    status: statusVal,
    deleted: isDeleted,
    name: getCol('Nome'),
    user: getCol('Usuário'),
    password: getCol('Senha'),
    expiryDate: parseDateString(getCol('Vencimento')),
    phone: getCol('Telefone'),
    obs1: getCol('Obs1'),
    obs2: getCol('Obs2'),
    city: getCol('Cidade'),
    mac: getCol('MAC'),
    dkey: getCol('D_Key'),
    price: parseCurrency(priceStr),
    cost: parseCurrency(costStr),
    lastContactedDate: idx === 0 ? new Date().toISOString() : undefined,
  }
})

export const mockClients: Client[] = [...importedImageClients]

export const mockBanks: Bank[] = [
  { id: 'b1', name: 'Nubank Disponível', balance: 3250.5, type: 'Disponível', isDefault: true },
  { id: 'b2', name: 'Cofre Estoque', balance: 1400.0, type: 'Custo', isDefault: true },
  { id: 'b3', name: 'Provisão Contas', balance: 500.0, type: 'Contas', isDefault: true },
]

export const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    date: new Date().toISOString(),
    type: 'Renovação de Cliente',
    entry: 35,
    cost: 8.75,
    profit: 26.25,
    profitPercentage: 75,
    bankId: 'b1',
    description: 'Renovação - Acacio V',
    service: 'Unitv',
    qty: 1,
    splitDistribution: {
      costBankId: 'b2',
      profitBankId: 'b1',
      costAmount: 8.75,
      profitAmount: 26.25,
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

export const mockPayables: Payable[] = [
  {
    id: 'p1',
    description: 'Servidor Dedicado AWS',
    category: 'Contas Fixas',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    amount: 450.0,
    status: 'Pendente',
  },
  {
    id: 'p2',
    description: 'Fornecedor de Paineis',
    category: 'Dívidas',
    dueDate: new Date(Date.now() + 86400000 * 12).toISOString(),
    amount: 1200.0,
    status: 'Pendente',
  },
]

export const mockInteractions: Interaction[] = [
  {
    id: 'int_1',
    conversationId: 'conv_1',
    clientId: 'img_import_0',
    phone: '5551999999991',
    channel: 'whatsapp',
    message: 'Gostaria de saber quando vence minha assinatura',
    intent: 'solicitar informações sobre vencimento',
    aiConfidence: 0.92,
    status: 'cliente_identificado',
    timestamp: new Date().toISOString(),
    correlationId: 'req_123',
    isOutbound: false,
  },
]

export const mockReceipts: Receipt[] = [
  {
    id: 'rec_1',
    clientId: 'img_import_1',
    phone: '5551999999992',
    timestamp: new Date().toISOString(),
    fileAttachment: 'https://img.usecurling.com/p/300/500?q=receipt&color=blue',
    status: 'recebido',
  },
]
