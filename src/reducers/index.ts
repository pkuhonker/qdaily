import { combineReducers } from 'redux';
import home, { HomeState } from './home';
import routes, { RoutesState } from './routes';

export type AppState = HomeState & RoutesState;

export default combineReducers({
    home,
    routes
});
