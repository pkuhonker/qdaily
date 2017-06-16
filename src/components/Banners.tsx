import * as React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, Image } from 'react-native';
import { Carousel } from 'antd-mobile';

interface BannerData {
    title: string;
    image: string;
}

export default class Banners extends React.Component<any, any> {

    private bannerData: BannerData[] = [
        {
            title: '一个“无国籍”建筑师在上海未盖成一座房子，却留下对城市的深远影响',
            image: 'http://img.qdaily.com/article/banner/20170602143535HWDOK8bZd6Efv5qm.jpg?imageMogr2/auto-orient/thumbnail/!640x380r/gravity/Center/crop/640x380/quality/85/format/jpg/ignore-error/1'
        },
        {
            title: '一个卖三明治和简餐的公司如何做到上市？反应足够快才行 | 市场发明家',
            image: 'http://img.qdaily.com/article/banner/201706012211438h4gEwMbpYlBP5Ia.png?imageMogr2/auto-orient/thumbnail/!640x380r/gravity/Center/crop/640x380/quality/85/format/jpg/ignore-error/1'
        },
        {
            title: 'MP3 格式走到了终点，这个为电话和广播而生的技术，最后改变了整个音乐产业 | 好奇心商业史',
            image: 'http://img.qdaily.com/article/banner/20170601143936W3vKrF7N05mcSeAC.jpg?imageMogr2/auto-orient/thumbnail/!640x380r/gravity/Center/crop/640x380/quality/85/format/jpg/ignore-error/1'
        }
    ];

    private renderPage(data: BannerData): JSX.Element {
        return (
            <View key={data.image} style={[styles.container, { backgroundColor: 'red' }]}>
                <Image style={{ height: 200, justifyContent: 'flex-end' }} source={{ uri: data.image }}>
                    <Text style={styles.text}>{data.title}</Text>
                </Image>
            </View>
        );
    }

    public render(): JSX.Element {
        return (
            <View>
                <Carousel
                    style={styles.wrapper}
                    autoplayInterval={5000}
                    autoplay
                    infinite
                >
                    {this.bannerData.map(data => { return this.renderPage(data); })}
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
        flexGrow: 1,
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