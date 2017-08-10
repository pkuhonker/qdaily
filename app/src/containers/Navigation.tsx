import * as React from 'react';
import {
    View, ActivityIndicator, StatusBarProperties, Platform,
    BackHandler, ToastAndroid, Easing, Animated, AppState as RNAppState
} from 'react-native';
import { connect, DispatchProp } from 'react-redux';
import { addNavigationHelpers, StackNavigator, NavigationActions, NavigationState, NavigationRoute } from 'react-navigation';
import * as transitions from '../utils/transitions';
import * as codePushUtils from '../utils/codePushSync';
import { AppState } from '../reducers';
import CustomStatusBar from '../components/base/CustomStatusBar';
import HomeContainer from './HomeContainer';
import ArticleContainer from './ArticleContainer';
import PaperContainer from './PaperContainer';
import CategoryContainer from './CategoryContainer';
import ADContainer from './ADContainer';
import PicsPreview from '../components/PicsPreview';
import ShareView from '../components/ShareView';
import DashContainer from './DashContainer';

export const Navigator = StackNavigator({
    home: {
        screen: HomeContainer
    },
    dash: {
        screen: DashContainer
    },
    article: {
        screen: ArticleContainer
    },
    paper: {
        screen: PaperContainer
    },
    category: {
        screen: CategoryContainer
    },
    ad: {
        screen: ADContainer
    },
    picsPreview: {
        screen: PicsPreview
    },
    share: {
        screen: ShareView
    }
}, {
        initialRouteName: 'home',
        cardStyle: {
            backgroundColor: 'rgba(0,0,0,0)'
        },
        headerMode: 'none',
        transitionConfig: () => ({
            transitionSpec: {
                easing: Easing.out(Easing.ease),
                timing: Animated.timing,
                duration: 300
            },
            screenInterpolator: sceneProps => {
                const { scene } = sceneProps;
                switch (scene.route.routeName) {
                    case 'dash':
                        return transitions.crossFade(sceneProps, 0, 1);
                    case 'picsPreview':
                        return transitions.crossFade(sceneProps);
                    case 'share':
                        return transitions.crossFade(sceneProps);
                    default:
                        return transitions.horizontalCover(sceneProps);
                }
            }
        })
    });

interface StateProps {
    restored?: boolean;
    nav?: NavigationState;
}

class Navigation extends React.Component<DispatchProp<any> & StateProps, any> {

    private lastBackPressed: number = 0;

    constructor(props) {
        super(props);
    }

    private onBackAndroid = () => {
        const { dispatch, nav } = this.props;
        if (nav.routes.length > 1) {
            dispatch(NavigationActions.back() as any);
            return true;
        } else {
            if (Date.now() - this.lastBackPressed < 2000) {
                return false;
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.showWithGravity('再按一次退出程序', ToastAndroid.SHORT, ToastAndroid.CENTER);
            return true;
        }
    }

    private onNavigationStateChange(prevNavigationState: NavigationState, nextNavigationState: NavigationState) {
        const prevRoute: NavigationRoute<any> = prevNavigationState.routes[prevNavigationState.index];
        const nextRoute: NavigationRoute<any> = nextNavigationState.routes[nextNavigationState.index];
        if (prevRoute.key !== nextRoute.key) {
            this.updateStatusBar(nextRoute);
        }
    }

    private updateStatusBar(route: NavigationRoute<any>) {
        const routeComponent = Navigator.router.getComponentForRouteName(route.routeName);
        let options: StatusBarProperties = routeComponent.navigationOptions && routeComponent.navigationOptions.statusbar;
        options = Object.assign({}, CustomStatusBar.defaultStatusBarOptions, options);
        if (Platform.OS === 'android') {
            CustomStatusBar.setHidden(options.hidden, options.animated ? 'fade' : 'none');
            CustomStatusBar.setBackgroundColor(options.backgroundColor);
            CustomStatusBar.setTranslucent(options.translucent);
            CustomStatusBar.setBarStyle(options.barStyle);
        } else {
            CustomStatusBar.setHidden(options.hidden, options.showHideTransition || 'fade');
            CustomStatusBar.setBackgroundColor(options.backgroundColor);
            CustomStatusBar.setBarStyle(options.barStyle, options.animated);
            CustomStatusBar.setNetworkActivityIndicatorVisible(options.networkActivityIndicatorVisible);
        }
    }

    public componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        
        setTimeout(() => {
            const { nav } = this.props;
            codePushUtils.sync();
            this.updateStatusBar(nav.routes[nav.index]);
        }, 100);

        RNAppState.addEventListener('change', (newState) => {
            if (newState === 'active') {
                codePushUtils.sync();
            }
        });
    }

    public componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    public componentWillReceiveProps(nextProps: StateProps) {
        if (this.props.nav !== nextProps.nav) {
            this.onNavigationStateChange(this.props.nav, nextProps.nav);
        }
    }

    public render() {
        const { dispatch, nav, restored } = this.props;
        if (!restored) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator />
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <Navigator navigation={addNavigationHelpers({ state: nav, dispatch })} />
                </View>
            );
        }
    }
}

function mapStateToProps(state: AppState, ownProps?: any): StateProps {
    return {
        restored: state.system.restored,
        nav: state.nav
    };
}

export default connect(mapStateToProps)(Navigation as any);