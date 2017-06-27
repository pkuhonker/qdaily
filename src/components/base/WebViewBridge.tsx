import * as React from 'react';
import { WebView, WebViewProperties, NativeSyntheticEvent, WebViewMessageEventData } from 'react-native';

const injectedJavaScript = require('../../../res/other/bridge.js');

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
        const { ...props } = this.props;

        return (
            <WebView
                ref={ref => this.webview = ref as any}
                injectedJavaScript={injectedJavaScript}
                onMessage={this.onMessage.bind(this)}
                {...props}
            >
            </WebView>
        );
    }
}