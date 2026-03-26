migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('app_settings')
    const existing = app.findRecordsByFilter('app_settings', '1=1', '', 1, 0)
    if (existing.length === 0) {
      const record = new Record(collection)
      record.set('wapi_active', false)
      record.set('api_key', 'default_key_change_me')
      record.set('webhook_secret', '')
      app.save(record)
    }
  },
  (app) => {
    const existing = app.findRecordsByFilter(
      'app_settings',
      "api_key = 'default_key_change_me'",
      '',
      1,
      0,
    )
    if (existing.length > 0) {
      app.delete(existing[0])
    }
  },
)
