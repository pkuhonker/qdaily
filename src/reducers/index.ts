import { combineReducers } from 'redux';
import home, { HomeState } from './home';
import article, { ArticleState } from './article';
import routes, { RoutesState } from './routes';

export interface AppState {
    home: HomeState;
    article: ArticleState;
    routes: RoutesState;
}

export default combineReducers<AppState>({
    home,
    article,
    routes
});
