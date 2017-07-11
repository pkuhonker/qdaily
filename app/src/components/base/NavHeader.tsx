import * as React from 'react';
import { View, ViewStyle, Text, TextStyle, StyleSheet } from 'react-native';
import Icon from './Icon';

export interface NavHeaderProps {
    title?: string;
    style?: ViewStyle;
    titleStyle?: TextStyle;
    backTitleStyle?: TextStyle;
    onBack?: () => void;
}

export default class NavHeader extends React.Component<NavHeaderProps, any> {

    public render() {
        const { onBack, title, style, titleStyle, backTitleStyle } = this.props;
        return (
            <View style={[styles.container, style]}>
                <Icon style={[styles.back, backTitleStyle]} onPress={() => onBack && onBack()} type='EvilIcons' name='chevron-left' />
                <Text style={[{ color: '#000', fontSize: 16 }, titleStyle]}>{title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
    } as ViewStyle,
    back: {
        position: 'absolute',
        left: 10,
        color: '#000',
        fontSize: 40
    }
});