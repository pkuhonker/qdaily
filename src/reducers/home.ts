import { Feed, Banner, HeadLine, PromiseMeta, PromiseMetaSequence } from '../interfaces';
import { FSA } from 'flux-standard-action';
import * as types from '../constants/actionTypes';

export interface HomeState {
    has_more: boolean;
    last_key: string;
    feeds: Feed[];
    banners: Banner[];
    headline: HeadLine;
}

const initialState: HomeState = {
    has_more: true,
    last_key: '',
    feeds: [],
    banners: [],
    headline: {
        list: []
    } as HeadLine
};

export default function (state = initialState, action: FSA<HomeState, PromiseMeta>): HomeState {
    const { type, payload, error,meta = {} as PromiseMeta } = action;
    const { sequence = {} as PromiseMetaSequence } = meta;
    const pending = sequence.type === 'start';

    switch (type) {
        case types.GET_HOME:
            return (!error && !pending) ? {
                ...state,
                ...payload,
                feeds: payload.feeds.length > 0 ? state.feeds.concat(payload.feeds) : state.feeds,
                banners: payload.banners.length > 0 ? payload.banners : state.banners,
                headline: payload.headline.list.length > 0 ? payload.headline : state.headline
            } : state;
        default:
            return state;
    }
}