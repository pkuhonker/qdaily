import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { AppState } from '../reducers';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

interface HomeProps {

}

interface StateProps {
}

type Props = HomeProps & StateProps & ConnectComponentProps;

class Home extends React.Component<Props, any> {

    private onPress(): void {
        Actions['dash']();
    }

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Button title='ToDash' onPress={this.onPress.bind(this)} />
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit index.android.js
                </Text>
                <Text style={styles.instructions}>
                    Double tap R on your keyboard to reload,{'\n'}
                    Shake or press menu button for dev menu
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

function mapStateToProps(state: AppState, ownProps?: HomeProps): StateProps {
    return {
    };
}

export default connectComponent({
    LayoutComponent: Home,
    mapStateToProps: mapStateToProps
});