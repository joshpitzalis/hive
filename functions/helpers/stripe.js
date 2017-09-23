const functions = require('firebase-functions')
const admin = require('firebase-admin')
const stripe = require('stripe')(functions.config().stripe.token)
const currency = functions.config().stripe.currency || 'USD'

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.auth.user().onCreate(event => {
  const data = event.data
  return stripe.customers
    .create({
      email: data.email
    })
    .then(customer => {
      return admin
        .database()
        .ref(`/users/${data.uid}/info/customer_id`)
        .set(customer.id)
    })
})

// Add a payment source (card) for a user by writing a stripe payment source token to Realtime database
exports.addPaymentSource = functions.database
  .ref('/users/{userId}/sources/token/id')
  .onWrite(event => {
    const source = event.data.val()

    if (source === null) return null
    return admin
      .database()
      .ref(`/users/${event.params.userId}/info/customer_id`)
      .once('value')
      .then(snapshot => {
        return snapshot.val()
      })
      .then(customer => {
        console.log('source', source)
        console.log('customer', customer)
        return stripe.customers.createSource(customer, { source })
      })
      .catch(error => {
        console.log(error)
      })
  })

exports.dailyCharge = functions.https.onRequest((req, res) => {
  const users = []
  let today = new Date().toISOString()

  admin
    .database()
    .ref()
    .child('activeTasks')
    .orderByChild('due')
    .endAt(today)
    .once('value')
    .then(activeTasks => {
      activeTasks.forEach(task => {
        const user = task.val().userId
        const card = task.val().cardId
        users.push({ userId: user, cardId: card })
      })
      return users
    })
    .then(users =>
      users.map(user => {
        if (user.cardId) {
          admin
            .database()
            .ref(`/users/${user.userId}/charges`)
            .push({
              source: user.cardId,
              amount: 500
            })
        }
      })
    )
})

// Charge the Stripe customer whenever an amount is written to the Realtime database
exports.createStripeCharge = functions.database
  .ref('/users/{userId}/charges/{id}')
  .onWrite(event => {
    const val = event.data.val()
    // This onWrite will trigger whenever anything is written to the path, so
    // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)
    if (val === null || val.id || val.error) return null
    // Look up the Stripe customer id written in createStripeCustomer
    return admin
      .database()
      .ref(`/users/${event.params.userId}/info/customer_id`)
      .once('value')
      .then(snapshot => {
        return snapshot.val()
      })
      .then(customer => {
        console.log('val', val)
        console.log('customer', customer)
        // Create a charge using the pushId as the idempotency key, protecting against double charges
        const amount = val.amount
        const idempotency_key = event.params.id
        let charge = { amount, currency, customer }
        if (val.source !== null) charge.source = val.source
        return stripe.charges.create(charge, { idempotency_key })
      })
      .then(
        response => {
          // If the result is successful, write it back to the database
          return event.data.adminRef.set(response)
        },
        error => {
          console.log(error, { user: event.params.userId })
        }
      )
  })
