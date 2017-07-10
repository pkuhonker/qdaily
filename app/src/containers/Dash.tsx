import * as React from 'react';
import { View, Button } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { AppState } from '../reducers';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

type DashProps = NavigationScreenProps<{
}>;

interface StateProps {
}

type Props = DashProps & StateProps & ConnectComponentProps;

class Dash extends React.Component<Props, any> {

    private onPress() {
        this.props.navigation.goBack();
    }

    public render(): JSX.Element {
        return (
            <View>
                <Button title='后退' onPress={this.onPress.bind(this)} />
            </View>
        );
    }
}

function mapStateToProps(state: AppState, ownProps?: DashProps): StateProps {
    return {
    };
}

export default connectComponent({
    LayoutComponent: Dash,
    mapStateToProps: mapStateToProps
});