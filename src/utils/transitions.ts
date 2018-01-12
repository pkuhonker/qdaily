import { NavigationSceneRendererProps } from 'react-navigation';

export function crossFade(sceneProps: NavigationSceneRendererProps, pushStartOpacity: number = 0, popStartOpacity: number = 0) {
    const { position, scene } = sceneProps;
    const { index } = scene;
    const opacity = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [pushStartOpacity, 1, popStartOpacity]
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