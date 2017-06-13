declare module 'react-native-smart-splash-screen' {

    type AnimationType = {
        scale: any,
        fade: any,
        none: any
    }

    let SplashScreen: {
        animationType: AnimationType;
        close: (options: {
            animationType?: AnimationType,
            duration?: number,
            delay?: number
        }) => void;
    };
    export default SplashScreen;
}