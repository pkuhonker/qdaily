import { ViewStyle, Platform } from 'react-native';

export const containerStyle = {
    paddingTop: Platform.OS === 'android' ? 0 : 20,
} as ViewStyle;