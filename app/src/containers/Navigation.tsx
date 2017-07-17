import * as React from 'react';
import { Platform, BackHandler, ToastAndroid, Easing, Animated, AppState as RNAppState } from 'react-native';
import { connect, DispatchProp } from 'react-redux';
import { addNavigationHelpers, StackNavigator, NavigationActions, NavigationState } from 'react-navigation';
import * as transitions from '../utils/transitions';
import * as codePushUtils from '../utils/codePushSync';
import { AppState } from '../reducers';
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
                        return transitions.crossFade(sceneProps);
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

    public componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        codePushUtils.sync();
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

    public render() {
        const { dispatch, nav } = this.props;
        return (
            <Navigator navigation={addNavigationHelpers({ state: nav, dispatch })} />
        );
    }
}

function mapStateToProps(state: AppState, ownProps?: any): StateProps {
    return {
        nav: state.nav
    };
}

export default connect(mapStateToProps)(Navigation as any);