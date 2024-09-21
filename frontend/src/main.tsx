import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
        domain="dev-b10153jymog3q5y1.us.auth0.com"
        clientId="nnryCin96MmnfTdB4jTqXgc4KSnWQzsN"
        authorizationParams={{
          redirect_uri: `${window.location.origin}/blogs`
        }}
    >
        <App />
    </Auth0Provider>
  </React.StrictMode>,
)
