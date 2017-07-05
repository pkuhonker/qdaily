import * as React from "react";
import {
    TouchableNativeFeedback,
    TouchableOpacity,
    TouchableWithoutFeedbackProperties,
    Platform,
} from "react-native";

export interface TouchableProps extends TouchableWithoutFeedbackProperties {
    androidSelectableBackground?: boolean;
    androidSelectableBackgroundBorderless?: boolean;
    androidRippleColor?: string;
    androidRippleBorderless?: boolean;
    iosActiveOpacity?: number;
}

export default class Touchable extends React.Component<TouchableProps, any> {

    static defaultProps: TouchableProps = {
        iosActiveOpacity: 1
    };

    public render() {
        if (Platform.OS === 'android') {
            const {
                androidRippleBorderless,
                androidRippleColor, 
                androidSelectableBackground, 
                androidSelectableBackgroundBorderless,
                ...otherProps
            } = this.props;

            let background;
            if (androidSelectableBackground) {
                background = TouchableNativeFeedback.SelectableBackground();
            } else if (androidSelectableBackgroundBorderless) {
                background = TouchableNativeFeedback.SelectableBackgroundBorderless();
            } else if (androidRippleColor) {
                background = TouchableNativeFeedback.Ripple(androidRippleColor, androidRippleBorderless);
            }

            return (
                <TouchableNativeFeedback
                    {...otherProps}
                    background={background}
                >
                    {this.props.children}
                </TouchableNativeFeedback>
            );
        } else {
            return (
                <TouchableOpacity
                    {...this.props}
                    activeOpacity={this.props.iosActiveOpacity}
                >
                    {this.props.children}
                </TouchableOpacity>
            );
        }
    }
};