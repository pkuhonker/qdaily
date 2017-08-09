import 'moment/locale/zh-cn.js';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Navigation from './containers/Navigation';
import * as Toast from './components/base/Toast';

const store = configureStore();

export default class Astro extends React.Component<any, any> {

    render() {
        return (
            <Provider store={store}>
                <Navigation />
            </Provider>
        );
    }
}

global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    // todo
    if (isFatal) {
        Toast.show(error.message, Toast.ToastDuration.LONG);
    }
});