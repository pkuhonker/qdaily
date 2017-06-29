import { createAction } from 'redux-actions';
import * as types from '../constants/actionTypes';
import { Article, Feed } from '../interfaces';
import * as apiService from '../services/apiService';

export function getArticleDetailById(id: number) {
    return createAction<Promise<Article>, any>(types.GET_ARTICLE_DETAIL_BY_ID, async (id: number) => {
        return await apiService.getArticleDetailById(id);
    })(id);
}

export function getArticleInfoById(id: number) {
    return createAction<Promise<Feed>, any>(types.GET_ARTICLE_INFO_BY_ID, async (id: number) => {
        return await apiService.getArticleInfoById(id);
    })(id);
}