import * as React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, ViewStyle, TextStyle, Image } from 'react-native';
import { Carousel } from 'antd-mobile';
import { Banner } from '../interfaces';

export interface BannersProp {
    banners: Banner[];
    onPress?: (banner: Banner) => void;
}

export interface BannersState {
}

export default class Banners extends React.Component<BannersProp, BannersState> {

    constructor(props) {
        super(props);
    }

    private onPress(banner) {
        if (this.props.onPress) {
            this.props.onPress(banner);
        }
    }

    private renderPage(data: Banner): JSX.Element {
        return (
            <TouchableNativeFeedback key={data.image} onPress={() => this.onPress(data)}>
                <View style={[styles.container, { backgroundColor: 'red' }]}>
                    <Image style={{ flex: 1, justifyContent: 'flex-end' }} source={{ uri: data.image }}>
                        <Text style={styles.text}>{data.post.title}</Text>
                    </Image>
                </View>
            </TouchableNativeFeedback>
        );
    }

    public render(): JSX.Element {
        return (
            <View>
                <Carousel
                    selectedIndex={0}
                    style={styles.wrapper}
                    autoplayInterval={5000}
                    autoplay
                    infinite
                >
                    {this.props.banners.map(banner => { return this.renderPage(banner); })}
                </Carousel>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
    } as ViewStyle,
    container: {
        height: 255,
        alignItems: 'center',
        justifyContent: 'center'
    } as ViewStyle,
    text: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginHorizontal: 30,
        marginVertical: 30
    } as TextStyle,
});