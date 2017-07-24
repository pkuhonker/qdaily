import { ToastAndroid, Platform } from 'react-native';
import Toast from 'react-native-root-toast';

export enum ToastDuration {
    SHORT,
    LONG
}

export enum ToastPosition {
    TOP,
    CENTER,
    BOTTOM
}

export function show(message: string, duration: ToastDuration = ToastDuration.SHORT, position: ToastPosition = ToastPosition.CENTER): void {
    if (Platform.OS === 'android') {
        if (duration === ToastDuration.SHORT) {
            duration = ToastAndroid.SHORT;
        }
        if (duration === ToastDuration.LONG) {
            duration = ToastAndroid.LONG;
        }
        if (position === ToastPosition.TOP) {
            position = ToastAndroid.TOP;
        }
        if (position === ToastPosition.CENTER) {
            position = ToastAndroid.CENTER;
        }
        if (position === ToastPosition.BOTTOM) {
            position = ToastAndroid.BOTTOM;
        }

        ToastAndroid.showWithGravity(message, duration, position);
    } else {
        if (duration === ToastDuration.SHORT) {
            duration = Toast.durations.SHORT;
        }
        if (duration === ToastDuration.LONG) {
            duration = Toast.durations.LONG;
        }
        if (position === ToastPosition.TOP) {
            position = Toast.positions.TOP;
        }
        if (position === ToastPosition.CENTER) {
            position = Toast.positions.CENTER;
        }
        if (position === ToastPosition.BOTTOM) {
            position = Toast.positions.BOTTOM;
        }
        Toast.show(message, {
            duration: duration,
            position: position
        });
    }
}

