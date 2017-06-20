import * as React from 'react';
import { View, Text, ListView, ListViewDataSource } from 'react-native';
import { Feed } from '../interfaces';
import FeedItem from './FeedItem';

export interface FeedsListViewProp {
    feeds: Feed[];
}

export interface FeedsListViewState {
    ds: ListViewDataSource;
}

export default class FeedsListView extends React.Component<FeedsListViewProp, FeedsListViewState> {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            ds: ds.cloneWithRows(props.feeds)
        };
    }

    private renderRow(feed: Feed) {
        return (<FeedItem key={feed.post.id} feed={feed} />);
    }

    private renderFooter() {
        return (
            <Text style={[{ padding: 10, textAlign: 'center' }]}>
                正在加载...
            </Text>
        );
    }

    private renderSeparator(sectionID: string, rowID: string) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: 8
                }}
            />
        );
    }

    private onEndReached() {
        //TODO do action that get data...
    }

    public render() {

        return (
            <ListView
                dataSource={this.state.ds}
                renderRow={this.renderRow.bind(this)}
                renderFooter={this.renderFooter.bind(this)}
                renderSeparator={this.renderSeparator.bind(this)}
                removeClippedSubviews
                enableEmptySections
                pagingEnabled={false}
                scrollRenderAheadDistance={90}
                onEndReachedThreshold={30}
                onEndReached={this.onEndReached.bind(this)}
            >
            </ListView>
        );
    }

}