import { Share as RNShare } from 'react-native';
import { Share } from '../interfaces';

export interface ShareItem {
    type: string;
    icon: any;
    onPress?: (content: Share ) => void;
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
        icon: require('../../res/imgs/share/icon_share_more.png'),
        onPress: content => {
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