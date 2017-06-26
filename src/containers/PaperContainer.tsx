import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { AppState } from '../reducers';
import { Paper } from '../interfaces';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

interface PaperContainerProps {
    id: number;
}

interface StateProps {
    paper?: Paper;
}

interface PaperContainerState {
}

type Props = PaperContainerProps & StateProps & ConnectComponentProps;

class PaperContainer extends React.Component<Props, PaperContainerState> {

    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        if (!this.props.paper) {
            this.props.actions.getPaperById(this.props.id);
        }
    }

    public render() {
        const { paper } = this.props;
        if (!paper) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Image style={{ width: 180, height: 120, alignSelf: 'center' }} source={require('../../res/imgs/pen_pageloading.gif')} />
                </View>
            );
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>施工中, 敬请期待</Text>
            </View>
        );
    }
}

function mapStateToProps(state: AppState, ownProps?: PaperContainerProps): StateProps {
    const { id } = ownProps;
    const paper = state.paper.papers[id];

    return {
        paper: paper
    };
}

export default connectComponent({
    LayoutComponent: PaperContainer,
    mapStateToProps: mapStateToProps
});