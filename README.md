# Peace of Mind

A cross-platform mental health tracking application built with React Native and Expo.

## Overview

Peace of Mind helps users track their mental wellbeing through three core features:
- **Mood Check-Ins**: Log and visualize your daily mood ratings
- **Journal Entries**: Record thoughts and reflections
- **Activity Tracking**: Monitor beneficial activities and habits

## Features

- **Cross-platform compatibility**: Works on iOS, Android, and Web
- **Offline functionality**: All data stored locally on the device
- **Responsive design**: Optimized for all screen sizes
- **User-friendly interface**: Intuitive and accessible UI

## Technology Stack

- React Native
- Expo
- TypeScript
- File-based data storage
- Local Storage for web platform

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/peace-of-mind.git
cd peace-of-mind

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Different Platforms

```bash
# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Building for Production

### Web Static Build

```bash
# Create a production web build
expo build:web
```

### Using Docker for Web Deployment

```bash
# Build the Docker image
docker build -t peace-of-mind .

# Run the container
docker run -p 3049:3049 peace-of-mind
```

### Mobile Deployment

For mobile distribution, build using EAS:

```bash
# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

## Project Structure

```
peace-of-mind/
├── app/
│   ├── screens/              # Application screens
│   │   ├── CheckInScreen.tsx # Mood tracking feature
│   │   ├── JournalScreen.tsx # Journal entries feature
│   │   └── ActivitiesScreen.tsx # Activities tracking
│   ├── components/           # Reusable components
│   └── utils/                # Utility functions
├── assets/                   # Images, fonts, etc.
├── .dockerignore             # Docker ignore file
└── Dockerfile                # Docker configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Expo team for the cross-platform framework
- React Native community for their excellent documentation