import * as React from 'react';
import { View, Image, NavState } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import WebViewBridge, { WebViewMessge } from '../components/base/WebViewBridge';
import { AppState } from '../reducers';
import { Article } from '../interfaces';
import { domain } from '../constants/config';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

type ArticleContainerProps = NavigationScreenProps<{
    id: number
}>;

interface StateProps {
    article?: Article;
}

interface ArticleContainerState {
    loaded: boolean;
}

type Props = StateProps & ConnectComponentProps & ArticleContainerProps;

class ArticleContainer extends React.Component<Props, ArticleContainerState> {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    public componentDidMount() {
        const { params } = this.props.navigation.state;
        if (!this.props.article) {
            this.props.actions.getArticleById(params.id);
        }
    }

    private onLoadEnd() {
        if (!this.state.loaded) {
            setTimeout(() => {
                this.setState({ loaded: true });
            }, 300);
        }
    }

    private onLoadError(nav: NavState) {
        console.log('webview load error');
    }

    private onBridgeMessage(data: WebViewMessge) {
        const { navigate } = this.props.navigation;
        if (data.name === 'qdaily::picsPreview') {
            navigate('picsPreview', {
                defaultActiveIndex: data.options.cur,
                pics: data.options.pics
            });
        } else {
            console.log('onBridgeMessage', data);
        }
    }

    private onLinkPress(url: string) {
        const { navigate } = this.props.navigation;
        const match = url.match(/http:\/\/m.qdaily.com\/mobile\/articles\/(.*).html/);
        const articleId = match && match[1];
        if (articleId) {
            navigate('article', { id: articleId });
        } else {
            navigate('ad', { url });
        }
    }

    private renderLoading() {
        return (
            <View style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                justifyContent: 'center', backgroundColor: '#ffffff'
            }}>
                <Image style={{ width: 180, height: 120, alignSelf: 'center' }} source={require('../../res/imgs/pen_pageloading.gif')} />
            </View>
        );
    }

    private renderWebView() {
        const { article } = this.props;
        if (!article) {
            return null;
        }
        return (
            <WebViewBridge
                onLoadEnd={this.onLoadEnd.bind(this)}
                onError={this.onLoadError.bind(this)}
                onBridgeMessage={this.onBridgeMessage.bind(this)}
                onLinkPress={this.onLinkPress.bind(this)}
                source={{ html: article.body, baseUrl: domain }}
            />
        );
    }

    public render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                {this.renderWebView()}
                {this.state.loaded ? null : this.renderLoading()}
            </View>
        );
    }
}

function mapStateToProps(state: AppState, ownProps?: ArticleContainerProps): StateProps {
    const { params } = ownProps.navigation.state;
    const article = state.article.articles[params.id];

    return {
        article: article
    };
}

export default connectComponent({
    LayoutComponent: ArticleContainer,
    mapStateToProps: mapStateToProps
});