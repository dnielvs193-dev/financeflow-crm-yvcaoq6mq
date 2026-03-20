import { Client, Bank, Transaction, InventoryItem, PriceTier, Reseller, Payable } from '@/types'

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

const rawCsv = `Serviço;Status;Nome;Usuário;Senha;Vencimento;Telefone;Obs1;Obs2;Cidade;MAC;D_Key;Preço;Custo
Unitv;Ativo;Acacio V 21k9;2l1k9q;3wqpn;19/02/2026;55 51 9...;;;Caxias;;;35,00;8,75
Unitv;Ativo;Ademir D z728;z7n28;r5dxq;21/02/2026;55 51 9...;;;Caxias;;;35,00;8,75
Unitv;Devedor;Ademir T d6r5w;d6r5w;e7k2n;10/02/2026;55 51 9...;Novo;;Caxias;;;35,00;8,75
Live;Ativo;Ademar P h1s9t;h1s9t;a5v2c;22/03/2026;55 51 9...;Novo;;;;;35,00;8,00
Unitv;Devedor;Adriane F 7ybd9;7ybd9;kplx67;28/03/2026;55 51 9...;;;Glorinha;;;35,00;8,75
Unitv;Devedor;Alan S 3n9p;3n9p;d1c6n;07/04/2026;55 51 9...;Novo;;Gravataí;;;35,00;8,75
Five;Devedor;Alberto T 8y65;8y65;s2v3p;16/04/2026;55 51 9...;;;Cidade;;;30,00;8,00
Unitv;Devedor;Alessandra ufg7n;ufg7n;k4jm7b;21/03/2026;55 51 9...;jul/26;;Cidade;;;35,00;8,75
Unitv;Devedor;Alex d3a4m;d3a4m;z8xrn2;23/04/2026;55 51 9...;Novo;;Porto Alegre;;;35,00;8,75
Unitv;Devedor;Alex Silva 39h4n;39h4n;f7dk6m;15/04/2026;55 51 9...;MXQ P60;;Cidade;;;35,00;8,75
Unitv;Devedor;Alex S 5s5w;5s5w;wxcx;20/03/2026;55 51 9...;MXQ P60;;Cidade;;;35,00;8,75
Unitv;Ativo;Alexandre G 2t89;2t89;x4m3;15/04/2026;55 51 9...;04/fev Novo;;;;;35,00;8,75
Five;Excluído;Alexandre M e4s8f;e4s8f;w5y2;12/11/2025;55 51 9...;;;Cruz;;;35,00;8,00
Unitv;Vencido;Alexia S g5w2;g5w2;a6b8;06/03/2026;55 51 9...;;;Gravataí;;;35,00;8,75
Live;Ativo;Aline N c9s4;c9s4;p7k2;15/04/2026;55 51 9...;Reativo;;Porto Alegre;;;35,00;8,00
Gsat;Ativo;Aline 6890 bnm1s;bnm1s;c3x5;13/08/2026;55 51 9...;08/25 Mai Novo;;Porto Alegre;;;30,00;7,00
Unitv;Excluído;Aline M c1b4;c1b4;m9n2;10/01/2026;55 51 9...;MXQ P60;;Gravataí;;;35,00;8,75
Five;Ativo;Amanda L m3k8;m3k8;v2c5;01/04/2026;55 51 9...;;;Gravataí;;;35,00;8,00
Gsat;Ativo;Anderson 411e;411e;r8d9;03/04/2026;55 51 9...;abr/26;;Gravataí;;;30,00;7,00
Five;Ativo;Anderson 001b;001b;p4n7;15/04/2026;55 51 9...;Novo;;Gravataí;;;35,00;8,00
Unitv;Excluído;Andreia S v9b4;v9b4;x3m2;28/02/2025;55 51 9...;;;;;;35,00;8,75
Unitv;Ativo;Angela Z 7k1m;7k1m;b8v5;15/04/2026;55 51 9...;Alex 3010 Novo;;Glorinha;;;35,00;8,75
Unitv;Ativo;Anna C 8x2n;8x2n;t5c9;03/04/2026;55 51 9...;Novo;;;;;35,00;8,75
Unitv;Ativo;Antonio V g4p3;g4p3;z1m8;25/03/2026;55 51 9...;;;Cidade;;;35,00;8,75
Unitv;Excluído;Antonio Z u2n9;u2n9;l7k4;20/08/2025;55 51 9...;;;Mato Grosso;;;35,00;8,75
Five;Ativo;Antonio T f9b1;f9b1;y6v2;28/03/2026;55 51 9...;abr/26;;Cidade;;;35,00;8,00
Unitv;Ativo;Ariane S h5m2;h5m2;c9x4;11/04/2026;55 51 9...;;;;;;35,00;8,75
Unitv;Ativo;Ariane O 3v7c;3v7c;m2b8;07/04/2026;55 51 9...;;;Gravataí;;;35,00;8,75
Five;Ativo;Marco O d1k5;d1k5;r8v3;02/04/2026;55 51 9...;MXQ P60;;Five;;;35,00;8,00
Unitv;Ativo;Arlete M n6p2;n6p2;x4c9;18/04/2026;55 51 9...;Novo;;Gravataí;;;35,00;8,75
Five;Ativo;Armando J 8b3m;8b3m;t1v7;11/03/2026;55 51 9...;;;Porto Alegre;;;35,00;8,00
Unitv;Ativo;Augusto V p5z9;p5z9;k2m4;31/04/2026;55 51 9...;;;Gravataí;;;35,00;8,75
Five;Ativo;Augusto S 4x8n;4x8n;b7c1;22/03/2026;55 51 9...;Reativo;;Gravataí;;;35,00;8,00
Unitv;Ativo;Beatriz B 9v2c;9v2c;m5k8;08/04/2026;55 51 9...;Novo;;Cidade;;;35,00;8,75
Five;Ativo;Betina S 7m4x;7m4x;p1v9;17/04/2026;55 51 9...;abr/26;;Gravataí;;;35,00;8,00
Unitv;Ativo;Brian S 2c8v;2c8v;n6m3;15/04/2026;55 51 9...;abr/26 Pai;;Glorinha;;;35,00;8,75
Five;Excluído;Bruna M 5k1p;5k1p;z4x7;15/09/2025;55 51 9...;;;Gravataí;;;35,00;8,00
Unitv;Ativo;Bruna V w9m2;w9m2;c5b8;08/04/2026;55 51 9...;Novo;;Cidade;;;35,00;8,75
Unitv;Ativo;Bruno T 1n7x;1n7x;v3m9;22/03/2026;55 51 9...;Novo;;Cidade;;;35,00;8,75
Gsat;Ativo;Bruno O 6p4k;6p4k;m2b7;15/04/2026;55 51 9...;Sala;;Gravataí;;;30,00;7,00
Unitv;Vencido;Bruno Z 8c2v;8c2v;x5n1;17/01/2026;55 51 9...;Novo;;;;;35,00;8,75
Unitv;Ativo;Cacau B 3m9p;3m9p;v1c4;12/04/2026;55 51 9...;;;;;;35,00;8,75
Unitv;Ativo;Camila M 7v5x;7v5x;k2n8;02/04/2026;55 51 9...;Deli Auto 26;;Canoas;;;35,00;8,75
Unitv;Ativo;Caprioli I 4b1m;4b1m;z9v3;11/04/2026;55 51 9...;abr/26 Novo;;Glorinha;;;35,00;8,75
Unitv;Vencido;Caprioli V 9x2c;9x2c;m5k7;11/04/2026;55 51 9...;abr/26 Pai;;Glorinha;;;35,00;8,75
Uniplay;Ativo;Carem M 5n8p;5n8p;c1v4;23/03/2026;55 51 9...;;;Cidade;;;35,00;10,00
Unitv;Ativo;Carla G 2v9x;2v9x;m4k1;08/04/2026;55 51 9...;Novo;;Cidade;;;35,00;8,75
Unitv;Ativo;Carla C 8m3p;8m3p;v7c2;15/04/2026;55 51 9...;;;Espanha;;;35,00;8,75
Live;Ativo;Carla S 1k5n;1k5n;x8m9;21/03/2026;55 51 9...;Sala;;Porto Alegre;;;35,00;8,00
Unitv;Excluído;Carolina M 6v2c;6v2c;p9k4;04/12/2025;55 51 9...;Novo;;Espanha;;;35,00;8,75
Unitv;Ativo;Carolina O 3n8p;3n8p;c1v5;20/04/2026;55 51 9...;Carolina 5;;Espanha;;;35,00;8,75
Unitv;Ativo;Carolina F 9x4m;9x4m;z2v7;24/03/2026;55 51 9...;Novo;;Porto Alegre;;;35,00;8,75
Unitv;Ativo;Carolina C 5p1k;5p1k;m8n3;23/03/2026;55 51 9...;nov/26 Carol;;Espanha;;;35,00;8,75
Unitv;Vencido;Zuleica M 5s2d;5s2d;n8k4;11/03/2026;55 51 9...;;;Glorinha;;;35,00;8,75
Live;Ativo;Zulema A 3f9p;3f9p;b7x1;16/04/2026;55 51 9...;;;Gravataí;;;35,00;8,00`

const parseDateString = (ds: string) => {
  if (!ds) return new Date().toISOString()
  const parts = ds.split('/')
  if (parts.length === 3) {
    const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00Z`)
    if (!isNaN(d.getTime())) return d.toISOString()
  }
  return new Date().toISOString()
}

const lines = rawCsv.split('\n').filter(Boolean)
const headers = lines[0].split(';')

const importedImageClients: Client[] = lines.slice(1).map((line, idx) => {
  const v = line.split(';')
  const getCol = (name: string) => v[headers.indexOf(name)] || ''

  const priceStr = getCol('Preço')
  const costStr = getCol('Custo')

  let st = getCol('Status')
  let statusVal: any = null
  let isDeleted = false
  if (st === 'Devedor') statusVal = 'Devedor'
  if (st === 'Vencido +30d' || st === 'Vencido +30') statusVal = 'Vencido +30d'
  if (st === 'Excluído' || st === 'Excluido') isDeleted = true

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
    price: parseFloat(priceStr.replace(',', '.')) || 0,
    cost: parseFloat(costStr.replace(',', '.')) || 0,
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
    cost: 3.5,
    profit: 31.5,
    profitPercentage: 90,
    bankId: 'b1',
    description: 'Renovação - Acacio V',
    service: 'Unitv',
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
