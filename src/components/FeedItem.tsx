import * as React from 'react';
import moment from 'moment';
import numbro from 'numbro';
import {
    StyleSheet, Text, View, Image, Platform,
    ViewStyle, TextStyle, ImageStyle
} from 'react-native';
import Icon from './base/Icon';
import Touchable from './base/Touchable';

import { Feed, FeedType } from '../interfaces';

export interface FeedProp {
    feed: Feed;
    onPress?: () => void;
}

export default class FeedItem extends React.Component<FeedProp, any> {

    private onPress() {
        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    private parseTime(time: number) {
        return moment(time * 1000, undefined, 'zh-cn').fromNow();
    }

    private formatNumber(num: number) {
        return numbro(num).format('0.[0]a').toUpperCase();
    }

    private renderFooter() {
        const { feed } = this.props;

        const comment = feed.post.comment_count ? [
            <Icon key='icon' type='EvilIcons' style={[styles.postDetailIcon]} name='comment' />,
            <Text key='text' style={[styles.postDetailText]}>{this.formatNumber(feed.post.comment_count)}</Text>
        ] : null;

        const praise = feed.post.praise_count ? [
            <Icon key='icon' type='EvilIcons' style={[styles.postDetailIcon]} name='heart' />,
            <Text key='text' style={[styles.postDetailText]}>{this.formatNumber(feed.post.praise_count)}</Text>
        ] : null;

        return (
            <View style={styles.postDetail}>
                <Text style={[styles.postDetailText]}>{feed.post.category.title}</Text>
                {comment}
                {praise}
                <Text style={[styles.postDetailText]}>{this.parseTime(feed.post.publish_time)}</Text>
            </View>
        );
    }

    private renderNormal() {
        const { feed } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text ellipsizeMode='tail' numberOfLines={3} style={styles.postTitle}>{feed.post.title}</Text>
                    {this.renderFooter()}
                </View>
                <Image style={styles.image} source={{ uri: feed.image }}>
                </Image>
            </View>
        );
    }

    private renderPaper() {
        const { feed } = this.props;
        const isNew = moment(Date.now()).isSame(feed.post.publish_time * 1000, 'day');
        const lab_vote = isNew ? require('../../res/imgs/lab_vote_new.png') : require('../../res/imgs/lab_vote_join.png');

        return (
            <View style={{ backgroundColor: '#fff' }}>
                <View style={{ height: 50, marginHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ height: 20, width: 20, borderRadius: 10 }} source={{ uri: feed.post.column.icon }} />
                    <Text style={[styles.postTitle, { marginLeft: 10 }]}>{feed.post.column.name}</Text>
                    <Icon style={{ fontSize: 24, position: 'absolute', right: 0 }} type='EvilIcons' name='share-apple' />
                </View>
                <View>
                    <Image style={{ height: 200 }} source={{ uri: feed.image }}>
                        <Image style={{ position: 'absolute', height: 36, width: 36, bottom: 20, left: 20 }} source={{ uri: feed.post.category.image_lab }}></Image>
                        <Image style={{ position: 'absolute', height: 95 * 0.5, width: 114 * 0.5, top: 17, right: 17 }} source={lab_vote}>
                            {isNew ? null : (<Text style={styles.paperJoinText}>{feed.post.record_count}</Text>)}
                        </Image>
                    </Image>
                    <View style={{ padding: 16 }}>
                        <Text style={styles.postTitle}>{feed.post.title}</Text>
                        <Text style={{ fontSize: 13, paddingTop: 4 }}>{feed.post.description}</Text>
                    </View>
                </View>
            </View>
        );
    }

    private renderLarge() {
        const { feed } = this.props;

        return (
            <View style={{ backgroundColor: '#fff' }}>
                <Image style={{ height: 200 }} source={{ uri: feed.image }} />
                <View style={{ padding: 16 }}>
                    <Text style={styles.postTitle}>{feed.post.title}</Text>
                    <Text style={{ fontSize: 13, paddingVertical: 4 }}>{feed.post.description}</Text>
                    {this.renderFooter()}
                </View>
            </View>
        );
    }

    public render() {
        const { feed } = this.props;

        let content: JSX.Element;

        if (feed.type === FeedType.NORMAL) {
            content = this.renderNormal();
        } else if (feed.type === FeedType.PAPER) {
            content = this.renderPaper();
        } else if (feed.type === FeedType.LARGE) {
            content = this.renderLarge();
        } else {
            content = this.renderNormal();
        }

        return (
            <Touchable onPress={this.onPress.bind(this)} androidSelectableBackground>
                {content}
            </Touchable>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'row'
    } as ViewStyle,
    content: {
        flex: 8,
        padding: 12,
        justifyContent: 'space-between'
    } as ViewStyle,
    image: {
        flex: 7,
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
    } as TextStyle,
    paperJoinText: {
        backgroundColor: 'rgba(0,0,0,0)',
        fontFamily: Platform.OS === 'android' ? 'dincondensed_bold' : 'DINCondensedC',
        fontSize: 20,
        color: '#ffc81f',
        top: Platform.OS === 'android' ? 2 : 5,
        textAlign: 'center'
    } as TextStyle
});