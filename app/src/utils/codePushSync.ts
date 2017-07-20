import { NetInfo, Platform } from 'react-native';
import codePush from 'react-native-code-push';

let netInfoInited: boolean = false;

export async function shouldSync(): Promise<boolean> {
    if (!netInfoInited && Platform.OS === 'ios') {
        // see https://github.com/facebook/react-native/issues/8615
        return await new Promise<boolean>((c, e) => {
            async function handleConnectivityChange(isConnected) {
                if (!netInfoInited) {
                    try {
                        const result = await shouldSync();
                        c(result);
                    } catch (error) {
                        c(false)
                    }
                }
                netInfoInited = true;
            }
            NetInfo.isConnected.addEventListener('change', handleConnectivityChange);
        });
    }

    try {
        const reach = await NetInfo.fetch();
        if (__DEV__) { return false; }
        if (Platform.OS === 'ios') {
            return reach === 'wifi';
        } else {
            return ['WIFI', 'VPN'].indexOf(reach) > -1;
        }
    } catch (error) {
        return false;
    }
}

export async function sync() {
    const result = await shouldSync();
    if (result) {
        codePush.sync();
    }
}