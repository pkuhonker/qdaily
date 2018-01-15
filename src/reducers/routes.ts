import { REHYDRATE } from 'redux-persist/constants';
import { NavigationState } from 'react-navigation';
import { Navigator } from '../containers/Navigation';

export type NavigationState = NavigationState;

const firstAction = Navigator.router.getActionForPathAndParams('home');
const initialState: NavigationState = Navigator.router.getStateForAction(firstAction, null);

export default function reducer(state = initialState, action: any) {
    if (typeof action.type === 'string' && action.type.startsWith('Navigation/')) {
        const nextState = Navigator.router.getStateForAction(action, state);
        return nextState || state;
    }
    switch (action.type) {
        // We should restore the route.
        case REHYDRATE:
            return {
                ...state,
                initialState
            };
        default:
            return state;
    }
};
