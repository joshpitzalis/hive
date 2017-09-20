const functions = require('firebase-functions')
const admin = require('firebase-admin')
const stripe = require('stripe')(functions.config().stripe.token)

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
  .onCreate(event => {
    const userEmail = event.data.val().client
    const title = event.data.val().deliverable
    const from = event.data.val().from
    const due = event.data.val().deadline || null
    const createdAt = event.data.val().createdAt
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
        // send pending task to new user
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
      })
      .catch(error => console.log('Error creating new user:', error))
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
