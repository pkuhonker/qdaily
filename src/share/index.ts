import { Share as RNShare, Platform, NativeModules } from 'react-native';
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

export enum ShareType {
    SHARE_TEXT = 1,
    SHARE_IMAGE = 2,
    SHARE_WEBPAGE = 4,
    SHARE_MUSIC = 5,
    SHARE_VIDEO = 6,
    SHARE_APPS = 7,
    SHARE_FILE = 8,
    SHARE_EMOJI = 9,
    SHARE_ZHIFUBAO = 10,
    SHARE_WXMINIPROGRAM = 11
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

    constructor() {
    }

    public registerApp(appkey: string, activePlatforms: any[], totalPlatforms: any[]) {
        if (Platform.OS === 'ios') {
            ShareSDKManagerIOS.registerApp(appkey, activePlatforms, totalPlatforms);
        }
    }

    public share(platformType: PlatformType, shareParams: Object): Promise<any> {
        if (Platform.OS === 'ios') {
            return ShareSDKManagerIOS.share(platformType, shareParams);
        } else {
            return ShareSDKManagerAndroid.share(platformType, shareParams);
        }
    }

    public async authorize(platformType: PlatformType) {
        if (Platform.OS === 'ios') {
            return ShareSDKManagerIOS.authorize(platformType);
        } else {
            return ShareSDKManagerAndroid.authorize(platformType);
        }
    }

    public async isAuthValid(platformType: PlatformType): Promise<boolean> {
        if (Platform.OS === 'ios') {
            return ShareSDKManagerIOS.hasAuthorized(platformType);
        } else {
            return ShareSDKManagerAndroid.isAuthValid(platformType);
        }
    }

    public async cancelAuthorize(platformType: PlatformType): Promise<boolean> {
        if (Platform.OS === 'ios') {
            return ShareSDKManagerIOS.cancelAuthorize(platformType);
        } else {
            return ShareSDKManagerAndroid.removeAccount(platformType);
        }
    }

    public async isClientValid(platformType: PlatformType): Promise<boolean> {
        if (Platform.OS === 'ios') {
            return ShareSDKManagerIOS.isClientValid(platformType);
        } else {
            return ShareSDKManagerAndroid.isClientValid(platformType);
        }
    }

    public async getUserInfo(platformType: PlatformType) {
        if (Platform.OS === 'ios') {
            return ShareSDKManagerIOS.getUserInfo(platformType);
        } else {
            return ShareSDKManagerAndroid.getAuthInfo(platformType);
        }
    }
}

export const shareSDK = new ShareSDK();

export const defaultItems = {
    wechat: {
        type: 'wechat',
        icon: require('../../res/imgs/share/icon_share_wechat.png'),
        openShare: async content => {
            const valid = await shareSDK.isClientValid(PlatformType.Wechat);
            if (!valid) {
                throw new Error('您未安装微信');
            } else {
                return await shareSDK.share(PlatformType.Wechat, {
                    shareType: ShareType.SHARE_WEBPAGE,
                    url: content.url,
                    title: content.title,
                    text: content.text,
                    imageUrl: content.image
                });
            }
        }
    } as ShareItem,
    wechatfriends: {
        type: 'wechatfriends',
        icon: require('../../res/imgs/share/icon_share_wechatfriends.png'),
        openShare: async content => {
            const valid = await shareSDK.isClientValid(PlatformType.Wechat);
            if (!valid) {
                throw new Error('您未安装微信');
            } else {
                return await shareSDK.share(PlatformType.WechatMoments, {
                    shareType: ShareType.SHARE_WEBPAGE,
                    url: content.url,
                    title: content.title,
                    text: content.text,
                    imageUrl: content.image
                });
            }
        }
    } as ShareItem,
    qq: {
        type: 'qq',
        icon: require('../../res/imgs/share/icon_share_qq.png'),
        openShare: async content => {
            const valid = await shareSDK.isClientValid(PlatformType.QQ);
            if (!valid) {
                throw new Error('您未安装QQ');
            } else {
                return await shareSDK.share(PlatformType.QQ, {
                    url: content.url,
                    titleUrl: content.url,
                    title: content.title,
                    text: content.text,
                    imageUrl: content.image
                });
            }
        }
    } as ShareItem,
    weibo: {
        type: 'weibo',
        icon: require('../../res/imgs/share/icon_share_weibo.png'),
        openShare: async content => {
            const valid = await shareSDK.isClientValid(PlatformType.SinaWeibo);
            if (!valid) {
                throw new Error('您未安装微博');
            } else {
                return await shareSDK.share(PlatformType.SinaWeibo, {
                    text: '#通晓# ' + content.title + '\n' + content.url,
                    imageUrl: content.image
                });
            }
        }
    } as ShareItem,
    evernote: {
        type: 'evernote',
        icon: require('../../res/imgs/share/icon_share_evernote.png'),
        openShare: async content => {
            const valid = await shareSDK.isClientValid(PlatformType.Evernote);
            if (!valid) {
                throw new Error('您未安装印象笔记');
            } else {
                return await shareSDK.share(PlatformType.Evernote, {
                    url: content.url,
                    titleUrl: content.url,
                    title: content.title,
                    text: content.text,
                    imageUrl: content.image
                });
            }
        }
    } as ShareItem,
    more: {
        type: 'more',
        icon: require('../../res/imgs/share/icon_share_more.png'),
        openShare: async content => {
            const message = content.title + '\n' + content.url;
            const result = await RNShare.share({ title: content.title, message: message }, { dialogTitle: message });
            if ((<any>result).action === RNShare.dismissedAction) {
                return null;
            } else {
                return result;
            }
        }
    } as ShareItem,
};