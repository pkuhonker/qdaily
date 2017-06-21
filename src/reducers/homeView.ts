import { PromiseMeta, PromiseMetaSequence } from '../interfaces';
import { FSA } from 'flux-standard-action';
import * as types from '../constants/actionTypes';

export interface HomeViewState {
    pullRefreshPending: boolean;
}

const initialState: HomeViewState = {
    pullRefreshPending: false
};

export default function (state = initialState, action: FSA<HomeViewState, PromiseMeta>): HomeViewState {
    const { type, meta = {} as PromiseMeta } = action;
    const { sequence = {} as PromiseMetaSequence, home = true } = meta;
    const pending = sequence.type === 'start';

    switch (type) {
        case types.GET_HOME:
            return home ? {
                pullRefreshPending: pending
            } : state;
        default:
            return state;
    }
}