import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View, Tabs, ActivityIndicator } from 'antd-mobile';
import NewsView from '../components/NewsView';
import { AppState } from '../reducers';
import { HomeState } from '../reducers/home';
import { HomeViewState } from '../reducers/homeView';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';
import SplashScreen from 'react-native-smart-splash-screen';

const TabPane = Tabs.TabPane;

interface HomeProps {

}

interface StateProps {
    home: HomeState;
    homeView: HomeViewState;
}

type Props = HomeProps & StateProps & ConnectComponentProps;

class Home extends React.Component<Props, any> {

    private splashClosed: boolean = false;

    public componentDidMount() {
        this.refreshHome();
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (!this.splashClosed && !nextProps.homeView.pullRefreshPending) {
            SplashScreen.close({
                animationType: SplashScreen.animationType.fade,
                duration: 500,
                delay: 4000
            });

            this.splashClosed = true;
        }
    }

    private refreshHome(key?: string) {
        const { actions, home, homeView } = this.props;
        if (key) {
            if (!homeView.pullRefreshPending && home.feeds.length) {
                actions.getHome(key);
            }
        } else {
            actions.getHome();
        }
    }

    public render(): JSX.Element {
        const { home, homeView } = this.props;
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
                        <NewsView
                            feeds={home.feeds}
                            banners={home.banners}
                            headline={home.headline}
                            pullRefreshPending={homeView.pullRefreshPending}
                            onRefresh={() => this.refreshHome()}
                            onEndReached={() => this.refreshHome(home.last_key)}>
                        </NewsView>
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
    }
});

function mapStateToProps(state: AppState, ownProps?: HomeProps): StateProps {
    return {
        home: state.home,
        homeView: state.homeView
    };
}

export default connectComponent({
    LayoutComponent: Home,
    mapStateToProps: mapStateToProps
});