import { createAction } from 'redux-actions';
import * as types from '../constants/actionTypes';
import { Paper } from '../interfaces';
import * as apiService from '../services/apiService';

export function getPaperById(id: number) {
    return createAction<Promise<Paper>, any>(types.GET_PAPER_BY_ID, async (id: number) => {
        return await apiService.getPaperById(id);
    })(id);
}