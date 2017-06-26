import { Article, PromiseMeta, PromiseMetaSequence } from '../interfaces';
import { FSA } from 'flux-standard-action';
import * as types from '../constants/actionTypes';

export interface ArticleState {
    articles: { [id: string]: Article };
}

const initialState: ArticleState = {
    articles: {}
};

export default function (state = initialState, action: FSA<Article, PromiseMeta>): ArticleState {
    const { type, payload, error, meta = {} as PromiseMeta } = action;
    const { sequence = {} as PromiseMetaSequence } = meta;
    const pending = sequence.type === 'start';

    switch (type) {
        case types.GET_ARTICLE_BY_ID:
            return (!error && !pending) ? {
                ...state,
                articles: {
                    ...state.articles,
                    [payload.id]: payload
                }
            } : state;
        default:
            return state;
    }
}