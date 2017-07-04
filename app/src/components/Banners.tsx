import * as React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, Image } from 'react-native';
import Touchable from './base/Touchable';
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
            <Touchable key={data.image} onPress={() => this.onPress(data)}>
                <View style={styles.container}>
                    <Image style={{ flex: 1 }} source={{ uri: data.image }}>
                        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                            <Text style={styles.text}>{data.post.title}</Text>
                        </View>
                    </Image>
                </View>
            </Touchable>
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
                    paginationStyle={{ bottom: 8 }}
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
        marginHorizontal: 40,
        marginVertical: 30
    } as TextStyle,
});