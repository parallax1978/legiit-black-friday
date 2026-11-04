import React from 'react'
import ReactDOM from 'react-dom/client'
import PromoApp from './PromoApp'
import { agencyPage } from './content'
import { connectDataLayer } from '../lib/dataLayer'
import '../index.css'

// Forwards the typed events to the host page's GTM dataLayer when one exists; otherwise a no-op.
connectDataLayer()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PromoApp copyFor={agencyPage} />
  </React.StrictMode>,
)
