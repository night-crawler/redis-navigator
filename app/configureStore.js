/**
 * Create the store with dynamic reducers
 */

import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createReducer from './reducers';
import { apiMiddleware } from 'redux-api-middleware';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';


export default function configureStore(initialState = {}, history) {
    const middlewares = [
        apiMiddleware,
        thunkMiddleware,
        createLogger,
        routerMiddleware(history),
    ];

    const enhancers = [
        applyMiddleware(...middlewares),
    ];

    const composeEnhancers =
        process.env.NODE_ENV !== 'production' &&
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
                shouldHotReload: false,
            })
            : compose;

    const store = createStore(
        createReducer(),
        initialState,
        composeEnhancers(...enhancers)
    );

    store.injectedReducers = {}; // Reducer registry

    // Make reducers hot reloadable, see http://mxs.is/googmo
    if (module.hot) {
        module.hot.accept('./reducers', () => {
            store.replaceReducer(createReducer(store.injectedReducers));
        });
    }

    return store;
}