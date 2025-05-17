import React, { useState, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import { Image } from 'expo-image';
import { moderateScale, scale } from 'react-native-size-matters';
import { Text } from '../../../../components/widget';
import { theme } from "../../../../core/theme";
import { I18nManager } from 'react-native';
import { DateTime } from "luxon";
import { translate } from '../../../../utils/utils';

interface Notification {
    _id: string;
    id?: string;
    title: string;
    description: string;
    read: number;
    createdAt: string;
    bookingsObj: {
        bookingdDate: string;
    };
}

interface HeaderProps {
    Hide: () => void;
}

// Dummy data
const dummyNotifications: Notification[] = [
    {
        _id: '1',
        title: 'Booking Confirmed',
        description: 'Your booking has been confirmed',
        read: 0,
        createdAt: new Date().toISOString(),
        bookingsObj: {
            bookingdDate: new Date().toISOString()
        }
    },
    {
        _id: '2',
        title: 'Special Offer',
        description: 'New offer available',
        read: 1,
        createdAt: new Date().toISOString(),
        bookingsObj: {
            bookingdDate: new Date().toISOString()
        }
    }
];

export const NotificationsHeader: React.FC<HeaderProps> = ({ Hide }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setNotifications(dummyNotifications);
            setUnread(dummyNotifications.filter(n => n.read === 0).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === id ? { ...notif, read: 1 } : notif
                )
            );
            setUnread(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const renderNotificationItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={styles.notificationItem}
            onPress={() => handleMarkAsRead(item._id)}
        >
            <View style={styles.notificationContent}>
                <View style={styles.iconContainer}>
                    <Image
                        source={require('../../../../assets/devura.png')}
                        style={styles.icon}
                        contentFit="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>{item.title}</Text>

                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>
                            {translate('notification_from').replace(
                                '{date}',
                                DateTime.fromISO(item.bookingsObj.bookingdDate)
                                    .toFormat('dd MMM - hh:mm a')
                            )}
                        </Text>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>
                            {item.description}
                        </Text>
                    </View>

                    <View style={styles.timeStampContainer}>
                        <Text style={styles.timeText}>
                            {DateTime.fromISO(item.createdAt).toFormat('hh:mm a')}
                        </Text>
                        {item.read === 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>1</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const EmptyComponent = () => (
        <View>
            {!isLoading ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../../../assets/no-search-items.png')}
                        style={styles.emptyImage}
                        contentFit="contain"
                    />
                    <Text bold style={styles.emptyTitle}>
                        {translate('no_notifications')}
                    </Text>
                    <Text style={styles.emptySubtitle}>
                        {translate('no_notifications_desc')}
                    </Text>
                </View>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                presentationStyle="formSheet"
                visible={true}
                onRequestClose={Hide}
            >
                <TouchableWithoutFeedback
                    onPressOut={(e) => {
                        if (e.nativeEvent.locationY < 0) {
                            Hide();
                        }
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.headerContainer}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={Hide}
                                accessibilityLabel={translate('close')}
                            >
                                <Image
                                    source={require('../../../../assets/close-theme.png')}
                                    style={[
                                        styles.closeIcon,
                                        I18nManager.isRTL && styles.rtlIcon as ImageStyle
                                    ]}
                                    contentFit="contain"
                                />
                            </TouchableOpacity>

                            <Text bold style={styles.headerTitle}>
                                {translate('notifications')}
                                {unread !== 0 &&
                                    <Text style={styles.unreadCount}>
                                        {` (${unread})`}
                                    </Text>
                                }
                            </Text>

                            <View style={styles.placeholder} />
                        </View>

                        <View style={styles.listContainer}>
                            <FlatList
                                data={notifications}
                                renderItem={renderNotificationItem}
                                ListEmptyComponent={EmptyComponent}
                                keyExtractor={(item) => item._id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.listContent}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    } as ViewStyle,
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: moderateScale(10)
    } as ViewStyle,
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: moderateScale(5),
        paddingHorizontal: moderateScale(5),
        height: moderateScale(40),
        marginTop: moderateScale(20)
    } as ViewStyle,
    closeButton: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 0.6
    } as ViewStyle,
    closeIcon: {
        height: scale(25),
        width: scale(25),
        marginHorizontal: moderateScale(10)
    } as ImageStyle,
    rtlIcon: {
        transform: [{ rotate: '180deg' }]
    } as ViewStyle,
    headerTitle: {
        color: theme.colors.black,
        fontSize: moderateScale(20),
        textAlign: 'center',
        textTransform: 'capitalize'
    } as TextStyle,
    unreadCount: {
        fontWeight: '400'
    } as TextStyle,
    placeholder: {
        flex: 0.6
    } as ViewStyle,
    listContainer: {
        padding: moderateScale(10),
        marginHorizontal: moderateScale(10),
        marginBottom: moderateScale(70)
    } as ViewStyle,
    notificationItem: {
        width: '100%',
        marginVertical: moderateScale(10)
    } as ViewStyle,
    notificationContent: {
        flexDirection: 'row',
        paddingBottom: moderateScale(0),
        width: '100%'
    } as ViewStyle,
    iconContainer: {
        backgroundColor: theme.colors.grayBackground,
        width: moderateScale(70),
        height: moderateScale(70),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: moderateScale(20)
    } as ViewStyle,
    icon: {
        width: moderateScale(40),
        height: moderateScale(40)
    } as ImageStyle,
    textContainer: {
        flexDirection: 'column',
        flex: 1
    } as ViewStyle,
    titleText: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: moderateScale(10),
        fontWeight: '800'
    } as TextStyle,
    dateContainer: {
        flexDirection: 'row',
        marginTop: moderateScale(0)
    } as ViewStyle,
    dateText: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        textAlign: 'left',
        marginHorizontal: moderateScale(10),
        fontWeight: '500',
        flex: 1
    } as TextStyle,
    descriptionContainer: {
        flexDirection: 'row',
        marginTop: moderateScale(0)
    } as ViewStyle,
    descriptionText: {
        color: theme.colors.black,
        fontSize: moderateScale(15),
        textAlign: 'left',
        textTransform: 'capitalize',
        marginHorizontal: moderateScale(10),
        fontWeight: '100',
        flex: 1
    } as TextStyle,
    timeStampContainer: {
        position: 'absolute',
        right: moderateScale(5),
        alignItems: 'flex-end',
        alignContent: 'flex-end',
        justifyContent: 'flex-end'
    } as ViewStyle,
    timeText: {
        color: theme.colors.grayText,
        fontSize: moderateScale(14),
        textAlign: 'left',
        fontWeight: '400'
    } as TextStyle,
    unreadBadge: {
        backgroundColor: theme.colors.primary,
        borderRadius: moderateScale(10),
        width: moderateScale(22),
        height: moderateScale(22),
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: moderateScale(10)
    } as ViewStyle,
    unreadText: {
        color: theme.colors.white,
        fontSize: moderateScale(14),
        fontWeight: '500'
    } as TextStyle,
    emptyContainer: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        paddingBottom: moderateScale(300),
        padding: moderateScale(30)
    } as ViewStyle,
    emptyImage: {
        height: moderateScale(110),
        width: moderateScale(150),
        marginVertical: moderateScale(10),
        alignSelf: 'center'
    } as ImageStyle,
    emptyTitle: {
        color: theme.colors.black,
        fontSize: moderateScale(25),
        textAlign: 'center',
        textTransform: 'capitalize',
        marginTop: moderateScale(20)
    } as TextStyle,
    emptySubtitle: {
        color: theme.colors.grayText,
        fontSize: moderateScale(15),
        textAlign: 'center',
        textTransform: 'capitalize',
        marginTop: moderateScale(10)
    } as TextStyle,
    loadingContainer: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        paddingBottom: moderateScale(300),
        padding: moderateScale(30)
    } as ViewStyle,
    listContent: {
        paddingBottom: moderateScale(0)
    } as ViewStyle
});

export default NotificationsHeader;