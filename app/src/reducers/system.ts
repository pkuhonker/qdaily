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
    switch (action.type) {
        case REHYDRATE:
            const system = action.payload.system;
            return {
                ...state,
                ...system,
                restored: true
            };
        case types.LAUNCH:
            return {
                ...state,
                isLaunched: true
            };
        default:
            return state;
    }
};
