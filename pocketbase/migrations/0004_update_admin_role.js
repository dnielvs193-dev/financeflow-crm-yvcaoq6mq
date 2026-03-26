migrate(
  (app) => {
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'daniel.silva.martins193@gmail.com')
      user.set('role', 'admin')
      app.save(user)
    } catch (e) {
      console.log('Admin user not found, skipping role update.')
    }
  },
  (app) => {
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'daniel.silva.martins193@gmail.com')
      user.set('role', 'user')
      app.save(user)
    } catch (e) {
      // Ignore
    }
  },
)
