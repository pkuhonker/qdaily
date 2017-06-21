import * as React from 'react';
import moment from 'moment';
import {
    StyleSheet, Text, View, Image, TouchableNativeFeedback,
    ViewStyle, TextStyle, ImageStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

import { Feed, FeedType } from '../interfaces';

export interface FeedProp {
    feed: Feed;
}

export default class FeedItem extends React.Component<FeedProp, any> {

    private parseTime(time: number) {
        return moment(time * 1000, undefined, 'zh-cn').fromNow();
    }

    private renderNormal() {
        const { feed } = this.props;

        const comment = feed.post.comment_count ? [
            <Icon key='icon' style={[styles.postDetailIcon]} name='comment' />,
            <Text key='text' style={[styles.postDetailText]}>{feed.post.comment_count}</Text>
        ] : null;

        const praise = feed.post.praise_count ? [
            <Icon key='icon' style={[styles.postDetailIcon]} name='heart' />,
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

    private renderColumn() {
        const { feed } = this.props;

        return (
            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={{ backgroundColor: '#fff' }}>
                    <View style={{ height: 50, marginHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ height: 20, width: 20, borderRadius: 10 }} source={{ uri: feed.post.column.icon }} />
                        <Text style={[styles.postTitle, { marginLeft: 10 }]}>{feed.post.column.name}</Text>
                        <Icon style={{ fontSize: 24, position: 'absolute', right: 0 }} name='share-apple' />
                    </View>
                    <View>
                        <Image style={{ height: 200 }} source={{ uri: feed.image }}>
                            <Image style={{ position: 'absolute', height: 36, width: 36, bottom: 20, left: 20 }} source={{ uri: feed.post.category.image_lab }}></Image>
                        </Image>
                        <View style={{ padding: 15 }}>
                            <Text style={styles.postTitle}>{feed.post.title}</Text>
                            <Text style={{ fontSize: 13 }}>{feed.post.description}</Text>
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }

    public render() {
        const { feed } = this.props;

        if (feed.type === FeedType.NORMAL) {
            return this.renderNormal();
        } else if (feed.type === FeedType.COLUMN) {
            return this.renderColumn();
        } else {
            return this.renderNormal();
        }
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
        fontSize: 15,
        fontWeight: 'bold'
    } as TextStyle,
    postDetail: {
        flexDirection: 'row',
        alignItems: 'center'
    } as ViewStyle,
    postDetailText: {
        fontSize: 12,
        marginRight: 5
    } as TextStyle,
    postDetailIcon: {
        fontSize: 14,
        marginRight: 5
    } as TextStyle
});