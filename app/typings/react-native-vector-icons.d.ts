declare module 'react-native-vector-icons/EvilIcons' {
    import { TextProperties } from 'react-native';

    interface IconProperties extends TextProperties {
        name: string;
        size?: number;
        color?: string;
    }

    class Icon extends React.Component<IconProperties, any> {
    }

    const iconSet: typeof Icon;
    export default iconSet;
}

declare module 'react-native-vector-icons/FontAwesome' {
    import { TextProperties } from 'react-native';

    interface IconProperties extends TextProperties {
        name: string;
        size?: number;
        color?: string;
    }

    class Icon extends React.Component<IconProperties, any> {
    }

    const iconSet: typeof Icon;
    export default iconSet;
}