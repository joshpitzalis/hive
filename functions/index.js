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

// When a user deletes their account, clean up after them
// exports.cleanupUser = functions.auth.user().onDelete(event => {
//   return admin
//     .database()
//     .ref(`/users/${event.data.uid}/info`)
//     .once('value')
//     .then(snapshot => {
//       return snapshot.val()
//     })
//     .then(customer => {
//       return stripe.customers.del(customer)
//     })
//     .then(() => {
//       return admin
//         .database()
//         .ref(`/stripe_customers/${event.data.uid}`)
//         .remove()
//     })
// })

// const nodemailer = require('nodemailer')

var mailgun = require('mailgun-js')({
  apiKey: 'key-e97fd64eb5cc24f8466074ddf553e1b9',
  domain: 'www.realsies.com'
})

// var nodemailerMailgun = nodemailer.createTransport(auth)

exports.weeklyEmail = functions.https.onRequest((req, res) => {
  const currentTime = new Date().getTime()
  const lastWeek = currentTime - 604800000
  // 604800000 is one week in milliseconds
  let emails = ['joshpitzalis@gmail.com']

  admin
    .database()
    .ref()
    .child('users/info')
    .orderByChild('created')
    .startAt(lastWeek)
    .once('value')
    .then(snap => {
      snap.forEach(child => {
        const email = child.val().email
        emails.push(email)
      })
      return emails
    })
    .then(emails => {
      console.log('emails', emails)
      const data = {
        from: `hi@realsies.com`,
        bcc: emails.join(),
        subject: 'Thanks for Trying Realsies.',
        text: `I'd love to know how it has been using Realsies over the last week. Any bugs that I should know of? Or features that you would like added?`
      }

      mailgun.messages().send(data, function(error, body) {
        console.log(body)
      })

      // mailgun
      //   .messages()
      //   .send(data)
      //   .then(() => res.send('Email sent'))
      //   .catch(error => res.send(error))
    })
})

exports.dailyCharge = functions.https.onRequest((req, res) => {
  const users = []
  let today = new Date().toISOString()

  admin
    .database()
    .ref()
    .child('activeTasks')
    .orderByChild('deadline')
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
          admin.database().ref(`/users/${user.userId}/charges`).push({
            source: user.cardId,
            amount: 500
          })
        }
      })
    )

  // write a charge to /users/{userId}/charges/{id}

  // a charge is amount, source: cardId

  // .then(emails => {
  //   const mailOptions = {
  //     from: `"Hive" <joshpitzalis@gmail.com>`,
  //     bcc: emails.join(),
  //     subject: 'Thanks for Trying Hive.',
  //     text: `I'd love to know how it has been using Hive over the last week. Any serious bugs that I should know of? Or features that you would like added?`
  //   }
  //   return mailTransport
  //     .sendMail(mailOptions)
  //     .then(() => {
  //       res.send('Email sent')
  //     })
  //     .catch(error => res.send(error))
  // })
})
