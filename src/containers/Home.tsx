import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Tabs } from 'antd-mobile';
import Banners from '../components/Banners';
import { AppState } from '../reducers';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

const TabPane = Tabs.TabPane;

interface HomeProps {

}

interface StateProps {
}

type Props = HomeProps & StateProps & ConnectComponentProps;

class Home extends React.Component<Props, any> {

    public render(): JSX.Element {
        return (
            <View style={styles.container}>
                <Tabs defaultActiveKey='news'>
                    <TabPane tab='NEWS' key='news'>
                        <ScrollView>
                            <Banners />
                        </ScrollView>
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
        backgroundColor: '#F5FCFF',
    }
});

function mapStateToProps(state: AppState, ownProps?: HomeProps): StateProps {
    return {
    };
}

export default connectComponent({
    LayoutComponent: Home,
    mapStateToProps: mapStateToProps
});