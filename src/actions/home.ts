import { createAction } from 'redux-actions';
import * as types from '../constants/actionTypes';
import { News, Papers } from '../interfaces';
import * as apiService from '../services/apiService';

export function getNews(key?: string) {
    return createAction<Promise<News>, any>(types.GET_NEWS, async (key?: string) => {
        return await apiService.getNews(key);
    }, (key: string) => {
        return {
            root: !key || key === '0'
        };
    })(key);
}

export function getPapers(key?: string) {
    return createAction<Promise<Papers>, any>(types.GET_PAPERS, async (key?: string) => {
        return await apiService.getPapers(key);
    }, (key: string) => {
        return {
            root: !key || key === '0'
        };
    })(key);
}