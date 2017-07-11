import * as React from 'react';
import {
    View, Text, Image, Animated, Easing, TouchableWithoutFeedback, BackHandler,
    StyleSheet, ViewStyle, Dimensions
} from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import OverlayButton from '../components/base/OverlayButton';
import { AppState } from '../reducers';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

type DashContainerProps = NavigationScreenProps<{
}>;

interface StateProps {
}

interface DashContainerState {
    topContainerY: Animated.Value;
    bottomContainerY: Animated.Value;
    bottomContainerX: Animated.Value;
}

type Props = DashContainerProps & StateProps & ConnectComponentProps;

const windowWidth = Dimensions.get('window').width;

class DashContainer extends React.Component<Props, DashContainerState> {

    constructor(props) {
        super(props);
        this.state = {
            topContainerY: new Animated.Value(-200),
            bottomContainerY: new Animated.Value(600),
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

    // http://facebook.github.io/react-native/docs/backhandler.html
    private onBackAndroid = () => {
        this.goBack();
        return true;
    }

    private goBack() {
        Animated.parallel([
            Animated.timing(this.state.topContainerY, { toValue: -200, easing: Easing.out(Easing.back(1)), duration: 300 }),
            Animated.timing(this.state.bottomContainerY, { toValue: 600, easing: Easing.out(Easing.back(1)), duration: 300 })
        ]).start();
        setTimeout(() => {
            this.props.navigation.goBack();
        }, 50);
    }

    private showCategory(value: boolean) {
        Animated.timing(this.state.bottomContainerX, {
            toValue: value ? -windowWidth : 0,
            easing: Easing.out(Easing.back(0.8)),
            duration: 300
        }).start();
    }

    private renderVButton(options: { text: string, icon: string, onPress?: () => void }) {
        return (
            <TouchableWithoutFeedback onPress={() => options.onPress && options.onPress()}>
                <View style={{ alignItems: 'center' }}>
                    <Image style={{ height: 37, width: 37, marginBottom: 15 }} source={options.icon} />
                    <Text style={{ color: '#000' }}>{options.text}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    private renderHButton(options: { text: string, icon: string, right?: boolean, onPress?: () => void }) {
        return (
            <TouchableWithoutFeedback onPress={() => options.onPress && options.onPress()}>
                <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 15 }}>
                    <Image style={{ width: 36, height: 36, marginRight: 15 }} source={options.icon} />
                    <Text style={{ color: '#000', fontSize: 15 }}>{options.text}</Text>
                    {options.right ? <Image style={{ marginLeft: 5, width: 8, height: 16 }} source={require('../../res/imgs/dash/icon_menu_second_day.png')} /> : null}
                </View>
            </TouchableWithoutFeedback>
        );
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Animated.View style={{ transform: [{ translateY: this.state.topContainerY }] }}>
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
                                <Image style={{ width: 50, height: 50 }} source={require('../../res/imgs/dash/icon_close_button.png')} />
                            </View>
                        </OverlayButton>
                    </View>
                    <View style={styles.vActionContainer}>
                        {this.renderHButton({ text: '关于我们', icon: require('../../res/imgs/dash/icon_menu_about_day.png') })}
                        {this.renderHButton({ text: '栏目中心', icon: require('../../res/imgs/dash/icon_menu_column_day.png') })}
                        {this.renderHButton({ text: '我的消息', icon: require('../../res/imgs/dash/icon_menu_notification_day.png') })}
                        <OverlayButton position={{ left: 20, bottom: 20 }} onPress={() => this.showCategory(false)}>
                            <View>
                                <Image style={{ width: 50, height: 50 }} source={require('../../res/imgs/dash/icon_back_button.png')} />
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
        backgroundColor: '#f2f2f2',
    } as ViewStyle,
    searchContainer: {
        height: 39,
        marginVertical: 20,
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
        marginVertical: 20,
        marginHorizontal: 20,
    } as ViewStyle,
    vActionContainer: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 20,
        paddingHorizontal: 20
    } as ViewStyle,
});

function mapStateToProps(state: AppState, ownProps?: DashContainerProps): StateProps {
    return {
    };
}

export default connectComponent({
    LayoutComponent: DashContainer,
    mapStateToProps: mapStateToProps
});