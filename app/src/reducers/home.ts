import { News, Papers, HeadLine, TopicCategory, PromiseMeta, PromiseMetaSequence } from '../interfaces';
import { FSA } from 'flux-standard-action';
import * as types from '../constants/actionTypes';

export interface HomeState {
    news_pullRefreshPending: boolean;
    papers_pullRefreshPending: boolean;
    news: News;
    papers: Papers;
    left_sidebar: TopicCategory[];
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
    papers: initialPapersState,
    left_sidebar: []
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
            const filterFeeds = payload.feeds.filter(feed => {
                if (payload.headline) {
                    return feed.post.id !== payload.headline.post.id;
                } else {
                    return true;
                }
            });
            return {
                ...newState, news: {
                    ...newState.news,
                    ...payload,
                    feeds: filterFeeds
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

function getLeftSidebar(state: HomeState, action: FSA<TopicCategory[], PromiseMeta>): HomeState {
    const { payload, error, meta = {} as PromiseMeta } = action;
    const { sequence = {} as PromiseMetaSequence } = meta;
    const pending = sequence.type === 'start';

    if (!error && !pending) {
        return {
            ...state,
            left_sidebar: payload
        };
    }
    return state;
}

export default function (state = initialState, action: any): HomeState {
    const { type } = action as FSA<any, PromiseMeta>;

    switch (type) {
        case types.GET_NEWS:
            return getNews(state, action);
        case types.GET_PAPERS:
            return getPapers(state, action);
        case types.GET_LEFT_SIDEBAR:
            return getLeftSidebar(state, action);
        default:
            return state;
    }
}