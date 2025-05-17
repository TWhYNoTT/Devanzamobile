import React, { Component } from 'react';
import { ScrollView, Image, StyleSheet, TouchableOpacity, View, Alert, TouchableHighlight, I18nManager, ImageBackground } from 'react-native'

import { getSettings, getUser, setUser, saveSettings, clearCart } from '../../../../utils/storage'
import { theme } from '../../../../core/theme';
import { Block, Text, Switch, DividerSecond } from '../../../../components/widget';
import * as loginActions from '../../../../actions/Actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showSuccess, translate, setI18nConfig, showDanger } from '../../../../utils/utils';
import RNRestart from 'react-native-restart'; // Import package from node modules
import {
    CachedImage
} from 'react-native-cached-image';
import { BASE_API_URL } from '../../../../services/config';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { moderateScale } from 'react-native-size-matters';
import Header from '../childs/Header';

class Settings extends Component {

    state = {
        notifications: true, language: false, languageText: 'عربى', settings: {}, user: {}, isLogin: false, url: ''
    }

    constructor(props) {
        super(props);
    }

    onSuccess = (response) => {
        // console.log('Settings', response);
        if (response.code === 200) {
            showSuccess(response.message);
            setUser(response.data)
        } else {
            showDanger(response.message);
        }
    }

    onError = (error) => {
        showDanger('Try Again');
        // console.log('Settings', error)
    }
    componentDidMount() {


        if (this.props.data.userInfo.profile) {
            if (this.props.data.userInfo.profile.includes('facebook') || this.props.data.userInfo.profile.includes('google')) {
                this.setState({ url: this.props.data.userInfo.profile });
            } else {
                this.setState({ url: BASE_API_URL + this.props.data.userInfo.profile });
            }
        }


        if (this.props.data.userInfo && this.props.data.userInfo.email) {
            this.setState({ isLogin: true })
        } else {
            this.setState({ isLogin: false })
        }


        getSettings().then((settings) => {
            // console.log('Settings', settings)
            if (settings) {
                this.setState({ language: settings.language });
                this.setState({ notifications: settings.notifications });
                this.setState({ languageText: settings.languageText });
                this.setState({ settings: settings });
            } else {

                this.setState({ settings: {} });
                this.setState({ language: false });
                this.setState({ notifications: true });
                this.setState({ languageText: 'عربى' });
            }
        }).catch((error) => {
            // console.log('SettingsError', error)
        });

        getUser().then((user) => {
            // console.log('User', user)
            this.setState({ user: user });
            if (user.newsletter) {
                this.setState({ notifications: true });
            } else {
                this.setState({ notifications: false });
            }


        });
    }

    Newsletter(value) {
        this.setState({ notifications: value });
        if (value) {
            this.state.user.newsletter = 1;
        } else {
            this.state.user.newsletter = 0;
        }
        this.setState({ user: this.state.user })
        // console.log(this.state.user)

        this.props.actions.settings.updateProfile(this.state.user, this.onSuccess, this.onError)

    }
    Language(value) {
        Alert.alert(
            translate('ChangeLanguage'),
            translate('changeLanguageMessage'),
            [
                {
                    text: translate('Yes'), onPress: () => {
                        this.setState({ language: value });
                        if (value) {
                            this.state.languageText = 'عربى'
                            this.state.settings.language = true;
                            setI18nConfig('ar');
                        } else {
                            this.state.languageText = 'عربى'
                            this.state.settings.language = false;
                            setI18nConfig('en');
                        }
                        saveSettings(this.state.settings);
                        clearCart().then(() => {
                            this.forceUpdate();
                            RNRestart.Restart();
                        }).catch((err) => {
                            this.forceUpdate();
                            RNRestart.Restart();
                        });
                    }
                },
                {
                    text: translate('Cancel'),
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                }],
            { cancelable: true },
        );




    }


    navigateToScreen = (route) => () => {
        if (route === 'LOGOUT') {
            this.props.navigation.dispatch(loginActions.setUserInfo({ profile: '' }));
            this.setState({ data: { userInfo: {} } })
            setTimeout(() => {
                setToken('')
                clearToken();
                clearUser();
                const { navigation } = this.props;
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Splash' }),
                    ],
                });
                navigation.dispatch(resetAction);
            }, 300);

        } else {
            setTimeout(() => {
                const { navigation } = this.props;
                navigation.navigate(route);
            }, 0);
        }
    };

    render() {
        return (

            <Block>
                <Header back={true} options={true} optionsclick={() => { this.sort.show() }} Text={translate('Settings')} backclick={() => { this.props.navigation.pop() }} color={theme.colors.primary} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Block style={[styles.toggles]}>
                        <Block
                            row
                            center
                            space="between"
                            style={{ marginBottom: theme.sizes.base * 0.3, margin: 10 }} >
                            <Text gray2 style={{ fontWeight: '600', color: theme.colors.white, fontSize: moderateScale(15) }}>{translate('language').toUpperCase()}</Text>
                            <Switch
                                value={this.state.language}
                                onValueChange={value => this.Language(value)}
                            />
                        </Block>
                        <View style={{ backgroundColor: theme.colors.gray07, width: '100%', height: 2, marginTop: 4 }} />

                    </Block>
                </ScrollView>
            </Block>
        )
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.data.userInfo.profile) {
            if (nextProps.data.userInfo.profile.includes('facebook') || nextProps.data.userInfo.profile.includes('google')) {
                this.setState({ url: nextProps.data.userInfo.profile });
            } else {
                this.setState({ url: BASE_API_URL + nextProps.data.userInfo.profile });
            }
        }
    }

}

const mapStateToProps = (state) => ({
    data: {
        userInfo: state.login.userInfo
    },
})
const mapDispatchToProps = (dispatch) => ({
    actions: {
        settings: bindActionCreators(loginActions, dispatch)
    }
})


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        backgroundColor: '#fff',
    },

    headerText: {
        fontSize: 25,
        alignSelf: 'center',
    },
    back: {
        alignSelf: 'flex-end',
        height: 50,
        width: 50,
        borderRadius: 20,
        marginRight: 10,
    },

    header: {
        marginTop: 100,
        marginBottom: 30,
        color: 'white',
        alignItems: 'center',
        paddingHorizontal: theme.sizes.base * 2,
    },
    avatar: {
        height: 120,
        width: 120
    },
    inputs: {
        marginTop: theme.sizes.base * 0,
        paddingHorizontal: theme.sizes.base * 2,
    },
    inputRow: {
        alignItems: 'flex-end'
    },
    sliders: {
        marginTop: theme.sizes.base * 0.7,
        paddingHorizontal: theme.sizes.base * 2,
    },
    thumb: {
        width: theme.sizes.base,
        height: theme.sizes.base,
        borderRadius: theme.sizes.base,
        borderColor: 'white',
        borderWidth: 3,
        backgroundColor: theme.colors.secondary,
    },
    groupHeader: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    groupTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    groupTitleText: {
        flex: 0.9,
        paddingHorizontal: 10,
        fontSize: 17,
        fontWeight: '500',
        color: theme.colors.blue
    },
    groupTitleArrow: {
        width: 12,
        tintColor: theme.colors.blue,
        height: 12,
        flex: 0.1,
        marginRight: 5
    },
    toggles: {
        marginTop: 0,
        paddingHorizontal: theme.sizes.base * 1
    },
    storyCounters: {
        justifyContent: "center",
        alignItems: "center"
    },
    imgstoryCounters: {
        width: '100%'
    },
    iconCounter: {
        height: 110,
        width: 110,
    },
    icon: {
        height: 20,
        width: 20,
    },
    iconSelected: {
        height: 20,
        width: 20,
        tintColor: theme.colors.black
    },
    iconCounterText: {
        color: theme.colors.primary,
        width: '100%',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        textAlign: "center"
    },
    HeaderView: {
        justifyContent: 'center',
        marginBottom: 20,
        flexDirection: 'row'
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Settings))