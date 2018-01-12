import * as React from 'react';
import { View, Image, WebView, StyleSheet, ViewStyle, TextStyle, NavState } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { AppState } from '../reducers';
import Icon from '../components/base/Icon';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';
import { containerStyle } from '../utils/container';

type ADContainerProps = NavigationScreenProps<{
    url: string;
}>;

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
        const { goBack } = this.props.navigation;
        goBack();
    }

    private onShare() {
        // TODO
    }

    private renderLoading() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Image style={{ width: 150, height: 150, alignSelf: 'center' }} source={require('../../res/imgs/icon_loadmore.gif')} />
            </View>
        );
    }

    public render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#ffffff' }}>
                <WebView
                    ref={ref => this.webview = ref as any}
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                    renderLoading={() => this.renderLoading()}
                    onLoadEnd={this.onLoadEnd.bind(this)}
                    onError={this.onLoadError.bind(this)}
                    source={{ uri: params.url }}
                />
                <View style={styles.bottomBar}>
                    <Icon onPress={this.onReturn.bind(this)} style={[styles.icon, { left: 20, position: 'absolute' }]} type='FontAwesome' name='chevron-left' />
                    <Icon onPress={this.onReload.bind(this)} style={styles.icon} type='FontAwesome' name='refresh' />
                    <Icon onPress={this.onBack.bind(this)} style={styles.icon} type='FontAwesome' name='arrow-left' />
                    <Icon onPress={this.onForward.bind(this)} style={styles.icon} type='FontAwesome' name='arrow-right' />
                    <Icon onPress={this.onShare.bind(this)} style={[styles.icon, { marginRight: 0 }]} type='FontAwesome' name='share-square-o' />
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