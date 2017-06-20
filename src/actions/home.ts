import { createAction } from 'redux-actions';
import * as types from '../constants/actionTypes';
import { HomeState } from '../reducers/home';
import * as apiService from '../services/apiService';

export function getHome(key?: string) {
    return createAction<Promise<HomeState>, string | undefined>(types.GET_HOME, async (key?: string) => {
        return await apiService.getHome(key);
    })(key);
}