import { Dimensions, Navigator } from 'react-native';

const { width } = Dimensions.get('window');

const baseConfig = Navigator.SceneConfigs.FloatFromRight;
const popGestureConfig = Object.assign({}, baseConfig.gestures && baseConfig.gestures.pop, {
    edgeHitWidth: width / 3
});

const bottomConfig = Navigator.SceneConfigs.FloatFromBottom;
const fullPopGestureConfig = Object.assign({}, bottomConfig.gestures && bottomConfig.gestures.pop, {
    edgeHitWidth: width
});

export const customFloatFromRight = Object.assign({}, baseConfig, {
    gestures: {
        pop: popGestureConfig
    }
});

export const customFloatFromBottom = Object.assign({}, Navigator.SceneConfigs.FloatFromBottom, {
    gestures: {
        pop: fullPopGestureConfig
    }
});