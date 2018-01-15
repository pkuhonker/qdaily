import * as React from 'react';
import RootSiblings from 'react-native-root-siblings';
import { View, Text, Animated, ActivityIndicator, StyleSheet, ViewStyle, TextStyle, Dimensions, Platform } from 'react-native';

export enum ToastDuration {
    SHORT,
    LONG,
    INFINITE
}

export enum ToastPosition {
    TOP,
    CENTER,
    BOTTOM
}

export enum ToastType {
    NONE,
    ANIM,
    LOADING
}

interface ToastContainerProps {
    type?: ToastType;
    content?: string;
    onClose?: () => void;
    duration?: ToastDuration;
}

interface ToastContainerState {
    fadeAnim: Animated.Value;
}

class ToastContainer extends React.Component<ToastContainerProps, ToastContainerState> {

    private anim: Animated.CompositeAnimation;

    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0)
        };
    }

    public componentDidMount() {
        const { onClose, duration } = this.props;
        const animArr = [];

        animArr.push(Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 200
        }));

        if (duration !== ToastDuration.INFINITE) {
            animArr.push(Animated.delay(duration === ToastDuration.SHORT ? 1000 : 2000));
            animArr.push(Animated.timing(this.state.fadeAnim, {
                toValue: 0,
                duration: 200
            }));
        }

        this.anim = Animated.sequence(animArr);
        this.anim.start(() => {
            if (duration !== ToastDuration.INFINITE) {
                this.anim = null;
                if (onClose) {
                    onClose();
                }
            }
        });
    }

    public componentWillUnmount() {
        if (this.anim) {
            this.anim.stop();
            this.anim = null;
        }
    }

    public render() {
        const { type, content } = this.props;
        let icon: JSX.Element;
        if (type === ToastType.LOADING) {
            icon = (
                <ActivityIndicator
                    animating
                    style={styles.centering}
                    color='#fff'
                    size={Platform.OS === 'android' ? 30 : 'large'}
                >
                </ActivityIndicator>
            );
        }
        
        return (
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <Animated.View style={{ opacity: this.state.fadeAnim }}>
                        <View style={[styles.innerWrap, icon ? styles.iconToast : styles.textToast]}>
                            {icon}
                            {content ? <Text style={styles.content}>{content}</Text> : null}
                        </View>
                    </Animated.View>
                </View>
            </View>
        );
    }
}

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: width,
        height: height,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    } as ViewStyle,
    innerContainer: {
        backgroundColor: 'transparent',
    } as ViewStyle,
    innerWrap: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .8)',
        minWidth: 100,
    } as ViewStyle,
    iconToast: {
        borderRadius: 7,
        padding: 15,
    } as ViewStyle,
    textToast: {
        borderRadius: 3,
        paddingVertical: 9,
        paddingHorizontal: 15,
    } as ViewStyle,
    content: {
        color: '#ffffff',
        fontSize: 15,
    } as TextStyle,
    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 9,
    } as ViewStyle,
});

let currentToast: RootSiblings;

function notice(
    content: string,
    type: ToastType = ToastType.LOADING,
    duration: ToastDuration = ToastDuration.SHORT,
    position: ToastPosition = ToastPosition.CENTER
) {
    hide();
    currentToast = new RootSiblings(
        <ToastContainer
            content={content}
            type={type}
            duration={duration}
            onClose={() => hide()}
        />
    );
    return currentToast;
}

export function hide() {
    if (currentToast) {
        currentToast.destroy();
        currentToast = null;
    }
}

export function loading(message?: string, duration: ToastDuration = ToastDuration.INFINITE, position: ToastPosition = ToastPosition.CENTER): void {
    notice(message, ToastType.LOADING, duration, position);
}

export function show(message: string, duration: ToastDuration = ToastDuration.SHORT, position: ToastPosition = ToastPosition.CENTER): void {
    notice(message, ToastType.NONE, duration, position);
}

export default {
    show,
    loading,
    hide
};
