import * as rn from 'react-native';

declare module 'react-native' {
    export interface WebViewPropertiesAndroid {
        mixedContentMode?: 'never' | 'always' | 'compatibility';
    }
}