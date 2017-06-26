import { News, Papers, HeadLine, PromiseMeta, PromiseMetaSequence } from '../interfaces';
import { FSA } from 'flux-standard-action';
import * as types from '../constants/actionTypes';

export interface HomeState {
    news_pullRefreshPending: boolean;
    papers_pullRefreshPending: boolean;
    news: News;
    papers: Papers;
}

const initialNewsState: News = {
    has_more: true,
    last_key: '',
    feeds: [],
    banners: [],
    headline: {
        post: {},
        list: []
    } as HeadLine
};

const initialPapersState: Papers = {
    has_more: true,
    last_key: '',
    feeds: [],
    paper_topics: []
};

const initialState: HomeState = {
    news_pullRefreshPending: false,
    papers_pullRefreshPending: false,
    news: initialNewsState,
    papers: initialPapersState
};

function getNews(state: HomeState, action: FSA<News, PromiseMeta>): HomeState {
    const { payload, error, meta = {} as PromiseMeta } = action;
    const { sequence = {} as PromiseMetaSequence, root = true } = meta;
    const pending = sequence.type === 'start';
    let newState: HomeState;
    if (root) {
        newState = { ...state, news_pullRefreshPending: pending };
    } else {
        newState = state;
    }

    if (!error && !pending) {
        if (root) {
            const filterFirst = payload.feeds.length > 0 && payload.headline.post.id === payload.feeds[0].post.id;
            return {
                ...newState, news: {
                    ...newState.news,
                    ...payload,
                    feeds: filterFirst ? payload.feeds.slice(1) : payload.feeds
                }
            };
        } else {
            return {
                ...newState, news: {
                    ...newState.news,
                    has_more: payload.has_more,
                    last_key: payload.last_key,
                    feeds: newState.news.feeds.concat(payload.feeds)
                }
            };
        }
    }
    return newState;
}

function getPapers(state: HomeState, action: FSA<Papers, PromiseMeta>): HomeState {
    const { payload, error, meta = {} as PromiseMeta } = action;
    const { sequence = {} as PromiseMetaSequence, root = true } = meta;
    const pending = sequence.type === 'start';
    let newState: HomeState;
    if (root) {
        newState = { ...state, papers_pullRefreshPending: pending };
    } else {
        newState = state;
    }

    if (!error && !pending) {
        if (root) {
            return {
                ...newState, papers: {
                    ...newState.papers,
                    ...payload
                }
            };
        } else {
            return {
                ...newState, papers: {
                    ...newState.papers,
                    has_more: payload.has_more,
                    last_key: payload.last_key,
                    feeds: newState.papers.feeds.concat(payload.feeds),
                    paper_topics: newState.papers.paper_topics.concat(payload.paper_topics)
                }
            };
        }
    }
    return newState;
}

export default function (state = initialState, action: FSA<any, PromiseMeta>): HomeState {
    const { type } = action;

    switch (type) {
        case types.GET_NEWS:
            return getNews(state, action);
        case types.GET_PAPERS:
            return getPapers(state, action);
        default:
            return state;
    }
}