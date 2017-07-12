import { Platform, DeviceEventEmitter, NativeModules, NativeEventEmitter } from 'react-native';

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
    Unknown = 0,    // 未知
    SinaWeibo = 1,    // 新浪微博
    TencentWeibo = 2,    // 腾讯微博
    DouBan = 5,    // 豆瓣
    QZone = 6,    // QQ空间
    Renren = 7,    // 人人网
    Kaixin = 8,    // 开心网
    Facebook = 10,   // Facebook
    Twitter = 11,   // Twitter
    YinXiang = 12,   // 印象笔记
    GooglePlus = 14,   // Google+
    Instagram = 15,   // Instagram
    LinkedIn = 16,   // LinkedIn
    Tumblr = 17,   // Tumblr
    Mail = 18,   // 邮件
    SMS = 19,   // 短信
    Print = 20,   // 打印
    Copy = 21,   // 拷贝
    WechatSession = 22,   // 微信好友
    WechatTimeline = 23,   // 微信朋友圈
    QQFriend = 24,   // QQ好友
    Instapaper = 25,   // Instapaper
    Pocket = 26,   // Pocket
    YouDaoNote = 27,   // 有道云笔记
    Pinterest = 30,   // Pinterest
    Flickr = 34,   // Flickr
    Dropbox = 35,   // Dropbox
    VKontakte = 36,   // VKontakte
    WechatFav = 37,   // 微信收藏
    YiXinSession = 38,   // 易信好友
    YiXinTimeline = 39,   // 易信好友圈
    YiXinFav = 40,   // 易信收藏
    MingDao = 41,   // 明道
    Line = 42,   // 连我
    WhatsApp = 43,   // WhatsApp
    KakaoTalk = 44,   // KakaoTalk
    KakaoStory = 45,   // KakaoStory
    FacebookMessenger = 46,   // FacebookMessenger
    AliPaySocial = 50,   // 支付宝好友
    YiXin = 994,  // 易信系列
    Kakao = 995,  // KaKao
    Evernote = 996,  // 印象笔记
    Wechat = 997,  // 微信
    QQ = 998,  // QQ
    Any = 999   // 任意平台
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

    public getUserInfo(platformType: PlatformType) {
        if (Platform.OS === 'ios') {
            ShareSDKManagerIOS.getUserInfo(platformType);
        } else {
            ShareSDKManagerAndroid.getAuthInfo(platformType);
        }
    }
}

export default new ShareSDK();