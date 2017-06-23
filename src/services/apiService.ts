import * as requestService from './requestService';
import { News, Papers } from '../interfaces';


export function getNews(key?: string): Promise<News> {
    return requestService.get(`/homes/index/${key ? key : 0}.json`).then(result => {
        return result.response as News;
    });
}

export function getPapers(key?: string): Promise<Papers> {
    return requestService.get(`/papers/index/${key ? key : 0}.json`).then(result => {
        return result.response as Papers;
    });
}