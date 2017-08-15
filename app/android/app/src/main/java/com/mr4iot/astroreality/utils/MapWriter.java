package com.mr4iot.astroreality.utils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.Map;

public final class MapWriter {

    public static WritableMap mapToWritableMap(Map<String, Object> map) {
        JSONObject json = new JSONObject(map);
        return jsonToWritableMap(json);
    }

    public static WritableMap stringToWritableMap(String jsonString) {
        JSONObject json = null;
        try {
            json = new JSONObject(jsonString);
        } catch (JSONException e) {
            return Arguments.createMap();
        }
        return jsonToWritableMap(json);
    }

    public static WritableMap jsonToWritableMap(JSONObject jsonObject) {
        WritableMap writableMap = Arguments.createMap();

        if (jsonObject == null) {
            return null;
        }


        Iterator<String> iterator = jsonObject.keys();
        if (!iterator.hasNext()) {
            return null;
        }


        try {
            while (iterator.hasNext()) {
                String key = iterator.next();
                Object value = jsonObject.get(key);
                if (value == null) {
                    writableMap.putNull(key);
                } else if (value instanceof Boolean) {
                    writableMap.putBoolean(key, (Boolean) value);
                } else if (value instanceof Integer) {
                    writableMap.putInt(key, (Integer) value);
                } else if (value instanceof Double) {
                    writableMap.putDouble(key, (Double) value);
                } else if (value instanceof String) {
                    writableMap.putString(key, (String) value);
                } else if (value instanceof JSONObject) {
                    writableMap.putMap(key, jsonToWritableMap((JSONObject) value));
                } else if (value instanceof JSONArray) {
                    writableMap.putArray(key, jsonArrayToWritableArray((JSONArray) value));
                }
            }
        } catch (JSONException ex){
            // Do nothing and fail silently
        }

        return writableMap;
    }

    private static WritableArray jsonArrayToWritableArray(JSONArray jsonArray) {
        WritableArray writableArray = Arguments.createArray();

        try {
            if (jsonArray == null) {
                return null;
            }

            if (jsonArray.length() <= 0) {
                return null;
            }

            for (int i = 0 ; i < jsonArray.length(); i++) {
                Object value = jsonArray.get(i);
                if (value == null) {
                    writableArray.pushNull();
                } else if (value instanceof Boolean) {
                    writableArray.pushBoolean((Boolean) value);
                } else if (value instanceof Integer) {
                    writableArray.pushInt((Integer) value);
                } else if (value instanceof Double) {
                    writableArray.pushDouble((Double) value);
                } else if (value instanceof String) {
                    writableArray.pushString((String) value);
                } else if (value instanceof JSONObject) {
                    writableArray.pushMap(jsonToWritableMap((JSONObject) value));
                } else if (value instanceof JSONArray) {
                    writableArray.pushArray(jsonArrayToWritableArray((JSONArray) value));
                }
            }
        } catch (JSONException e) {
            // Do nothing and fail silently
        }

        return writableArray;
    }
}