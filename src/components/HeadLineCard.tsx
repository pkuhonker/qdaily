import * as React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, TouchableNativeFeedback } from 'react-native';
import { Card } from 'antd-mobile';
import MiniCalendar from './base/MiniCalendar';
import { HeadLine } from '../interfaces';

export interface HeadLineProp {
    headline: HeadLine;
}

export default class HeadLineCard extends React.Component<HeadLineProp, any> {

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
            <Text style={{ textAlign: 'right', fontSize: 12 }}>查看详情 ≫</Text>
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
        return (
            <TouchableNativeFeedback style={styles.container} background={TouchableNativeFeedback.Ripple('#f2f2f2')}>
                <Card style={styles.card} >
                    <Card.Header title={this.renderTitle()} />
                    <Card.Body style={styles.cardBody}>
                        {this.renderContent()}
                    </Card.Body>
                    <Card.Footer extra={this.renderFooter()} />
                </Card>
            </TouchableNativeFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    card: {
        marginHorizontal: 5,
        borderWidth: 0
    } as ViewStyle,
    cardTitle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    } as ViewStyle,
    cardTitleText: {
        marginLeft: 10,
        fontWeight: 'bold',
        color: 'black'
    } as TextStyle,
    cardBody: {
        marginHorizontal: 10,
        borderTopWidth: 0
    } as ViewStyle,
    cardContentText: {
        color: '#2a2a2a',
        marginHorizontal: 14,
        fontSize: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#ececec'
    } as TextStyle
});