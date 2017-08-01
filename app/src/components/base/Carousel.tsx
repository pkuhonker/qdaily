import * as  React from 'react';
import {
    View, Animated, ScrollView, StyleSheet,
    PanResponder, PanResponderInstance, PanResponderGestureState
} from 'react-native';

interface IndicatorConfig {
    pageNum: number;
    childrenNum: number;
    loop: boolean;
    scrollValue: Animated.Value;
}

interface CarouselProps {
    pageWidth: number;
    pageHeight?: number;
    loop?: boolean;
    index?: number;
    autoplay?: boolean;
    autoplayTimeout?: number;
    androidSlipFactor?: number;
    showsPageIndicator?: boolean;
    renderPageIndicator?: (config: IndicatorConfig) => JSX.Element;
    onPageChanged?: (index: number) => void;
}


interface CarouselState {
    scrollValue: Animated.Value;
}

export default class Carousel extends React.Component<CarouselProps, CarouselState> {

    public static defaultProps: CarouselProps = {
        pageWidth: 0,
        loop: true,
        index: 0,
        autoplay: false,
        autoplayTimeout: 5000,
        androidSlipFactor: 1,
        showsPageIndicator: true
    };

    private autoPlayTimer: number = 0;
    private pageAnimation: Animated.CompositeAnimation;
    private panResponder: PanResponderInstance;
    private currentIndex: number = 0;
    private panStartIndex: number = 0;
    private panOffsetFactor: number = 0;

    constructor(props) {
        super(props);
        this.state = {
            scrollValue: new Animated.Value(0)
        };
    }

    public componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => {
                this.startPanResponder();
                return true;
            },
            onMoveShouldSetPanResponder: (e, g) => {
                if (Math.abs(g.dx) > Math.abs(g.dy)) {
                    this.startPanResponder();
                    return true;
                } else {
                    return false;
                }
            },
            onPanResponderGrant: () => {
                this.startPanResponder();
            },
            onPanResponderStart: (e, g) => {
                this.startPanResponder();
            },
            onPanResponderMove: (e, g) => {
                this.panOffsetFactor = this.computePanOffset(g);
                this.gotoPage(this.panStartIndex + this.panOffsetFactor, false);
            },
            onPanResponderEnd: (e, g) => {
                this.endPanResponder(g);
            }
        });
    }

    public componentDidMount() {
        if (this.props.autoplay) {
            this.startAutoPlay();
        }
        this.gotoPage(this.props.index + (this.props.loop ? 1 : 0), false);
    }

    public componentWillReceiveProps(nextProps: CarouselProps) {
        if (nextProps.autoplay) {
            this.startAutoPlay();
        } else {
            this.stopAutoPlay();
        }
    }

    private startAutoPlay() {
        this.stopAutoPlay();
        if (!this.autoPlayTimer) {
            this.autoPlayTimer = setInterval(() => {
                this.gotoNextPage();
            }, this.props.autoplayTimeout);
        }
    }
    private stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = 0;
        }
    }

    private computePanOffset(g: PanResponderGestureState) {
        let offset = -g.dx / (this.props.pageWidth / this.props.androidSlipFactor);
        if (Math.abs(offset) > 1) {
            offset = offset > 1 ? 1 : -1;
        }
        return offset;
    }

    private startPanResponder() {
        this.stopAutoPlay();
        this.panStartIndex = this.currentIndex;
        this.panOffsetFactor = 0;
        if (this.pageAnimation) {
            const index = this.currentIndex;
            this.pageAnimation.stop();
            this.gotoPage(index);
        }
    }

    private endPanResponder(g: PanResponderGestureState) {
        if (this.props.autoplay) {
            this.startAutoPlay();
        }
        let newIndex = this.currentIndex;
        this.panOffsetFactor = this.computePanOffset(g);
        if (this.panOffsetFactor > 0.5 || (this.panOffsetFactor > 0 && g.vx <= -1e-1)) {
            newIndex = Math.floor(this.currentIndex + 1);
        } else if (this.panOffsetFactor < -0.5 || (this.panOffsetFactor < 0 && g.vx >= 1e-1)) {
            newIndex = Math.ceil(this.currentIndex - 1);
        } else {
            newIndex = Math.round(this.currentIndex);
        }

        if (this.currentIndex === newIndex) {
            return;
        }
        this.gotoPage(newIndex);
    }

    private gotoNextPage(animated: boolean = true) {
        const childrenNum = this.getChildrenNum();
        if (!this.props.loop) {
            if (this.currentIndex === childrenNum - 1) {
                return;
            }
        }
        this.gotoPage(Math.floor(this.currentIndex) + 1);
    }

    private gotoPage(index: number, animated: boolean = true, cb = () => { }) {
        const childrenNum = this.getChildrenNum();
        if (childrenNum <= 1) {
            return cb();
        }
        if (index < 0) {
            index = 0;
        }
        if (index > childrenNum - 1) {
            index = childrenNum - 1;
        }

        const setIndex = (index: number) => {
            this.currentIndex = index;
            if (this.props.onPageChanged) {
                this.props.onPageChanged(this.getCurrentPage());
            }
        };

        if (animated) {
            this.pageAnimation = Animated.spring(this.state.scrollValue, {
                toValue: index,
                friction: 10,
                tension: 50
            });
            const animationId = this.state.scrollValue.addListener((state: { value: number }) => {
                setIndex(state.value);
            });
            this.pageAnimation.start(() => {
                this.state.scrollValue.removeListener(animationId);
                setIndex(index);
                this.pageAnimation = null;
                this.loopJump();
                cb();
            });
        } else {
            this.state.scrollValue.setValue(index);
            setIndex(index);
            this.loopJump();
            cb();
        }
    }

    /**
     * -0.5 <= pageIndex <= (pages.length - 1 + 0.5)
     */
    public getCurrentPage() {
        const childrenNum = this.getChildrenNum();
        if (childrenNum <= 1) {
            return childrenNum;
        }

        const index = this.currentIndex;
        if (this.props.loop) {
            if (index < 0.5) {
                return index + childrenNum - 2 - 1;
            } else if (index > childrenNum - 2 + 0.5) {
                return index - childrenNum + 1;
            } else {
                return index - 1;
            }
        } else {
            return index;
        }
    }

    private loopJump() {
        if (!this.props.loop) {
            return;
        }
        const childrenNum = this.getChildrenNum();
        if (childrenNum <= 1) {
            return;
        }
        if (this.currentIndex === 0) {
            this.gotoPage(childrenNum - 2, false);
        } else if (this.currentIndex === (childrenNum - 1)) {
            this.gotoPage(1, false);
        }
    }

    private getChildrenNum() {
        const { children, loop } = this.props;
        let pages = React.Children.toArray(children);
        if (pages.length < 2) {
            return 1;
        }
        if (loop) {
            return pages.length + 2;
        } else {
            return pages.length;
        }
    }

    private renderIndicator(config: IndicatorConfig) {
        if (!this.props.showsPageIndicator) {
            return null;
        }
        if (this.props.renderPageIndicator) {
            return this.props.renderPageIndicator(config);
        }

        const { childrenNum, pageNum, loop, scrollValue } = config;
        if (pageNum === 0) {
            return null;
        }

        const indicators: JSX.Element[] = [];
        for (let i = 0; i < pageNum; i++) {
            indicators.push(<View key={i} style={styles.pointStyle} />);
        }

        let left: Animated.AnimatedInterpolation;

        if (pageNum === 1) {
            left = this.state.scrollValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0]
            });
        } else if (!loop) {
            left = this.state.scrollValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 16]
            });
        } else {
            left = this.state.scrollValue.interpolate({
                inputRange: [0, 1, 2, childrenNum - 2, childrenNum - 1],
                outputRange: [0, 0, 16, 16 * (childrenNum - 3), 16 * (childrenNum - 3)]
            });
        }

        return (
            <View style={{ position: 'absolute', alignSelf: 'center', flexDirection: 'row', bottom: 10 }}>
                {indicators}
                <Animated.View style={[styles.pointStyle, styles.pointActiveStyle, { left: left }]} />
            </View>
        );
    }

    public render() {
        const { children, pageWidth, pageHeight, loop } = this.props;
        const { scrollValue } = this.state;

        let pages = React.Children.toArray(children);
        const pageNum = pages.length;
        if (loop && pages.length > 1) {
            pages.unshift(pages[pages.length - 1]);
            pages.push(pages[1]);
        }

        pages = pages.map((page, index) => {
            return (
                <View key={index} style={{ height: pageHeight, width: pageWidth }}>
                    {page}
                </View>
            );
        });

        const childrenNum = pages.length;
        const translateX = scrollValue.interpolate({
            inputRange: [0, 1, childrenNum],
            outputRange: [0, -pageWidth, -childrenNum * pageWidth]
        });

        return (
            <View>
                <ScrollView
                    style={{ width: this.props.pageWidth }}
                    horizontal
                    pagingEnabled
                    directionalLockEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                >
                    <Animated.View
                        style={{ flexDirection: 'row', width: this.props.pageWidth * childrenNum, transform: [{ translateX }] }}
                        {...this.panResponder.panHandlers}
                    >
                        {pages}
                    </Animated.View>
                </ScrollView>
                {this.renderIndicator({ childrenNum, pageNum, loop, scrollValue })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    pagination: {
        position: 'absolute',
        alignItems: 'center',
    },
    paginationX: {
        bottom: 10,
        left: 0,
        right: 0,
    },
    paginationY: {
        right: 10,
        top: 0,
        bottom: 0,
    },
    pointStyle: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 5,
        backgroundColor: 'rgba(0,0,0,.4)'
    },
    pointActiveStyle: {
        position: 'absolute',
        backgroundColor: '#ffc81f',
    }
});