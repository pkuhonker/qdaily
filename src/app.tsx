import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Navigation from './containers/Navigation';
import SplashScreen from 'react-native-smart-splash-screen';

const store = configureStore();

export default class Astro extends React.Component<any, any> {

    public componentDidMount(): void {
        SplashScreen.close({
            animationType: SplashScreen.animationType.fade,
            duration: 500,
            delay: 4000
        });
    }

    render() {
        return (
            <Provider store={store}>
                <Navigation />
            </Provider>
        );
    }
}