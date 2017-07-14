import * as React from 'react';
import {
    View, Text, Image, Animated, Easing, TouchableWithoutFeedback, BackHandler, ActivityIndicator,
    StyleSheet, ViewStyle, Dimensions, Platform
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import OverlayButton from '../components/base/OverlayButton';
import { AppState } from '../reducers';
import { TopicCategory } from '../interfaces';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';
import { containerStyle } from '../utils/container';

type DashContainerProps = NavigationScreenProps<{
}>;

interface StateProps {
    active: boolean;
    topics: TopicCategory[];
}

interface DashContainerState {
    topContainerY: Animated.Value;
    bottomContainerY: Animated.Value;
    bottomContainerX: Animated.Value;
}

type Props = DashContainerProps & StateProps & ConnectComponentProps;

const windowWidth = Dimensions.get('window').width;

class DashContainer extends React.Component<Props, DashContainerState> {

    private topicCategoryVisible: boolean;

    constructor(props) {
        super(props);
        this.state = {
            topContainerY: new Animated.Value(-400),
            bottomContainerY: new Animated.Value(800),
            bottomContainerX: new Animated.Value(0)
        };
    }

    public componentDidMount() {
        Animated.parallel([
            Animated.timing(this.state.topContainerY, { toValue: 0, easing: Easing.out(Easing.back(1)), duration: 300 }),
            Animated.timing(this.state.bottomContainerY, { toValue: 0, easing: Easing.out(Easing.back(1)), duration: 300 })
        ]).start();
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    public componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    public componentWillReceiveProps(nextProps: Props): void {
        if (this.props.active !== nextProps.active) {
            if (nextProps.active) {
                BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
            } else {
                BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
            }
        }
    }

    // http://facebook.github.io/react-native/docs/backhandler.html
    private onBackAndroid = () => {
        if (this.topicCategoryVisible) {
            this.showCategory(false);
        } else {
            this.goBack();
        }
        return true;
    }

    private goBack() {
        Animated.parallel([
            Animated.timing(this.state.topContainerY, { toValue: -400, easing: Easing.out(Easing.back(1)), duration: 300 }),
            Animated.timing(this.state.bottomContainerY, { toValue: 800, easing: Easing.out(Easing.back(1)), duration: 300 })
        ]).start();
        setTimeout(() => {
            this.props.navigation.goBack();
        }, 50);
    }

    private showCategory(value: boolean) {
        if (value === this.topicCategoryVisible) {
            return;
        }
        this.topicCategoryVisible = value;
        Animated.timing(this.state.bottomContainerX, {
            toValue: value ? -windowWidth : 0,
            easing: Easing.out(Easing.back(0.8)),
            duration: 300
        }).start();
    }

    private toCategory(topic: TopicCategory) {
        this.props.navigation.navigate('category', {
            id: topic.id,
            title: topic.title
        });
    }

    private renderVButton(options: { text: string, icon: any, onPress?: () => void }) {
        return (
            <TouchableWithoutFeedback onPress={() => options.onPress && options.onPress()}>
                <View style={{ alignItems: 'center' }}>
                    <Image style={{ height: 37, width: 37, marginBottom: 10 }} source={options.icon} />
                    <Text style={{ color: '#000' }}>{options.text}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    private renderHButton(options: { id?: number, text: string, icon: any, small?: boolean, right?: boolean, onPress?: () => void }) {
        return (
            <TouchableWithoutFeedback key={options.id} onPress={() => options.onPress && options.onPress()}>
                <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 15, paddingRight: 20 }}>
                    <Image style={[{ marginRight: 15 }, options.small ? { width: 32, height: 32 } : { width: 36, height: 36 }]} source={options.icon} />
                    <Text style={{ color: '#000', fontSize: options.small ? 14 : 15 }}>{options.text}</Text>
                    {options.right ? <Image style={{ marginLeft: 5, width: 8, height: 16 }} source={require('../../res/imgs/dash/icon_menu_second_day.png')} /> : null}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    public render(): JSX.Element {
        return (
            <View style={[styles.container, containerStyle]}>
                <Animated.View style={{ height: 170, transform: [{ translateY: this.state.topContainerY }] }}>
                    <TouchableWithoutFeedback>
                        <View style={styles.searchContainer}>
                            <Image style={{ width: 18, height: 19, marginRight: 8 }} source={require('../../res/imgs/dash/icon_menu_search_day.png')} />
                            <Text style={{ color: '#000', fontSize: 16 }}>搜索</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.hActionContainer}>
                        {this.renderVButton({ text: '设置', icon: require('../../res/imgs/dash/icon_menu_setting_day.png') })}
                        {this.renderVButton({ text: '夜间', icon: require('../../res/imgs/dash/icon_menu_night.png') })}
                        {this.renderVButton({ text: '离线', icon: require('../../res/imgs/dash/icon_menu_outline_day.png') })}
                        {this.renderVButton({ text: '推荐', icon: require('../../res/imgs/dash/icon_menu_share_day.png') })}
                    </View>
                </Animated.View>
                <Animated.View style={[{ flex: 1, flexDirection: 'row', width: windowWidth * 2 }, { transform: [{ translateX: this.state.bottomContainerX }, { translateY: this.state.bottomContainerY }] }]}>
                    <View style={styles.vActionContainer}>
                        {this.renderHButton({ text: '关于我们', icon: require('../../res/imgs/dash/icon_menu_about_day.png') })}
                        {this.renderHButton({ text: '新闻分类', icon: require('../../res/imgs/dash/icon_menu_category_day.png'), right: true, onPress: () => this.showCategory(true) })}
                        {this.renderHButton({ text: '栏目中心', icon: require('../../res/imgs/dash/icon_menu_column_day.png') })}
                        {this.renderHButton({ text: '我的消息', icon: require('../../res/imgs/dash/icon_menu_notification_day.png') })}
                        {this.renderHButton({ text: '个人中心', icon: require('../../res/imgs/dash/icon_menu_usercenter_day.png') })}
                        {this.renderHButton({ text: '意见反馈', icon: require('../../res/imgs/dash/icon_menu_feedback_day.png') })}
                        <OverlayButton position={{ left: 20, bottom: 20 }} onPress={() => this.goBack()}>
                            <View>
                                <Image style={{ width: 54, height: 54, borderRadius: 27 }} source={require('../../res/imgs/dash/icon_close_button.png')} />
                            </View>
                        </OverlayButton>
                    </View>
                    <View style={styles.vActionContainer}>
                        <View style={{ flexWrap: 'wrap', height: 350, alignContent: 'space-between' }}>
                            {
                                this.props.topics.length === 0
                                    ?
                                    <ActivityIndicator />
                                    :
                                    this.props.topics.map(topic => {
                                        return this.renderHButton({
                                            id: topic.id,
                                            text: topic.title,
                                            icon: { uri: topic.white_icon },
                                            onPress: () => this.toCategory(topic)
                                        });
                                    })
                            }
                        </View>
                        <OverlayButton position={{ left: 20, bottom: 20 }} onPress={() => this.showCategory(false)}>
                            <View>
                                <Image style={{ width: 54, height: 54, borderRadius: 27 }} source={require('../../res/imgs/dash/icon_back_button.png')} />
                            </View>
                        </OverlayButton>
                    </View>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    } as ViewStyle,
    searchContainer: {
        height: 39,
        marginVertical: 18,
        marginHorizontal: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center'
    } as ViewStyle,
    hActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 20,
    } as ViewStyle,
    vActionContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 20
    } as ViewStyle,
});

function mapStateToProps(state: AppState, ownProps?: DashContainerProps): StateProps {
    return {
        active: state.nav.routes[state.nav.index].routeName === 'dash',
        topics: state.home.left_sidebar
    };
}

export default connectComponent({
    LayoutComponent: DashContainer,
    mapStateToProps: mapStateToProps
});