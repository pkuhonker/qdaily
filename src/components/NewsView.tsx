import * as React from 'react';
import { View, ListView, ListViewDataSource, RefreshControl } from 'react-native';
import { WhiteSpace, ActivityIndicator } from 'antd-mobile';
import Banners from '../components/Banners';
import HeadLineCard from '../components/HeadLineCard';
import { Feed, Banner, HeadLine } from '../interfaces';
import FeedItem from './FeedItem';

export interface NewsViewProp {
    feeds: Feed[];
    banners: Banner[];
    headline?: HeadLine;
    pullRefreshPending?: boolean;
    onEndReached?: () => void;
    onRefresh?: () => void;
}

export interface NewsViewState {
    ds: ListViewDataSource;
}

export default class NewsView extends React.Component<NewsViewProp, NewsViewState> {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            ds: ds.cloneWithRows(props.feeds)
        };
    }

    public componentWillReceiveProps(nextProps: NewsViewProp) {
        if (nextProps.feeds !== this.props.feeds) {
            this.updateData(nextProps.feeds);
        }
    }

    private updateData(data) {
        this.setState({
            ds: this.state.ds.cloneWithRows(data)
        });
    }

    private renderRow(feed: Feed) {
        return (<FeedItem key={feed.post.id} feed={feed} />);
    }

    private renderHeader() {
        const { banners, headline = Object.create(null) } = this.props;
        return (
            <View>
                <Banners banners={banners} />
                <WhiteSpace />
                <HeadLineCard headline={headline} />
                <WhiteSpace />
            </View>
        );
    }

    private renderFooter() {
        return (
            <View style={{ padding: 20 }}>
                <ActivityIndicator text="正在加载" />
            </View>
        );
    }

    private renderSeparator(sectionID: string, rowID: string) {
        return (
            <WhiteSpace key={`${sectionID}-${rowID}`} />
        );
    }

    private onEndReached() {
        if (this.props.onEndReached) {
            this.props.onEndReached();
        }
    }

    private onRefresh() {
        if (this.props.onRefresh) {
            this.props.onRefresh();
        }
    }

    public render() {
        const { pullRefreshPending = false } = this.props;

        return (
            <ListView
                dataSource={this.state.ds}
                renderRow={this.renderRow.bind(this)}
                renderHeader={this.renderHeader.bind(this)}
                renderFooter={this.renderFooter.bind(this)}
                renderSeparator={this.renderSeparator.bind(this)}
                removeClippedSubviews={true}
                enableEmptySections
                pagingEnabled={false}
                pageSize={28}
                initialListSize={28}
                onEndReachedThreshold={30}
                onEndReached={this.onEndReached.bind(this)}
                refreshControl={
                    <RefreshControl
                        refreshing={pullRefreshPending}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }
            >
            </ListView>
        );
    }
}