import 'moment/locale/zh-cn.js';
import * as React from 'react';
import { View, NativeModules } from 'react-native';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Navigation from './containers/Navigation';
import CustomStatusBar from './components/base/CustomStatusBar';

const store = configureStore();

export default class Astro extends React.Component<any, any> {

    render() {
        return (
            <View style={{ flex: 1 }}>
                <CustomStatusBar />
                <Provider store={store}>
                    <Navigation />
                </Provider>
            </View>
        );
    }
}

if (!__DEV__) {
    global.ErrorUtils.setGlobalHandler((error: Error, isFatal) => {
        if (isFatal) {
            NativeModules.UmengNativeModule.onEventWithLabel('js_error', error.stack);
        }
    });
}