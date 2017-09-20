'use strict'

const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const { saveUser, createClient, cleanupUser } = require('./helpers/auth.js')
const { updateTask, challengeDeclined } = require('./helpers/crud.js')
const {
  createStripeCustomer,
  addPaymentSource,
  createStripeCharge,
  dailyCharge
} = require('./helpers/stripe.js')
const { weeklyEmail } = require('./helpers/mail.js')

exports.saveUser = saveUser
exports.createClient = createClient
exports.cleanupUser = cleanupUser
exports.updateTask = updateTask
exports.challengeDeclined = challengeDeclined
exports.createStripeCustomer = createStripeCustomer
exports.addPaymentSource = addPaymentSource
exports.createStripeCustomer = createStripeCustomer
exports.dailyCharge = dailyCharge
exports.weeklyEmail = weeklyEmail
