// src/screens/home/bottoms/childs/Header.tsx
import React from 'react';
import { View, TouchableOpacity, Platform, I18nManager, Image as RNImage } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import { Text } from '../../../../components/widget';
import { theme } from "../../../../core/theme";

// Conditional imports
let ExpoImage: any;
let StatusBar: any;

if (Platform.OS !== 'web') {
    ExpoImage = require('expo-image').Image;
    StatusBar = require('expo-status-bar').StatusBar;
}

// Use either expo-image or react-native Image based on platform
const Image = Platform.OS === 'web' ? RNImage : ExpoImage;

interface HeaderProps {
    dialog?: boolean;
    color?: string;
    backPress: () => void;
    languageUpdate?: () => void;
    addClick?: () => void;
    skpeClick?: () => void;
    shareClick?: () => void;
    Text?: string;
    navigation: any;
    search?: boolean;
    language?: boolean;
    back?: boolean;
    add?: boolean;
    share?: boolean;
    skpe?: boolean;
    logo?: boolean;
    iconTint?: string;
}

const Header: React.FC<HeaderProps> = ({
    dialog,
    color,
    backPress,
    languageUpdate,
    addClick,
    skpeClick,
    shareClick,
    Text: headerText,
    search,
    language,
    back,
    add,
    share,
    skpe,
    logo,
    iconTint
}) => {
    const handleRightButtonPress = () => {
        if (language) {
            languageUpdate?.();
        }
        if (add) {
            addClick?.();
        }
        if (skpe) {
            skpeClick?.();
        }
        if (share) {
            shareClick?.();
        }
    };

    // Platform-specific padding
    const getPaddingTop = () => {
        if (dialog) return moderateScale(20);

        return Platform.select({
            android: moderateScale(30),
            ios: moderateScale(45),
            web: moderateScale(20), // Smaller padding for web
            default: moderateScale(30),
        });
    };

    return (
        <View style={{
            paddingTop: getPaddingTop(),
            opacity: 1,
            backgroundColor: color || theme.colors.white,
            ...Platform.select({
                web: {
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    width: '100%',
                }
            })
        }}>
            {/* StatusBar only for mobile platforms */}
            {Platform.OS !== 'web' && StatusBar && (
                <StatusBar style="dark" backgroundColor="transparent" translucent />
            )}

            <View style={{
                width: '100%',
                position: 'absolute',
                height: moderateScale(95),
                paddingTop: moderateScale(0),
            }} />

            <View style={{
                flexDirection: 'row',
                paddingVertical: moderateScale(5),
                alignItems: 'center',
                paddingHorizontal: moderateScale(10),
                ...Platform.select({
                    web: {
                        maxWidth: 1200,
                        marginHorizontal: 'auto',
                        width: '100%',
                    }
                })
            }}>
                {/* Left Section */}
                <View style={{
                    flex: 1.8,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                }}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            flex: 0.6,
                            ...Platform.select({
                                web: { cursor: 'pointer' }
                            })
                        }}
                        onPress={backPress}
                    >
                        {back && (
                            <Image
                                source={require('../../../../assets/back-with-overview.png')}
                                contentFit={Platform.OS === 'web' ? undefined : "contain"}
                                resizeMode={Platform.OS === 'web' ? "contain" : undefined}
                                style={{
                                    height: scale(25),
                                    width: scale(25),
                                    marginHorizontal: moderateScale(10),
                                    ...(I18nManager.isRTL ? { transform: [{ rotate: '180deg' }] } : {}),
                                    ...(iconTint ? { tintColor: iconTint } : {})
                                }}
                            />
                        )}
                        {search && (
                            <Image
                                source={require('../../../../assets/notifications.png')}
                                contentFit={Platform.OS === 'web' ? undefined : "contain"}
                                resizeMode={Platform.OS === 'web' ? "contain" : undefined}
                                style={{
                                    height: scale(30),
                                    width: scale(30),
                                    marginHorizontal: moderateScale(10),
                                    ...(I18nManager.isRTL ? { transform: [{ rotate: '180deg' }] } : {}),
                                    ...(iconTint ? { tintColor: iconTint } : {})
                                }}
                            />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Center Section */}
                <View style={{
                    flex: 2.8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <View style={{
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} />

                    {!logo ? (
                        <Text style={{
                            textAlign: 'center',
                            width: '130%',
                            fontSize: moderateScale(19),
                            color: theme.colors.blackText,
                            alignSelf: 'center',
                            fontWeight: '900',
                        }}>
                            {String(headerText || '')}
                        </Text>
                    ) : (
                        <Image
                            source={require('../../../../assets/logo-with-name.png')}
                            contentFit={Platform.OS === 'web' ? undefined : "contain"}
                            resizeMode={Platform.OS === 'web' ? "contain" : undefined}
                            style={{
                                height: scale(40),
                                width: scale(140),
                            }}
                        />
                    )}
                </View>

                {/* Right Section */}
                <View style={{
                    flex: 1.8,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    flexDirection: 'column',
                }}>
                    <TouchableOpacity
                        style={{
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            flex: 0.6,
                            ...Platform.select({
                                web: { cursor: 'pointer' }
                            })
                        }}
                        onPress={handleRightButtonPress}
                    >
                        {add && (
                            <Image
                                source={require('../../../../assets/add-icon.png')}
                                contentFit={Platform.OS === 'web' ? undefined : "contain"}
                                resizeMode={Platform.OS === 'web' ? "contain" : undefined}
                                style={{
                                    height: scale(20),
                                    width: scale(20),
                                    marginHorizontal: moderateScale(10),
                                    marginTop: moderateScale(2),
                                    ...(I18nManager.isRTL ? { transform: [{ rotate: '180deg' }] } : {}),
                                    ...(iconTint ? { tintColor: iconTint } : {})
                                }}
                            />
                        )}

                        {share && (
                            <Image
                                source={require('../../../../assets/share.png')}
                                contentFit={Platform.OS === 'web' ? undefined : "contain"}
                                resizeMode={Platform.OS === 'web' ? "contain" : undefined}
                                style={{
                                    height: moderateScale(20),
                                    width: moderateScale(20),
                                    marginHorizontal: moderateScale(10),
                                    marginTop: moderateScale(2),
                                }}
                            />
                        )}

                        {skpe && (
                            <Text style={{
                                fontSize: moderateScale(17),
                                color: theme.colors.blackText,
                                alignSelf: 'center',
                                fontWeight: '700',
                                height: moderateScale(30),
                                marginTop: moderateScale(5),
                                ...Platform.select({
                                    web: { cursor: 'pointer' }
                                })
                            }}>
                                Skip
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Header;