import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/routes.js'
import registerServiceWorker from './registerServiceWorker'
import './styles/styles.css'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
