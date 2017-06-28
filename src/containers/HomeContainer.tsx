import * as React from 'react';
import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { View, WhiteSpace, ActivityIndicator } from 'antd-mobile';
import FeedList from '../components/FeedList';
import Banners from '../components/Banners';
import HeadLineCard from '../components/HeadLineCard';
import CustomTabBar from '../components/base/CustomTabBar';
import { AppState } from '../reducers';
import { HomeState } from '../reducers/home';
import { Feed, FeedType, HeadLine } from '../interfaces';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';
import SplashScreen from 'react-native-smart-splash-screen';
import { TabViewAnimated } from 'react-native-tab-view';

type HomeContainerProps = NavigationScreenProps<{
}>;

interface StateProps extends HomeState {
}

interface HomeContainerState {
    index: number;
    routes: {
        key: string;
        title: string;
    }[];
}

type Props = HomeContainerProps & StateProps & ConnectComponentProps & HomeContainerProps;

class HomeContainer extends React.Component<Props, HomeContainerState> {

    private splashClosed: boolean = false;

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { key: 'news', title: 'NEWS' },
                { key: 'labs', title: 'LABS' }
            ]
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

    private toDetail(feed: Feed) {
        const { navigate } = this.props.navigation;
        if (feed.type === FeedType.PAPER) {
            navigate('paper', { id: feed.post.id });
        } else {
            navigate('article', { id: feed.post.id });
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
        const { banners, headline = Object.create(null) as HeadLine } = this.props.news;
        return (
            <View>
                <Banners banners={banners} onPress={banner => this.toDetail(banner)} />
                <WhiteSpace />
                <HeadLineCard headline={headline} onPress={() => this.toDetail(headline)} />
                <WhiteSpace />
            </View>
        );
    }

    private renderNewsList() {
        const { news, news_pullRefreshPending } = this.props;
        return (
            <FeedList
                feeds={news.feeds}
                pullRefreshPending={news_pullRefreshPending}
                renderHeader={this.renderNewsHeader.bind(this)}
                onRefresh={this.refreshNews.bind(this)}
                onEndReached={() => this.refreshNews(news.last_key)}
                onItemPress={feed => this.toDetail(feed)}
            >
            </FeedList>
        );
    }

    private renderLabsList() {
        const { papers, papers_pullRefreshPending } = this.props;
        return (
            <FeedList
                feeds={papers.feeds}
                pullRefreshPending={papers_pullRefreshPending}
                onRefresh={this.refreshNews.bind(this)}
                onEndReached={() => this.refreshPapers(papers.last_key)}
                onItemPress={feed => this.toDetail(feed)}
            >
            </FeedList>
        );
    }

    private renderScene({ route }) {
        switch (route.key) {
            case 'news':
                return this.renderNewsList();
            case 'labs':
                return this.renderLabsList();
            default:
                return null;
        }
    };

    private renderTabBar(props) {
        return (
            <CustomTabBar
                style={tabBarStyles.container}
                labelStyle={tabBarStyles.label}
                tabStyle={tabBarStyles.tab}
                indicatorStyle={tabBarStyles.indicator}
                {...props} >
            </CustomTabBar>);
    }

    public render(): JSX.Element {
        if (!this.splashClosed) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size='large' text='正在加载' />
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <TabViewAnimated
                    navigationState={this.state}
                    renderScene={this.renderScene.bind(this)}
                    renderHeader={this.renderTabBar.bind(this)}
                    onRequestChangeTab={index => this.setState({ index })}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    } as ViewStyle
});

const tabBarStyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    } as ViewStyle,
    tab: {
        padding: 4
    } as ViewStyle,
    label: {
        color: '#000'
    } as TextStyle,
    indicator: {
        backgroundColor: '#faca00',
        marginHorizontal: Dimensions.get('window').width / 6,
        height: 3
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