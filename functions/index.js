const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

exports.saveUser = functions.auth.user().onCreate(event => {
  const user = event.data
  const email = user.email
  const displayName = user.displayName
  const uid = user.uid

  const newUserRef = admin.database().ref(`/users/${uid}/info`)
  return newUserRef.update({
    uid,
    email,
    created: new Date()
  })
})
