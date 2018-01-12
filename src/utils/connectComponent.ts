import * as React from 'react';
import { connect, MapStateToPropsParam, MapDispatchToPropsParam, Options } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../actions';

const options: Options = {
    withRef: true
};

export interface ConnectComponentProps {
    actions: typeof actions;
}

export interface ConnectableComponent<TStateProps, TDispatchProps, TOwnProps> {
    mapStateToProps?: MapStateToPropsParam<TStateProps, TOwnProps>;
    mapDispatchToProps?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>;
    LayoutComponent: React.ComponentClass<any>;
}

export default function connectComponent<TStateProps, TDispatchProps, TOwnProps>(comp: ConnectableComponent<TStateProps, TDispatchProps, TOwnProps>) {
    return connect<TStateProps, TDispatchProps, TOwnProps>(
        comp.mapStateToProps || function (state: any): any {
            return {};
        },
        comp.mapDispatchToProps || function (dispatch: Dispatch<any>): any {
            return {
                actions: bindActionCreators(actions, dispatch)
            };
        },
        undefined,
        options
    )(comp.LayoutComponent);
}