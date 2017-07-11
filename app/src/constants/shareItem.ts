export interface ShareItem {
    type: string;
    icon: any;
    onPress?: () => void;
}

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
        icon: require('../../res/imgs/share/icon_share_qq.png')
    } as ShareItem,
    weibo: {
        type: 'weibo',
        icon: require('../../res/imgs/share/icon_share_weibo.png')
    } as ShareItem,
    evernote: {
        type: 'evernote',
        icon: require('../../res/imgs/share/icon_share_evernote.png')
    } as ShareItem,
    more: {
        type: 'more',
        icon: require('../../res/imgs/share/icon_share_more.png')
    } as ShareItem,
};