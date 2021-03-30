package com.janeasystems.rn_nodejs_mobile;

import android.content.Intent;
import android.os.Bundle;
import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class NodeServiceEvent extends HeadlessJsTaskService {
    @Nullable
    protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        return new HeadlessJsTaskConfig(
                "NodeServiceEvent",
                extras != null ? Arguments.fromBundle(extras) : Arguments.createMap(),
                5000,
                true);
    }
}