import * as React from 'react';
import moment from 'moment';
import { StyleSheet, Text, View, Image, ViewStyle, TextStyle, ImageStyle, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface FeedCategory {
    id: number;
    title: string;
    [key: string]: any;
}

export interface FeedPost {
    id: number;
    title: string;
    publish_time: number;
    comment_count: number;
    praise_count: number;
    category: FeedCategory;
}

export interface IFeed {
    image: string;
    type: 1 | 2 | 3;
    post: FeedPost;
}

export interface FeedProp {
    feed?: IFeed;
}

export default class Feed extends React.Component<FeedProp, any> {

    private feed: IFeed = {
        image: 'http://img.qdaily.com/article/article_show/20170602185127NhzM7wSLXmy2pWAt.jpg?imageMogr2/auto-orient/thumbnail/!640x380r/gravity/Center/crop/640x380/quality/85/format/jpg/ignore-error/1',
        type: 1,
        post: {
            id: 41574,
            title: "苹果App Store 9年卖了1000亿美元的软件，这相当于什么水平？ | 好奇心小数据",
            publish_time: 1496401430,
            comment_count: 15,
            praise_count: 57,
            category: {
                id: 4,
                title: "智能",
                normal: "http://img.qdaily.com/category/icon_black/20160606004531Fg254UJbRaLqOmvY.png?imageMogr2/auto-orient/thumbnail/!128x128r/gravity/Center/crop/128x128/quality/85/ignore-error/1",
                normal_hl: "http://img.qdaily.com/category/icon_yellow_app/20160606004532NrgPYnKo3UXRaw1i.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/85/ignore-error/1",
                image_lab: "http://img.qdaily.com/category/icon_yellow_app/20160606004532NrgPYnKo3UXRaw1i.png?imageMogr2/auto-orient/thumbnail/!160x160r/gravity/Center/crop/160x160/quality/85/ignore-error/1",
                image_experiment: ""
            },
        }
    };

    private parseTime(time: number) {
        return moment(time * 1000, undefined, 'zh-cn').fromNow();
    }

    public render() {
        const { feed = this.feed } = this.props;
        return (
            <TouchableNativeFeedback>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.postTitle}>{feed.post.title}</Text>
                        <View style={styles.postDetail}>
                            <Text style={[styles.postDetailText]}>{feed.post.category.title}</Text>
                            <Icon style={[styles.postDetailText]} name='comment-o'/>
                            <Text style={[styles.postDetailText]}>{feed.post.comment_count}</Text>
                            <Icon style={[styles.postDetailText, { fontSize: 10 }]} name='heart-o'/>
                            <Text style={[styles.postDetailText]}>{feed.post.praise_count}</Text>
                            <Text style={[styles.postDetailText]}>{this.parseTime(feed.post.publish_time)}</Text>
                        </View>
                    </View>
                    <Image style={styles.image} source={{ uri: feed.image }}>
                    </Image>
                </View>
            </TouchableNativeFeedback>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'row'
    } as ViewStyle,
    content: {
        flex: 11,
        padding: 12,
        justifyContent: 'space-between'
    } as ViewStyle,
    image: {
        flex: 9,
        height: 120
    } as ImageStyle,
    postTitle: {
        color: '#2a2a2a',
        fontSize: 13,
        fontWeight: 'bold'
    } as TextStyle,
    postDetail: {
        flexDirection: 'row',
        alignItems: 'center'
    } as ViewStyle,
    postDetailText: {
        fontSize: 11,
        marginRight: 5
    } as TextStyle
});