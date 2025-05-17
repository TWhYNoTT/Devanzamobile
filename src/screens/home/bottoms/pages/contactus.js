import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginActions from '../../../../actions/Actions';
//view
import {
    View,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity, Linking, Platform, I18nManager
} from 'react-native';
import { theme } from '../../../../core/theme';
import { StatusBar } from 'react-native';
import TextInput from '../../../../components/Weights/TextInput';
import Button from 'apsl-react-native-button'
import { Text } from '../../../../components/widget';
import { showDanger, showSuccess, translate } from '../../../../utils/utils';
import Header from '../childs/Header';
import { moderateScale } from 'react-native-size-matters';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Marker } from 'react-native-maps';
import { FONT_FAMILY } from '../../../../services/config';


class ContactUs extends Component {


    state = { isLoading: true, }
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            name: '', email: '', message: ''
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidMount() {
        if (this.props.data?.userInfo?.first_name) {
            this.state = {
                name: this.props.data?.userInfo?.first_name + " " + this.props.data?.userInfo?.last_name, email: this.props.data?.userInfo?.email, message: ''
            }
        }
    }


    contactus() {


        if (this.state.name === '') {
            showDanger(translate('Please Enter Your Name'));
            return;
        }

        if (this.state.email === '') {
            showDanger(translate('Please Enter Your Email'));
            return;
        }

        if (this.state.message === '') {
            showDanger(translate('Please Enter Your Message'));
            return;
        }
        this.setState({ submitReview: true })
        setTimeout(() => {
            this.props.actions.contactus.contactus({ name: this.state.name, email: this.state.email, message: this.state.message }, this.onSuccess, this.onError);
        }, 1000);
    }

    onSuccess = (response) => {
        this.setState({ submitReview: false })
        if (response.code !== 200) {
            showDanger(response.message);
            return;
        }

        showSuccess(translate('Thanks For Contacting Us'));
        this.setState({ name: '', email: '', message: '', subject: '', phone: '' })
    }

    onError = (error) => {
        this.setState({ submitReview: false })
        showDanger(translate('Try Again'));
        // console.log('ContactUS', error)
    }

    render() {
        return (
            <View style={styles.container_scrolling}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header backPress={() => { this.props.navigation.pop() }} search={false} backPrimary={false} Text={translate('')} back={true} navigation={this.props.navigation} />


                <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: moderateScale(100) }}>

                    <View style={{ marginTop: moderateScale(0), flexDirection: 'column' }}>

                        <View style={{ marginStart: moderateScale(20), marginEnd: moderateScale(20), marginVertical: moderateScale(0), zIndex: 1, }}>
                            <View showsVerticalScrollIndicator={false} style={{ paddingVertical: moderateScale(10) }}>
                                <Text bold style={styles.heading}>{translate('Be part of helping us improve our services')}</Text>


                                <TextInput
                                    style={{
                                        borderRadius: 5, borderColor: theme.colors.gray05, backgroundColor: theme.colors.white, borderRadius: moderateScale(10),
                                        borderWidth: 0, height: moderateScale(140), paddingStart: 10, ...I18nManager.isRTL ? { paddingEnd: 10, textAlign: 'right' } : {},
                                        fontFamily: FONT_FAMILY, height: moderateScale(220), paddingTop: moderateScale(10), paddingHorizontal: moderateScale(10),
                                    }}
                                    value={this.state.message}
                                    onChangeText={text => this.setState({ message: text })}
                                    multiline={true}
                                    placeholder={translate('Write your feedback here…')}
                                    blurOnSubmit={true}
                                    underlineColorAndroid='transparent'
                                    autoCapitalize="sentences"
                                />





                            </View>
                        </View>




                    </View>




                </ScrollView>
                <Button mode="contained"
                    activityIndicatorColor={theme.colors.white}
                    isDisabled={this.state.message === ''}
                    style={{
                        borderColor: 'transparent', color: theme.colors.white, borderRadius: moderateScale(10),
                        backgroundColor: theme.colors.primary, marginTop: moderateScale(20), width: '80%', alignSelf: 'center', position: 'absolute', bottom: moderateScale(20)
                    }} textStyle={{
                        fontSize: moderateScale(15),
                        color: theme.colors.white,
                        fontFamily: FONT_FAMILY, fontWeight: 'bold'
                    }}
                    onPress={() => { showSuccess('Thanks for feedback!!'); this.props.navigation.navigate('Browse') }}>
                    {translate('Submit')}</Button>

            </View >
        );
    }
}

const mapStateToProps = (state) => ({
    data: {
        userInfo: state.login.userInfo
    },
})


const mapDispatchToProps = (dispatch) => ({
    actions: {
        contactus: bindActionCreators(loginActions, dispatch)
    }
})


const styles = StyleSheet.create({
    container_scrolling: {
        flex: 1,
    },
    wrapper: {
        flex: 1,
    },
    scrollview: {
        paddingTop: 9,
    },
    scrollViewContent: {
        paddingBottom: 80,
    },
    categories: {
        marginBottom: 10,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
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
        marginTop: 10,
        paddingHorizontal: theme.sizes.base * 1
    },
    inputmessage: {
        width: '100%',
        marginTop: 5,
        marginBottom: 5,
        minHeight: 150,
        paddingStart: 10,
        paddingEnd: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        width: '100%',
        height: 35,
        marginTop: 5,
        marginBottom: 5,
        paddingStart: 10,
        paddingEnd: 10,
        borderBottomColor: theme.colors.gray03,
        borderBottomWidth: 0,
    },
    checkout: {
        width: '100%',
        color: theme.colors.primary,
        borderRadius: moderateScale(10),
        borderWidth: 0,
        fontWeight: '400',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center', backgroundColor: theme.colors.primary
    },
    heading: {
        fontSize: moderateScale(25),
        color: theme.colors.text,
        width: '100%', alignSelf: 'center', marginTop: moderateScale(30), ...I18nManager.isRTL ? { textAlign: 'left' } : {},
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(ContactUs))
