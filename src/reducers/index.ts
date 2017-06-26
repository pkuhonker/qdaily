import { combineReducers } from 'redux';
import home, { HomeState } from './home';
import article, { ArticleState } from './article';
import paper, { PaperState } from './paper';
import routes, { RoutesState } from './routes';

export interface AppState {
    home: HomeState;
    article: ArticleState;
    paper: PaperState;
    routes: RoutesState;
}

export default combineReducers<AppState>({
    home,
    article,
    paper,
    routes
});
