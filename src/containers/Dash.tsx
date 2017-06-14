import * as React from 'react';
import { View, Button } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { AppState } from '../reducers';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

export interface DashProps {
}

interface StateProps {
}

type Props = DashProps & StateProps & ConnectComponentProps;

class Dash extends React.Component<Props, any> {

    private onPress() {
        Actions.pop();
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