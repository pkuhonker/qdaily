import * as requestService from './requestService';
import { HomeState } from '../reducers/home';

export function getHome(key?: string): Promise<HomeState> {
    return requestService.get(`/homes/index/${key ? key : 0}.json`).then(result => {
        return result.response as HomeState;
    });
}