package com.rnsharesdk;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.WritableMap;
import com.mob.MobSDK;
import com.mob.tools.utils.Hashon;
import com.mr4iot.astroreality.utils.MapWriter;

import java.util.HashMap;

import cn.sharesdk.framework.Platform;
import cn.sharesdk.framework.Platform.ShareParams;
import cn.sharesdk.framework.PlatformActionListener;
import cn.sharesdk.framework.ShareSDK;

public class ShareSDKManagerAndroid extends ReactContextBaseJavaModule {

    private ReactApplicationContext context;
    private static boolean DEBUG = false;
    private static boolean disableSSO = false;

    public ShareSDKManagerAndroid(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        context = reactApplicationContext;
        MobSDK.init(context);
        // todo: we must fetch the list first.
        ShareSDK.getPlatformList();
    }

    @Override
    public String getName() {
        return "ShareSDKManagerAndroid";
    }

    @ReactMethod
    public void authorize(int platform, final Promise promise) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.authorize");
        }
        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        plat.setPlatformActionListener(new PlatformActionListener() {
            @Override
            public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
                WritableMap params = Arguments.createMap();
                params.putMap("data", MapWriter.stringToWritableMap(platform.getDb().exportData()));
                promise.resolve(params);
            }

            @Override
            public void onError(Platform platform, int i, Throwable throwable) {
                promise.reject(throwable);
            }

            @Override
            public void onCancel(Platform platform, int i) {
                WritableMap params = Arguments.createMap();
                params.putBoolean("cancel", true);
                promise.resolve(params);
            }
        });
        plat.SSOSetting(disableSSO);
        plat.authorize();
    }

    @ReactMethod
    public void removeAccount(int platform, Promise promise) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.removeAccount");
        }
        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        plat.removeAccount(true);
        promise.resolve(true);
    }

    @ReactMethod
    public void isAuthValid(int platform, Promise promise) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.isAuthValid");
        }
        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        promise.resolve(plat.isAuthValid());
    }

    @ReactMethod
    public void isClientValid(int platform, Promise promise) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.isClientValid");
        }
        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        promise.resolve(plat.isClientValid());
    }

    @ReactMethod
    public void showUser(int platform, final Promise promise) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.showUser");
        }
        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        plat.setPlatformActionListener(new PlatformActionListener() {
            @Override
            public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
                WritableMap params = Arguments.createMap();
                params.putString("data", platform.getDb().exportData());
                promise.resolve(params);
            }

            @Override
            public void onError(Platform platform, int i, Throwable throwable) {
                promise.reject(throwable);
            }

            @Override
            public void onCancel(Platform platform, int i) {
                WritableMap params = Arguments.createMap();
                params.putBoolean("cancel", true);
                promise.resolve(params);
            }
        });
        plat.SSOSetting(disableSSO);
        plat.showUser(null);
    }

    @ReactMethod
    public void share(int platform, ReadableMap content, final Promise promise) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.share");
        }
        String pName = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(pName);
        plat.setPlatformActionListener(new PlatformActionListener() {
            @Override
            public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
                WritableMap params = Arguments.createMap();
                if(hashMap != null){
                    params.putMap("data", MapWriter.mapToWritableMap(hashMap));
                }
                promise.resolve(params);
            }

            @Override
            public void onError(Platform platform, int i, Throwable throwable) {
                promise.reject(throwable);
            }

            @Override
            public void onCancel(Platform platform, int i) {
                WritableMap params = Arguments.createMap();
                params.putBoolean("cancel", true);
                promise.resolve(params);
            }
        });
        plat.SSOSetting(disableSSO);

        try {
            Hashon hashon = new Hashon();
            if (DEBUG) {
                System.out.println("share content ==>>" + ((ReadableNativeMap)content).toHashMap().toString());
            }
            HashMap<String, Object> data = ((ReadableNativeMap)content).toHashMap();
            if(data.containsKey("shareType")) {
                data.put("shareType", new Double((double)data.get("shareType")).intValue());
            }

            ShareParams sp = new ShareParams(data);
            //不同平台，分享不同内容
            if (data.containsKey("customizeShareParams")) {
                final HashMap<String, String> customizeSP = (HashMap<String, String>) data.get("customizeShareParams");
                if (customizeSP.size() > 0) {
                    String pID = String.valueOf(platform);
                    if (customizeSP.containsKey(pID)) {
                        String cSP = customizeSP.get(pID);
                        if (DEBUG) {
                            System.out.println("share content ==>>" + cSP);
                        }
                        data = hashon.fromJson(cSP);
                        for (String key : data.keySet()) {
                            sp.set(key, data.get(key));
                        }
                    }
                }
            }
            plat.share(sp);
        } catch (Throwable t) {
            promise.reject(t);
        }
    }

    @ReactMethod
    public void getFriendList(int platform, int count, int page, final Promise promise) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.getFriendList");
        }
        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        plat.setPlatformActionListener(new PlatformActionListener() {
            @Override
            public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
                WritableMap params = Arguments.createMap();
                if(hashMap != null){
                    params.putMap("data",MapWriter.mapToWritableMap(hashMap));
                }
                promise.resolve(params);
            }

            @Override
            public void onError(Platform platform, int i, Throwable throwable) {
                promise.reject(throwable);
            }

            @Override
            public void onCancel(Platform platform, int i) {
                WritableMap params = Arguments.createMap();
                params.putBoolean("cancel", true);
                promise.resolve(params);
            }
        });
        plat.SSOSetting(disableSSO);
        plat.listFriend(count, page, null);
    }

    @ReactMethod
    public void followFriend(int platform, String account, final Promise promise) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.followFriend");
        }

        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        plat.setPlatformActionListener(new PlatformActionListener() {
            @Override
            public void onComplete(Platform platform, int i, HashMap<String, Object> hashMap) {
                WritableMap params = Arguments.createMap();
                params.putBoolean("cancel", false);
                promise.resolve(params);
            }

            @Override
            public void onError(Platform platform, int i, Throwable throwable) {
                promise.reject(throwable);
            }

            @Override
            public void onCancel(Platform platform, int i) {
                WritableMap params = Arguments.createMap();
                params.putBoolean("cancel", true);
                promise.resolve(params);
            }
        });
        plat.SSOSetting(disableSSO);
        plat.followFriend(account);
    }

    @ReactMethod
    public void getAuthInfo(int platform, Promise promise) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.getAuthInfo");
        }

        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        HashMap<String, Object> map = new HashMap<String, Object>();
        if(plat.isAuthValid()){
            promise.resolve(MapWriter.stringToWritableMap(plat.getDb().exportData()));
        } else {
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void disableSSOWhenAuthorize(boolean open){
        disableSSO = open;
    }
}
