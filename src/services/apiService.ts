import * as requestService from './requestService';
import { NewsState } from '../reducers/news';

export function getNews(key?: string): Promise<NewsState> {
    return requestService.get(`/homes/index/${key ? key : 0}.json`).then(result => {
        return result.response as NewsState;
    });
}