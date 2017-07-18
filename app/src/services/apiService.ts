import * as requestService from './requestService';
import { News, Papers, Categories, TopicCategory, Article, Paper, ArticleInfo } from '../interfaces';


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

export function getCategories(id: number, key?: string): Promise<Categories> {
    return requestService.get(`/categories/index/${id}/${key ? key : 0}.json`).then(result => {
        return result.response as Categories;
    });
}

export function getLeftSidebar(): Promise<TopicCategory[]> {
    return requestService.get(`/homes/left_sidebar.json`).then(result => {
        return result.response as TopicCategory[];
    });
}

export function getArticleDetailById(id: number): Promise<Article> {
    return requestService.get(`/articles/detail/${id}.json`).then(result => {
        return result.response.article as Article;
    });
}

export function getArticleInfoById(id: number): Promise<ArticleInfo> {
    return requestService.get(`/articles/info/${id}.json`).then(result => {
        return result.response as ArticleInfo;
    });
}

export function getPaperDetailById(id: number): Promise<Paper> {
    return requestService.get(`/papers/detail/${id}.json`).then(result => {
        return result.response as Paper;
    });
}