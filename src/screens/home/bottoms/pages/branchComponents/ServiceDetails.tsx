import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Modal,
    FlatList,
    Platform,
    I18nManager,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { moderateScale, scale } from 'react-native-size-matters';
import moment from 'moment';
import { theme } from '../../../../../core/theme';
import { Text } from '../../../../../components/widget';
import { formateDuration } from '../../../../../utils/utils';

interface SubService {
    _id: string;
    name: string;
    duration: string;
    price: string;
    selected: boolean;
    description?: string;
}

interface Service {
    _id: string;
    name: string;
    duration: string;
    price: string;
    description?: string;
    selected: boolean;
    SubService: SubService[];
    SubServiceSelected?: SubService;
}

interface ServiceDetailsProps {
    subService: boolean;
    selectedService: Service;
    selectedServiceClick: (service: Service) => void;
    hide: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
    subService,
    selectedService: initialSelectedService,
    selectedServiceClick,
    hide,
}) => {
    const [selectedService, setSelectedService] = useState<Service>(initialSelectedService);
    const [price, setPrice] = useState<string>('0');

    useEffect(() => {
        const serviceCopy = { ...initialSelectedService };

        if (serviceCopy.SubService.length !== 0) {
            // Select first sub-service by default
            serviceCopy.SubService = serviceCopy.SubService.map((sub, index) => ({
                ...sub,
                selected: index === 0,
            }));
            serviceCopy.SubServiceSelected = serviceCopy.SubService[0];
            setSelectedService(serviceCopy);
            setPrice(serviceCopy.SubService[0].price);
        } else {
            setSelectedService(serviceCopy);
            setPrice(serviceCopy.price);
        }
    }, [initialSelectedService]);

    const getHoursMin = (service: { duration: string }) => {
        const hours = moment(service.duration, 'HH:mm').toDate().getHours();
        const minutes = moment(service.duration, 'HH:mm').toDate().getMinutes();
        return { hours, minutes };
    };

    const handleSubServiceSelect = (index: number) => {
        const updatedService = { ...selectedService };

        // Deselect all sub-services
        updatedService.SubService = updatedService.SubService.map(sub => ({
            ...sub,
            selected: false,
        }));

        // Select the clicked sub-service
        updatedService.SubService[index].selected = true;
        updatedService.SubServiceSelected = updatedService.SubService[index];

        setSelectedService(updatedService);
        setPrice(updatedService.SubService[index].price);
    };

    const handleAddService = async () => {
        const finalService = { ...selectedService, selected: true };
        selectedServiceClick(finalService);

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const duration = getHoursMin(selectedService);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={true}
            onRequestClose={hide}
            onDismiss={hide}
        >
            <View style={{ width: '100%', height: '100%' }}>
                <View style={{ width: '100%', ...(subService ? { flex: 1 } : {}) }}>
                    {Platform.OS === 'ios' ? (
                        <BlurView
                            intensity={50}
                            style={{ width: '100%', height: '100%' }}
                            tint="dark"
                        />
                    ) : (
                        <View
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: `${theme.colors.black}70`,
                            }}
                        />
                    )}
                </View>

                <View
                    style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        alignSelf: 'center',
                        borderRadius: moderateScale(0),
                        marginTop: moderateScale(-35),
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            paddingBottom: moderateScale(100),
                            borderTopRightRadius: moderateScale(50),
                            borderTopLeftRadius: moderateScale(50),
                            backgroundColor: 'white',
                        }}
                    >
                        {/* Close button */}
                        <View
                            style={{
                                flexDirection: 'row',
                                paddingVertical: moderateScale(5),
                                alignItems: 'center',
                                paddingHorizontal: moderateScale(10),
                                height: moderateScale(40),
                                position: 'absolute',
                                top: moderateScale(10),
                                zIndex: 1,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    flex: 0.6,
                                }}
                                onPress={hide}
                            >
                                <Image
                                    source={require('../../../../../assets/close-theme.png')}
                                    resizeMode="contain"
                                    style={{
                                        height: scale(25),
                                        width: scale(25),
                                        marginHorizontal: moderateScale(10),
                                        ...(I18nManager.isRTL ? { transform: [{ rotate: '180deg' }] } : {}),
                                    }}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Service image */}
                        <View style={{ height: moderateScale(200), width: '100%' }}>
                            <Image
                                resizeMode="cover"
                                source={{ uri: 'https://source.unsplash.com/400x400/?beauty,service' }}
                                style={{
                                    height: moderateScale(200),
                                    width: '100%',
                                    borderTopLeftRadius: Platform.OS === 'android' ? moderateScale(25) : moderateScale(20),
                                    borderTopRightRadius: Platform.OS === 'android' ? moderateScale(25) : moderateScale(20),
                                    position: 'absolute',
                                }}
                            />
                            <View
                                style={{
                                    height: moderateScale(200),
                                    width: '100%',
                                    borderTopLeftRadius: moderateScale(20),
                                    borderTopRightRadius: moderateScale(20),
                                    position: 'absolute',
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                }}
                            />
                        </View>

                        {/* Service details */}
                        <View
                            style={{
                                marginHorizontal: moderateScale(20),
                                marginTop: moderateScale(20),
                                borderBottomWidth: moderateScale(1),
                                borderBottomColor: theme.colors.line,
                                paddingBottom: moderateScale(15),
                            }}
                        >
                            <View style={{ borderColor: theme.colors.primary, backgroundColor: 'white' }}>
                                <View style={{ flexDirection: 'row', width: '100%', alignSelf: 'center' }}>
                                    <View
                                        style={{
                                            paddingHorizontal: moderateScale(5),
                                            marginTop: moderateScale(5),
                                            flex: 1,
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: theme.colors.black,
                                                fontSize: moderateScale(15),
                                                textAlign: 'left',
                                                textTransform: 'capitalize',
                                                fontWeight: '800',
                                            }}
                                        >
                                            {selectedService.name}
                                        </Text>
                                        <Text
                                            style={{
                                                color: theme.colors.grayText,
                                                fontSize: moderateScale(15),
                                                textAlign: 'left',
                                                marginTop: moderateScale(2),
                                                fontWeight: '400',
                                            }}
                                        >
                                            {formateDuration(duration.hours, duration.minutes)}
                                        </Text>
                                        <Text
                                            style={{
                                                color: theme.colors.black,
                                                fontSize: moderateScale(15),
                                                textAlign: 'left',
                                                marginTop: moderateScale(2),
                                                fontWeight: '400',
                                            }}
                                        >
                                            {selectedService.price}
                                            <Text
                                                style={{
                                                    color: theme.colors.black,
                                                    fontSize: moderateScale(12),
                                                    textAlign: 'left',
                                                    marginTop: moderateScale(0),
                                                    fontWeight: '400',
                                                }}
                                            >
                                                {' AED'}
                                            </Text>
                                        </Text>
                                        <Text
                                            style={{
                                                color: theme.colors.grayText,
                                                fontSize: moderateScale(15),
                                                textAlign: 'left',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {selectedService.description || 'Premium service with experienced professionals'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Sub-services list */}
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            style={{ marginTop: moderateScale(10), backgroundColor: 'white' }}
                            data={selectedService.SubService}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => handleSubServiceSelect(index)}
                                    style={{
                                        marginHorizontal: moderateScale(20),
                                        marginTop: moderateScale(0),
                                        paddingBottom: moderateScale(15),
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', width: '100%' }}>
                                            <View
                                                style={{
                                                    paddingHorizontal: moderateScale(5),
                                                    marginTop: moderateScale(5),
                                                    flexDirection: 'column',
                                                    flex: 1,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: theme.colors.black,
                                                        fontSize: moderateScale(15),
                                                        textAlign: 'left',
                                                        textTransform: 'capitalize',
                                                        fontWeight: '800',
                                                    }}
                                                >
                                                    {item.name}
                                                </Text>
                                                <Text
                                                    style={{
                                                        color: theme.colors.grayText,
                                                        fontSize: moderateScale(15),
                                                        textAlign: 'left',
                                                        marginTop: moderateScale(2),
                                                        fontWeight: '400',
                                                    }}
                                                >
                                                    {formateDuration(
                                                        getHoursMin(item).hours,
                                                        getHoursMin(item).minutes
                                                    )}
                                                </Text>
                                            </View>

                                            <View
                                                style={{
                                                    justifyContent: 'center',
                                                    alignContent: 'center',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: theme.colors.black,
                                                        fontSize: moderateScale(15),
                                                        textAlign: 'left',
                                                        marginTop: moderateScale(2),
                                                        fontWeight: '400',
                                                    }}
                                                >
                                                    {item.price}
                                                    <Text
                                                        style={{
                                                            color: theme.colors.black,
                                                            fontSize: moderateScale(12),
                                                            textAlign: 'left',
                                                            marginTop: moderateScale(0),
                                                            fontWeight: '400',
                                                        }}
                                                    >
                                                        {' AED'}
                                                    </Text>
                                                </Text>

                                                <View
                                                    style={{
                                                        width: moderateScale(20),
                                                        height: moderateScale(20),
                                                        borderWidth: moderateScale(1),
                                                        borderColor: theme.colors.primary,
                                                        justifyContent: 'center',
                                                        alignContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: moderateScale(50),
                                                        marginHorizontal: moderateScale(10),
                                                    }}
                                                >
                                                    {item.selected && (
                                                        <View
                                                            style={{
                                                                width: moderateScale(13),
                                                                height: moderateScale(13),
                                                                backgroundColor: theme.colors.primary,
                                                                borderRadius: moderateScale(50),
                                                            }}
                                                        />
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                paddingHorizontal: moderateScale(5),
                                                marginTop: moderateScale(5),
                                                flexDirection: 'column',
                                                flex: 1,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: theme.colors.grayText,
                                                    fontSize: moderateScale(15),
                                                    textAlign: 'left',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {item.description || 'Quality service option'}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />

                        {/* Bottom action button */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignContent: 'center',
                                marginTop: moderateScale(5),
                                position: 'absolute',
                                bottom: moderateScale(20),
                                backgroundColor: theme.colors.primary,
                                width: '80%',
                                alignSelf: 'center',
                                borderRadius: moderateScale(10),
                                paddingHorizontal: moderateScale(15),
                                paddingVertical: moderateScale(8),
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.white,
                                    fontSize: moderateScale(12),
                                    textAlign: 'left',
                                    fontWeight: '800',
                                    flex: 1,
                                }}
                            >
                                {price} AED
                            </Text>
                            <TouchableOpacity
                                onPress={handleAddService}
                                style={{
                                    marginStart: moderateScale(5),
                                    paddingHorizontal: moderateScale(10),
                                    paddingVertical: moderateScale(5),
                                    borderRadius: moderateScale(20),
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.white,
                                        fontSize: moderateScale(12),
                                        textAlign: 'left',
                                        textTransform: 'capitalize',
                                        fontWeight: '800',
                                    }}
                                >
                                    Add Service
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ServiceDetails;