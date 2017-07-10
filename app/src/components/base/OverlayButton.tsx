import * as React from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity } from 'react-native';

const overlayButtonSize = 50;

export interface OverlayButtonProps {
    style?: ViewStyle;
    position?: {
        left: number;
        bottom: number;
    };
    activeOpacity?: number;
    onPress?: () => void;
}

export default class OverlayButton extends React.Component<OverlayButtonProps, any> {

    static defaultProps: OverlayButtonProps = {
        activeOpacity: 0.8,
        position: {
            left: 20,
            bottom: 20
        }
    };

    public render() {
        return (
            <View
                style={[styles.container, this.props.position, this.props.style]}
            >
                <TouchableOpacity
                    activeOpacity={this.props.activeOpacity}
                    onPress={() => this.props.onPress && this.props.onPress()}
                >
                    {this.props.children}
                </TouchableOpacity>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        height: overlayButtonSize,
        width: overlayButtonSize,
        position: 'absolute',
        borderRadius: overlayButtonSize / 2
    } as ViewStyle
});