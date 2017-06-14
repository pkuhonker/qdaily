import { MiddlewareAPI, Dispatch } from "redux";
import { isFSA, FluxStandardAction } from 'flux-standard-action';
import * as _ from 'lodash';

function isPromise(val: any): val is Promise<any> {
    return val && typeof val.then === 'function';
}

export default function promiseMiddleware({ dispatch }: MiddlewareAPI<FluxStandardAction<any, any>>) {
    return (next: Dispatch<any>) => (action: any) => {
        if (!isFSA(action)) {
            return isPromise(action)
                ? action.then(dispatch)
                : next(action);
        }
        const { meta = {}, payload } = action;

        const id = _.uniqueId();

        if (isPromise(payload)) {
            dispatch({
                ...action,
                payload: undefined,
                meta: {
                    ...meta,
                    sequence: {
                        type: 'start',
                        id
                    }
                }
            });

            return payload.then(
                result => dispatch({
                    ...action,
                    payload: result,
                    meta: {
                        ...meta,
                        sequence: {
                            type: 'next',
                            id
                        }
                    }
                }),
                error => dispatch({
                    ...action,
                    payload: error,
                    error: true,
                    meta: {
                        ...meta,
                        sequence: {
                            type: 'next',
                            id
                        }
                    }
                })
            );
        }

        return next(action);
    };
}
