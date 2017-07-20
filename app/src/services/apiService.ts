import * as requestService from './requestService';
import { News, Papers, Categories, TopicCategory, Article, Paper, ArticleInfo } from '../interfaces';


export async function getNews(key?: string): Promise<News> {
    const result = await requestService.get(`/homes/index/${key ? key : 0}.json`);
    return result.response as News;
}

export async function getPapers(key?: string): Promise<Papers> {
    const result = await requestService.get(`/papers/index/${key ? key : 0}.json`);
    return result.response as Papers;
}

export async function getCategories(id: number, key?: string): Promise<Categories> {
    const result = await requestService.get(`/categories/index/${id}/${key ? key : 0}.json`);
    return result.response as Categories;
}

export async function getLeftSidebar(): Promise<TopicCategory[]> {
    const result = await requestService.get(`/homes/left_sidebar.json`);
    return result.response as TopicCategory[];
}

export async function getArticleDetailById(id: number): Promise<Article> {
    const result = await requestService.get(`/articles/detail/${id}.json`);
    return result.response.article as Article;
}

export async function getArticleInfoById(id: number): Promise<ArticleInfo> {
    const result = await requestService.get(`/articles/info/${id}.json`);
    return result.response as ArticleInfo;
}

export async function getPaperDetailById(id: number): Promise<Paper> {
    const result = await requestService.get(`/papers/detail/${id}.json`);
    return result.response as Paper;
}