import * as React from 'react';
import { Animated, View, Image, TouchableWithoutFeedback, Easing, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import Toast from 'react-native-root-toast';
import { NavigationScreenProps } from 'react-navigation';
import { ShareItem } from '../share';
import { Share } from '../interfaces';

export type ShareViewProps = NavigationScreenProps<{
    content: Share;
    items: ShareItem[];
}>;

const windowHeight = Dimensions.get('window').height;
const itemSize = 77;
const itemMargin = (Dimensions.get('window').width - 77 * 3) / 8;

interface ShareViewState {
    containerY: Animated.Value;
}

export default class ShareView extends React.Component<ShareViewProps, ShareViewState> {

    constructor(props) {
        super(props);
        this.state = {
            containerY: new Animated.Value(windowHeight)
        };
    }

    public componentDidMount() {
        Animated.timing(this.state.containerY, {
            duration: 300,
            easing: Easing.out(Easing.back(1.5)),
            toValue: 0
        }).start();
    }

    private async openShare(item: ShareItem, content: Share) {
        if (!item.openShare) {
            return;
        }
        this.props.navigation.goBack();

        try {
            const data = await item.openShare(content);
            if (!data) {
                // Toast.show('分享取消', { position: Toast.positions.CENTER });
            } else {
                // Toast.show('分享成功', { position: Toast.positions.CENTER });
            }
        } catch (error) {
            Toast.show(error.message || '分享失败', { position: Toast.positions.CENTER });
        }
    }

    private renderItem(item: ShareItem) {
        const { content } = this.props.navigation.state.params;
        return (
            <TouchableWithoutFeedback key={item.type} onPress={() => this.openShare(item, content)}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ margin: itemMargin, width: itemSize, height: itemSize }} source={item.icon} />
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
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <Animated.View style={[{ flex: 1, alignItems: 'center' }, { transform: [{ translateY: this.state.containerY }] }]}>
                    <View style={styles.itemContainer}>
                        {shareItems}
                    </View>
                    <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
                        <View style={styles.cancel}>
                            <Image style={{ width: 51, height: 51 }} source={require('../../res/imgs/share/icon_cancel_button.png')} />
                        </View>
                    </TouchableWithoutFeedback>
                </Animated.View>
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