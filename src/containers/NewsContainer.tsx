import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { View, Tabs, WhiteSpace, ActivityIndicator } from 'antd-mobile';
import FeedList from '../components/FeedList';
import Banners from '../components/Banners';
import HeadLineCard from '../components/HeadLineCard';
import { AppState } from '../reducers';
import { HomeState } from '../reducers/home';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';
import SplashScreen from 'react-native-smart-splash-screen';

const TabPane = Tabs.TabPane;

interface HomeContainerProps {

}

interface StateProps extends HomeState {
}

interface HomeContainerState {
    tab: string;
}

type Props = HomeContainerProps & StateProps & ConnectComponentProps;

class HomeContainer extends React.Component<Props, HomeContainerState> {

    private splashClosed: boolean = false;

    constructor(props) {
        super(props);
        this.state = {
            tab: 'news'
        };
    }

    public componentDidMount() {
        this.refreshNews();
        this.refreshPapers();
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (!this.splashClosed && !nextProps.news_pullRefreshPending) {
            SplashScreen.close({
                animationType: SplashScreen.animationType.fade,
                duration: 500,
                delay: 4000
            });

            this.splashClosed = true;
        }
    }

    private refreshNews(key?: string) {
        const { actions, news, news_pullRefreshPending } = this.props;
        if (key) {
            if (!news_pullRefreshPending && news.feeds.length) {
                actions.getNews(key);
            }
        } else {
            actions.getNews();
        }
    }

    private refreshPapers(key?: string) {
        const { actions, papers, papers_pullRefreshPending } = this.props;
        if (key) {
            if (!papers_pullRefreshPending && papers.feeds.length) {
                actions.getPapers(key);
            }
        } else {
            actions.getPapers();
        }
    }

    private renderNewsHeader() {
        const { banners, headline = Object.create(null) } = this.props.news;
        return (
            <View>
                <Banners banners={banners} />
                <WhiteSpace />
                <HeadLineCard headline={headline} />
                <WhiteSpace />
            </View>
        );
    }

    public render(): JSX.Element {
        const { news, papers, news_pullRefreshPending, papers_pullRefreshPending } = this.props;
        if (!this.splashClosed) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size='large' text='正在加载' />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Tabs
                    defaultActiveKey='news'
                    activeKey={this.state.tab}
                    onChange={tab => { this.setState({ tab }); }}
                >
                    <TabPane tab='NEWS' key='news'>
                        <View style={styles.tabContent}>
                            <FeedList
                                feeds={news.feeds}
                                pullRefreshPending={news_pullRefreshPending}
                                renderHeader={this.renderNewsHeader.bind(this)}
                                onRefresh={() => this.refreshNews()}
                                onEndReached={() => this.refreshNews(news.last_key)}>
                            </FeedList>
                        </View>
                    </TabPane>
                    <TabPane tab='LABS' key='labs'>
                        <View style={styles.tabContent}>
                            <FeedList
                                feeds={papers.feeds}
                                pullRefreshPending={papers_pullRefreshPending}
                                onRefresh={() => this.refreshPapers()}
                                onEndReached={() => this.refreshPapers(papers.last_key)}>
                            </FeedList>
                        </View>
                    </TabPane>
                </Tabs>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    } as ViewStyle,
    tabContent: {
    } as ViewStyle
});

function mapStateToProps(state: AppState, ownProps?: HomeContainerProps): StateProps {
    return {
        ...state.home
    };
}

export default connectComponent({
    LayoutComponent: HomeContainer,
    mapStateToProps: mapStateToProps
});