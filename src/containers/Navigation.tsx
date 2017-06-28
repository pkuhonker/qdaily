import * as React from 'react';
import { connect } from 'react-redux';
import { Router, Scene } from 'react-native-router-flux';
import { AppState } from '../reducers';
import connectComponent from '../utils/connectComponent';
import HomeContainer from './HomeContainer';
import ArticleContainer from './ArticleContainer';
import PaperContainer from './PaperContainer';
import ADContainer from './ADContainer';
import PicsPreview from '../components/PicsPreview';
import Dash from './Dash';

const RouterWithRedux = connect()(Router as any);

interface NavigationProps {
}

interface StateProps {
}

type Props = NavigationProps & StateProps;

class Navigation extends React.Component<NavigationProps, any> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <RouterWithRedux>
                <Scene key="root">
                    <Scene key="home" component={HomeContainer} hideNavBar initial={true} />
                    <Scene key="dash" component={Dash} />
                    <Scene key="article" clone component={ArticleContainer} />
                    <Scene key="paper" clone component={PaperContainer} />
                    <Scene key="ad" clone component={ADContainer} />
                    <Scene key="picsPreview" clone animation='fade' duration={100} component={PicsPreview} />
                </Scene>
            </RouterWithRedux>
        );
    }
}

function mapStateToProps(state: AppState, ownProps?: NavigationProps): StateProps {
    return {
    };
}

export default connectComponent({
    LayoutComponent: Navigation,
    mapStateToProps: mapStateToProps
});
