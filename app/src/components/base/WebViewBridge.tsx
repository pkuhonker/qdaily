import * as React from 'react';
import { WebView, WebViewProperties, NativeSyntheticEvent, WebViewMessageEventData, Platform } from 'react-native';

let bridgeScript = require('../../../res/other/bridge.js');

// https://github.com/facebook/react-native/issues/10865
const fixPostMessage = `
window.native = {};
window.native.platform = "${Platform.OS}";
window.native.dev = ${__DEV__};

(function() {
    if (!window.native || window.native.platform === 'android' || !window.native.dev) {
        return;
    }
    var originalPostMessage = window.postMessage;

    var patchedPostMessage = function(message, targetOrigin, transfer) { 
    originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function() { 
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage'); 
    };

    window.postMessage = patchedPostMessage;
})();
`;
bridgeScript = fixPostMessage + bridgeScript;

export interface WebViewMessge {
    name: string;
    options: any;
}

export interface WebViewBridgeProperties extends WebViewProperties {
    onLinkPress?: (url: string) => void;
    onBridgeMessage?: (data: WebViewMessge) => void;
}

export default class WebViewBridge extends React.Component<WebViewBridgeProperties, any> {

    private webview: WebView;

    private onMessage(event: NativeSyntheticEvent<WebViewMessageEventData>) {
        const message: WebViewMessge = JSON.parse(event.nativeEvent.data);

        if (message.name === '_toNative::onLinkPress') {
            if (this.props.onLinkPress) {
                this.props.onLinkPress(message.options);
            }
        } else {
            if (this.props.onBridgeMessage) {
                this.props.onBridgeMessage(message);
            }
        }
    }

    public sendToWebView(name: string, options?: any) {
        this.webview.postMessage(JSON.stringify({ name, options }));
    }

    public render() {
        const { injectedJavaScript = '', ...props } = this.props;

        return (
            <WebView
                {...props}
                ref={ref => this.webview = ref as any}
                injectedJavaScript={bridgeScript + injectedJavaScript}
                onMessage={this.onMessage.bind(this)}
            >
            </WebView>
        );
    }
}