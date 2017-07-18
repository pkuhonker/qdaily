import { NetInfo, Platform } from 'react-native';
import codePush from 'react-native-code-push';

let netInfoInited: boolean = false;

export function shouldSync(): Promise<boolean> {
    if (!netInfoInited && Platform.OS === 'ios') {
        // see https://github.com/facebook/react-native/issues/8615
        return new Promise((c, e) => {
            function handleConnectivityChange(isConnected) {
                if (!netInfoInited) {
                    shouldSync().then(result => c(result), error => c(false));
                }
                netInfoInited = true;
            }
            NetInfo.isConnected.addEventListener('change', handleConnectivityChange);
        });
    }
    return NetInfo
        .fetch()
        .then(reach => {
            if (__DEV__) { return false; }
            if (Platform.OS === 'ios') {
                return reach === 'wifi';
            } else {
                return ['WIFI', 'VPN'].indexOf(reach) > -1;
            }
        }, error => false);
}

export function sync() {
    shouldSync().then(result => {
        if (result) {
            codePush.sync();
        }
    });
}