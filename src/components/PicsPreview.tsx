import * as React from 'react';
import { View, Image, Text, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import Swiper, { SwiperState } from 'react-native-swiper';

export interface Pic {
    text: string;
    url: string;
}

export interface PicsPreviewProps {
    defaultActiveIndex?: number;
    pics: Pic[];
    onBack?: () => void;
}

export interface PicsPreviewState {
    activeIndex: number;
}

export default class PicsPreview extends React.Component<PicsPreviewProps, PicsPreviewState> {

    constructor(props: PicsPreviewProps) {
        super(props);
        this.state = {
            activeIndex: props.defaultActiveIndex || 0
        };
    }

    private onChange(e, state: SwiperState) {
        this.setState({ activeIndex: state.index });
    }

    private onBack() {
        if (this.props.onBack) {
            this.props.onBack();
        }
    }

    public render() {
        const { pics } = this.props;
        const { activeIndex } = this.state;
        const swiperHeight = Dimensions.get('window').height - 110;

        return (
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <View style={{ height: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Icon style={{ position: 'absolute', left: 10, color: '#ffffff', fontSize: 40 }} onPress={this.onBack.bind(this)} name='chevron-left' />
                    <Text style={{ color: '#ffffff', fontSize: 20 }}>{`${activeIndex + 1}/${pics.length}`}</Text>
                </View>
                <Swiper index={activeIndex} showsPagination={false} height={swiperHeight} onMomentumScrollEnd={this.onChange.bind(this)} >
                    {
                        pics.map(pic => {
                            return (
                                <View key={pic.url} style={{}}>
                                    <Image resizeMode='center' style={{ height: swiperHeight }} source={{ uri: pic.url }}></Image>
                                    <Text style={{ position: 'absolute', left: 20, bottom: 100 , color: '#ffffff' }}>{pic.text}</Text>
                                </View>
                            );
                        })
                    }
                </Swiper>
                <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon style={{ color: '#ffffff', fontSize: 30 }} name='share-apple' />
                </View>
            </View>
        );
    }
}