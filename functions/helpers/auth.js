const functions = require('firebase-functions')
const admin = require('firebase-admin')
const stripe =
  process.env.NODE_ENV === 'production'
    ? require('stripe')(functions.config().stripe.livetoken)
    : require('stripe')(functions.config().stripe.token)

// automatically save new users to the database
exports.saveUser = functions.auth.user().onCreate(event => {
  const email = event.data.email
  const uid = event.data.uid
  const newUserRef = admin.database().ref(`/users/${uid}/info`)
  return newUserRef.update({
    uid,
    email,
    created: Date.now()
  })
})

// creates a new user when a new task is created
exports.createClient = functions.database
  .ref('/users/{anyUser}/sent/{anyTask}')
  .onCreate(async (snapshot, context) => {
    const userEmail = snapshot.val().client
    const title = snapshot.val().deliverable
    const from = snapshot.val().from
    const due = snapshot.val().deadline || null
    const createdAt = snapshot.val().createdAt
    const taskId = snapshot.val().taskId

    try {
    // search if the account already exists
      const userRecord = await admin
        .auth()
        .getUserByEmail(snapshot.val().client)

      if (userRecord) {
        return admin
          .database()
          .ref(`/users/${userRecord.uid}/pending/${taskId}`)
          .update({
            title,
            from,
            due,
            taskId,
            createdAt
          }).then(() => console.log('pending task added to existing user'))
      } else {
        // create new user and send pending task to new user
        return admin
          .auth()
          .createUser({
            email: userEmail,
            emailVerified: false,
            password: 'changeme'
          })
          .then(userRecord =>
            admin
              .database()
              .ref(`/users/${userRecord.uid}/pending/${taskId}`)
              .update({
                title,
                from,
                due,
                taskId,
                createdAt
              })
          ).then(() => console.log('pending task added to new user'))
      }
    } catch (error) {
      console.log('Error sending pending task to reciever', error)
    }
    return null
  })

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete(event => {
  return admin
    .database()
    .ref(`/users/${event.data.uid}`)
    .once('value')
    .then(snapshot => {
      admin
        .database()
        .ref(`/users/${event.data.uid}`)
        .remove()
      return snapshot.val()
    })
    .then(customer => {
      return stripe.customers.del(customer.info.customer_id)
    })
})
