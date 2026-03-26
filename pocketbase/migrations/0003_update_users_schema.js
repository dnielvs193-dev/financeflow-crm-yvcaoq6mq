migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!collection.fields.getByName('role')) {
      collection.fields.add(
        new SelectField({
          name: 'role',
          values: ['admin', 'user'],
          maxSelect: 1,
        }),
      )
    }

    collection.listRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    collection.viewRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    collection.createRule = "@request.auth.id = '' || @request.auth.role = 'admin'"
    collection.updateRule = "id = @request.auth.id || @request.auth.role = 'admin'"
    collection.deleteRule = "id = @request.auth.id || @request.auth.role = 'admin'"

    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('_pb_users_auth_')
    const field = collection.fields.getByName('role')
    if (field) {
      collection.fields.removeByName('role')
    }

    collection.listRule = 'id = @request.auth.id'
    collection.viewRule = 'id = @request.auth.id'
    collection.createRule = ''
    collection.updateRule = 'id = @request.auth.id'
    collection.deleteRule = 'id = @request.auth.id'

    app.save(collection)
  },
)
