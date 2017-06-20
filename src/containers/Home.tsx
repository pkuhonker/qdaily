import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View, Tabs } from 'antd-mobile';
import NewsView from '../components/NewsView';
import { AppState } from '../reducers';
import { HomeState } from '../reducers/home';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

const TabPane = Tabs.TabPane;

interface HomeProps {

}

interface StateProps {
    home: HomeState;
}

type Props = HomeProps & StateProps & ConnectComponentProps;

class Home extends React.Component<Props, any> {

    public componentDidMount() {
        const { actions } = this.props;
        actions.getHome();
    }

    private refreshHome() {
        const { actions, home } = this.props;
        if (home.feeds.length) {
            actions.getHome(home.last_key);
        }
    }

    public render(): JSX.Element {
        const { home } = this.props;
        return (
            <View style={styles.container}>
                <Tabs defaultActiveKey='news'>
                    <TabPane tab='NEWS' key='news'>
                        {/*<ScrollView>*/}
                        
                        <NewsView
                            feeds={home.feeds}
                            banners={home.banners}
                            headline={home.headline}
                            onEndReached={this.refreshHome.bind(this)}>
                        </NewsView>
                        {/*</ScrollView>*/}
                    </TabPane>
                    <TabPane tab='LABS' key='labs'>
                    </TabPane>
                </Tabs>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    }
});

function mapStateToProps(state: AppState, ownProps?: HomeProps): StateProps {
    return {
        home: state.home
    };
}

export default connectComponent({
    LayoutComponent: Home,
    mapStateToProps: mapStateToProps
});