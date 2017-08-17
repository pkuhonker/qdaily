import numbro from 'numbro';
import * as React from 'react';
import {
    View, Image, Text, Animated, Easing, NavState, StyleSheet, ViewStyle, TextStyle, Platform, StatusBarProperties,
    PanResponder, PanResponderInstance, GestureResponderEvent, PanResponderGestureState
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import Icon from '../components/base/Icon';
import WebViewBridge, { WebViewMessge } from '../components/base/WebViewBridge';
import CustomStatusBar from '../components/base/CustomStatusBar';
import { AppState } from '../reducers';
import { Article, ArticleInfo, Post } from '../interfaces';
import { domain } from '../constants/config';
import { defaultItems } from '../share';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

type ArticleContainerProps = NavigationScreenProps<{
    id: number
}>;

interface StateProps {
    detail?: Article;
    info?: ArticleInfo;
}

interface ArticleContainerState {
    bottomBarBottom: Animated.Value;
    loaded: boolean;
}

type Props = StateProps & ConnectComponentProps & ArticleContainerProps;

const scrollScript = require('../../res/other/scroll.js');

const ArticleIds: { [id: string]: boolean } = {};

class ArticleContainer extends React.Component<Props, ArticleContainerState> {

    public static navigationOptions = {
        statusbar: {
            barStyle: 'light-content',
            backgroundColor: 'rgba(0,0,0,0)'
        } as StatusBarProperties
    };

    private statusbarVisible: boolean;
    private panResponder: PanResponderInstance;
    private panDirection = '';

    constructor(props) {
        super(props);
        this.state = {
            bottomBarBottom: new Animated.Value(0),
            loaded: false
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponderCapture: () => true,
            onPanResponderMove: this.onPanResponderMove.bind(this)
        });
    }

    public componentDidMount() {
        const { params } = this.props.navigation.state;
        if (!ArticleIds[params.id] || !this.props.info) {
            this.props.actions.getArticleInfoById(params.id);
        }
        if (!ArticleIds[params.id] || !this.props.detail) {
            this.props.actions.getArticleDetailById(params.id);
        }
        ArticleIds[params.id] = true;
    }

    private onPanResponderMove(e: GestureResponderEvent, gestureState: PanResponderGestureState) {
        if (gestureState.dy > 0) {
            this.updateBar('up');
        } else {
            this.updateBar('down');
        }
    }

    private updateBar(direction: string, position?: number) {
        if (direction === 'down') {
            if (Platform.OS === 'android') {
                this.state.bottomBarBottom.setValue(48);
            } else {
                Animated.timing(this.state.bottomBarBottom, {
                    duration: 100,
                    toValue: 48,
                    easing: Easing.in(Easing.ease)
                }).start();
            }
            this.updateStautsBar(false);
        } else {
            Animated.timing(this.state.bottomBarBottom, {
                duration: 100,
                toValue: 0,
                easing: Easing.in(Easing.ease)
            }).start();
            this.updateStautsBar(true);
        }
        if (Platform.OS === 'ios' || position !== undefined) {
            if (direction === 'top' || position < 200) {
                CustomStatusBar.setBarStyle('light-content');
                CustomStatusBar.setBackgroundColor('rgba(0,0,0,0)', true);
            } else {
                CustomStatusBar.setBarStyle('dark-content');
                CustomStatusBar.setBackgroundColor('#fff', true);
            }
        }
        this.panDirection = direction;
    }

    private updateStautsBar(visible: boolean) {
        if (this.statusbarVisible === visible) {
            return;
        }
        this.statusbarVisible = visible;
        CustomStatusBar.setHidden(!visible, 'fade');
    }

    private onLoadEnd() {
        if (!this.state.loaded) {
            setTimeout(() => {
                this.setState({ loaded: true });
            }, 300);
        }
    }

    private onLoadError(nav: NavState) {
        console.log('webview load error');
    }

    private onBridgeMessage(data: WebViewMessge) {
        const { navigate } = this.props.navigation;
        if (data.name === '_toNative::onScroll') {
            const { direction, position } = data.options;
            this.updateBar(direction, position);
        } else if (data.name === 'qdaily::picsPreview') {
            navigate('picsPreview', {
                defaultActiveIndex: data.options.cur,
                pics: data.options.pics
            });
        } else {
            console.log('onBridgeMessage', data);
        }
    }

    private onLinkPress(url: string) {
        const { navigate } = this.props.navigation;
        const match = url.match(/http:\/\/m.qdaily.com\/mobile\/articles\/(.*).html/);
        const articleId = match && match[1];
        if (articleId) {
            navigate('article', { id: articleId });
        } else {
            navigate('ad', { url });
        }
    }

    private toShare() {
        this.props.navigation.navigate('share', {
            content: this.props.info.share,
            items: [
                defaultItems.wechat,
                defaultItems.wechatfriends,
                defaultItems.qq,
                defaultItems.weibo,
                defaultItems.evernote,
                defaultItems.more
            ]
        });
    }

    private renderLoading() {
        return (
            <View style={styles.loading}>
                <Image style={{ width: 180, height: 120, alignSelf: 'center' }} source={require('../../res/imgs/pen_pageloading.gif')} />
            </View>
        );
    }

    private renderWebView() {
        const { detail } = this.props;
        if (!detail) {
            return null;
        }
        let panProps;
        if (Platform.OS === 'ios') {
            panProps = this.panResponder.panHandlers;
        } else {
            panProps = Object.create(null);
        }
        return (
            <View style={{ flex: 1 }} {...panProps}>
                <WebViewBridge
                    onLoadEnd={this.onLoadEnd.bind(this)}
                    onError={this.onLoadError.bind(this)}
                    onBridgeMessage={this.onBridgeMessage.bind(this)}
                    onLinkPress={this.onLinkPress.bind(this)}
                    injectedJavaScript={scrollScript}
                    decelerationRate='normal'
                    source={{ html: detail.body, baseUrl: domain }}
                />
            </View>
        );
    }

    private renderBadgeIcon(name: string, onPress: () => void, badge?: number) {
        var badgeText = "";
        if (badge > 0) {
            badgeText = numbro(badge).format('0.[0]a').toUpperCase();
        }
        return (
            <View style={styles.badge}>
                <Icon style={styles.badgeIcon} type='EvilIcons' name={name} onPress={onPress.bind(this)} />
                <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
        );
    }

    private renderBottomBar() {
        const { info = {} } = this.props;
        const { post = {} as Post } = info as ArticleInfo;
        return (
            <Animated.View style={[styles.bottomBar, { transform: [{ translateY: this.state.bottomBarBottom }] }]}>
                <Icon style={styles.backIcon} type='EvilIcons' name='chevron-left' onPress={() => this.props.navigation.goBack()} />
                {this.renderBadgeIcon('comment', () => { }, post.comment_count)}
                {this.renderBadgeIcon('heart', () => { }, post.praise_count)}
                {this.renderBadgeIcon('share-apple', () => this.toShare())}
            </Animated.View>
        );
    }

    public render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                {this.renderWebView()}
                {this.renderBottomBar()}
                {this.state.loaded ? null : this.renderLoading()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    } as ViewStyle,
    bottomBar: {
        position: 'absolute',
        borderTopColor: '#eeeeee',
        borderTopWidth: 1,
        bottom: 0,
        left: 0,
        right: 0,
        height: 48,
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    } as ViewStyle,
    backIcon: {
        position: 'absolute',
        left: 20,
        fontSize: 40
    } as TextStyle,
    badge: {
        marginLeft: 25
    } as ViewStyle,
    badgeIcon: {
        fontSize: 30
    } as TextStyle,
    badgeText: {
        position: 'absolute',
        left: 26,
        top: 0,
        fontSize: 10
    } as TextStyle,

});

function mapStateToProps(state: AppState, ownProps?: ArticleContainerProps): StateProps {
    const { params } = ownProps.navigation.state;
    const detail = state.article.detail[params.id];
    const info = state.article.info[params.id];
    return {
        detail: detail,
        info: info
    };
}

export default connectComponent({
    LayoutComponent: ArticleContainer,
    mapStateToProps: mapStateToProps
});