import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    I18nManager
} from 'react-native';
import { Text } from '../../../components/widget';
import { moderateScale } from 'react-native-size-matters';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getSettings, clearToken } from '../../../utils/storage';
import { showSuccess, translate } from '../../../utils/utils';
import { Alert } from 'react-native';
import { CustomSwitch } from './childs/Switch';

// Mock user data
const MOCK_USER = {
    id: '12345',
    email: 'user@example.com',
    name: 'Abdo',
    notification: true,
    phone: '+1234567890',
    address: '123 Main St, City, Country',
    language: 'en',
    avatar: null
};

interface SettingsProps {
    // Making userInfo optional since we'll use mock data
    userInfo?: typeof MOCK_USER;
}

interface Settings {
    language: boolean;
    notifications: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ userInfo = MOCK_USER }) => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        language: false,
        notifications: true
    });
    const [languageText, setLanguageText] = useState('عربى');
    const [mockNotificationEnabled, setMockNotificationEnabled] = useState(userInfo.notification);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await getSettings();
            if (savedSettings) {
                setSettings(savedSettings);
                setLanguageText(savedSettings.language ? 'ENG' : 'عربى');
            }
        } catch (error) {
            console.error('Settings load error:', error);
            // Use default settings if loading fails
            setSettings({
                language: false,
                notifications: true
            });
        }
    };

    const handleNotificationToggle = async () => {
        setIsLoading(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setMockNotificationEnabled(!mockNotificationEnabled);
            showSuccess('Notification settings updated!');
        } catch (error) {
            console.error('Notification update error:', error);
            Alert.alert('Error', 'Failed to update notification settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLanguageChange = () => {
        Alert.alert(
            translate('Language'),
            translate('Are you sure you want to change language ? app may require restarting after changing language.'),
            [
                {
                    text: translate('Cancel'),
                    style: 'cancel'
                },
                {
                    text: translate('Change'),
                    onPress: async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        // Simulate language change
                        setLanguageText(languageText === 'عربى' ? 'ENG' : 'عربى');
                        setSettings(prev => ({
                            ...prev,
                            language: !prev.language
                        }));
                        showSuccess('Language updated!');
                    }
                }
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            translate('Logout'),
            translate('Are you sure you want to logout'),
            [
                {
                    text: translate('Cancel'),
                    style: 'cancel'
                },
                {
                    text: translate('Logout'),
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            await clearToken();
                            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            showSuccess('Logged out successfully');
                            // Navigate to login screen
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Error', 'Failed to logout');
                        } finally {
                            setIsLoading(false);
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const SettingItem = ({
        icon,
        title,
        onPress,
        rightElement,
        backgroundColor = '#DBD1F9'
    }: {
        icon: any;
        title: string;
        onPress?: () => void;
        rightElement?: React.ReactNode;
        backgroundColor?: string;
    }) => (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.settingItem, { opacity: onPress ? 1 : 0.8 }]}
            disabled={isLoading}
        >
            <View style={[styles.iconContainer, { backgroundColor }]}>
                <Image
                    source={icon}
                    style={styles.icon}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.settingText}>{title}</Text>
            {rightElement}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {translate('Settings')}
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {userInfo.email && (
                    <>
                        <SettingItem
                            icon={require('../../../assets/you/user.png')}
                            title={translate('Profile')}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                navigation.navigate('Profile');
                            }}
                        />

                        <SettingItem
                            icon={require('../../../assets/you/location.png')}
                            title={translate('Address')}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                navigation.navigate('Address');
                            }}
                        />

                        <SettingItem
                            icon={require('../../../assets/you/notificaiton.png')}
                            title={translate('Notification settings')}
                            rightElement={
                                <CustomSwitch
                                    value={mockNotificationEnabled}
                                    onValueChange={handleNotificationToggle}
                                    disabled={isLoading}
                                />
                            }
                        />
                    </>
                )}

                <SettingItem
                    icon={require('../../../assets/you/language.png')}
                    title={translate('Language')}
                    onPress={handleLanguageChange}
                    rightElement={
                        <Image
                            source={require('../../../assets/arbia.png')}
                            style={[
                                styles.languageIcon,
                                I18nManager.isRTL && styles.rtlIcon
                            ]}
                            resizeMode="contain"
                        />
                    }
                />

                <SettingItem
                    icon={require('../../../assets/you/feedback.png')}
                    title={translate('Send us feedback')}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.navigate('ContactUs');
                    }}
                />

                <SettingItem
                    icon={require('../../../assets/you/terms.png')}
                    title={translate('Terms and conditions')}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.navigate('About');
                    }}
                />

                {userInfo.email && (
                    <SettingItem
                        icon={require('../../../assets/you/logout.png')}
                        title={translate('Logout')}
                        onPress={handleLogout}
                        backgroundColor="#909FBA"
                    />
                )}

                <View style={styles.footer}>
                    <Image
                        source={require('../../../assets/you/devanwithlogo.png')}
                        style={styles.footerLogo}
                        resizeMode="contain"
                    />
                    <Text style={styles.footerText}>
                        {translate('© copyright 2021 Devanza All rights reserved.')}
                    </Text>
                    <Text style={styles.footerText}>
                        {translate('Version Devanza 1.0 build 1.')}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        padding: moderateScale(25),
        paddingBottom: moderateScale(0)
    },
    headerTitle: {
        fontSize: moderateScale(30),
        marginTop: moderateScale(20),
        fontWeight: 'bold'
    },
    scrollContent: {
        padding: moderateScale(25),
        paddingTop: 0
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: moderateScale(13),
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },
    iconContainer: {
        width: moderateScale(34),
        height: moderateScale(35),
        borderRadius: moderateScale(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: moderateScale(17),
        height: moderateScale(17)
    },
    settingText: {
        fontSize: moderateScale(17),
        flex: 1,
        marginHorizontal: moderateScale(10),
        color: '#333333'
    },
    languageIcon: {
        height: moderateScale(25),
        width: moderateScale(25),
        marginHorizontal: moderateScale(10),
        marginTop: moderateScale(2)
    },
    rtlIcon: {
        transform: [{ rotate: '180deg' }]
    },
    footer: {
        alignItems: 'center',
        paddingVertical: moderateScale(20)
    },
    footerLogo: {
        width: moderateScale(200),
        height: moderateScale(80)
    },
    footerText: {
        fontSize: moderateScale(13),
        textAlign: 'center',
        color: '#757575',
        marginTop: moderateScale(5)
    }
});

export default Settings;