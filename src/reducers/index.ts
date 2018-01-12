import { combineReducers } from 'redux';
import home, { HomeState } from './home';
import article, { ArticleState } from './article';
import paper, { PaperState } from './paper';
import category, { CategoryState } from './category';
import nav, { NavigationState } from './routes';
import system, { SystemState } from './system';

export interface AppState {
    home: HomeState;
    article: ArticleState;
    paper: PaperState;
    category: CategoryState;
    nav: NavigationState;
    system: SystemState;
}

export default combineReducers<AppState>({
    home,
    article,
    paper,
    category,
    nav,
    system
});
