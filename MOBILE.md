# Development Setup for Android Devices

### Project Structure
- `native-app/` Contains the source code for the android and iOS clients. The directory contains the javascript code in React Native and the android build for the same.
- `intralan-web/` Contains the web client written in React

### Using the mobile version

#### Prerequistes
- Android SDK v28 installed
- ndk bundle <a href="https://dl.google.com/android/repository/android-ndk-r21b-linux-x86_64.zip">Download from here</a>
- Extract and copy the downloaded ndk files to the /home/user/Android/Sdk/ndk folder


#### Steps
- Start by cloning the repository.
- Since React Native does not run in a nodejs environment, an external package for using nodejs and hence the HTTP server for broadcasting is used by the application.
- Once cloned, navigate to the `native-app` directory.
- Run `npm i` to install all dependencies.
- Navigate to `nodejs-assets/nodejs-project` and run `npm i` to install the dependencies for the nodejs package for React Native.
- Go back to the `native-app/` directory and make a file called `local.properties` and add the following lines to it:
```
sdk.dir=/home/<user>/Android/Sdk
ndk.dir=/home/<user>/Android/Sdk/ndk/android-ndk-r21b


Replace the <user> with your username
```
- Next step is to copy the files in the `native-app/dependency` directory to the `native-app/node_modules/nodejs-mobile-react-native/android/` directory. Replace the src folder with the one from dependency.
- Once all this is done, go to the `native-app/android/` folder and run the following:
```
chmod +x gradlew
./gradlew clean
```
- Connect your phone via USB to the computer and make sure that USB debugging is enabled. Verify that the device is connected using `adb devices` command in the terminal.
- Run `npx react-native run-android` with the phone connected. This should start building the application
- Open another terminal and run `react-native start` to fire the development server.
- Once the build is completed, the application should be installed on your device.
- Open the app and shake your device to open the developer settings. Alternately you can also press d on the terminal to start it. Go to settings -> debug server host & port -> and add your laptops ip followed by port number. Eg: 192.168.1.20:8081
- The application can now be hot reloaded and the changes will be built and sent over the network. 

### Updates and Progress
Implemented the calling and file sharing features. The messaging and web client are in works now. 
It takes some time to connect to call....please be patient for a while when you initiate call/transfer files....


