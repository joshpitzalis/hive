import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/routes.js'
import registerServiceWorker from './registerServiceWorker'
import './styles/styles.css'
import { StripeProvider } from 'react-stripe-elements'
// import stripeKey from './constants/stripe.js'

ReactDOM.render(
  <StripeProvider apiKey={'pk_test_UEtlVFtmDH1SIsFR5HMOR6tD'}>
    <App />
  </StripeProvider>,
  document.getElementById('root')
)
registerServiceWorker()
