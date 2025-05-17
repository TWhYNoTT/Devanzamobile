import { NativeModules } from 'react-native';

const FullScreenModule = {
    // Maintain the same interface as the original native module
    enterFullScreen: () => Promise.resolve(),
    exitFullScreen: () => Promise.resolve(),
};

export default FullScreenModule;