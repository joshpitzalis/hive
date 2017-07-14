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
    created: Date.now()
  })
})

exports.createClient = functions.database
  .ref('/users/{anyUser}/tasks/{anyTask}')
  .onCreate(event => {
    const userEmail = event.data.val().client
    const title = event.data.val().deliverable
    const from = event.data.val().from
    const due = event.data.val().deadline || null
    const ready = event.data.val().ready
    const taskId = event.data.val().taskId

    //   // need to search if account exists
    //   const userAccount = admin
    //     .database()
    //     .ref('/users/{anyUser}/info')
    //     .orderByChild('email')
    //     .equalTo(userEmail)
    //     .once('value')
    //     .then(snap => console.log(snap.val()))
    // })

    admin
      .auth()
      .createUser({
        email: userEmail,
        emailVerified: false,
        password: 'changeme'
      })
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord)

        // send file to client
        admin
          .database()
          .ref(`/users/${userRecord.uid}/beGiven/${taskId}`)
          .update({
            title,
            from,
            due,
            ready,
            taskId
          })
          .catch(function(error) {
            console.log('Error pushing task to new user:', error)
          })
      })
      .catch(function(error) {
        console.log('Error creating new user:', error)
      })
  })

exports.updateTask = functions.database
  .ref('/users/{anyUser}/tasks/{task}')
  .onUpdate(event => {
    if (event.data.val().ready) {
      admin.auth().getUserByEmail(event.data.val().client).then(result =>
        admin
          .database()
          .ref(`/users/${result.uid}/beGiven/${event.data.val().taskId}`)
          .update({
            ready: true,
            file: event.data.val().file || null,
            url: event.data.val().url || null,
            timeDelivered: event.data.val().timeDelivered
          })
          .catch(function(error) {
            console.log('Error updating deliverable for client:', error)
          })
      )
    }
  })
