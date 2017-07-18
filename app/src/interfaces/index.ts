export interface PostCategory {
    id: number;
    title: string;
    normal: string;
    normal_hl: string;
    image_lab?: string;
    image_experiment: string;
}

export interface TopicCategory {
    id: number;
    title: string;
    normal: string;
    white_icon: string;
    black_icon: string;
}

export interface Share {
    url: string;
    title: string;
    text: string;
    image: string;
}

export interface Author {
    id: number;
    description: string;
    avatar: string;
    name: string;
    background_image: string;
}

export interface PostColumn {
    id: number;
    name: string;
    description: string;
    icon: string;
    image: string;
    share: Share;
}

export interface Post {
    id: number;
    title: string;
    description: string;
    publish_time: number;
    image: string;
    comment_count: number;
    praise_count: number;
    category: PostCategory;
    record_count: number;
    column?: PostColumn;
}

export enum FeedType {
    PAPER = 0,
    NORMAL = 1,
    LARGE = 2
}

export interface Feed {
    image: string;
    type: FeedType;
    post: Post;
}

export interface PaperOption {
    id: string;
    content: string;
    image: string;
    praise_count: number;
    perfect: number;
    author: {
        id: number;
        description: string;
        avatar: string;
        name: string;
        background_image: string;
    };
}

export interface Paper extends Feed {
    options: PaperOption[];
}

export interface Banner extends Feed {
}

export interface HeadLine extends Feed {
    list: {
        title: string;
        description: string;
        keywords: string[];
    }[];
}

export interface PaperTopicContent {
    id: string;
    icon: string;
    title: string;
    description: string;
    image: string;
}

export interface PaperTopic {
    id: string;
    insert_location: number;
    insert_content: PaperTopicContent;
}

export interface Categories {
    has_more: boolean;
    last_key: string;
    feeds: Feed[];
}

export interface News {
    has_more: boolean;
    last_key: string;
    feeds: Feed[];
    banners: Banner[];
    headline: HeadLine;
}

export interface Papers {
    has_more: boolean;
    last_key: string;
    feeds: Feed[];
    paper_topics: PaperTopic[];
}

export interface Article {
    id: number;
    body: string;
    js: string[];
    css: string[];
    image: string[];
}

export interface ArticleInfo extends Feed {
    share: Share;
    author: Author;
}

/////////

export interface PromiseMeta {
    sequence: PromiseMetaSequence;
    [key: string]: any;
}

export interface PromiseMetaSequence {
    id: string;
    type: 'start' | 'next';
}