import * as React from 'react';
import { View, WebView, Image, NavState } from 'react-native';
import { AppState } from '../reducers';
import { Article } from '../interfaces';
import { domain } from '../constants/config';
import connectComponent, { ConnectComponentProps } from '../utils/connectComponent';

interface ArticleContainerProps {
    articleId: number;
}

interface StateProps {
    article?: Article;
}

interface ArticleContainerState {
    loaded: boolean;
}

type Props = ArticleContainerProps & StateProps & ConnectComponentProps;

class ArticleContainer extends React.Component<Props, ArticleContainerState> {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
    }

    public componentDidMount() {
        if (this.props.article) {
            this.props.actions.getArticleById(this.props.articleId);
        }
    }

    private onLoadEnd() {
        setTimeout(() => {
            this.setState({ loaded: true });
        }, 1000);
    }

    private onLoadError(nav: NavState) {
        console.log('webview load error');
    }

    public render() {
        const { article } = this.props;
        let { loaded } = this.state;
        if (!article) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Image style={{ width: 180, height: 120, alignSelf: 'center' }} source={require('../../res/imgs/pen_pageloading.gif')} />
                </View>
            );
        }
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <WebView
                    style={loaded ? null : { opacity: 0 }}
                    onLoadEnd={this.onLoadEnd.bind(this)}
                    onError={this.onLoadError.bind(this)}
                    source={{ html: article.body, baseUrl: domain }}
                />
                {loaded ? null : <Image style={{ position: 'absolute', width: 180, height: 120, alignSelf: 'center' }} source={require('../../res/imgs/pen_pageloading.gif')} />}
            </View>
        );
    }
}

function mapStateToProps(state: AppState, ownProps?: ArticleContainerProps): StateProps {
    const { articleId } = ownProps;
    const article = state.article.articles[articleId];

    return {
        article: article
    };
}

export default connectComponent({
    LayoutComponent: ArticleContainer,
    mapStateToProps: mapStateToProps
});