import { createAction } from 'redux-actions';
import * as types from '../constants/actionTypes';
import { NewsState } from '../reducers/news';
import * as apiService from '../services/apiService';

export function getNews(key?: string) {
    return createAction<Promise<NewsState>, any>(types.GET_NEWS, async (key?: string) => {
        return await apiService.getNews(key);
    }, (key: string) => {
        return {
            root: !key || key === '0'
        };
    })(key);
}