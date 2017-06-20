import * as React from 'react';
import moment from 'moment';
import { StyleSheet, Text, View, Image, ViewStyle, TextStyle, ImageStyle, TouchableNativeFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Feed } from '../interfaces';

export interface FeedProp {
    feed: Feed;
}

export default class FeedItem extends React.Component<FeedProp, any> {

    private parseTime(time: number) {
        return moment(time * 1000, undefined, 'zh-cn').fromNow();
    }

    public render() {
        const { feed } = this.props;

        const comment = feed.post.comment_count ? [
            <Icon key='icon' style={[styles.postDetailText]} name='comment-o' />,
            <Text key='text' style={[styles.postDetailText]}>{feed.post.comment_count}</Text>
        ] : null;

        const praise = feed.post.praise_count ? [
            <Icon key='icon' style={[styles.postDetailText, { fontSize: 10 }]} name='heart-o' />,
            <Text key='text' style={[styles.postDetailText]}>{feed.post.praise_count}</Text>
        ] : null;

        return (
            <TouchableNativeFeedback>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.postTitle}>{feed.post.title}</Text>
                        <View style={styles.postDetail}>
                            <Text style={[styles.postDetailText]}>{feed.post.category.title}</Text>
                            {comment}
                            {praise}
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