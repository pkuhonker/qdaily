import * as React from 'react';
import { View, Image, TouchableWithoutFeedback, Dimensions, Animated, StyleSheet, ImageStyle, PanResponderInstance, PanResponder } from 'react-native';

export interface WhatsNewProps {
    onExit?: () => void;
}

interface WhatsNewState {
    index: number;
    images: Animated.Value[];
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class WhatsNew extends React.Component<WhatsNewProps, WhatsNewState> {
    private images = [
        require('../../../res/imgs/whatsnew/bg_whatsnew_bg_1.jpg'),
        require('../../../res/imgs/whatsnew/bg_whatsnew_bg_2.jpg'),
        require('../../../res/imgs/whatsnew/bg_whatsnew_bg_3.jpg'),
    ];

    private button: Image;
    private panResponder: PanResponderInstance;
    private panStartIndex = 0;
    private currentIndex = 0;
    private currentOffset = 0;

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            images: this.images.map((image, index) => {
                return new Animated.Value(index === 0 ? 1 : 0);
            })
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderStart: (e, g) => {
                this.panStartIndex = this.currentIndex;
                this.currentOffset = 0;
            },
            onPanResponderMove: (e, g) => {
                let offset = -g.dx / (windowWidth / 2);
                if (Math.abs(offset) > 1) {
                    offset = offset > 1 ? 1 : -1;
                }
                this.currentOffset = offset;
                this.updateImages(this.panStartIndex + offset);
            },
            onPanResponderEnd: (e, g) => {
                const newIndex = this.currentOffset < 0 ? Math.floor(this.currentIndex) : Math.ceil(this.currentIndex);
                if (this.currentIndex === newIndex) {
                    return;
                }
                Animated.parallel(this.state.images.map((value, imageIndex) => {
                    return Animated.timing(value, {
                        toValue: this.computeOpacity(newIndex, imageIndex),
                        duration: 300,
                    });
                }), { stopTogether: true }).start(() => {
                    this.currentIndex = newIndex;
                });
            }
        });
    }

    private computeOpacity(index: number, imageIndex: number) {
        const opacity = 1 - Math.min(1, Math.abs(imageIndex - index));
        return opacity;
    }

    private updateImages(index: number) {
        if (index < 0) {
            index = 0;
        }
        if (index > this.images.length - 1) {
            index = this.images.length - 1;
        }
        if (this.currentIndex === index) {
            return;
        }

        this.state.images.forEach((value, imageIndex) => {
            value.setValue(this.computeOpacity(index, imageIndex));
        });
        this.currentIndex = index;
    }

    public render() {
        return (
            <View {...this.panResponder.panHandlers} style={{ flex: 1 }}>
                {
                    this.images.map((imageSource, index) => {
                        return <Animated.Image
                            key={index}
                            style={[styles.image, {  opacity: this.state.images[index] }]}
                            source={imageSource}
                        >
                            {
                                index === this.images.length - 1
                                    ?
                                    <TouchableWithoutFeedback onPress={() => this.props.onExit && this.props.onExit()}>
                                        <Image
                                            ref = {ref => this.button = ref as any}
                                            style={styles.button}
                                            source={require('../../../res/imgs/whatsnew/icon_whatsnew_pagethree_start.png')}
                                        />
                                    </TouchableWithoutFeedback>
                                    :
                                    null
                            }
                        </Animated.Image>;
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        position: 'absolute',
        width: windowWidth,
        height: windowHeight
    } as ImageStyle,
    button: {
        position: 'absolute',
        bottom: windowHeight / 8,
        width: windowWidth / 2,
        alignSelf: 'center',
        resizeMode: 'contain'
    } as ImageStyle
});