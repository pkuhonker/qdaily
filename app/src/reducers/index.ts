import { combineReducers } from 'redux';
import home, { HomeState } from './home';
import article, { ArticleState } from './article';
import paper, { PaperState } from './paper';
import category, { CategoryState } from './category';
import nav, { NavigationState } from './routes';

export interface AppState {
    home: HomeState;
    article: ArticleState;
    paper: PaperState;
    category: CategoryState;
    nav: NavigationState;
}

export default combineReducers<AppState>({
    home,
    article,
    paper,
    category,
    nav
});
