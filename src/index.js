import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import { Provider } from 'react-redux';
import rootReducer from './reducer';
import thunk from 'redux-thunk';
import { Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import history from './history';
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/lib/integration/react';

const persistConfig = {
    key: 'root',
    storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Router history={history}>
                <App />
            </Router>
        </PersistGate>
    </Provider >, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
