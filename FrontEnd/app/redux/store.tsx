import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'
import userReducer from './reducers'; // Assuming this is where your userReducer is
import { createPromise } from 'redux-promise-middleware'

const rootReducer = combineReducers({ user: userReducer }); 
export const store = createStore(rootReducer, applyMiddleware(thunk)); 
