import { combineReducers } from 'redux';
import home, { HomeState } from './home';
import routes, { RoutesState } from './routes';

export interface AppState {
    home: HomeState;
    routes: RoutesState;
}

export default combineReducers({
    home,
    routes
});
