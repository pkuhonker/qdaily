import { combineReducers } from 'redux';
import news, { NewsState } from './news';
import newsView, { NewsViewState } from './newsView';
import routes, { RoutesState } from './routes';

export interface AppState {
    news: NewsState;
    newsView: NewsViewState;
    routes: RoutesState;
}

export default combineReducers<AppState>({
    news,
    newsView,
    routes
});
