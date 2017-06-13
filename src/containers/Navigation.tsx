import * as React from 'react';
import { Navigator, ViewProperties, Route, SceneConfig } from 'react-native';
import Router from '../configs/Router';
import Home from './Home';

const initialRoute: Route = {
    name: 'home',
    index: 0,
    component: Home,
    id: "0"
};

export default class Navigation extends React.Component<any, any> {

    private navigator: React.Component<any, any>;
    private router: Router;
    private routeViews: { [index: number]: React.Component<any, any> };

    constructor(props: any) {
        super(props);
        this.routeViews = {};
    }

    private renderScene({ component, name, props, id, index }: Route, navigator: Navigator): React.ReactElement<ViewProperties> | undefined {
        this.router = this.router || new Router(navigator);
        if (component) {
            return React.createElement(component, {
                ...props,
                ref: view => this.routeViews[index as number] = view,
                router: this.router,
                route: {
                    name,
                    id,
                    index
                }
            });
        }
        return undefined;
    }

    private configureScene(route: Route): SceneConfig {
        if (route.sceneConfig) {
            return route.sceneConfig;
        }
        return Navigator.SceneConfigs.FloatFromRight;
    }

    public render() {
        return (
            <Navigator
                ref={view => this.navigator = view}
                initialRoute={initialRoute}
                configureScene={this.configureScene.bind(this)}
                renderScene={this.renderScene.bind(this)}
            />
        );
    }
}
