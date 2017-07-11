import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import NavHeader from '../components/base/NavHeader';
import FeedList from '../components/FeedList';
import { NavigationScreenProps } from 'react-navigation';
import { AppState } from '../reducers';
import { Categories, Feed, FeedType } from '../interfaces';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

type CategoryContainerProps = NavigationScreenProps<{
    id: number;
    title: string;
}>;

interface StateProps {
    category: Categories;
    pullRefreshPending: boolean;
}

interface CategoryContainerState {
}

type Props = CategoryContainerProps & StateProps & ConnectComponentProps & CategoryContainerProps;

class CategoryContainer extends React.Component<Props, CategoryContainerState> {

    public componentDidMount() {
        if (!this.props.category.feeds) {
            this.refresh();
        }
    }

    private toDetail(feed: Feed) {
        const { navigate } = this.props.navigation;
        if (feed.type === FeedType.PAPER) {
            navigate('paper', { id: feed.post.id });
        } else {
            navigate('article', { id: feed.post.id });
        }
    }

    private refresh(key?: string) {
        const { actions, category, pullRefreshPending } = this.props;
        const { id } = this.props.navigation.state.params;
        if (key) {
            if (!pullRefreshPending && category.feeds.length) {
                actions.getCategories(id, key);
            }
        } else {
            actions.getCategories(id);
        }
    }

    public render() {
        const { category, pullRefreshPending } = this.props;
        const { title } = this.props.navigation.state.params;

        if (!category.feeds) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size='large' />
                </View>
            ); 
        }

        return (
            <View style={{ flex: 1, backgroundColor: '#f2f2f2' }} >
                <NavHeader
                    title={title}
                    style={{ height: 50 }}
                    onBack={() => this.props.navigation.goBack()}
                />
                <FeedList
                    feeds={category.feeds}
                    pullRefreshPending={pullRefreshPending}
                    onRefresh={this.refresh.bind(this)}
                    onEndReached={() => this.refresh(category.last_key)}
                    onItemPress={feed => this.toDetail(feed)}
                >
                </FeedList>
            </View>
        );
    }
}

function mapStateToProps(state: AppState, ownProps?: CategoryContainerProps): StateProps {
    const { id } = ownProps.navigation.state.params;
    return {
        category: state.category.categories[id] || Object.create(null),
        pullRefreshPending: state.category.pullRefreshPending
    };
}

export default connectComponent({
    LayoutComponent: CategoryContainer,
    mapStateToProps: mapStateToProps
});