import { Navigator, BackAndroid, Platform, Route } from 'react-native';
import connectComponent from '../utils/connectComponent';
import * as CustomSceneConfigs from './sceneConfig';
import * as _ from 'lodash';

export default class Router {
    private navigator: Navigator;

    constructor(navigator: Navigator) {
        this.navigator = navigator;

        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', () => {
                const routesList = this.navigator.getCurrentRoutes();
                const currentRoute = routesList[routesList.length - 1];
                if (currentRoute.name !== 'home') {
                    navigator.pop();
                    return true;
                }
                return false;
            });
        }
    }

    public push(props: any = {}, route: Route) {
        const routesList = this.navigator.getCurrentRoutes();
        const currentRoute = routesList[routesList.length - 1];
        const nextIndex = <number>currentRoute.index + 1;
        route.props = props;
        route.index = nextIndex;
        route.sceneConfig = route.sceneConfig ? route.sceneConfig : CustomSceneConfigs.customFloatFromRight;
        route.id = _.uniqueId();
        route.component = connectComponent(<any>route.component);
        this.navigator.push(route);
    }

    public pop() {
        this.navigator.pop();
    }
}