const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add web to platforms
config.resolver.platforms = ['ios', 'android', 'web'];

// Create custom resolver for react-native-maps on web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-maps' && platform === 'web') {
    // Return a stub module for web instead of the non-existent web implementation
    return {
      filePath: path.resolve(__dirname, 'src/stubs/react-native-maps-stub.js'),
      type: 'sourceFile',
    };
  }

  // Use default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;