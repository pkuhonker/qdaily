import * as React from 'react';
import { View, Image, TouchableWithoutFeedback, StyleSheet, ViewStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { ShareItem } from '../constants/shareItem';
import { Share } from '../interfaces';

export type ShareProps = NavigationScreenProps<{
    content: Share;
    items: ShareItem[];
}>;

export default class ShareView extends React.Component<ShareProps, any> {

    private renderItem(item: ShareItem) {
        const { content } = this.props.navigation.state.params;
        return (
            <TouchableWithoutFeedback key={item.type} onPress={() => item.onPress && item.onPress(content)}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ margin: 15, width: 77, height: 77 }} source={item.icon} />
                </View>
            </TouchableWithoutFeedback>
        );
    }

    public render() {
        const { items = [] } = this.props.navigation.state.params;
        const shareItems = items.map(item => {
            return this.renderItem(item);
        });

        return (
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center' }}>
                <View style={styles.itemContainer}>
                    {shareItems}
                </View>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
                    <View style={styles.cancel}>
                        <Image style={{ width: 51, height: 51 }} source={require('../../res/imgs/share/icon_cancel_button.png')} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        bottom: 100
    } as ViewStyle,
    cancel: {
        position: 'absolute',
        bottom: 20
    } as ViewStyle
});