import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from './promiseMiddleware';
import asyncActionCallbackMiddleware from './asyncActionCallbackMiddleware';
import reducers from '../reducers';

declare const module: any;

const middlewares: Middleware[] = [
    thunkMiddleware,
    promiseMiddleware,
    asyncActionCallbackMiddleware
];

export default function configureStore(initialState?: any): Store<any> {
    const store = applyMiddleware(...middlewares)(createStore)(reducers, initialState);

    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = require('../reducers/index').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}