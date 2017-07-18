> Note: 所有API返回结果格式如下

```typescript
{
    "meta": {
        status: ${status_code},    // 200
        msg: ${message}            // "success"
    },
    "response": {
        // 请求结果对象
    }
}

```

# 首页

## NEWS

### 地址

http://app3.qdaily.com/homes/index/${key}.json

### 参数

| 名称     | 类型    | 描述         |
|----------|:------:|:------------:|
| key      | string | 分页索引，第一页为`0`。 <br/>下一页的索引为返回结果中的 last_key 字段 |

### 结果

#### Response

```typescript
interface News {
    has_more: boolean;
    last_key: string;       // 下一页的索引
    feeds: Feed[];          // 新闻列表
    banners: Banner[];      // 首页banner轮播列表
    headline: HeadLine;     // 首页新闻头条
    banners_ad: Banner[];   // 首页banner轮播广告
    feeds_ad: Feed[];       // 广告新闻列表
}
```

#### Feed 新闻数据

```typescript
interface Feed {
    image: string;      // 缩略图
    type: FeedType;     // 类型 [FeedType](./api_readme.md#FeedType 新闻类型)
    post: Post;         // 详细信息
}
```

#### FeedType 新闻类型

```typescript
enum FeedType {
    PAPER = 0,      // LABS中的新闻类型，通常用户可以参与讨论
    NORMAL = 1,     // 一般类型，大多数为这种类型
    LARGE = 2       // 这种类型在界面上显示出来比较大
}
```

#### Post 新闻详细信息

```typescript
interface Post {
    id: number;                 // 新闻id
    title: string;              // 新闻标题
    description: string;        // 新闻简短描述
    publish_time: number;       // 发布时间，距离1970年1月1日的秒数，即 Date.now() / 1000
    image: string;              // 新闻图片
    comment_count: number;      // 评论数量
    praise_count: number;       // 点赞数量
    appview: string;            // 新闻网址
    category: PostCategory;     // 新闻类别
    record_count?: number;      // 类型为Paper的新闻，参与的人数
    column?: PostColumn;        // 新闻所在的column
}
```

#### PostCategory 新闻类别

```typescript
interface PostCategory {
    id: number;
    title: string;
    normal: string;
    normal_hl: string;
    image_lab?: string;
    image_experiment: string;
}
```

#### PostColumn 新闻column

```typescript
interface PostColumn {
    id: number;
    name: string;
    description: string;
    icon: string;
    image: string;
    share: Share;
}
```

##### Banner 首页轮播

```typescript
interface Banner extends Feed {
}
```

##### HeadLine 头条

```typescript
interface HeadLine extends Feed {
    list: {
        title: string;
        description: string;
        keywords: string[];
    }[];
}
```

### 示例数据

[实例](./example_data/homes0.json)


### LABS