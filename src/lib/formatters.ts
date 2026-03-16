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

export const getClientStatus = (expiryDate: string, isDebtor: boolean) => {
  if (isDebtor) return 'Devedor'
  const isExpired = new Date(expiryDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
  return isExpired ? 'Vencido' : 'Ativo'
}
