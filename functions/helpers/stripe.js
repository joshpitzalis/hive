const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.token);

const currency = functions.config().stripe.currency || 'USD';

// When a user is created, register them with Stripe
exports.saveCardToStripe = functions.database
  .ref('/users/{userId}/info/token')
  .onWrite(event =>
    admin
      .database()
      .ref(`/users/${event.params.userId}/info/email`)
      .once('value')
      .then(snap => snap.val())
      .then(email =>
        stripe.customers
          .create({
            email,
            source: event.data.val().id,
          })
          .then((customer) => {
            return admin
              .database()
              .ref(`/users/${event.params.userId}/info/customer_id`)
              .set(customer.id);
          })));

exports.dailyCharge = functions.https.onRequest(() => {
  const today = new Date().toISOString();
  admin
    .database()
    .ref()
    .child('activeTasks')
    .orderByChild('due')
    .endAt(today)
    .once('value')
    .then((activeTasks) => {
      const users = [];
      activeTasks.forEach(task =>
        users.push({
          userId: task.val().receiversUid,
        }));
      return users;
    })
    .then((users) => {
      users.map((user) => {
        if (user.userId) {
          return admin
            .database()
            .ref(`/users/${user.userId}/charges`)
            .push({
              amount: 1000,
            });
        }
        return null;
      });
    })
    .catch(error => console.log(error));
});

// Charge the Stripe customer whenever an amount is written to the Realtime database
exports.createStripeCharge = functions.database
  .ref('/users/{userId}/charges/{id}')
  .onWrite((event) => {
    const val = event.data.val();
    // This onWrite will trigger whenever anything is written to the path, so
    // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)
    if (val === null || val.id || val.error) {
      return null;
    }
    // Look up the Stripe customer id written in createStripeCustomer
    return admin
      .database()
      .ref(`/users/${event.params.userId}/info/customer_id`)
      .once('value')
      .then((snapshot) => {
        return snapshot.val();
      })
      .then((customer) => {
        // Create a charge using the pushId as the idempotency key, protecting against double charges
        const amount = val.amount;
        const idempotency_key = event.params.id;
        const charge = { amount, currency, customer };
        // if (val.source !== null) charge.source = val.source;
        console.log('charge', charge);
        return stripe.charges.create(charge, { idempotency_key });
      })
      .then(
        (response) => {
          // If the result is successful, write it back to the database
          return console.log('success', response);
        },
        (error) => {
          console.log(error, { user: event.params.userId });
        }
      );
  });
