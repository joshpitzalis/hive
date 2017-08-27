'use strict'

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

// ##############

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
        .ref(`/stripe_customers/${data.uid}/customer_id`)
        .set(customer.id)
    })
})

// Add a payment source (card) for a user by writing a stripe payment source token to Realtime database
exports.addPaymentSource = functions.database
  .ref('/stripe_customers/{userId}/sources/{pushId}/token')
  .onWrite(event => {
    const source = event.data.val()
    if (source === null) return null
    return admin
      .database()
      .ref(`/stripe_customers/${event.params.userId}/customer_id`)
      .once('value')
      .then(snapshot => {
        return snapshot.val()
      })
      .then(customer => {
        return stripe.customers.createSource(customer, { source })
      })
      .then(
        response => {
          return event.data.adminRef.parent.set(response)
        },
        error => {
          return event.data.adminRef.parent
            .child('error')
            .set(userFacingMessage(error))
            .then(() => {
              return reportError(error, { user: event.params.userId })
            })
        }
      )
  })

// Charge the Stripe customer whenever an amount is written to the Realtime database
exports.createStripeCharge = functions.database
  .ref('/stripe_customers/{userId}/charges/{id}')
  .onWrite(event => {
    const val = event.data.val()
    // This onWrite will trigger whenever anything is written to the path, so
    // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)
    if (val === null || val.id || val.error) return null
    // Look up the Stripe customer id written in createStripeCustomer
    return admin
      .database()
      .ref(`/stripe_customers/${event.params.userId}/customer_id`)
      .once('value')
      .then(snapshot => {
        return snapshot.val()
      })
      .then(customer => {
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
          // We want to capture errors and render them in a user-friendly way, while
          // still logging an exception with Stackdriver
          return event.data.adminRef
            .child('error')
            .set(userFacingMessage(error))
            .then(() => {
              return reportError(error, { user: event.params.userId })
            })
        }
      )
  })

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete(event => {
  return admin
    .database()
    .ref(`/stripe_customers/${event.data.uid}`)
    .once('value')
    .then(snapshot => {
      return snapshot.val()
    })
    .then(customer => {
      return stripe.customers.del(customer)
    })
    .then(() => {
      return admin
        .database()
        .ref(`/stripe_customers/${event.data.uid}`)
        .remove()
    })
})

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = 'errors'
  const log = logging.log(logName)

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: 'cloud_function',
      labels: { function_name: process.env.FUNCTION_NAME }
    }
  }

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: 'cloud_function'
    },
    context: context
  }

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), error => {
      if (error) {
        reject(error)
      }
      resolve()
    })
  })
}
// [END reporterror]

// Sanitize the error message for the user
function userFacingMessage(error) {
  return error.type
    ? error.message
    : 'An error occurred, developers have been alerted'
}
