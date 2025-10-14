# My React Native App

A modern React Native application with TypeScript, navigation, and beautiful UI components.

## Features

- 🚀 **React Native 0.72.6** with TypeScript support
- 🧭 **Navigation** using React Navigation v6
- 📱 **Bottom Tab Navigation** with Stack navigators
- 🎨 **Modern UI** with Material Design components
- ⚙️ **Settings Screen** with toggles and preferences
- 👤 **Profile Screen** with user information
- 🏠 **Home Screen** with interactive elements
- 📄 **Details Screen** demonstrating navigation

## Screens

1. **Home Screen** - Welcome screen with input fields and navigation buttons
2. **Profile Screen** - User profile with personal information and settings
3. **Settings Screen** - App preferences and configuration options
4. **Details Screen** - Example of navigation with parameter passing

## Getting Started

### Prerequisites

- Node.js (>= 16)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS (macOS only):
```bash
cd ios && pod install && cd ..
```

3. Start the Metro bundler:
```bash
npm start
```

4. Run the app:

For Android:
```bash
npm run android
```

For iOS:
```bash
npm run ios
```

## Project Structure

```
├── App.tsx                 # Main app component with navigation
├── src/
│   └── screens/
│       ├── HomeScreen.tsx      # Home screen with interactive elements
│       ├── ProfileScreen.tsx   # User profile screen
│       ├── SettingsScreen.tsx  # App settings and preferences
│       └── DetailsScreen.tsx   # Details screen with navigation
├── package.json           # Dependencies and scripts
├── metro.config.js        # Metro bundler configuration
├── babel.config.js        # Babel configuration
└── README.md             # This file
```

## Dependencies

### Main Dependencies
- `react` - React library
- `react-native` - React Native framework
- `@react-navigation/native` - Navigation library
- `@react-navigation/bottom-tabs` - Bottom tab navigator
- `@react-navigation/stack` - Stack navigator
- `react-native-vector-icons` - Icon library
- `react-native-screens` - Native screen optimization
- `react-native-safe-area-context` - Safe area handling
- `react-native-gesture-handler` - Gesture handling

## Development

### Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Code Style

This project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Modern React patterns with hooks

## Customization

### Adding New Screens

1. Create a new screen component in `src/screens/`
2. Add the screen to the appropriate navigator in `App.tsx`
3. Update navigation types if using TypeScript

### Styling

The app uses StyleSheet for styling with a consistent design system:
- Primary color: `#2196F3` (Material Blue)
- Background: `#f5f5f5` (Light Gray)
- Card backgrounds: `white`
- Text colors: `#333` (dark), `#666` (medium), `#999` (light)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).