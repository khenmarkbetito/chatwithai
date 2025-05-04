# Nexus Chat App

A mobile application for chatting with AI using React Native and Expo.

## Features

- Interactive chat interface with Gemini AI
- Message history persistence
- Suggestions for new users
- Settings for customization
- Copy and clear message functionality
- Dark/light mode support

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI
- (Optional) Android Studio or Xcode for native development

### Installation

1. Clone this repository or download the source code

2. Navigate to the project directory:
```bash
cd chatwithai
```

3. Install dependencies:
```bash
npm install
```

4. Download the required fonts:
   - Go to [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
   - Download the font family
   - Extract the ZIP file
   - Copy `Inter-Regular.ttf`, `Inter-Medium.ttf`, and `Inter-SemiBold.ttf` to the `assets/fonts/` directory

5. Start the development server:
```bash
npm run dev
```

This will start the Expo development server and provide options to run the app on different platforms.

## Building for Android

To build an APK for Android:

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Log in to your Expo account:
```bash
eas login
```

3. Configure the build:
```bash
eas build:configure
```

4. Start the build process:
```bash
npm run build:android
```

Alternatively, for a development build that can be installed on your device:

```bash
eas build -p android --profile development
```

## Project Structure

- `app/` - Contains all the routes and screens
  - `(tabs)/` - Tab-based navigation
    - `chat/` - Chat interface
    - `settings/` - Settings screen
- `components/` - Reusable UI components
- `services/` - API integration and business logic
- `utils/` - Helper functions
- `constants/` - App-wide constants
- `hooks/` - Custom React hooks
- `assets/` - Static assets like fonts and images

## API Integration

The app uses the Gemini API. The API key should be paste in source code but i provided it already.

In a production environment:
1. Use environment variables for the API key
2. Implement proper authentication
3. Consider using a backend to proxy API requests for added security

## Customization

Customize the app by modifying:

- `constants/Colors.ts` - App color scheme
- Fonts and styling in individual component files
- API parameters in `services/GeminiService.ts`
