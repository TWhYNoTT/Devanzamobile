// src/screens/Splash.tsx
import React, { useEffect } from 'react';
import { View, ImageBackground, StyleSheet, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { triggerHapticFeedback } from '../../utils/platform';
import { useAuthContext } from '../../contexts/AuthContext';
import { CommonActions } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SplashProps { }

const Splash: React.FC<SplashProps> = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { isAuthenticated, isInitialized, user } = useAuthContext();

    useEffect(() => {
        if (isInitialized) {
            checkSignInStatus();
        }
    }, [isInitialized, isAuthenticated, user]);

    const checkSignInStatus = async () => {
        await triggerHapticFeedback();

        // Add a small delay for splash screen visibility
        setTimeout(() => {
            // Check the current auth state
            const currentAuth = !!user;

            if (currentAuth) {
                // User is authenticated, go to home
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'home' }],
                    })
                );
            } else {
                // User is not authenticated, go to Welcome
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Welcome' }],
                    })
                );
            }
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/spalsh.png')}
                style={styles.backgroundImage}
                resizeMode={Platform.OS === 'web' ? 'contain' : 'cover'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        // Ensure full screen on web
        ...Platform.select({
            web: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
            },
        }),
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        // For web, use viewport units
        ...Platform.select({
            web: {
                width: '100vw',
                height: '100vh',
                objectFit: 'contain', // or 'cover' if you want to fill the screen
            },
        }),
    }
});

export default Splash;