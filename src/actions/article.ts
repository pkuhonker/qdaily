import { createAction } from 'redux-actions';
import * as types from '../constants/actionTypes';
import { Article } from '../interfaces';
import * as apiService from '../services/apiService';

export function getArticleById(id: number) {
    return createAction<Promise<Article>, any>(types.GET_ARTICLE_BY_ID, async (id: number) => {
        return await apiService.getArticleById(id);
    })(id);
}