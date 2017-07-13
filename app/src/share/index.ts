import { Share as RNShare, Platform, DeviceEventEmitter, NativeModules, NativeEventEmitter } from 'react-native';
import { Share } from '../interfaces';

const ShareSDKManagerIOS = NativeModules.ShareSDKManager;
const ShareSDKManagerAndroid = NativeModules.ShareSDKManagerAndroid;

export enum AuthType {
    Both = 0,
    SSO = 1,
    Web = 2
}

export enum ContentType {
    Auto = 0,
    Text = 1,
    Image = 2,
    WebPage = 3
}

export enum PlatformType {
    SinaWeibo = 1,    // 新浪微博
    Evernote = 12,  // 印象笔记
    Wechat = 22,  // 微信
    WechatMoments = 23,
    QQ = 24,  // QQ
}

export interface ShareItem {
    type: string;
    icon: any;
    openShare?: (content: Share) => Promise<any>;
}

class ShareSDK {

    private callbacks: ((error: any, cancel: boolean, data: any) => void)[];

    constructor() {
        this.callbacks = [];
        this.registerListener();
    }

    private handleCallback(error: any, cancel: boolean, data: any) {
        while (this.callbacks.length > 0) {
            this.callbacks.pop()(error, cancel, data);
        }
    }

    private registerListener() {
        if (Platform.OS === 'ios') {
            var successListener = new NativeEventEmitter(NativeModules.ShareSDKManager);
            successListener.addListener('success', e => {
                this.handleCallback(null, false, e);
            });

            var failListener = new NativeEventEmitter(NativeModules.ShareSDKManager);
            failListener.addListener('fail', e => {
                this.handleCallback(e, false, null);
            });

            var cancelListener = new NativeEventEmitter(NativeModules.ShareSDKManager);
            cancelListener.addListener('cancel', e => {
                this.handleCallback(null, true, e);
            });
        } else {
            DeviceEventEmitter.addListener('OnComplete', (e) => {
                this.handleCallback(null, false, e);
            });

            DeviceEventEmitter.addListener('OnError', (e) => {
                this.handleCallback(e, false, null);
            });

            DeviceEventEmitter.addListener('OnCancel', (e) => {
                this.handleCallback(null, true, e);
            });
        }
    }

    public registerApp(appkey: string, activePlatforms: any[], totalPlatforms: any[]) {
        if (Platform.OS === 'ios') {
            ShareSDKManagerIOS.registerApp(appkey, activePlatforms, totalPlatforms);
        }
    }

    public share(platformType: PlatformType, shareParams: Object): Promise<any> {
        return new Promise((c, e) => {
            shareParams = JSON.stringify(shareParams);
            if (Platform.OS === 'ios') {
                ShareSDKManagerIOS.share(platformType, shareParams);
            } else {
                ShareSDKManagerAndroid.share(platformType, shareParams);
            }
            this.callbacks.push((error, cancel, data) => {
                if (error) {
                    return e(error);
                } else {
                    return c(cancel ? null : data);
                }
            });
        });
    }

    public authorize(platformType: PlatformType) {
        if (Platform.OS === 'ios') {
            ShareSDKManagerIOS.authorize(platformType);
        } else {
            ShareSDKManagerAndroid.authorize(platformType);
        }
    }

    public hasAuthorized(platformType: PlatformType) {
        if (Platform.OS === 'ios') {
            ShareSDKManagerIOS.hasAuthorized(platformType);
        } else {
            ShareSDKManagerAndroid.isAuthValid(platformType);
        }
    }

    public cancelAuthorize(platformType: PlatformType) {
        if (Platform.OS === 'ios') {
            ShareSDKManagerIOS.cancelAuthorize(platformType);
        } else {
            ShareSDKManagerAndroid.removeAccount(platformType);
        }
    }

    public isClientValid(platformType: PlatformType): Promise<boolean> {
        if (Platform.OS === 'ios') {
            return ShareSDKManagerIOS.isClientValid(platformType);
        } else {
            return ShareSDKManagerAndroid.isClientValid(platformType);
        }
    }

    public getUserInfo(platformType: PlatformType) {
        if (Platform.OS === 'ios') {
            ShareSDKManagerIOS.getUserInfo(platformType);
        } else {
            ShareSDKManagerAndroid.getAuthInfo(platformType);
        }
    }
}

export const shareSDK = new ShareSDK();

export const defaultItems = {
    wechat: {
        type: 'wechat',
        icon: require('../../res/imgs/share/icon_share_wechat.png')
    } as ShareItem,
    wechatfriends: {
        type: 'wechatfriends',
        icon: require('../../res/imgs/share/icon_share_wechatfriends.png')
    } as ShareItem,
    qq: {
        type: 'qq',
        icon: require('../../res/imgs/share/icon_share_qq.png'),
        openShare: content => {
            return shareSDK.isClientValid(PlatformType.QQ).then(valid => {
                if (!valid) {
                    return Promise.reject(new Error('您未安装QQ'));
                } else {
                    return shareSDK.share(PlatformType.QQ, {
                        title: content.title,
                        text: content.text,
                        imageUrl: content.image
                    });
                }
            });
        }
    } as ShareItem,
    weibo: {
        type: 'weibo',
        icon: require('../../res/imgs/share/icon_share_weibo.png'),
        openShare: content => {
            return shareSDK.isClientValid(PlatformType.SinaWeibo).then(valid => {
                if (!valid) {
                    return Promise.reject(new Error('您未安装微博'));
                } else {
                    return shareSDK.share(PlatformType.SinaWeibo, {
                        text: '#好奇心日报# ' + content.title + '\n' + content.url,
                        imageUrl: content.image
                    });
                }
            });
        }
    } as ShareItem,
    evernote: {
        type: 'evernote',
        icon: require('../../res/imgs/share/icon_share_evernote.png')
    } as ShareItem,
    more: {
        type: 'more',
        icon: require('../../res/imgs/share/icon_share_more.png'),
        openShare: content => {
            const message = content.title + '\n' + content.url;
            RNShare.share({
                title: content.title,
                message: message
            }, {
                    dialogTitle: message
                });
        }
    } as ShareItem,
};