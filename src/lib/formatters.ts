import { Client } from '@/types'

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export const getClientStatus = (expiryDate: string, manualStatus?: string | null) => {
  if (manualStatus === 'Devedor') return 'Devedor'
  if (manualStatus === 'Vencido +30d') return 'Vencido +30d'
  if (manualStatus === 'Excluído') return 'Excluído'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const exp = new Date(expiryDate)
  exp.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Vencido'
  if (diffDays === 0) return 'Vence Hoje'
  if (diffDays === 1) return 'Vence Amanhã'
  return 'Ativo'
}

export const cleanPhone = (val: string | number | null | undefined) => {
  if (!val) return ''
  const str = String(val)
  if (str.includes('@lid')) return str.trim()
  return str.replace(/\D/g, '')
}

export const maskPhone = (val: string | number | null | undefined) => {
  if (!val) return ''
  let v = String(val)
  if (v.includes('@lid')) return v.trim()

  v = v.replace(/\D/g, '')
  if (v.length > 13) v = v.substring(0, 13)
  if (v.length === 0) return ''

  if (v.length <= 2) return v
  if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`
  if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`
  if (v.length === 11) return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`
  if (v.length === 12) return `+${v.slice(0, 2)} (${v.slice(2, 4)}) ${v.slice(4, 8)}-${v.slice(8)}`
  if (v.length >= 13) return `+${v.slice(0, 2)} (${v.slice(2, 4)}) ${v.slice(4, 9)}-${v.slice(9)}`

  return v
}

export const isContactedThisMonth = (date?: string) => {
  if (!date) return false
  const d = new Date(date)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export const generateMessage = (template: string, client: Client) => {
  return template
    .replace(/{{nome}}/g, client.name || '')
    .replace(/{{vencimento}}/g, formatDate(client.expiryDate))
    .replace(/{{servico}}/g, client.service || '')
    .replace(/{{usuario}}/g, client.user || 'N/A')
    .replace(/{{senha}}/g, client.password || 'N/A')
}
