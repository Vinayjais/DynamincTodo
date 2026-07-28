# Todo List App

A React Native application for managing tasks across multiple todo lists. Built with React Native, Redux Toolkit, and React Navigation.

## Features

- **Multiple Todo Lists**: Create, edit, rename, and delete multiple distinct todo lists (e.g., Work, Personal).
- **Dynamic Todo List**: Create, edit, and toggle completion of tasks within each list.
- **Progress Tracking**: Real-time progress bar tracking the completion rate of tasks.
- **Smart Undo System**: Includes a 10-second time-limited undo window for any deleted tasks.
- **State Persistence**: Global state is managed using Redux Toolkit and persisted locally across app reboots using `AsyncStorage`.
- **Modern Navigation**: Seamless screen transitions handled by `@react-navigation/native-stack`.

## Project Structure

The codebase is organized in a feature-driven architecture for scalability:

```text
todo_list/
├── app/
│   ├── Home.tsx                 # Main application entry/home screen
│   └── screens/                 # Organized by feature domains
│       └── todo/                # Todo list features (TodoListGroups, DynamicTodo, Item)
├── components/                  # Reusable, stateless UI components (e.g., Row.tsx)
├── store/                       # Redux Toolkit setup and global state
│   ├── store.js                 # Redux store configuration
│   └── slices/                  # State slices (todo.tsx)
└── utils/                       # Helper functions and services (NavigationService.js)
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (>= 20.19.4)
- **Watchman** (macOS only)   
- **Ruby** (for iOS Cocoapods)
- **Java Development Kit (JDK)** (for Android)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

Detailed environment setup instructions can be found in the [official React Native documentation](https://reactnative.dev/docs/environment-setup).

## Installation

1. Navigate to the project directory:
   ```bash
   cd todo_list
   ```

2. Install the Node dependencies:
   ```bash
   npm install
   ```

## Setup for iOS (macOS only)

To run the app on iOS, you need to install the necessary native dependencies using CocoaPods.

1. Navigate to the `ios` directory:
   ```bash
   cd ios
   ```

2. Install the required Ruby gems (for CocoaPods):
   ```bash
   bundle install
   ```

3. Install CocoaPods dependencies:
   ```bash
   bundle exec pod install
   ```

4. Return to the root project directory:
   ```bash
   cd ..
   ```

## Setup for Android

Ensure you have an Android Emulator running, or a physical device connected via USB with "USB Debugging" enabled. No additional dependency installation is required specifically for Android, as Gradle will handle it automatically during the build process.

## Running the App

### 1. Start the Metro Bundler

First, you need to start Metro, the JavaScript bundler that ships with React Native.

```bash
npm start
```

### 2. Run the Application

Keep the Metro Bundler terminal running. Open a new terminal window/pane, ensure you are in the project root, and use one of the following commands:

#### To run on Android:
```bash
npm run android
```

#### To run on iOS:
```bash
npm run ios
```

## Troubleshooting

- **Metro Cache:** If you encounter unexpected behavior, try clearing the Metro cache: `npm start -- --reset-cache`.
- **iOS Build Errors:** If iOS builds fail, try navigating to the `ios` directory and running `pod install` again, or open the `ios/todolist.xcworkspace` in Xcode to clean the build folder (`Cmd + Shift + K`).
- **Android Build Errors:** Try navigating to the `android` directory and running `./gradlew clean`, then build again.
