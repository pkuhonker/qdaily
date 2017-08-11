import * as React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, Image, Dimensions } from 'react-native';
import Touchable from './base/Touchable';
import Carousel from 'react-native-banner-carousel';
import { Banner } from '../interfaces';

export interface BannersProp {
    banners: Banner[];
    onPress?: (banner: Banner) => void;
}

export interface BannersState {
    swiperShow: boolean;
}

const BannerHeight = 260;
const BannerWidth = Dimensions.get('window').width;

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
            <Touchable key={data.image} onPress={() => this.onPress(data)}>
                <View style={styles.container}>
                    <Image style={{ width: BannerWidth, height: BannerHeight }} source={{ uri: data.image }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                            <Text style={styles.text}>{data.post.title}</Text>
                        </View>
                    </Image>
                </View>
            </Touchable>
        );
    }

    public render(): JSX.Element {
        if (this.props.banners.length === 0) {
            return <View />;
        }

        return (
            <View>
                <Carousel
                    autoplay={true}
                    autoplayTimeout={5000}
                    loop
                    index={0}
                    pageSize={BannerWidth}
                >
                    {this.props.banners.map(banner => { return this.renderPage(banner); })}
                </Carousel>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
    } as ViewStyle,
    container: {
        width: BannerWidth
    } as ViewStyle,
    text: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginHorizontal: 40,
        marginVertical: 30
    } as TextStyle,
});