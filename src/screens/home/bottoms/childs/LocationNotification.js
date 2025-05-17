import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginActions from '../../../../actions/Actions';
// import firebase from 'react-native-firebase';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import PushNotificationIos from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';




class LocationNotificationFCM extends Component {
    watchID = null;
    async componentDidMount() {
        setTimeout(() => {
            this.PushNotificationSetup();
            Geocoder.fallbackToGoogle('AIzaSyAl_KkpIB-kNu2GIhc4Kxejd0DDESQWMRM');
            Geolocation.getCurrentPosition(
                position => {
                    Geocoder.geocodePosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }).then(res => {
                        console.log(res);
                        this.props.actions.locationNotificationFCM.setdefaultLocation({ country: res[0].countryCode, location: res[0].formattedAddress, geometry: { lat: position.coords.latitude, lng: position.coords.longitude } });
                    }).catch(err => {
                        console.log(err)
                    })
                },
                error => {
                    console.log(error);
                    if (Platform.OS === 'ios') Geolocation.requestAuthorization();
                    this.props.actions.locationNotificationFCM.setdefaultLocation({ location: this.props.data.selectedLocation.location, geometry: { lat: this.props.data.selectedLocation.geometry.lat, lng: this.props.data.selectedLocation.geometry.lng } });
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
            );


        }, 500);
    }
    _handleConnectionChange = (isConnected) => {
        this.props.actions.locationNotificationFCM.connectionState({ status: isConnected });
    };


    componentWillUnmount() {
        this.watchID != null && Geolocation.clearWatch(this.watchID);
        try {
            this.removeNotificationDisplayedListener();
            this.removeNotificationListener();
            this.removeNotificationOpenedListener();
        } catch (Ex) {

        }

    }

    async SaveToken() {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            if (!this.props.data.userInfo.fcm) {
                this.props.data.userInfo.fcm = []
                this.props.data.userInfo.fcm.push(fcmToken);
            } else {
                this.props.data.userInfo.fcm.push(fcmToken);
            }
            console.log('that user that we are trying to update', this.props.data.userInfo)
            this.props.actions.locationNotificationFCM.updateFcm({ fcm: fcmToken }, ((data) => {
                console.log('FCM Stored', data);
            }), ((err) => {
                console.log('FCM Error', err);
            }));
            console.log(fcmToken)
        } else {
            console.log('FCM', ' FCM error');

        }
    }




    async checkApplicationPermission() {
        const authorizationStatus = await messaging().requestPermission();

        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
            console.log('User has notification permissions enabled.');
            return true;
        } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
            console.log('User has provisional notification permissions.');
            return false;
        } else {
            console.log('User has notification permissions disabled');
            return false;
        }
    }


    checkNotificationClicked() {

        // console.log('checkNotificationClicked')


        // messaging().registerDeviceForRemoteMessages().then((flag) => {
        //     messaging().getAPNSToken().then(apns => {
        //         console.log("Apn Token", apns);
        //     }).catch((e) => {

        //         console.log('e', e)
        //     })
        // }).catch((err) => {
        //     console.log("message", err);
        // });

        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage,
            );
            // navigation.navigate(remoteMessage.data.type);
        });

        messaging().onMessage(async remoteMessage => {
            // console.log(remoteMessage);
            this.showNotification(remoteMessage);
        });


        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );
                    // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
                }
                // setLoading(false);
            });
    }

    showNotification(remoteMessage) {

        if (Platform.OS === 'android') {
            PushNotification.localNotification({
                message: remoteMessage.notification.body,
                title: remoteMessage.notification.title,
                bigPictureUrl: remoteMessage.notification.android.imageUrl,
                smallIcon: remoteMessage.notification.android.imageUrl,
                userInfo: remoteMessage.data,
            });
        } else {

            console.log({
                id: remoteMessage.messageId,
                body: remoteMessage.notification.body,
                title: remoteMessage.notification.title,
                userInfo: remoteMessage.data,
            })

            PushNotificationIos.addNotificationRequest({
                id: remoteMessage.messageId,
                body: remoteMessage.notification.body,
                title: remoteMessage.notification.title,
                userInfo: remoteMessage.data,
            });
        }

    }

    async PushNotificationSetup() {
        console.log('PushNotificationSetup')
        var enabled = await this.checkApplicationPermission();
        console.log('PushNotificationSetup', enabled)
        if (enabled) {
            // user has permissions
            // this.onNotification();
            this.SaveToken();
            this.checkNotificationClicked()
            await messaging().subscribeToTopic('notifications');

        } else {
            // user doesn't have permission
            try {
                await messaging().requestPermission();
                // this.onNotification();
                this.SaveToken();
            } catch (error) {
                console.log('error while permission notification', error)
            }
        }

    }



    render() {
        return null;
    }

    componentWillReceiveProps(nextProps) {
        // if (this.props.data.RefrashApp !== nextProps.data.RefrashApp) {
        //     this.props.data.userInfo.fcm = this.props.data.fcm;
        //     this.props.actions.locationNotificationFCM.updateProfile(this.props.data.userInfo, ((data) => {
        //         console.log('FCM Stored', data);
        //     }), ((err) => {
        //         console.log('FCM Error', err);
        //     }));
        // }
    }
}



const mapStateToProps = (state) => ({
    data: {
        userInfo: state.login.userInfo,
        selectedLocation: state.login.selectedLocation,
        RefrashApp: state.app.RefrashApp,
        fcm: state.app.fcm,
    },
    isConnected: state.connection.isConnected,
})
const mapDispatchToProps = (dispatch) => ({
    actions: {
        locationNotificationFCM: bindActionCreators(loginActions, dispatch)
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(LocationNotificationFCM))

