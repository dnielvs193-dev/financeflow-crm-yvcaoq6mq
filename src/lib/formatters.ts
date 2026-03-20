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
