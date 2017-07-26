import { AsyncStorage } from 'react-native';
import { compose, createStore, applyMiddleware, Middleware, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import promiseMiddleware from './promiseMiddleware';
import asyncActionCallbackMiddleware from './asyncActionCallbackMiddleware';
import fetchErrorMiddleware from './fetchErrorMiddleware';
import reducers from '../reducers';

declare const module: any;

const middlewares: Middleware[] = [
    thunkMiddleware,
    promiseMiddleware,
    asyncActionCallbackMiddleware,
    fetchErrorMiddleware
];

export default function configureStore(initialState?: any): Store<any> {
    const store = compose(
        applyMiddleware(...middlewares),
        autoRehydrate({ log: __DEV__ })
    )(createStore)(reducers, initialState);

    persistStore(store, {
        storage: AsyncStorage as any,
        transforms: [
            {
                in: (state, key) => {
                    return state;
                },
                out: (raw, key) => {
                    return raw;
                },
            }
        ]
    });

    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = require('../reducers/index').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}