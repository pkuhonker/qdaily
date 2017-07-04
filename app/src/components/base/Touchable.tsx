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
}

export default class Touchable extends React.Component<TouchableProps, any> {

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
                >
                    {this.props.children}
                </TouchableOpacity>
            );
        }
    }
};