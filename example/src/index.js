import React from 'react'

import ReactDOM from 'react-dom'

import './index.css'

import { LoadingPage } from 'react-tcomponent'

import App from './App'

import { store, persistor } from './redux'

import { Provider } from 'react-redux'

import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<LoadingPage />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)
