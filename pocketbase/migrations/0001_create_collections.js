migrate(
  (app) => {
    const clients = new Collection({
      name: 'clients',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'lid', type: 'text' },
        {
          name: 'avatar',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        "CREATE UNIQUE INDEX idx_clients_lid ON clients (lid) WHERE lid != ''",
        'CREATE INDEX idx_clients_phone ON clients (phone)',
      ],
    })
    app.save(clients)

    const interactions = new Collection({
      name: 'interactions',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'client',
          type: 'relation',
          required: true,
          collectionId: clients.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'content', type: 'text', required: true },
        { name: 'direction', type: 'select', values: ['inbound', 'outbound'], required: true },
        { name: 'status', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_interactions_client ON interactions (client)',
        'CREATE INDEX idx_interactions_created ON interactions (created DESC)',
      ],
    })
    app.save(interactions)

    const appSettings = new Collection({
      name: 'app_settings',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'wapi_active', type: 'bool' },
        { name: 'api_key', type: 'text' },
        { name: 'webhook_secret', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(appSettings)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('app_settings'))
    } catch (e) {}
    try {
      app.delete(app.findCollectionByNameOrId('interactions'))
    } catch (e) {}
    try {
      app.delete(app.findCollectionByNameOrId('clients'))
    } catch (e) {}
  },
)
