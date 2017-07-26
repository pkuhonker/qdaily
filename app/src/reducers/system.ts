import { REHYDRATE } from 'redux-persist/constants';

export interface SystemState {
    redux_version: number;
    firstLaunch: boolean;
    restored: boolean;
}

const initialState: SystemState = {
    redux_version: 1,
    firstLaunch: true,
    restored: false
};

export default function reducer(state = initialState, action: any) {
    if (action.type === REHYDRATE) {
        return {
            ...state,
            restored: true
        };
    } else {
        return state;
    }
};
