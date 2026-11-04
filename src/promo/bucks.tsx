import React from 'react'
import ReactDOM from 'react-dom/client'
import BucksApp from './BucksApp'
import { connectDataLayer } from '../lib/dataLayer'
import '../index.css'

connectDataLayer()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BucksApp />
  </React.StrictMode>,
)
