import { PlanId } from '@/types'

export type FeatureId =
  | 'clients'
  | 'resellers'
  | 'finance'
  | 'inventory'
  | 'banks'
  | 'payables'
  | 'voice'
  | 'ai_whatsapp'
  | 'evolution_api'

export interface PlanConfig {
  id: PlanId
  name: string
  price: number
  maxClients: number
  maxResellers: number
  features: FeatureId[]
  description: string
}

export const PLANS: Record<PlanId, PlanConfig> = {
  basic: {
    id: 'basic',
    name: 'Básico',
    price: 49.9,
    maxClients: 100,
    maxResellers: 2,
    features: ['clients', 'resellers'],
    description: 'Gestão essencial de clientes e revendas.',
  },
  silver: {
    id: 'silver',
    name: 'Prata',
    price: 99.9,
    maxClients: 200,
    maxResellers: 4,
    features: ['clients', 'resellers', 'finance', 'inventory', 'banks', 'payables'],
    description: 'Gestão completa com controle financeiro e estoque.',
  },
  gold: {
    id: 'gold',
    name: 'Ouro',
    price: 199.9,
    maxClients: 500,
    maxResellers: 8,
    features: ['clients', 'resellers', 'finance', 'inventory', 'banks', 'payables', 'voice'],
    description: 'Recursos avançados com Assistente por Voz.',
  },
  diamond: {
    id: 'diamond',
    name: 'Diamante',
    price: 399.9,
    maxClients: Infinity,
    maxResellers: Infinity,
    features: [
      'clients',
      'resellers',
      'finance',
      'inventory',
      'banks',
      'payables',
      'voice',
      'ai_whatsapp',
      'evolution_api',
    ],
    description: 'Acesso total, IA e automação ilimitada via WhatsApp.',
  },
}
