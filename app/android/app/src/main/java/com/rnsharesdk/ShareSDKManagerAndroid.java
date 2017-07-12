package com.rnsharesdk;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.view.View;
import android.text.TextUtils;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.mob.MobSDK;
import com.mob.tools.utils.Hashon;
import android.os.Bundle;
import android.os.Handler.Callback;
import com.mob.tools.utils.UIHandler;
import android.os.Message;

import java.util.HashMap;
import java.util.Map.Entry;

import cn.sharesdk.framework.Platform;
import cn.sharesdk.framework.Platform.ShareParams;
import cn.sharesdk.framework.ShareSDK;

/**
 * Created by jychen on 2016/6/14.
 */
public class ShareSDKManagerAndroid extends ReactContextBaseJavaModule implements Callback {

    private ReactApplicationContext context;
    private static boolean DEBUG = true;
    private static boolean disableSSO = false;


    private static final int MSG_INITSDK = 1;
    private static final int MSG_AUTHORIZE = 2;
    private static final int MSG_SHOW_USER = 3;
    private static final int MSG_SHARE = 4;
    private static final int MSG_ONEKEY_SAHRE = 5;
    private static final int MSG_GET_FRIENDLIST = 6;
    private static final int MSG_FOLLOW_FRIEND = 7;


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
    public void authorize(int platform) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.authorize");
        }
        Message msg = new Message();
        msg.what = MSG_AUTHORIZE;
        msg.arg1 = platform;
        UIHandler.sendMessage(msg, this);
    }

    @ReactMethod
    public void removeAccount(int platform) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.removeAccount");
        }
        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        plat.removeAccount(true);
    }

    @ReactMethod
    public boolean isAuthValid(int platform) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.isAuthValid");
        }
        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        return plat.isAuthValid();
    }

    @ReactMethod
    public boolean isClientValid(int platform) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.isClientValid");
        }
        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        return plat.isClientValid();
    }

    @ReactMethod
    public void showUser(int platform) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.showUser");
        }
        Message msg = new Message();
        msg.what = MSG_SHOW_USER;
        msg.arg1 = platform;
        UIHandler.sendMessage(msg, this);
    }

    @ReactMethod
    public void share(int platform, String content) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.share");
        }
        Message msg = new Message();
        msg.what = MSG_SHARE;
        msg.arg1 = platform;
        msg.obj = content;
        UIHandler.sendMessage(msg, this);
    }

    @ReactMethod
    public void getFriendList(int platform, int count, int page) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.getFriendList");
        }
        Message msg = new Message();
        msg.what = MSG_GET_FRIENDLIST;
        msg.arg1 = platform;
        Bundle data = new Bundle();
        data.putInt("page", page);
        data.putInt("count", count);
        msg.setData(data);
        UIHandler.sendMessage(msg, this);
    }

    @ReactMethod
    public void followFriend(int platform, String account) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.followFriend");
        }

        Message msg = new Message();
        msg.what = MSG_FOLLOW_FRIEND;
        msg.arg1 = platform;
        msg.obj = account;
        UIHandler.sendMessage(msg, this);
    }

    @ReactMethod
    public String getAuthInfo(int platform) {
        if (DEBUG) {
            System.out.println("ShareSDKUtils.getAuthInfo");
        }

        String name = ShareSDK.platformIdToName(platform);
        Platform plat = ShareSDK.getPlatform(name);
        Hashon hashon = new Hashon();
        HashMap<String, Object> map = new HashMap<String, Object>();
        if(plat.isAuthValid()){
            map.put("expiresIn", plat.getDb().getExpiresIn());
            map.put("expiresTime", plat.getDb().getExpiresTime());
            map.put("token", plat.getDb().getToken());
            map.put("tokenSecret", plat.getDb().getTokenSecret());
            map.put("userGender", plat.getDb().getUserGender());
            map.put("userID", plat.getDb().getUserId());
            map.put("openID", plat.getDb().get("openid"));
            map.put("userName", plat.getDb().getUserName());
            map.put("userIcon", plat.getDb().getUserIcon());
        }
        return hashon.fromHashMap(map);
    }

    @ReactMethod
    public void disableSSOWhenAuthorize(boolean open){
        disableSSO = open;
    }

    @SuppressWarnings("unchecked")
    public boolean handleMessage(Message msg) {
        switch (msg.what) {
            case MSG_INITSDK: {
                if (DEBUG) {
                    System.out.println("ShareSDKUtils.setPlatformConfig");
                }
                String configs = (String) msg.obj;
                Hashon hashon = new Hashon();
                HashMap<String, Object> devInfo = hashon.fromJson(configs);
                for(Entry<String, Object> entry: devInfo.entrySet()){
                    String p = ShareSDK.platformIdToName(Integer.parseInt(entry.getKey()));
                    if (p != null) {
                        if (DEBUG) {
                            System.out.println(p + " ==>>" + new Hashon().fromHashMap((HashMap<String, Object>)entry.getValue()));
                        }
                        ShareSDK.setPlatformDevInfo(p, (HashMap<String, Object>)entry.getValue());
                    }
                }
            }
            break;
            case MSG_AUTHORIZE: {
                int platform = msg.arg1;
                String name = ShareSDK.platformIdToName(platform);
                Platform plat = ShareSDK.getPlatform(name);
                plat.setPlatformActionListener(new ShareSDKPlatformListener(context));
                plat.SSOSetting(disableSSO);
                plat.authorize();
            }
            break;
            case MSG_SHOW_USER: {
                int platform = msg.arg1;
                System.out.println("平台名字"+platform);
                String name = ShareSDK.platformIdToName(platform);
                System.out.println("平台名字"+name);
                Platform plat = ShareSDK.getPlatform(name);
                plat.setPlatformActionListener(new ShareSDKPlatformListener(context));
                plat.SSOSetting(disableSSO);
                plat.showUser(null);
            }
            break;
            case MSG_SHARE: {
                int platformID = msg.arg1;
                String content = (String) msg.obj;
                String pName = ShareSDK.platformIdToName(platformID);
                Platform plat = ShareSDK.getPlatform(pName);
                plat.setPlatformActionListener(new ShareSDKPlatformListener(context));
                plat.SSOSetting(disableSSO);

                try {
                    Hashon hashon = new Hashon();
                    if (DEBUG) {
                        System.out.println("share content ==>>" + content);
                    }
                    HashMap<String, Object> data = hashon.fromJson(content);



                    ShareParams sp = new ShareParams(data);
                    //不同平台，分享不同内容
                    if (data.containsKey("customizeShareParams")) {
                        final HashMap<String, String> customizeSP = (HashMap<String, String>) data.get("customizeShareParams");
                        if (customizeSP.size() > 0) {
                            String pID = String.valueOf(platformID);
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
                    new ShareSDKPlatformListener(context).onError(plat, Platform.ACTION_SHARE, t);
                }
            }
            break;
            case MSG_GET_FRIENDLIST:{
                int platform = msg.arg1;
                int page = msg.getData().getInt("page");
                int count = msg.getData().getInt("count");
                String name = ShareSDK.platformIdToName(platform);
                Platform plat = ShareSDK.getPlatform(name);
                plat.setPlatformActionListener(new ShareSDKPlatformListener(context));
                plat.SSOSetting(disableSSO);
                plat.listFriend(count, page, null);
            }
            break;
            case MSG_FOLLOW_FRIEND:{
                int platform = msg.arg1;
                String account = (String) msg.obj;
                String name = ShareSDK.platformIdToName(platform);
                Platform plat = ShareSDK.getPlatform(name);
                plat.setPlatformActionListener(new ShareSDKPlatformListener(context));
                plat.SSOSetting(disableSSO);
                plat.followFriend(account);
            }
            break;
        }
        return false;
    }

}
