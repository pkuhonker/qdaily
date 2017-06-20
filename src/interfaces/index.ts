export interface PostCategory {
    id: number;
    title: string;
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
    publish_time: number;
    comment_count: number;
    praise_count: number;
    category: PostCategory;
    column?: PostColumn;
}

export interface Feed {
    image: string;
    type: number;
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