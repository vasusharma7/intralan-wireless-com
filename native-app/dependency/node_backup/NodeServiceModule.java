package com.janeasystems.rn_nodejs_mobile;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class NodeServiceModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "NodeService";
    private static ReactApplicationContext reactContext;

    public NodeServiceModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }
    public ReactApplicationContext getReactContext(){
        return reactContext;
    }
    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startService() {
        this.reactContext.startService(new Intent(this.reactContext, NodeService.class));
    }

    @ReactMethod
    public void stopService() {
        this.reactContext.stopService(new Intent(this.reactContext, NodeService.class));
    }
}
