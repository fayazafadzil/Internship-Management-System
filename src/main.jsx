import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

//  නිවැරදි ක්‍රමය (මෙතන Router එකක් නැහැ, App එක ඇතුළේ විතරයි තියෙන්නේ):
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
