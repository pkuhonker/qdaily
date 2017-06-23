export interface PostCategory {
    id: number;
    title: string;
    image_lab?: string;
    [key: string]: any;
}

export interface PostColumn {
    id: number;
    name: string;
    description: string;
    icon: string;
    image: string;
    share: {
        url: string;
        title: string;
        text: string;
        image: string;
    };
}

export interface Post {
    id: number;
    title: string;
    description: string;
    publish_time: number;
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

/////////

export interface PromiseMeta {
    sequence: PromiseMetaSequence;
    [key: string]: any;
}

export interface PromiseMetaSequence {
    id: string;
    type: 'start' | 'next';
}