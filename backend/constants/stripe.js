const configureStripe = require('stripe')

const STRIPE_SECRET_KEY =
  process.env.NODE_ENV === 'production'
    ? 'sk_live_MY_SECRET_KEY'
    : 'sk_test_KRt0sOtN4t9GGFBqz8U3PhoJ'

const stripe = configureStripe(STRIPE_SECRET_KEY)

module.exports = stripe
