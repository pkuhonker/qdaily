import { REHYDRATE } from 'redux-persist/constants';
import * as types from '../constants/actionTypes';

export interface SystemState {
    redux_version: number;
    isLaunched: boolean;
    restored: boolean;
}

const initialState: SystemState = {
    redux_version: 1,
    isLaunched: false,
    restored: false
};

export default function reducer(state = initialState, action: any) {
    switch(action.type) {
        case REHYDRATE:
            if (action.payload.system) {
                return {
                    ...state,
                    ...action.payload.system,
                    restored: true
                };
            } else {
                return state;
            }
        case types.LAUNCH:
            return {
                ...state,
                isLaunched: true
            };
        default:
            return state;
    }
};
