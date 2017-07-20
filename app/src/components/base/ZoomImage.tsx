import * as React from 'react';
import {
    Image, ScrollView, Platform, ImageURISource, View,
    NativeSyntheticEvent, NativeScrollEvent, NativeTouchEvent
} from 'react-native';
import PhotoView from 'react-native-photo-view';

export interface ZoomImageProps {
    source: ImageURISource;
    orginWidth: number;
    orginHeight: number;
    maximumZoomScale?: number;
    onTap?: () => void;
    onLongPress?: () => void;
}

interface ZoomImageState {
    layoutWidth: number;
    layputHeight: number;
}

export default class ZoomImage extends React.Component<ZoomImageProps, ZoomImageState> {

    public static defaultProps = {
        maximumZoomScale: 3
    };

    private scrollView: ScrollView;
    private isZoomed: boolean;
    private lastTouchStartNativeEvent: NativeTouchEvent;
    private lastTouchEndTimestamp = 0;
    private lastZoomActionTimestamp = 0;
    private tapTimeout: number = 0;
    private longPressTimeout: number = 0;

    constructor(props: ZoomImageProps) {
        super(props);
        this.state = {
            layoutWidth: props.orginWidth,
            layputHeight: props.orginHeight
        };
    }

    private onLoad() {
        const { orginWidth, orginHeight } = this.props;
        const orginRatio = orginWidth / orginHeight;
        Image.getSize(this.props.source.uri, (w, h) => {
            const imageRatio = w / h;
            if (orginRatio < imageRatio) {
                w = orginWidth;
                h = orginWidth / imageRatio;
            } else {
                h = orginHeight;
                w = orginHeight * imageRatio;
            }

            this.setState({
                layoutWidth: w,
                layputHeight: h
            });
        }, e => { });
    }

    private onTouchStart(e: NativeSyntheticEvent<NativeTouchEvent>) {
        clearTimeout(this.longPressTimeout);
        if (this.isMultiTouch(e)) {
            return;
        }

        this.longPressTimeout = setTimeout(() =>{
            this.onLongPress();
        }, 500);

        this.lastTouchStartNativeEvent = e.nativeEvent;
    }

    private onTouchMove(e: NativeSyntheticEvent<NativeTouchEvent>) {
        if (this.isMoving(e)) {
            clearTimeout(this.longPressTimeout);
        }
    }

    private onTouchEnd(e: NativeSyntheticEvent<NativeTouchEvent>) {
        clearTimeout(this.tapTimeout);
        clearTimeout(this.longPressTimeout);
        if (this.isLongPress(e) || this.isMoving(e) || this.isMultiTouch(e)) {
            return;
        }

        this.lastTouchEndTimestamp = e.nativeEvent.timestamp;

        if (Platform.OS === 'android') {
            return;
        }

        if (this.isSecondTap(e)) {
            const actionToPerform = this.isZoomed ? this.zoomOut : this.zoomIn;
            actionToPerform.bind(this)(e);
        } else {
            this.tapTimeout = setTimeout(() => this.onTap(), 300);
        }
    }

    private onTap() {
        if (this.props.onTap) {
            this.props.onTap();
        }
    }

    private onLongPress() {
        if (this.props.onLongPress) {
            this.props.onLongPress();
        }
    }

    private onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
        this.isZoomed = e.nativeEvent.zoomScale > 1;
    }

    private zoomIn(e: NativeSyntheticEvent<NativeTouchEvent>) {
        const { locationX: x, locationY: y, timestamp } = e.nativeEvent;
        const coords = { x, y, width: 0, height: 0 };

        if (this.isAlreadyZooming(e)) {
            return;
        }

        this.scrollView.scrollResponderZoomTo(coords);
        this.lastZoomActionTimestamp = timestamp;
    }

    private zoomOut(e: NativeSyntheticEvent<NativeTouchEvent>) {
        const { locationX: x, locationY: y, timestamp } = e.nativeEvent;
        const coords = { x, y, width: 10000, height: 10000 };

        if (this.isAlreadyZooming(e)) {
            return;
        };

        this.scrollView.scrollResponderZoomTo(coords);
        this.lastZoomActionTimestamp = timestamp;
    }

    private isMultiTouch(e: NativeSyntheticEvent<NativeTouchEvent>) {
        return e.nativeEvent.touches.length > 1;
    }

    private isMoving(e: NativeSyntheticEvent<NativeTouchEvent>) {
        const { pageX, pageY } = e.nativeEvent;
        const { pageX: lastPageX, pageY: lastPageY } = this.lastTouchStartNativeEvent;

        return pageX !== lastPageX && pageY !== lastPageY;
    }

    private isLongPress(e: NativeSyntheticEvent<NativeTouchEvent>) {
        const { timestamp } = e.nativeEvent;
        const lastTimestamp = this.lastTouchStartNativeEvent.timestamp;
        return timestamp - lastTimestamp >= 300;
    }

    private isSecondTap(e: NativeSyntheticEvent<NativeTouchEvent>) {
        const { timestamp } = e.nativeEvent;
        return timestamp - this.lastTouchEndTimestamp <= 300;
    }

    private isAlreadyZooming(e: NativeSyntheticEvent<NativeTouchEvent>) {
        const { timestamp } = e.nativeEvent;
        return timestamp - this.lastZoomActionTimestamp <= 500;
    }

    public render() {
        if (Platform.OS === 'android') {
            return (
                <View
                    onTouchStart={this.onTouchStart.bind(this)}
                    onTouchEnd={this.onTouchEnd.bind(this)}
                    onTouchMove={this.onTouchMove.bind(this)}
                >
                    <PhotoView
                        maximumZoomScale={this.props.maximumZoomScale}
                        androidScaleType="fitCenter"
                        style={{ width: this.props.orginWidth, height: this.props.orginHeight }}
                        source={this.props.source}
                        onTap={this.onTap.bind(this)}
                    >
                    </PhotoView>
                </View>
            );
        } else {
            const { orginWidth, orginHeight } = this.props;
            const { layoutWidth, layputHeight } = this.state;

            return (
                <ScrollView
                    ref={ref => this.scrollView = ref as any}
                    style={{ width: orginWidth, height: orginHeight }}
                    centerContent
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                    maximumZoomScale={this.props.maximumZoomScale}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onTouchStart={this.onTouchStart.bind(this)}
                    onTouchEnd={this.onTouchEnd.bind(this)}
                    onTouchMove={this.onTouchMove.bind(this)}
                    onScroll={this.onScroll.bind(this)}
                    scrollEventThrottle={100}
                >
                    <Image
                        resizeMode='contain'
                        style={{ width: layoutWidth, height: layputHeight }}
                        source={this.props.source}
                        onLoad={() => this.onLoad()}
                    />
                </ScrollView>

            );
        }
    }
}