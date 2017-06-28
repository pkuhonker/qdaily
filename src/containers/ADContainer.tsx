import * as React from 'react';
import { View, Image, WebView, StyleSheet, ViewStyle, TextStyle, NavState } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import { AppState } from '../reducers';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

interface ADContainerProps {
    url: string;
}

interface StateProps {
}

interface ADContainerState {
}

type Props = ADContainerProps & StateProps & ConnectComponentProps;

class ADContainer extends React.Component<Props, ADContainerState> {

    private webview: WebView;

    constructor(props) {
        super(props);
    }

    private onLoadEnd() {
    }

    private onLoadError(nav: NavState) {
        console.log('webview load error');
    }

    private onBack() {
        this.webview.goBack();
    }

    private onForward() {
        this.webview.goForward();
    }

    private onReload() {
        this.webview.reload();
    }

    private onReturn() {
        Actions.pop();
    }

    private onShare() {
        // TODO
    }

    private renderLoading() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Image style={{ width: 180, height: 120, alignSelf: 'center' }} source={require('../../res/imgs/pen_pageloading.gif')} />
            </View>
        );
    }

    public render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <WebView
                    ref={ref => this.webview = ref as any}
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                    renderLoading={() => this.renderLoading()}
                    onLoadEnd={this.onLoadEnd.bind(this)}
                    onError={this.onLoadError.bind(this)}
                    source={{ uri: this.props.url }}
                />
                <View style={styles.bottomBar}>
                    <Icon onPress={this.onReturn.bind(this)} style={[styles.icon, { left: 20, position: 'absolute' }]} name='chevron-left' />
                    <Icon onPress={this.onReload.bind(this)} style={styles.icon} name='refresh' />
                    <Icon onPress={this.onBack.bind(this)} style={styles.icon} name='arrow-left' />
                    <Icon onPress={this.onForward.bind(this)} style={styles.icon} name='arrow-right' />
                    <Icon onPress={this.onShare.bind(this)} style={[styles.icon, { marginRight: 0 }]} name='share-square-o' />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottomBar: {
        height: 50,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20
    } as ViewStyle,
    icon: {
        fontSize: 20,
        marginRight: 30
    } as TextStyle
});

function mapStateToProps(state: AppState, ownProps?: ADContainerProps): StateProps {
    return {
    };
}

export default connectComponent({
    LayoutComponent: ADContainer,
    mapStateToProps: mapStateToProps
});