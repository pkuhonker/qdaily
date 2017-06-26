import { Paper, PromiseMeta, PromiseMetaSequence } from '../interfaces';
import { FSA } from 'flux-standard-action';
import * as types from '../constants/actionTypes';

export interface PaperState {
    papers: { [id: string]: Paper };
}

const initialState: PaperState = {
    papers: {}
};

export default function (state = initialState, action: FSA<Paper, PromiseMeta>): PaperState {
    const { type, payload, error, meta = {} as PromiseMeta } = action;
    const { sequence = {} as PromiseMetaSequence } = meta;
    const pending = sequence.type === 'start';

    switch (type) {
        case types.GET_PAPER_BY_ID:
            return (!error && !pending) ? {
                ...state,
                papers: {
                    ...state.papers,
                    [payload.post.id]: payload
                }
            } : state;
        default:
            return state;
    }
}