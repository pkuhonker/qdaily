import * as React from 'react';
import { StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { View, Tabs, ActivityIndicator } from 'antd-mobile';
import NewsView from '../components/NewsView';
import { AppState } from '../reducers';
import { NewsState } from '../reducers/news';
import { NewsViewState } from '../reducers/newsView';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';
import SplashScreen from 'react-native-smart-splash-screen';

const TabPane = Tabs.TabPane;

interface NewsProps {

}

interface StateProps {
    news: NewsState;
    newsView: NewsViewState;
}

type Props = NewsProps & StateProps & ConnectComponentProps;

class News extends React.Component<Props, any> {

    private splashClosed: boolean = false;

    public componentDidMount() {
        this.refresh();
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (!this.splashClosed && !nextProps.newsView.pullRefreshPending) {
            SplashScreen.close({
                animationType: SplashScreen.animationType.fade,
                duration: 500,
                delay: 4000
            });

            this.splashClosed = true;
        }
    }

    private refresh(key?: string) {
        const { actions, news, newsView } = this.props;
        if (key) {
            if (!newsView.pullRefreshPending && news.feeds.length) {
                actions.getNews(key);
            }
        } else {
            actions.getNews();
        }
    }

    public render(): JSX.Element {
        const { news, newsView } = this.props;
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
                                pullRefreshPending={newsView.pullRefreshPending}
                                onRefresh={() => this.refresh()}
                                onEndReached={() => this.refresh(news.last_key)}>
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
        // height: Dimensions.get('window').height - 100
    } as ViewStyle
});

function mapStateToProps(state: AppState, ownProps?: NewsProps): StateProps {
    return {
        news: state.news,
        newsView: state.newsView
    };
}

export default connectComponent({
    LayoutComponent: News,
    mapStateToProps: mapStateToProps
});