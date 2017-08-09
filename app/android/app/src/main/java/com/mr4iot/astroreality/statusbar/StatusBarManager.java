package com.mr4iot.astroreality.statusbar;

import android.app.Activity;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.modules.statusbar.StatusBarModule;
import com.mr4iot.astroreality.utils.SystemUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

/**
 * Created by xzper on 2017/8/9.
 * http://blog.csdn.net/angcyo/article/details/49834739
 */

public class StatusBarManager extends ReactContextBaseJavaModule {

    private ReactApplicationContext context;

    public StatusBarManager(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        context = reactApplicationContext;
    }

    @Override
    public String getName() {
        return "StatusBarManagerAndroid";
    }

    @ReactMethod
    public void setStyle(final String style) {
        final Activity activity = getCurrentActivity();
        if (activity == null) {
            FLog.w(ReactConstants.TAG, "StatusBarModule: Ignored status bar change, current activity is null.");
            return;
        }
        if (SystemUtils.isMIUI()) {
            this.setMIUIStatusBarDarkMode(style.equals("dark-content"));
        } else if (SystemUtils.isFlyme()) {
            this.setFlymeStatusBarDarkMode(style.equals("dark-content"));
        } else {
            this.context.getNativeModule(StatusBarModule.class).setStyle(style);
        }
    }

    private void setMIUIStatusBarDarkMode(boolean darkmode) {
        Class<? extends Window> clazz = getCurrentActivity().getWindow().getClass();
        try {
            int darkModeFlag = 0;
            Class<?> layoutParams = Class.forName("android.view.MiuiWindowManager$LayoutParams");
            Field field = layoutParams.getField("EXTRA_FLAG_STATUS_BAR_DARK_MODE");
            darkModeFlag = field.getInt(layoutParams);
            Method extraFlagField = clazz.getMethod("setExtraFlags", int.class, int.class);
            extraFlagField.invoke(getCurrentActivity().getWindow(), darkmode ? darkModeFlag : 0, darkModeFlag);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void setFlymeStatusBarDarkMode(boolean darkmode) {
        Window window = getCurrentActivity().getWindow();
        try {
            WindowManager.LayoutParams lp = window.getAttributes();
            Field darkFlag = WindowManager.LayoutParams.class.getDeclaredField("MEIZU_FLAG_DARK_STATUS_BAR_ICON");
            Field meizuFlags = WindowManager.LayoutParams.class.getDeclaredField("meizuFlags");
            darkFlag.setAccessible(true);
            meizuFlags.setAccessible(true);
            int bit = darkFlag.getInt(null);
            int value = meizuFlags.getInt(lp);
            if (darkmode) {
                value |= bit;
            } else {
                value &= ~bit;
            }
            meizuFlags.setInt(lp, value);
            window.setAttributes(lp);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
