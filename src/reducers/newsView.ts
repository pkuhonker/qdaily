import { PromiseMeta, PromiseMetaSequence } from '../interfaces';
import { FSA } from 'flux-standard-action';
import * as types from '../constants/actionTypes';

export interface NewsViewState {
    pullRefreshPending: boolean;
}

const initialState: NewsViewState = {
    pullRefreshPending: false
};

export default function (state = initialState, action: FSA<NewsViewState, PromiseMeta>): NewsViewState {
    const { type, meta = {} as PromiseMeta } = action;
    const { sequence = {} as PromiseMetaSequence, root = true } = meta;
    const pending = sequence.type === 'start';

    switch (type) {
        case types.GET_NEWS:
            return root ? {
                pullRefreshPending: pending
            } : state;
        default:
            return state;
    }
}