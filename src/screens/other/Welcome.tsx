// src/screens/Welcome.tsx
import React from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import type { StackNavigationProp } from '@react-navigation/stack';

// Conditional import for Haptics
let Haptics: any;
if (Platform.OS !== 'web') {
    Haptics = require('expo-haptics');
}

import { SliderBox } from '../../components/react-native-image-slider-box';
import Header from '../home/bottoms/childs/Header';
import { theme } from '../../core/theme';
import { triggerHapticFeedback } from '../../utils/platform';

type WelcomeScreenProps = {
    navigation: StackNavigationProp<any>;
};

const Welcome: React.FC<WelcomeScreenProps> = ({ navigation }) => {
    const triggerHaptic = async () => {
        if (Platform.OS !== 'web' && Haptics) {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const navigateToScreen = async (screenName: string) => {
        await triggerHapticFeedback();
        await triggerHaptic();
        navigation.reset({
            index: 0,
            routes: [{ name: screenName }],
        });
    };

    const handleBack = () => {
        navigateToScreen('home');
    };

    const sliderImages = [
        {
            image: require('../../assets/tutorial1.png'),
            heading: 'Discover Salons',
            text: 'Set your location and find beauty parlors that offer various personal care treatments'
        },
        {
            image: require('../../assets/tutorial2.png'),
            heading: 'Book appointments',
            text: 'Book your beauty services on the go, choose the best salon and services like make-up, hair, nails and spa'
        },
        {
            image: require('../../assets/tutorial3.png'),
            heading: 'Book appointments',
            text: 'Enjoy relax and unwind – to regain balance and equilibrium after a hectic busy day.'
        }
    ];

    // Web-friendly container component
    const Container = Platform.OS === 'web' ? View : SafeAreaView;

    return (
        <Container style={styles.container}>
            {Platform.OS !== 'web' && (
                <StatusBar style="dark" backgroundColor="transparent" />
            )}
            <View style={styles.headerContainer}>
                <Header
                    languageUpdate={handleBack}
                    backPress={handleBack}
                    navigation={navigation}
                    search={false}
                    language={true}
                    back={true}
                    Text=""
                />
            </View>
            <View style={styles.sliderContainer}>
                <SliderBox
                    style={styles.slider}
                    images={sliderImages}
                    sliderBoxHeight={Platform.select({
                        web: 500, // Fixed height for web
                        default: moderateScale(400)
                    })}
                />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
        ...Platform.select({
            web: {
                height: '100vh',
                overflow: 'hidden',
            },
        }),
    },
    headerContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        position: 'absolute',
        top: Platform.select({
            web: 0,
            default: moderateScale(20), // Account for SafeAreaView on mobile
        }),
        zIndex: 100,
        ...Platform.select({
            web: {
                paddingTop: 20, // Web doesn't have SafeAreaView padding
            },
        }),
    },
    sliderContainer: {
        flex: 1,
        ...Platform.select({
            web: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 80, // Account for header
            },
        }),
    },
    slider: {
        flex: 1,
        marginTop: Platform.select({
            web: 0,
            default: moderateScale(50),
        }),
        ...Platform.select({
            web: {
                maxWidth: 800,
                width: '100%',
                alignSelf: 'center',
            },
        }),
    },
});

export default Welcome;