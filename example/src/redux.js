import { coreReducer, authReducer } from 'tcomponent'

import { persistStore, persistReducer } from 'redux-persist'

import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

import storage from 'localforage'

import hardSet from 'redux-persist/lib/stateReconciler/hardSet'

import thunk from 'redux-thunk'

import { createLogger } from 'redux-logger'

const log = createLogger({
  diff: false,
  collapsed: true
})

const persistConfig = {
  key: 'tcomponent',
  storage,
  stateReconciler: hardSet
}

const rootReducer = combineReducers({
  core: coreReducer,
  auth: authReducer
})

let middleware = [thunk]

if (process.env.REACT_APP_ENVIRONMENT !== 'production') {
  middleware = [thunk, log]
}

const enhancers = []

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
  persistedReducer,
  undefined,
  compose(applyMiddleware(...middleware), ...enhancers)
)

const persistor = persistStore(store)

export { store, persistor }
