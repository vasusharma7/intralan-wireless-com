import PushNotification from "react-native-push-notification";

global.config.fireCallsNotification = () => {
  if (!global.config.background) return;
  //   PushNotification.ca;
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "call-channel",
    // smallIcon: "lock", // (optional) default: "ic_notification" with fallback for "ic_launcher"
    bigText: "Open IntraLANCom app to receive Call", // (optional) default: "message" prop
    // subText: "Please Stay Indoors", // (optional) default: none
    vibrate: true, // (optional) default: true
    vibration: 10, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    // tag: "Please stay Indoors", // (optional) add tag to message
    group: "group", // (optional) add group to message
    ongoing: false, // (optional) set whether this is an "ongoing" notification
    priority: "high", // (optional) set notification priority, default: high
    visibility: "private", // (optional) set notification visibility, default: private
    importance: "high", // (optional) set notification importance, default: high
    allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
    /* iOS and Android properties */
    title: "Incoming Call ", // (optional)
    message: "", // (required)
    playSound: true, // (optional) default: true
    // soundName: 'android.resource://com.reactnativemapview/raw/woosh', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    soundName: "default",
    number: 4, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    // actions: '["Accept","Reject"]', // (Android only) See the doc for notification actions to know more
  });
};

global.config.fireMessageNotification = () => {
  if (!global.config.background) return;
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "message-channel",
    // smallIcon: "lock", // (optional) default: "ic_notification" with fallback for "ic_launcher"
    bigText: "Tap the banner to see the message", // (optional) default: "message" prop
    // subText: "Please Stay Indoors", // (optional) default: none
    vibrate: true, // (optional) default: true
    vibration: 10, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    // tag: "Please stay Indoors", // (optional) add tag to message
    group: "group", // (optional) add group to message
    ongoing: false, // (optional) set whether this is an "ongoing" notification
    priority: "high", // (optional) set notification priority, default: high
    visibility: "private", // (optional) set notification visibility, default: private
    importance: "high", // (optional) set notification importance, default: high
    allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)

    /* iOS and Android properties */
    title: "New Message received", // (optional)
    message: "", // (required)
    playSound: true, // (optional) default: true
    // soundName: 'android.resource://com.reactnativemapview/raw/woosh', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    soundName: "default",
    number: 4, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    // actions: '["Accept","Reject"]', // (Android only) See the doc for notification actions to know more
  });
};

global.config.fireFileNotification = () => {
  if (!global.config.background) return;
  PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "file-channel",
    // smallIcon: "lock", // (optional) default: "ic_notification" with fallback for "ic_launcher"
    bigText: "Tap the banner to grant/revoke permission", // (optional) default: "message" prop
    // subText: "Please Stay Indoors", // (optional) default: none
    vibrate: true, // (optional) default: true
    vibration: 10, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    // tag: "Please stay Indoors", // (optional) add tag to message
    group: "group", // (optional) add group to message
    ongoing: false, // (optional) set whether this is an "ongoing" notification
    priority: "high", // (optional) set notification priority, default: high
    visibility: "private", // (optional) set notification visibility, default: private
    importance: "high", // (optional) set notification importance, default: high
    allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)

    /* iOS and Android properties */
    title: "File Transfer Permission Request", // (optional)
    message: "", // (required)
    playSound: true, // (optional) default: true
    // soundName: 'android.resource://com.reactnativemapview/raw/woosh', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    soundName: "default",
    number: 4, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    // actions: '["Accept","Reject"]', // (Android only) See the doc for notification actions to know more
  });
};
