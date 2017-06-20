import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { View, Tabs, WhiteSpace } from 'antd-mobile';
import Banners from '../components/Banners';
import HeadLineCard from '../components/HeadLineCard';
import FeedsListView from '../components/FeedsListView';
import { AppState } from '../reducers';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

const data = require('../../data.json').response;

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
                            <Banners banners={data.banners}/>
                            <WhiteSpace />
                            <HeadLineCard headline={data.headline} />
                            <WhiteSpace />
                            <FeedsListView feeds={data.feeds} />
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
        backgroundColor: '#F2F2F2',
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