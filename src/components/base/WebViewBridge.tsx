import * as React from 'react';
import { WebView, WebViewProperties, NativeSyntheticEvent, NavState, WebViewMessageEventData, Platform } from 'react-native';

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

interface WebViewBridgeState {
    androidLoaded: boolean;
}

export default class WebViewBridge extends React.Component<WebViewBridgeProperties, WebViewBridgeState> {

    private webview: WebView;

    constructor(props) {
        super(props);
        this.state = {
            androidLoaded: false
        };
    }

    // fix android document.clientWidth == 0 when source is html string.
    private needRelayout() {
        return Platform.OS === 'android' &&
            !this.state.androidLoaded &&
            (typeof this.props.source === 'object' && (this.props.source as any).html);
    }

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

    private onLoadEnd(event: NavState) {
        if (this.needRelayout()) {
            this.setState({ androidLoaded: true });
            return;
        }
        if (this.props.onLoadEnd) {
            // wait the html page layout complete.
            setTimeout(() => {
                this.props.onLoadEnd(event);
            }, 0);
        }
    }

    public sendToWebView(name: string, options?: any) {
        this.webview.postMessage(JSON.stringify({ name, options }));
    }

    public render() {
        const { injectedJavaScript = '', source, ...props } = this.props;

        return (
            <WebView
                {...props}
                source={this.needRelayout() ? { html: '' } : source}
                ref={ref => this.webview = ref as any}
                mixedContentMode='always'   // fix tencent video error: http://blog.csdn.net/qq_16472137/article/details/54346078
                injectedJavaScript={bridgeScript + injectedJavaScript}
                onMessage={this.onMessage.bind(this)}
                onLoadEnd={this.onLoadEnd.bind(this)}
            >
            </WebView>
        );
    }
}