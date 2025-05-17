// src/stubs/react-native-maps-stub.js
import React from 'react';
import { View, Text } from 'react-native';

// Default MapView component
const MapView = ({ children, style, ...props }) => {
    return (
        <View style={[{ backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }, style]}>
            <Text>Map not available on web</Text>
            {children}
        </View>
    );
};

// Export all components that react-native-maps provides
export default MapView;
export { MapView };

// Additional components that might be used
export const Marker = ({ children }) => children || null;
export const Callout = ({ children }) => children || null;
export const Polygon = () => null;
export const Polyline = () => null;
export const Circle = () => null;
export const Overlay = () => null;
export const LocalTile = () => null;
export const UrlTile = () => null;
export const AnimatedRegion = class AnimatedRegion {
    constructor() { }
    setValue() { }
    setOffset() { }
    flattenOffset() { }
    extractOffset() { }
    addListener() { }
    removeListener() { }
    removeAllListeners() { }
    stopAnimation() { }
    resetAnimation() { }
    interpolate() { }
    animate() { }
    stopTracking() { }
    track() { }
    toJSON() { }
};

// Constants
export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = null;