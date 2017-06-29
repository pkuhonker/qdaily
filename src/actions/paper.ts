import { createAction } from 'redux-actions';
import * as types from '../constants/actionTypes';
import { Paper } from '../interfaces';
import * as apiService from '../services/apiService';

export function getPaperDetailById(id: number) {
    return createAction<Promise<Paper>, any>(types.GET_PAPER_DETAIL_BY_ID, async (id: number) => {
        return await apiService.getPaperDetailById(id);
    })(id);
}