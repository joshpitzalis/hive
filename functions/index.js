const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const { saveUser, createClient, cleanupUser } = require('./helpers/auth.js')
const { updateTask, challengeDeclined } = require('./helpers/crud.js')
const {
  saveCardToStripe,
  // addPaymentSource,
  createStripeCharge,
  dailyCharge
} = require('./helpers/stripe.js')
const { newChallengeEmail } = require('./helpers/mail.js')

exports.saveUser = saveUser
exports.createClient = createClient
exports.cleanupUser = cleanupUser
exports.updateTask = updateTask
exports.challengeDeclined = challengeDeclined
exports.saveCardToStripe = saveCardToStripe
exports.createStripeCharge = createStripeCharge
exports.dailyCharge = dailyCharge
exports.newChallengeEmail = newChallengeEmail
