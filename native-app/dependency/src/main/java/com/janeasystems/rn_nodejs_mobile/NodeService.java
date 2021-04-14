package com.janeasystems.rn_nodejs_mobile;

// import com.asterinet.react.bgactions.*;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.os.Build;
import java.io.Serializable;
import com.facebook.react.HeadlessJsTaskService;
import android.os.Bundle;
import java.io.*;
import java.util.*;

import android.content.res.AssetManager;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.SharedPreferences;
import android.system.Os;
import android.system.ErrnoException;
// import com.asterinet.react.bgactions.*;

import java.util.concurrent.Semaphore;

public class NodeService extends Service {

    static {
        System.loadLibrary("nodejs-mobile-react-native-native-lib");
        System.loadLibrary("node");
      }
    

    private static final int SERVICE_NOTIFICATION_ID = 92901;
    private static final String CHANNEL_ID = "RN_BACKGROUND_ACTIONS_CHANNEL";

    private Handler handler = new Handler();

    private Runnable runnableCode = new Runnable() {
        @Override
        public void run() {
            Context context = getApplicationContext();
            Intent myIntent = new Intent(context, NodeServiceEvent.class);
            context.startService(myIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
            handler.postDelayed(this, 2000);
        }
    };
    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "INTRALANWIRELESSCOMM", importance);
            channel.setDescription("CHANEL DESCRIPTION");
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.handler.removeCallbacks(this.runnableCode);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        
        final String nodeJsProjectPath = intent.getStringExtra("nodeJsProjectPath");
        final String mainFileName = intent.getStringExtra("mainFileName");
        final String builtinModulesPath = intent.getStringExtra("builtinModulesPath");

        this.handler.post(new Runnable(){
            @Override
            public void run() {
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                    startNodeWithArguments(new String[]{"node",
                    nodeJsProjectPath + "/" + mainFileName
                    },
                    nodeJsProjectPath + ":" + builtinModulesPath,
                    true
                );
                }}).start();
            }
        });

        // createNotificationChannel();

        // Intent notificationIntent = new Intent(this, MainActivity.class);
        // PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Intra LAN Communication")
                .setContentText("Running...")
                // // .setSmallIcon(R.mipmap.ic_launcher)
                // // .setContentIntent(contentIntent)
                .setOngoing(true)
                .build();
        // Notification appNotification = RNBackgroundActionsTask.appNotification;
        startForeground(SERVICE_NOTIFICATION_ID, notification);
        return START_STICKY;
    }
    public native Integer startNodeWithArguments(String[] arguments, String modulesPath, boolean option_redirectOutputToLogcat);

}
