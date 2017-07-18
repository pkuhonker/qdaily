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

## 首页

### NEWS

**地址**

http://app3.qdaily.com/homes/index/${key}.json

**参数**

| 名称     | 类型    | 描述         |
|----------|:------:|:------------:|
| key      | string | 分页索引，第一页为`0`。 <br/>下一页的索引为返回结果中的 last_key 字段 |

**结果**

```typescript
{
    has_more: boolean;
    last_key: string;       // 下一页的索引
    feeds: Feed[];          // 新闻列表
    banners: Banner[];      // 首页banner轮播列表
    headline: HeadLine;     // 首页新闻头条
    banners_ad: Banner[];   // 首页banner轮播广告
    feeds_ad: Feed[];       // 广告新闻列表
}
```

- Feed  新闻数据

```typescript
{
    image: string;      // 缩略图
    type: FeedType;     // 类型
    post: Post;         // 详细信息
}
```






### LABS