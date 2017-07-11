import { Categories, PromiseMeta, PromiseMetaSequence } from '../interfaces';
import { FSA } from 'flux-standard-action';
import * as types from '../constants/actionTypes';

export interface CategoryState {
    pullRefreshPending: boolean;
    categories: { [id: number]: Categories };
}

const initialState: CategoryState = {
    pullRefreshPending: false,
    categories: {}
};

export default function (state = initialState, action: FSA<Categories, PromiseMeta>): CategoryState {
    const { type, payload, error, meta = {} as PromiseMeta } = action;
    const { sequence = {} as PromiseMetaSequence, root = true, id } = meta;
    const pending = sequence.type === 'start';
    let newState: CategoryState;
    if (root) {
        newState = { ...state, pullRefreshPending: pending };
    } else {
        newState = state;
    }

    switch (type) {
        case types.GET_CATEGORIES:
            if (error) {
                return state;
            }
            if (root) {
                return {
                    ...state,
                    pullRefreshPending: pending,
                    categories: pending ? state.categories : {
                        ...state.categories,
                        [id] : payload
                    }
                };
            } else {
                return {
                    ...state,
                    pullRefreshPending: false,
                    categories: pending ? state.categories : {
                        ...state.categories,
                        [id]: {
                            ...payload,
                            feeds: state.categories[id].feeds.concat(payload.feeds)
                        }
                    }
                };
            }
        default:
            return state;
    }
}