migrate(
  (app) => {
    const appSettings = app.findCollectionByNameOrId('app_settings')
    if (!appSettings.fields.getByName('instance_id')) {
      appSettings.fields.add(new TextField({ name: 'instance_id' }))
    }
    app.save(appSettings)

    const interactions = app.findCollectionByNameOrId('interactions')
    if (!interactions.fields.getByName('intent')) {
      interactions.fields.add(new TextField({ name: 'intent' }))
    }
    app.save(interactions)
  },
  (app) => {
    const appSettings = app.findCollectionByNameOrId('app_settings')
    appSettings.fields.removeByName('instance_id')
    app.save(appSettings)

    const interactions = app.findCollectionByNameOrId('interactions')
    interactions.fields.removeByName('intent')
    app.save(interactions)
  },
)
