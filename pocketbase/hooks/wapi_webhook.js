routerAdd('POST', '/backend/v1/webhook/w-api', (e) => {
  const body = e.requestInfo().body

  let settings
  try {
    settings = $app.findFirstRecordByFilter('app_settings', 'wapi_active = true')
  } catch (err) {
    return e.json(200, { ignored: true, reason: 'wapi_active is false' })
  }

  const lid = body.senderLid || body.contact?.lid || ''
  const phone = body.phone || body.contact?.phone || ''
  const text = body.message?.text || body.text || body.content || ''
  const senderName = body.senderName || body.contact?.name || phone || lid || 'Desconhecido'

  if (!lid && !phone) {
    return e.json(400, { error: 'Missing lid or phone' })
  }

  let client
  try {
    if (lid) {
      client = $app.findFirstRecordByFilter('clients', 'lid = {:lid}', { lid })
    } else if (phone) {
      client = $app.findFirstRecordByFilter('clients', 'phone = {:phone}', { phone })
    }
  } catch (err) {
    // client not found
  }

  if (!client) {
    const clientsCol = $app.findCollectionByNameOrId('clients')
    client = new Record(clientsCol)
    client.set('name', senderName)
    client.set('lid', lid)
    client.set('phone', phone)
    $app.save(client)
  } else {
    let changed = false
    if (!client.get('lid') && lid) {
      client.set('lid', lid)
      changed = true
    }
    if (!client.get('phone') && phone) {
      client.set('phone', phone)
      changed = true
    }
    if (changed) {
      $app.save(client)
    }
  }

  if (text) {
    const interactionsCol = $app.findCollectionByNameOrId('interactions')
    const interaction = new Record(interactionsCol)
    interaction.set('client', client.id)
    interaction.set('content', text)
    interaction.set('direction', 'inbound')
    interaction.set('status', 'novo_contato')
    $app.save(interaction)
  }

  return e.json(200, { success: true })
})
