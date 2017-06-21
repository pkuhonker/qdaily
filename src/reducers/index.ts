import { combineReducers } from 'redux';
import home, { HomeState } from './home';
import homeView, { HomeViewState } from './homeView';
import routes, { RoutesState } from './routes';

export interface AppState {
    home: HomeState;
    homeView: HomeViewState;
    routes: RoutesState;
}

export default combineReducers<AppState>({
    home,
    homeView,
    routes
});
