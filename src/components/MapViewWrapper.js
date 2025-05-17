// components/MapViewWrapper.js
import React from 'react';
import { Platform, View, Text } from 'react-native';

let MapView = () => <View><Text>Maps not supported on this platform</Text></View>;

// Only import the real MapView on native platforms
if (Platform.OS !== 'web') {
    MapView = require('react-native-maps').default;
}

export default function MapViewWrapper(props) {
    return Platform.OS !== 'web'
        ? <MapView {...props} />
        : <View style={[{ height: 200, alignItems: 'center', justifyContent: 'center' }, props.style]}>
            <Text>Map view not available on web</Text>
        </View>;
}