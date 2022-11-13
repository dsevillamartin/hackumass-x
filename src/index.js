import React from 'react'
import ReactDOM from 'react-dom/client'

import './app.scss'
import App from './App'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  console.log(process.env.NODE_ENV)
  const runtime = require('react-refresh/runtime')
  runtime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
}
