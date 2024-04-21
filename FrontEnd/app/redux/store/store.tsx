import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/rootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web and AsyncStorage for React-Native
import devToolsEnhancer from 'remote-redux-devtools';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Setup Redux DevTools Extension
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Async Middleware (handles thunk-like async actions)
const asyncMiddleware = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

// Redux Persist Configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['events', 'settings', 'user'], // Blacklist events, settings, and user from being persisted
};

// Logger Middleware
const loggerMiddleware = store => next => action => {
  console.log('Dispatching:', action);
  let result = next(action);
  console.log('State after dispatch:', store.getState());
  return result;
};

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Composing enhancers and middleware together
const enhancers = composeEnhancers(
  applyMiddleware(loggerMiddleware, asyncMiddleware),
  devToolsEnhancer({ realtime: true, hostname: '10.0.0.215', port: 8002 }) // Make sure hostname and port are correctly set
);

// Create Store with persistedReducer and enhancers
const store = createStore(persistedReducer, enhancers);

// Persistor for the store
const persistor = persistStore(store);

export default store;
export { persistor };
