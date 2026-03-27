routerAdd('POST', '/backend/v1/webhook/w-api', (e) => {
  const body = e.requestInfo().body

  let settings
  try {
    settings = $app.findFirstRecordByFilter('app_settings', '1=1')
  } catch (err) {
    return e.json(200, { ignored: true, reason: 'Configurações não encontradas.' })
  }

  if (!settings.get('wapi_active')) {
    return e.json(200, { ignored: true, reason: 'A integração W-API está inativa.' })
  }

  const requestSecret =
    e.request.header.get('x-webhook-secret') || e.requestInfo().query['secret'] || body.secret
  const configSecret = settings.get('webhook_secret')

  if (configSecret && requestSecret && requestSecret !== configSecret) {
    return e.json(401, { error: 'Webhook secret inválido.' })
  }

  const lid = body.senderLid || body.contact?.lid || ''
  const rawPhone = body.phone || body.contact?.phone || ''
  const text = body.message?.text || body.text || body.content || ''
  const senderName = body.senderName || body.contact?.name || rawPhone || lid || 'Desconhecido'

  if (!lid && !rawPhone) {
    return e.json(400, { error: 'Faltam informações de contato (lid ou phone).' })
  }

  let client
  const normalizedPhone = rawPhone.replace(/\D/g, '')

  try {
    if (lid) {
      client = $app.findFirstRecordByFilter('clients', 'lid = {:lid}', { lid })
    }
    if (!client && rawPhone) {
      client = $app.findFirstRecordByFilter('clients', 'phone = {:phone}', { phone: rawPhone })
    }
  } catch (err) {}

  if (!client && normalizedPhone.length >= 8) {
    const searchPhone = normalizedPhone.slice(-8)
    try {
      client = $app.findFirstRecordByFilter('clients', 'phone LIKE {:likePhone}', {
        likePhone: `%${searchPhone}%`,
      })
    } catch (err) {}
  }

  if (!client) {
    const clientsCol = $app.findCollectionByNameOrId('clients')
    client = new Record(clientsCol)
    client.set('name', senderName)
    client.set('lid', lid)
    client.set('phone', rawPhone || normalizedPhone)
    $app.save(client)
  } else {
    let changed = false
    if (!client.get('lid') && lid) {
      client.set('lid', lid)
      changed = true
    }
    if (!client.get('phone') && (rawPhone || normalizedPhone)) {
      client.set('phone', rawPhone || normalizedPhone)
      changed = true
    }
    if (changed) {
      $app.save(client)
    }
  }

  if (text) {
    let intent = 'dúvidas gerais'
    const textLower = text.toLowerCase()

    if (
      textLower.includes('pix') ||
      textLower.includes('boleto') ||
      textLower.includes('pagamento') ||
      textLower.includes('pagar') ||
      textLower.includes('valor')
    ) {
      intent = 'vendas e financeiro'
    } else if (
      textLower.includes('ajuda') ||
      textLower.includes('suporte') ||
      textLower.includes('não funciona') ||
      textLower.includes('caiu') ||
      textLower.includes('ruim') ||
      textLower.includes('problema')
    ) {
      intent = 'suporte técnico'
    } else if (
      textLower.includes('renovar') ||
      textLower.includes('vencimento') ||
      textLower.includes('vence')
    ) {
      intent = 'solicitar informações sobre vencimento'
    } else if (textLower.includes('comprovante')) {
      intent = 'enviar comprovante'
    } else if (textLower.includes('segunda via') || textLower.includes('2 via')) {
      intent = 'solicitar segunda via'
    } else if (textLower.includes('humano') || textLower.includes('atendente')) {
      intent = 'solicitar suporte humano'
    }

    const interactionsCol = $app.findCollectionByNameOrId('interactions')
    const interaction = new Record(interactionsCol)
    interaction.set('client', client.id)
    interaction.set('content', text)
    interaction.set('direction', 'inbound')
    interaction.set('status', 'received')

    if (interactionsCol.fields.getByName('intent')) {
      interaction.set('intent', intent)
    }

    $app.save(interaction)
  }

  return e.json(200, { success: true, message: 'Webhook processado com sucesso' })
})
