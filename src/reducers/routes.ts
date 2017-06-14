import { ActionConst } from 'react-native-router-flux';

interface Scene {
    index: number;
    name: string;
    sceneKey: string;
    parent: string;
    type: string;
}

export interface RoutesState {
    scene: Scene;
}

const initialState: RoutesState = {
    scene: Object.create(null),
};

export default function reducer(state = initialState, action: any) {
    switch (action.type) {
        // focus action is dispatched when a new screen comes into focus
        case ActionConst.FOCUS:
            return {
                ...state,
                scene: action.scene,
            };
        default:
            return state;
    }
};
