import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { View, Tabs, ActivityIndicator } from 'antd-mobile';
import NewsView from '../components/NewsView';
import { AppState } from '../reducers';
import { HomeState } from '../reducers/home';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';
import SplashScreen from 'react-native-smart-splash-screen';

const TabPane = Tabs.TabPane;

interface HomeContainerProps {

}

interface StateProps extends HomeState {
}

type Props = HomeContainerProps & StateProps & ConnectComponentProps;

class HomeContainer extends React.Component<Props, any> {

    private splashClosed: boolean = false;

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

    public render(): JSX.Element {
        const { news, news_pullRefreshPending } = this.props;
        if (!this.splashClosed) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size='large' text='正在加载' />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Tabs defaultActiveKey='news'>
                    <TabPane tab='NEWS' key='news'>
                        <View style={styles.tabContent}>
                            <NewsView
                                feeds={news.feeds}
                                banners={news.banners}
                                headline={news.headline}
                                pullRefreshPending={news_pullRefreshPending}
                                onRefresh={() => this.refreshNews()}
                                onEndReached={() => this.refreshNews(news.last_key)}>
                            </NewsView>
                        </View>
                    </TabPane>
                    <TabPane tab='LABS' key='labs'>
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