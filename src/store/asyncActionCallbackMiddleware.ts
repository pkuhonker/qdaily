import { Middleware } from "redux";

const asyncActionCallbackMiddleware: Middleware = store => next => action => {
    const { meta = Object.create(null), error, payload } = action;
    const { sequence = Object.create(null), resolved, rejected } = meta;
    if (sequence.type !== 'next') {
        return next(action);
    }

    // do callback
    if (error) {
        if (rejected) {
            rejected(payload);
        }
    } else {
        if (resolved) {
            resolved(payload);
        }
    }

    next(action);
};

export default asyncActionCallbackMiddleware;