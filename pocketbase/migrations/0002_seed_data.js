migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const user = new Record(users)
    user.setEmail('daniel.silva.martins193@gmail.com')
    user.setPassword('securepassword123')
    user.setVerified(true)
    app.save(user)

    const settingsCol = app.findCollectionByNameOrId('app_settings')
    const settings = new Record(settingsCol)
    settings.set('wapi_active', false)
    settings.set('api_key', '')
    settings.set('webhook_secret', '')
    app.save(settings)
  },
  (app) => {
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'daniel.silva.martins193@gmail.com')
      app.delete(user)
    } catch (e) {}
    try {
      const records = app.findRecordsByFilter('app_settings', '', '', 1, 0)
      if (records.length > 0) app.delete(records[0])
    } catch (e) {}
  },
)
