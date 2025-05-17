import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Image, TouchableOpacity, Alert } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import custom components and utilities
import { Text } from '../../../../components/widget';
import { translate } from '../../../../utils/utils';
import Header from '../childs/Header';

// Theme should be migrated to a theme provider or context
import { theme } from '../../../../core/theme';

// Define navigation types
type RootStackParamList = {
    OptionSelectDate: {
        newBookingData: BookingData;
    };
    Address: { fromSelection: boolean; back: boolean };
};

type OptionsForServiceNavigationProp = StackNavigationProp<RootStackParamList>;
type OptionsForServiceRouteProp = RouteProp<{ params: { back?: boolean; newBookingData?: BookingData } }, 'params'>;

// Create an interface for our booking data
interface BookingData {
    selectedServices: Array<{
        forHome?: number;
        id: number;
        name: string;
        duration: string;
        price: number;
        selected: boolean;
        SubService: any[];
        SubServiceSelected?: any;
        [key: string]: any;
    }>;
    option?: number;
    item?: any;
}

// Create an interface for our user
interface UserInfo {
    email?: string;
    [key: string]: any;
}

const OptionsForService: React.FC = () => {
    // State
    const [homeService, setHomeService] = useState<boolean>(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [newBookingData, setNewBookingData] = useState<BookingData>({
        selectedServices: [],
        option: 0
    });

    // Hooks
    const navigation = useNavigation<OptionsForServiceNavigationProp>();
    const route = useRoute<OptionsForServiceRouteProp>();

    useEffect(() => {
        // Get booking data from the route params
        if (route.params?.newBookingData) {
            setNewBookingData(route.params.newBookingData);

            // Check if any service doesn't support home service
            const checkHomeService = () => {
                for (let k in route.params.newBookingData.selectedServices) {
                    if (!!!route.params.newBookingData.selectedServices[k].forHome ||
                        route.params.newBookingData.selectedServices[k].forHome === 0) {
                        setHomeService(false);
                        break;
                    }
                }
            };

            checkHomeService();
        }
    }, [route.params]);

    // Functions to update booking data
    const updateBookingData = (data: BookingData) => {
        setNewBookingData(data);
    };

    const openLoginDialog = (params: { navigate: string }) => {
        // In a real app, this would open a login dialog
        Alert.alert('Please login to continue');
        // After login, you would navigate to the specified screen
    };

    // Handle salon option selection
    const handleSalonOption = () => {
        const isBackNavigation = route.params?.back || false;

        const updatedBookingData = {
            ...newBookingData,
            option: 2 // Salon option
        };

        updateBookingData(updatedBookingData);

        if (!isBackNavigation) {
            if (userInfo && !!!userInfo.email) {
                openLoginDialog({ navigate: 'OptionSelectDate' });
            } else {
                navigation.navigate('OptionSelectDate', {
                    newBookingData: updatedBookingData
                });
            }
        } else {
            navigation.goBack();
        }
    };

    // Handle home service option selection
    const handleHomeService = () => {
        if (userInfo && !!!userInfo.email) {
            openLoginDialog({ navigate: 'Address' });
        } else {
            const isBackNavigation = route.params?.back || false;

            const updatedBookingData = {
                ...newBookingData,
                option: 1 // Home service option
            };

            updateBookingData(updatedBookingData);

            if (isBackNavigation) {
                navigation.navigate('Address', {
                    fromSelection: true,
                    back: isBackNavigation
                });
            } else {
                // For demo purposes, skip the address selection and go straight to date selection
                navigation.navigate('OptionSelectDate', {
                    newBookingData: updatedBookingData
                });
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />

            <Header
                backPress={() => navigation.goBack()}
                Text={translate('')}
                color={'transparent'}
                back={true}
                navigation={navigation}
                search={false}
                more={false}
            />

            <View style={styles.titleContainer}>
                <Text bold style={styles.title}>
                    {translate('Home service is available')}
                </Text>
            </View>

            <View style={styles.optionsContainer}>
                {/* Salon Option */}
                <View style={styles.optionCard}>
                    <TouchableOpacity
                        onPress={handleSalonOption}
                        style={styles.optionButton}
                    >
                        <View style={styles.iconContainer}>
                            <Image
                                resizeMode="contain"
                                source={require('../../../../assets/location-option.png')}
                                style={styles.optionIcon}
                            />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>{'Select in Salon walk-in'}</Text>
                            <Text style={styles.optionPrice}>
                                {'+0'}
                                <Text style={styles.currency}>{' AED'}</Text>
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Home Service Option */}
                {homeService && (
                    <View style={[styles.optionCard, styles.marginTop]}>
                        <TouchableOpacity
                            onPress={handleHomeService}
                            style={styles.optionButton}
                        >
                            <View style={styles.iconContainer}>
                                <Image
                                    resizeMode="contain"
                                    source={require('../../../../assets/home-option.png')}
                                    style={styles.optionIcon}
                                />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>{'Select home service'}</Text>
                                <Text style={styles.optionPrice}>
                                    {'+60'}
                                    <Text style={styles.currency}>{' AED'}</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.white,
    },
    titleContainer: {
        alignContent: 'center',
        width: '100%',
        padding: moderateScale(25),
        paddingBottom: moderateScale(0)
    },
    title: {
        fontSize: moderateScale(30),
        marginTop: moderateScale(0)
    },
    optionsContainer: {
        paddingHorizontal: moderateScale(20),
        marginTop: moderateScale(20)
    },
    optionCard: {
        borderColor: theme.colors.primary,
        borderRadius: moderateScale(20)
    },
    marginTop: {
        marginTop: moderateScale(20)
    },
    optionButton: {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center'
    },
    iconContainer: {
        height: moderateScale(85),
        width: moderateScale(85),
        borderRadius: moderateScale(20),
        backgroundColor: theme.colors.primarylight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    optionIcon: {
        height: moderateScale(35),
        width: moderateScale(35)
    },
    optionTextContainer: {
        paddingHorizontal: moderateScale(10),
        marginTop: moderateScale(10),
        flex: 1,
        flexDirection: 'column'
    },
    optionTitle: {
        color: theme.colors.blackText,
        fontSize: moderateScale(17),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: '800'
    },
    optionPrice: {
        color: theme.colors.blackText,
        fontSize: moderateScale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        fontWeight: '400'
    },
    currency: {
        color: theme.colors.blackText,
        fontSize: moderateScale(15),
        textAlign: 'left',
        fontWeight: '400'
    }
});

export default OptionsForService;