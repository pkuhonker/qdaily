import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import reducers from '../reducers';

declare const module: any;

const middlewares: Middleware[] = [
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