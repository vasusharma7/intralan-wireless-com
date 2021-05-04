<h1 align="center">
	IntraLAN-Wireless-Com
</h1>

<h4 align="center">
  Communication and Data Sharing within LAN
</h4>
  <div align="center">
<img src="intra_lan_web/public/favicon.ico">
  </div>
<div align="center">
<img src="https://img.shields.io/badge/Made%20By-VS%20AN-blue">
<img src="https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/images/faux-shield-badge-os-logos.svg?sanitize=true" alt="NetCon - OS Support">
  <a href="https://github.com/vasusharma7/intralan-wireless-com/blob/master/LICENSE"><img src=https://img.shields.io/github/license/sourcerer-io/sourcerer-app.svg?colorB=ff0000></a>
</div>

<b>IntraLAN Wireless Com</b> or <b>NetCon</b> is a communication and data sharing application that can be used for effective communication over local area networks without having to route data via the public internet. This serves significant benefits in comparison to traditional networking in the form of speed, security and connectivity, The solution is a cross platform client that can be used across devices and operating systems in an easy and convenient manner.

<div align="center">
<b>Find it live  <a href="https://play.google.com/store/apps/details?id=com.vasusharma7.intralancom">here</a></b>  
</div>

<!-- ## Demo Video for the project

https://user-images.githubusercontent.com/40715071/116125931-b175b380-a6e3-11eb-922d-00540561be80.mp4 

-->

## Contents :dart:

- [Project Structure](#project-structure)
- [Features](#features)
- [Building](#building)
- [Authors](#authors)
- [Contributing](#contributing)

- ### Project Structure :pushpin:

  - `native-app/` Contains the source code for the Android and iOS clients. The directory contains the JavaScript code in React Native and the Android build for the same.
  - `intralan-web/` Contains the web client written in React and the corresponding desktop client ported via electron.

- ### Features :page_with_curl:

  - <b>Phone Calls</b>
    End to end encrypted calls that do not require internet connection and are fast and reliable. Say goodbye to dropped connections. :)
  - <b>Chats</b>
    Safely send and recieve messages without sending them to places that you dont intend to. No database and hence all your data is in your hands. :lock:
  - <b>File Sharing</b>
    Send any files of any size at fast speeds between any devices. Next time you have notes to send, NetCon has got you covered. :file_folder:

- ### Building :wrench:

  - #### Running the mobile version :iphone:

    ##### Prerequistes

    - Android SDK v28 installed
    - ndk bundle <a href="https://dl.google.com/android/repository/android-ndk-r21b-linux-x86_64.zip">Download from here</a>
    - Extract and copy the downloaded ndk files to the `/home/user/Android/Sdk/ndk` folder

    ##### Steps

    - Start by cloning the repository.
    - Since React Native does not run in a nodejs environment, an external package for using nodejs and hence the HTTP server for broadcasting is used by the application.
    - Once cloned, navigate to the `native-app` directory.
    - Run `npm i` to install all dependencies.
    - Navigate to `nodejs-assets/nodejs-project` and run `npm i` to install the dependencies for the nodejs package for React Native.
    - Go back to the `native-app/` directory and make a file called `local.properties` and add the following lines to it:

      ```sh
      sdk.dir=/home/<user>/Android/Sdk
      ndk.dir=/home/<user>/Android/Sdk/ndk/android-ndk-r21b

      Replace the <user> with your username
      ```

    - Next step is to copy the files in the `native-app/dependency` directory to the `native-app/node_modules/nodejs-mobile-react-native/android/` directory. Replace the src folder with the one from dependency.
    - Once all this is done, go to the `native-app/android/` folder and run the following:

      ```sh
      chmod +x gradlew
      ./gradlew clean
      ```

    - Connect your phone via USB to the computer and make sure that USB debugging is enabled. Verify that the device is connected using `adb devices` command in the terminal.
    - Run `npx react-native run-android` with the phone connected. This should start building the application
    - Open another terminal and run `react-native start` to fire the development server.
    - Once the build is completed, the application should be installed on your device.
    - Open the app and shake your device to open the developer settings. Alternately you can also press d on the terminal to start it. Go to settings -> debug server host & port -> and add your laptops ip followed by port number. Eg: `192.168.1.20:8081`
    - The application can now be hot reloaded and the changes will be built and sent over the network.

  - #### Running the web/desktop client :computer:

    The web client is written in React and the desktop client is ported in electron. The following steps can be followed to build the clients:

    ```sh
        cd intralan/web/
        # Install dependencies for the frontend
        npm i

        cd src/backend
        # Install dependencies for the backend
        npm i

        # Start the backend server
        nodemon server.js

        cd ..
        # Start the frontend
        npm start

        # For running the desktop client
        npm run electron-dev

    ```

    - After successfully completing the above steps, the application should be up locally on port `3000` and the peer server should be up on port `5000`
    - Additionally, the electron window should start in case the last command was run.

- ### Authors :pencil2:

  1. [Vasu Sharma](https://github.com/vasusharma7)
  2. [Anup Nair](https://github.com/AnupNair08)
  <!-- 3. [Tanaya Jadhav](https://github.com/tanayajadhav1105) -->

- ### Contributing :memo:

  Pull requests are welcome.
