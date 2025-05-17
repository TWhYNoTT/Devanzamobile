// src/screens/Browse/components/NotificationModal.tsx
import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { moderateScale } from 'react-native-size-matters';
import { theme } from '../../../../../core/theme';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
}

interface NotificationModalProps {
    visible: boolean;
    onClose: () => void;
    notifications?: Notification[];
}

const NotificationModal: React.FC<NotificationModalProps> = ({
    visible,
    onClose,
    notifications = []
}) => {
    const renderNotification = (notification: Notification) => (
        <TouchableOpacity
            key={notification.id}
            style={[
                styles.notificationItem,
                !notification.isRead && styles.unreadNotification
            ]}
        >
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <Text style={styles.notificationTime}>{notification.timestamp}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <StatusBar style="light" />
                <View style={styles.header}>
                    <Text style={styles.title}>Notifications</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeButton}>Close</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {notifications.length > 0 ? (
                        notifications.map(renderNotification)
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No notifications yet</Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: moderateScale(20),
        backgroundColor: theme.colors.primary,
    },
    title: {
        fontSize: moderateScale(20),
        color: theme.colors.white,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: moderateScale(16),
        color: theme.colors.white,
    },
    content: {
        flex: 1,
        padding: moderateScale(20),
    },
    notificationItem: {
        padding: moderateScale(15),
        borderRadius: moderateScale(10),
        backgroundColor: theme.colors.white,
        marginBottom: moderateScale(10),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    unreadNotification: {
        backgroundColor: theme.colors.grayBackground,
    },
    notificationTitle: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
        color: theme.colors.black,
        marginBottom: moderateScale(5),
    },
    notificationMessage: {
        fontSize: moderateScale(14),
        color: theme.colors.grayText,
        marginBottom: moderateScale(5),
    },
    notificationTime: {
        fontSize: moderateScale(12),
        color: theme.colors.gray,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: moderateScale(16),
        color: theme.colors.gray,
    },
});

export default NotificationModal;