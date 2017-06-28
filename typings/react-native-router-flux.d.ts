import { SceneProps } from 'react-native-router-flux';

declare module 'react-native-router-flux' {
    export interface SceneProps {
        animation?: 'fade' | string;
    }
}
