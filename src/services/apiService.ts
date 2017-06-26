import * as requestService from './requestService';
import { News, Papers, Article, Paper } from '../interfaces';


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

export function getArticleById(id: number): Promise<Article> {
    return requestService.get(`/articles/detail/${id}.json`).then(result => {
        return result.response.article as Article;
    });
}

export function getPaperById(id: number): Promise<Paper> {
    return requestService.get(`/papers/detail/${id}.json`).then(result => {
        return result.response as Paper;
    });
}