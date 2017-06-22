import { Feed, Banner, HeadLine, PromiseMeta, PromiseMetaSequence } from '../interfaces';
import { FSA } from 'flux-standard-action';
import * as types from '../constants/actionTypes';

export interface NewsState {
    has_more: boolean;
    last_key: string;
    feeds: Feed[];
    banners: Banner[];
    headline: HeadLine;
}

const initialState: NewsState = {
    has_more: true,
    last_key: '',
    feeds: [],
    banners: [],
    headline: {
        list: []
    } as HeadLine
};

export default function (state = initialState, action: FSA<NewsState, PromiseMeta>): NewsState {
    const { type, payload, error, meta = {} as PromiseMeta } = action;
    const { sequence = {} as PromiseMetaSequence, root = true } = meta;
    const pending = sequence.type === 'start';

    switch (type) {
        case types.GET_NEWS:
            if (!error && !pending) {
                if (root) {
                    return { ...state, ...payload };
                } else {
                    return {
                        ...state,
                        has_more: payload.has_more,
                        last_key: payload.last_key,
                        feeds: state.feeds.concat(payload.feeds)
                    };
                }
            } else {
                return state;
            }
        default:
            return state;
    }
}