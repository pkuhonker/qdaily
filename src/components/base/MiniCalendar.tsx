import * as React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';

export interface MiniCalendarProps {
    date?: number;
}

const monthAbbr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default class MiniCalendar extends React.Component<MiniCalendarProps, any> {
    
    private getMonth(date: Date): string {
        return monthAbbr[date.getUTCMonth()];
    }

    private getDay(date: Date): string {
        return date.getUTCDate().toString();
    }

    public render(): JSX.Element {
        const date = new Date(this.props.date || Date.now());
        const day = this.getDay(date);
        const month = this.getMonth(date);

        return (
            <View style={styles.container}>
                <View style={styles.monthContainer}>
                    <Text style={[styles.text, { fontSize: 8 }]}>{month}</Text>
                </View>
                <View style={styles.dayContainer}>
                    <Text style={[styles.text, { fontSize: 12, color: 'black' }]}>{day}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 28
    } as ViewStyle,
    monthContainer: {
        backgroundColor: '#ededed',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        height: 12,
        justifyContent: 'center'
    } as ViewStyle,
    dayContainer: {
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        height: 16,
        borderWidth: 1,
        borderColor: '#e9e9e9',
        borderTopColor: '#dcdcdc',
        justifyContent: 'center'
    } as ViewStyle,
    text: {
        textAlign: 'center'
    } as TextStyle
});

