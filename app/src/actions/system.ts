import { createAction } from 'redux-actions';
import * as types from '../constants/actionTypes';

export function launch() {
    return createAction(types.LAUNCH)();
}