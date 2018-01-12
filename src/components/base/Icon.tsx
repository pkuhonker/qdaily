import * as React from 'react';
import { TextProperties } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export interface IconProps extends TextProperties {
    type: 'Ionicons' | 'EvilIcons' | 'FontAwesome' | 'Octicons' | 'SimpleLineIcons';
    name: string;
    size?: number;
    color?: string;
}

export default class Icon extends React.Component<IconProps, any> {

    public render() {
        const { type, ...props } = this.props;
        let IconComponent: React.ComponentClass<any>;
        switch(type) {
            case 'Ionicons':
                IconComponent = Ionicons;
                break;
            case 'EvilIcons':
                IconComponent = EvilIcons;
                break;
            case 'FontAwesome':
                IconComponent = FontAwesome;
                break;
            case 'Octicons':
                IconComponent = Octicons;
                break;
            case 'SimpleLineIcons':
                IconComponent = SimpleLineIcons;
                break;
            default:
                throw new Error('unknown icon type: ' + type);
        }

        return (
            <IconComponent {...props} >
                {this.props.children}
            </IconComponent>
        );
    }
}