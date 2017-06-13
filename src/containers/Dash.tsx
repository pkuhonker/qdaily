import * as React from 'react';
import { View, Button } from 'react-native';
import { AppState } from '../reducers';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';
import { RouterProps } from '../configs/Router';

export interface DashProps {

}

interface StateProps {
    user: any;
}

type Props = DashProps & StateProps & ConnectComponentProps & RouterProps;

class Dash extends React.Component<Props, any> {

    private onPress() {
        this.props.router.pop();
    }

    public render(): JSX.Element {
        return (
            <View>
                <Button title='fuck' onPress={this.onPress.bind(this)} />
            </View>
        );
    }
}

function mapStateToProps(state: AppState, ownProps?: DashProps): StateProps {
    return {
        user: state.user
    };
}

export default connectComponent({
    LayoutComponent: Dash,
    mapStateToProps: mapStateToProps
});