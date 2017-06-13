export interface HomeState {
    user: any;
}

const initialState: HomeState = {
    user: {}
};

export default function (state = initialState, action: any) {
    return state;
};