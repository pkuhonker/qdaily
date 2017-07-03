import { NavigationSceneRendererProps } from 'react-navigation';

export function crossFade(sceneProps: NavigationSceneRendererProps) {
    const { position, scene } = sceneProps;
    const { index } = scene;
    const opacity = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [0, 1, 1]
    });
    return { opacity };
}

export function horizontal(sceneProps: NavigationSceneRendererProps) {
    const { position, scene, layout } = sceneProps;
    const { index } = scene;
    const translateY = 0;
    const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [layout.initWidth, 0, -layout.initWidth]
    });

    return { transform: [{ translateX }, { translateY }] };
}

export function horizontalCover(sceneProps: NavigationSceneRendererProps) {
    const { position, scene, layout } = sceneProps;
    const { index } = scene;
    const translateY = 0;
    const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [layout.initWidth, 0, 0]
    });

    return { transform: [{ translateX }, { translateY }] };
}