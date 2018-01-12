import * as React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import Touchable from './base/Touchable';
import MiniCalendar from './base/MiniCalendar';
import { HeadLine } from '../interfaces';

export interface HeadLineProp {
    headline: HeadLine;
    onPress?: () => void;
}

export default class HeadLineCard extends React.Component<HeadLineProp, any> {

    private onPress() {
        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    private renderTitle() {
        return (
            <View style={styles.cardTitle}>
                <MiniCalendar />
                <Text style={styles.cardTitleText}>大公司头条</Text>
            </View>
        );
    }

    private renderFooter() {
        return (
            <Text style={{ textAlign: 'right', fontSize: 13 }}>查看详情 ≫</Text>
        );
    }

    private renderContent() {
        const { list = [] } = this.props.headline;
        return list.map((content, index) => {
            const isFirst = index === 0;
            const isLast = index === (list.length - 1);
            return (
                <View key={content.description} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#ffe38f', borderRadius: 7, width: 7, height: 7 }} />
                    <Text style={[styles.cardContentText, isFirst ? { paddingTop: 0 } : null, isLast ? { borderBottomWidth: 0 } : null]}>{content.description}</Text>
                </View>
            );
        });
    }

    public render(): JSX.Element {
        const { headline } = this.props;
        if (!headline || !headline.list || headline.list.length === 0) {
            return <View />;
        }
        return (
            <Touchable
                style={styles.container}
                androidRippleColor='#f2f2f2'
                onPress={this.onPress.bind(this)}
            >
                <View style={styles.card}>
                    {this.renderTitle()}
                    <View style={styles.cardBody}>
                        {this.renderContent()}
                    </View>
                    {this.renderFooter()}
                </View>
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    card: {
        borderRadius: 8,
        backgroundColor: '#fff',
        marginHorizontal: 5,
        padding: 10
    } as ViewStyle,
    cardTitle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    } as ViewStyle,
    cardTitleText: {
        marginLeft: 10,
        fontWeight: 'bold',
        color: 'black',
        fontSize: 15
    } as TextStyle,
    cardBody: {
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 5
    } as ViewStyle,
    cardContentText: {
        color: '#2a2a2a',
        marginHorizontal: 10,
        fontSize: 14,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ececec'
    } as TextStyle
});