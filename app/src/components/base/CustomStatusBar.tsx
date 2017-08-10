import * as React from 'react';
import { View, StatusBar, NativeModules, Platform, StatusBarProperties, StatusBarAnimation, StatusBarStyle } from 'react-native';

interface CustomStatusBarState extends StatusBarProperties {
}

const defaultStatusBarOptions: StatusBarProperties = {
    animated: true,
    backgroundColor: '#fff',
    barStyle: 'dark-content',
    hidden: false,
    networkActivityIndicatorVisible: false,
    showHideTransition: 'fade',
    translucent: true
};

export default class CustomStatusBar extends React.PureComponent<any, CustomStatusBarState> {

    public static defaultStatusBarOptions = defaultStatusBarOptions;

    public static setHidden(hidden: boolean, animation?: StatusBarAnimation) {
        CustomStatusBar.componentInstance.setHidden(hidden, animation);
    }

    public static setBarStyle(style: StatusBarStyle, animated?: boolean) {
        CustomStatusBar.componentInstance.setBarStyle(style, animated);
    }

    public static setNetworkActivityIndicatorVisible(visible: boolean) {
        CustomStatusBar.componentInstance.setNetworkActivityIndicatorVisible(visible);
    }

    public static setBackgroundColor(color: string, animated?: boolean) {
        CustomStatusBar.componentInstance.setBackgroundColor(color, animated);
    }

    public static setTranslucent(translucent: boolean) {
        CustomStatusBar.componentInstance.setTranslucent(translucent);
    }

    private static _componentInstance: CustomStatusBar;
    private static get componentInstance() {
        if (CustomStatusBar._componentInstance) {
            return CustomStatusBar._componentInstance;
        } else {
            return new CustomStatusBar({});
        }
    }

    constructor(props) {
        super(props);
        if (CustomStatusBar._componentInstance) {
            this.state = CustomStatusBar._componentInstance.state;
        } else {
            this.state = defaultStatusBarOptions;
        }
        CustomStatusBar._componentInstance = this;
    }

    public setHidden(hidden: boolean, animation?: StatusBarAnimation) {
        StatusBar.setHidden(hidden, animation);
        if (Platform.OS === 'ios') {
            this.setState({ hidden: hidden });
        }
    }

    public setBarStyle(style: StatusBarStyle, animated?: boolean) {
        if (Platform.OS === 'android') {
            NativeModules.StatusBarManagerAndroid.setStyle(style);
        } else {
            StatusBar.setBarStyle(style, animated);
        }
    }

    public setNetworkActivityIndicatorVisible(visible: boolean) {
        StatusBar.setNetworkActivityIndicatorVisible(visible);
    }

    public setBackgroundColor(color: string, animated?: boolean) {
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(color, animated);
        } else {
            this.setState({ backgroundColor: color });
        }
    }

    public setTranslucent(translucent: boolean) {
        StatusBar.setTranslucent(translucent);
    }

    public render() {
        if (Platform.OS === 'android') {
            return <View />;
        }
        const { backgroundColor, hidden } = this.state;

        return (
            <View style={{ position: 'absolute', zIndex: 9999, left: 0, right: 0, backgroundColor, height: hidden ? 0 : 20 }}>
            </View>
        );
    }
}