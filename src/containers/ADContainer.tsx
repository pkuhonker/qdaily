import * as React from 'react';
import { View, Image, Text, WebView, StyleSheet, ViewStyle, NavState } from 'react-native';
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

    constructor(props) {
        super(props);
    }

    private onLoadEnd() {
    }

    private onLoadError(nav: NavState) {
        console.log('webview load error');
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
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                    renderLoading={() => this.renderLoading()}
                    onLoadEnd={this.onLoadEnd.bind(this)}
                    onError={this.onLoadError.bind(this)}
                    source={{ uri: this.props.url }}
                />
                <View style={styles.bottomBar}>
                    <Text style={{ left: 10, position: 'absolute' }}>返回</Text>
                    <Text>刷新</Text>
                    <Text>后退</Text>
                    <Text>前进</Text>
                    <Text>分享</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottomBar: {
        height: 50,
        backgroundColor: '#ff0000',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 10
    } as ViewStyle
});

function mapStateToProps(state: AppState, ownProps?: ADContainerProps): StateProps {
    return {
    };
}

export default connectComponent({
    LayoutComponent: ADContainer,
    mapStateToProps: mapStateToProps
});