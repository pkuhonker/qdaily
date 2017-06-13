import { combineReducers } from 'redux';
import home, { HomeState } from './home';

export type AppState = HomeState;

export default combineReducers({
    home
});
