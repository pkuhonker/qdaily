import { NavigationSceneRendererProps } from 'react-navigation';

export function crossFade(sceneProps: NavigationSceneRendererProps) {
    const { position, scene } = sceneProps;
    const { index } = scene;
    const opacity = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [0, 1, 0]
    });
    return { opacity };
}

export function horizontal(sceneProps: NavigationSceneRendererProps) {
    const { position, scene, layout } = sceneProps;
    const { index } = scene;
    const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [layout.initWidth, 0, -layout.initWidth]
    });

    return { transform: [{ translateX }] };
}

export function horizontalCover(sceneProps: NavigationSceneRendererProps) {
    const { position, scene, layout } = sceneProps;
    const { index } = scene;
    const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [layout.initWidth, 0, 0]
    });

    return { transform: [{ translateX }] };
}