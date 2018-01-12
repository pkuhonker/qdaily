import { createAction } from 'redux-actions';
import * as types from '../constants/actionTypes';
import { Categories } from '../interfaces';
import * as apiService from '../services/apiService';

export function getCategories(id: number, key?: string) {
    return createAction<Promise<Categories>, any>(types.GET_CATEGORIES, async (id: number, key?: string) => {
        return await apiService.getCategories(id, key);
    }, (id: number, key?: string) => {
        return {
            id: id,
            root: !key || key === '0'
        };
    })(id, key);
}