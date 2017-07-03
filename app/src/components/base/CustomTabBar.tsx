// copy from https://github.com/react-native-community/react-native-tab-view/blob/master/src/TabBar.js

import * as React from 'react';
import {
    Animated,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableNativeFeedback,
    I18nManager,
    ViewStyle
} from 'react-native';
import {
    Scene,
    SceneRendererProps,
    Route,
    Style,
} from 'react-native-tab-view/src/TabViewTypeDefinitions';

type IndicatorProps<T> = SceneRendererProps<T> & {
    width: Animated.Value,
};

type ScrollEvent = {
    nativeEvent: {
        contentOffset: {
            x: number,
        },
    },
};

type DefaultProps<T> = {
    getLabelText: (scene: Scene<T>) => string,
};

type Props<T> = SceneRendererProps<T> & {
    scrollEnabled?: boolean,
    pressColor?: string,
    pressOpacity?: number,
    getLabelText?: (scene: Scene<T>) => string,
    renderLabel?: (scene: Scene<T>) => JSX.Element,
    renderIcon?: (scene: Scene<T>) => JSX.Element,
    renderBadge?: (scene: Scene<T>) => JSX.Element,
    renderIndicator?: (props: IndicatorProps<T>) => JSX.Element,
    onTabPress?: (scene: Scene<T>) => void,
    tabStyle?: Style,
    indicatorStyle?: Style,
    labelStyle?: Style,
    style?: Style,
};

type State = {
    offset: Animated.Value,
    visibility: Animated.Value,
    initialOffset: { x: number, y: number },
};

export default class TabBar<T extends Route<any>> extends React.PureComponent<Props<T>, State> {

    static defaultProps = {
        getLabelText: ({ route }) =>
            route.title ? route.title.toUpperCase() : null,
    };

    constructor(props: Props<T>) {
        super(props);

        let initialVisibility = 0;

        if (this.props.scrollEnabled === true) {
            const tabWidth = this._getTabWidthFromStyle(this.props.tabStyle);
            if (this.props.layout.width || tabWidth) {
                initialVisibility = 1;
            }
        } else {
            initialVisibility = 1;
        }

        this.state = {
            offset: new Animated.Value(0),
            visibility: new Animated.Value(initialVisibility),
            initialOffset: {
                x: this._getScrollAmount(this.props, this.props.navigationState.index),
                y: 0,
            },
        };
    }

    public componentDidMount() {
        this._adjustScroll(this.props.navigationState.index);
        this._positionListener = this.props.subscribe(
            'position',
            this._adjustScroll,
        );
    }

    public componentWillReceiveProps(nextProps: Props<T>) {
        if (this.props.navigationState !== nextProps.navigationState) {
            this._resetScrollOffset(nextProps);
        }

        const nextTabWidth = this._getTabWidthFromStyle(nextProps.tabStyle);

        if (
            (this.props.tabStyle !== nextProps.tabStyle && nextTabWidth) ||
            (this.props.layout.width !== nextProps.layout.width &&
                nextProps.layout.width)
        ) {
            this.state.visibility.setValue(1);
        }
    }

    public componentDidUpdate(prevProps: Props<T>) {
        if (
            this.props.scrollEnabled &&
            (prevProps.layout !== this.props.layout ||
                prevProps.tabStyle !== this.props.tabStyle)
        ) {
            global.requestAnimationFrame(() =>
                this._adjustScroll(this.props.navigationState.index),
            );
        }
    }

    public componentWillUnmount() {
        this._positionListener.remove();
    }

    private _positionListener: any;
    private _scrollView: any;
    private _isManualScroll: boolean = false;
    private _isMomentumScroll: boolean = false;

    private _renderLabel(scene: Scene<any>) {
        if (typeof this.props.renderLabel !== 'undefined') {
            return this.props.renderLabel(scene);
        }
        const label = this.props.getLabelText(scene);
        if (typeof label !== 'string') {
            return null;
        }
        return (
            <Text style={[styles.tabLabel, this.props.labelStyle]}>{label}</Text>
        );
    }

    private _renderIndicator(props: IndicatorProps<T>) {
        if (typeof this.props.renderIndicator !== 'undefined') {
            return this.props.renderIndicator(props);
        }
        const { width, position } = props;
        const translateX = Animated.multiply(
            Animated.multiply(position, width),
            I18nManager.isRTL ? -1 : 1,
        );
        return (
            <Animated.View
                style={[
                    styles.indicatorContainer,
                    { width, transform: [{ translateX }] },
                ]}
            >
                <View style={[styles.indicator, this.props.indicatorStyle]}></View>
            </Animated.View>
        );
    };

    private _tabWidthCache: { style: any, width?: string | number };

    private _getTabWidthFromStyle = (style: any) => {
        if (this._tabWidthCache && this._tabWidthCache.style === style) {
            return this._tabWidthCache.width;
        }
        const passedTabStyle = StyleSheet.flatten(this.props.tabStyle);
        const cache = {
            style,
            width: passedTabStyle ? passedTabStyle.width : null,
        };
        this._tabWidthCache = cache;
        return cache;
    }

    private _getFinalTabWidth = (props: Props<T>) => {
        const { layout, navigationState } = props;
        const tabWidth = this._getTabWidthFromStyle(props.tabStyle);
        if (typeof tabWidth === 'number') {
            return tabWidth;
        }
        if (typeof tabWidth === 'string' && tabWidth.endsWith('%')) {
            return layout.width * (parseFloat(tabWidth) / 100);
        }
        if (props.scrollEnabled) {
            return layout.width / 5 * 2;
        }
        return layout.width / navigationState.routes.length;
    }

    private _getMaxScrollableDistance = (props: Props<T>) => {
        const { layout, navigationState } = props;
        if (layout.width === 0) {
            return 0;
        }
        const finalTabWidth = this._getFinalTabWidth(props);
        const tabBarWidth = finalTabWidth * navigationState.routes.length;
        const maxDistance = tabBarWidth - layout.width;
        return Math.max(maxDistance, 0);
    }

    private _normalizeScrollValue = (props: Props<T>, value: number) => {
        const maxDistance = this._getMaxScrollableDistance(props);
        return Math.max(Math.min(value, maxDistance), 0);
    }

    private _getScrollAmount = (props: Props<T>, i: number) => {
        const { layout } = props;
        const finalTabWidth = this._getFinalTabWidth(props);
        const centerDistance = finalTabWidth * i + finalTabWidth / 2;
        const scrollAmount = centerDistance - layout.width / 2;
        return this._normalizeScrollValue(props, scrollAmount);
    }

    private _resetScrollOffset = (props: Props<T>) => {
        if (!props.scrollEnabled || !this._scrollView) {
            return;
        }

        const scrollAmount = this._getScrollAmount(
            props,
            props.navigationState.index,
        );
        this._scrollView.scrollTo({
            x: scrollAmount,
            animated: true,
        });
        Animated.timing(this.state.offset, {
            toValue: 0,
            duration: 150,
        }).start();
    }

    private _adjustScroll = (index: number) => {
        if (!this.props.scrollEnabled || !this._scrollView) {
            return;
        }

        const scrollAmount = this._getScrollAmount(this.props, index);
        this._scrollView.scrollTo({
            x: scrollAmount,
            animated: false,
        });
    }

    private _adjustOffset = (value: number) => {
        if (!this._isManualScroll || !this.props.scrollEnabled) {
            return;
        }

        const scrollAmount = this._getScrollAmount(
            this.props,
            this.props.navigationState.index,
        );
        const scrollOffset = value - scrollAmount;

        if (this._isMomentumScroll) {
            Animated.spring(this.state.offset, {
                toValue: -scrollOffset,
                tension: 300,
                friction: 35,
            }).start();
        } else {
            this.state.offset.setValue(-scrollOffset);
        }
    }

    private _handleScroll = (e: ScrollEvent) => {
        this._adjustOffset(e.nativeEvent.contentOffset.x);
    }

    private _handleBeginDrag = () => {
        // onScrollBeginDrag fires when user touches the ScrollView
        this._isManualScroll = true;
        this._isMomentumScroll = false;
    }

    private _handleEndDrag = () => {
        // onScrollEndDrag fires when user lifts his finger
        // onMomentumScrollBegin fires after touch end
        // run the logic in next frame so we get onMomentumScrollBegin first
        global.requestAnimationFrame(() => {
            if (this._isMomentumScroll) {
                return;
            }
            this._isManualScroll = false;
        });
    }

    private _handleMomentumScrollBegin = () => {
        // onMomentumScrollBegin fires on flick, as well as programmatic scroll
        this._isMomentumScroll = true;
    }

    private _handleMomentumScrollEnd = () => {
        // onMomentumScrollEnd fires when the scroll finishes
        this._isMomentumScroll = false;
        this._isManualScroll = false;
    }

    private _setRef = (el: any) => (this._scrollView = el);

    public render() {
        const { position, navigationState, scrollEnabled } = this.props;
        const { routes, index } = navigationState;
        const maxDistance = this._getMaxScrollableDistance(this.props);
        const finalTabWidth = this._getFinalTabWidth(this.props);
        const tabBarWidth = finalTabWidth * routes.length;

        // Prepend '-1', so there are always at least 2 items in inputRange
        const inputRange = [-1, ...routes.map((x, i) => i)];
        const translateOutputRange = inputRange.map(
            i => this._getScrollAmount(this.props, i) * -1,
        );

        const translateX = Animated.add(
            position.interpolate({
                inputRange,
                outputRange: translateOutputRange,
            }),
            this.state.offset,
        ).interpolate({
            inputRange: [-maxDistance, 0],
            outputRange: [-maxDistance, 0],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.tabBar, this.props.style]}>
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.indicatorContainer,
                        scrollEnabled
                            ? { width: tabBarWidth, transform: [{ translateX }] }
                            : null,
                    ]}
                >
                    {this._renderIndicator({
                        ...this.props,
                        width: new Animated.Value(finalTabWidth),
                    })}
                </Animated.View>
                <View style={styles.scroll}>
                    <ScrollView
                        horizontal
                        scrollEnabled={scrollEnabled}
                        bounces={false}
                        alwaysBounceHorizontal={false}
                        scrollsToTop={false}
                        showsHorizontalScrollIndicator={false}
                        automaticallyAdjustContentInsets={false}
                        overScrollMode="never"
                        contentContainerStyle={[
                            styles.tabContent,
                            scrollEnabled ? null : styles.container,
                        ]}
                        scrollEventThrottle={16}
                        onScroll={this._handleScroll}
                        onScrollBeginDrag={this._handleBeginDrag}
                        onScrollEndDrag={this._handleEndDrag}
                        onMomentumScrollBegin={this._handleMomentumScrollBegin}
                        onMomentumScrollEnd={this._handleMomentumScrollEnd}
                        contentOffset={this.state.initialOffset}
                        ref={this._setRef}
                    >
                        {routes.map((route, i) => {
                            const focused = index === i;
                            const outputRange = inputRange.map(
                                inputIndex => (inputIndex === i ? 1 : 0.5),
                            );
                            const opacity = Animated.multiply(
                                this.state.visibility,
                                position.interpolate({
                                    inputRange,
                                    outputRange,
                                }),
                            );
                            const scene = {
                                route,
                                focused,
                                index: i,
                            };
                            const label = this._renderLabel(scene);
                            const icon = this.props.renderIcon
                                ? this.props.renderIcon(scene)
                                : null;
                            const badge = this.props.renderBadge
                                ? this.props.renderBadge(scene)
                                : null;

                            const tabStyle: any = {};

                            tabStyle.opacity = opacity;

                            if (icon) {
                                if (label) {
                                    tabStyle.paddingTop = 8;
                                } else {
                                    tabStyle.padding = 12;
                                }
                            }

                            const passedTabStyle = StyleSheet.flatten(this.props.tabStyle);
                            const isWidthSet =
                                (passedTabStyle &&
                                    typeof passedTabStyle.width !== 'undefined') ||
                                scrollEnabled === true;
                            const tabContainerStyle: any = {};

                            if (isWidthSet) {
                                tabStyle.width = finalTabWidth;
                            }

                            if (passedTabStyle && typeof passedTabStyle.flex === 'number') {
                                tabContainerStyle.flex = passedTabStyle.flex;
                            } else if (!isWidthSet) {
                                tabContainerStyle.flex = 1;
                            }

                            const accessibilityLabel =
                                route.accessibilityLabel || route.title;

                            return (
                                <TouchableNativeFeedback
                                    key={route.key}
                                    accessible={route.accessible}
                                    accessibilityLabel={accessibilityLabel}
                                    accessibilityTraits="button"
                                    delayPressIn={0}
                                    background={TouchableNativeFeedback.SelectableBackground()}
                                    onPress={() => {
                                        const { onTabPress, jumpToIndex } = this.props;
                                        jumpToIndex(i);
                                        if (onTabPress) {
                                            onTabPress(scene);
                                        }
                                    }}
                                    style={tabContainerStyle}
                                >
                                    <View style={styles.container}>
                                        <Animated.View
                                            style={[
                                                styles.tabItem,
                                                tabStyle,
                                                passedTabStyle,
                                                styles.container,
                                            ]}
                                        >
                                            {icon}
                                            {label}
                                        </Animated.View>
                                        {badge
                                            ? <Animated.View
                                                style={[
                                                    styles.badge,
                                                    { opacity: this.state.visibility },
                                                ]}
                                            >
                                                {badge}
                                            </Animated.View>
                                            : null}
                                    </View>
                                </TouchableNativeFeedback>
                            );
                        })}
                    </ScrollView>
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    } as ViewStyle,
    scroll: {
        overflow: 'scroll',
    } as any,
    tabBar: {
        backgroundColor: '#2196f3',
        elevation: 4,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
    } as ViewStyle,
    tabContent: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    } as ViewStyle,
    tabLabel: {
        backgroundColor: 'transparent',
        color: 'white',
        margin: 8,
    },
    tabItem: {
        flexGrow: 1,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    } as ViewStyle,
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
    } as ViewStyle,
    indicatorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    } as ViewStyle,
    indicator: {
        backgroundColor: '#ffeb3b',
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        height: 2
    } as ViewStyle,
});
