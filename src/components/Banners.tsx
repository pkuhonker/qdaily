import * as React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, ViewStyle, TextStyle, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { Banner } from '../interfaces';

export interface BannersProp {
    banners: Banner[];
    onPress?: (banner: Banner) => void;
}

export interface BannersState {
    swiperShow: boolean;
}

const BannerHeight = 260;

export default class Banners extends React.Component<BannersProp, BannersState> {

    constructor(props) {
        super(props);
        this.state = {
            swiperShow: false
        };
    }

    public componentDidMount() {
        // see https://github.com/leecade/react-native-swiper/issues/389
        setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 0);
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
        if (!this.state.swiperShow) {
            return (
                <View style={{ height: BannerHeight, backgroundColor: '#ffffff' }}></View>
            );
        }
        return (
            <View>
                <Swiper
                    height={BannerHeight}
                    index={0}
                    autoplayTimeout={5}
                    autoplay
                    loop
                    paginationStyle={{ bottom: 5 }}
                    dotStyle={{ width: 6, height: 6, borderRadius: 3 }}
                    activeDotStyle={{ width: 6, height: 6, borderRadius: 3 }}
                    activeDotColor='#ffc81f'
                    dotColor='rgba(0,0,0,.4)'
                >
                    {this.props.banners.map(banner => { return this.renderPage(banner); })}
                </Swiper>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
    } as ViewStyle,
    container: {
        flex: 1,
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