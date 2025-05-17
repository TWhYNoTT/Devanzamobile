import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, View, TouchableOpacity, Image, StatusBar, I18nManager, ActivityIndicator } from 'react-native';
import Button from 'apsl-react-native-button'
import { Block, Text } from '../../../../components/widget';
import { theme } from '../../../../core/theme';
import { showSuccess, showDanger, showInfo, translate, formatePhoneNumber } from '../../../../utils/utils';
import * as loginActions from '../../../../actions/Actions';
import OTPInput from 'react-native-otp';
import { Dimensions } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import Header from '../childs/Header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Input } from 'react-native-elements';
import { FONT_FAMILY } from '../../../../services/config';
import { messaging } from 'react-native-firebase';


class UserInfo extends Component {



    constructor(props) {
        super(props);
        this.state = { isLoading: false, login: 100, register: 0, name: 'Muhammmad', email: 'geeksera.online@gmail.com', last_name: 'Asif', phone: '0509763143', optView: false, sendAgainDisbale: false },


            this.inputRefs = {
                name1: null, name2: null, email: null, phone: null,
            };

    }


    onSuccess = (data) => {

        this.setState({ isLoading: false });
        if (data.message) {
            showSuccess(data.message);
        }
        this.props.navigation.pop(2);
    }
    onError = (error) => {
        this.setState({ isLoading: false })
        console.log(error)
        showDanger(error.message)
    }

    async onPress(otp) {

        if (this.state.name === '') {
            showDanger(translate('PLEASE ENTER FISRT NAME'));
            return;
        }
        if (this.state.last_name === '') {
            showDanger(translate('PLEASE ENTER LAST NAME'));
            return;
        }
        if (this.state.email === '') {
            showDanger(translate('PLEASE ENTER EMAIL'));
            return;
        }
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.state.email) === false) {
            showDanger(translate('PLEASE ENTER VALID EMAIL'));
            return;
        }

        if (this.state.phone === '') {
            showDanger(translate('PLEASE ENTER PHONE'));
            return;
        }


        if (this.state.phone.length < 6) {
            showDanger(translate('PLEASE ENTER VALID PHONE NUMBER' + this.state.phone));
            return;
        }

        var phoneNumber = formatePhoneNumber(this.state.phone);



        this.props.OnUserInfo({
            email: this.state.email.trim(), first_name: this.state.name.trim(),
            last_name: this.state.last_name.trim(), phone: phoneNumber,
        })





    }

    render() {
        return (
            <View style={styles.container_scrolling}>
                <View style={{ width: '100%', height: '100%' }}>
                    <View style={[styles.container, { flex: this.state.login }]}>

                        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ width: '95%' }} contentContainerStyle={{
                            justifyContent: 'center', paddingVertical: moderateScale(0), alignItems: 'center', paddingBottom: moderateScale(100), width: '100%', alignSelf: 'center', alignContent: 'center'
                        }}>
                            <View style={{
                                flex: 1,
                                width: '100%',
                                marginTop: moderateScale(20), borderWidth: moderateScale(1), borderRadius: moderateScale(20), borderColor: theme.colors.primary, alignSelf: 'center'

                            }}>


                                {!this.state.optView &&
                                    <View style={{
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        justifyContent: 'center', width: '110%', padding: moderateScale(20),
                                    }}>


                                        <View style={{
                                            alignSelf: 'center',
                                            alignItems: 'center',
                                            justifyContent: 'center', width: '100%', padding: moderateScale(20),
                                        }}>


                                            <Text style={{ color: theme.colors.gray04, marginTop: moderateScale(10), fontSize: moderateScale(15), paddingHorizontal: moderateScale(10), width: '100%', ...I18nManager.isRTL ? { textAlign: 'left' } : {}, }}>{translate('FIRST NAME')}</Text>
                                            <Input
                                                labelStyle={{ color: theme.colors.secondary }}
                                                defaultValue={this.state.name}
                                                containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
                                                inputContainerStyle={{
                                                    width: '100%', height: moderateScale(45),
                                                    ...I18nManager.isRTL ? { paddingHorizontal: moderateScale(10) } : { paddingHorizontal: moderateScale(10) }, borderBottomWidth: 0, backgroundColor: theme.colors.gray01, marginTop: moderateScale(5), borderRadius: moderateScale(10)
                                                }}
                                                inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                                ref={(input) => { if (input) { this.inputRefs.first_name = input; } }}
                                                onSubmitEditing={() => { this.inputRefs.last_name.focus() }}
                                                returnKeyType="next"
                                                placeholderTextColor={theme.colors.gray02}
                                                placeholder={translate('Muhammad')}
                                                onChangeText={(value) => this.setState({ name: value })}
                                            />





                                            <Text style={{ color: theme.colors.gray04, marginTop: moderateScale(10), fontSize: moderateScale(15), paddingHorizontal: moderateScale(10), width: '100%', ...I18nManager.isRTL ? { textAlign: 'left' } : {}, }}>{translate('LAST NAME')}</Text>
                                            <Input
                                                labelStyle={{ color: theme.colors.secondary }}
                                                defaultValue={this.state.last_name}
                                                containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
                                                inputContainerStyle={{
                                                    width: '100%', height: moderateScale(45),
                                                    ...I18nManager.isRTL ? { paddingHorizontal: moderateScale(10) } : { paddingHorizontal: moderateScale(10) }, borderBottomWidth: 0, backgroundColor: theme.colors.gray01, marginTop: moderateScale(5), borderRadius: moderateScale(10)
                                                }}
                                                inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                                ref={(input) => { if (input) { this.inputRefs.last_name = input; } }}
                                                onSubmitEditing={() => { this.inputRefs.phone.focus() }}
                                                returnKeyType="next"
                                                placeholderTextColor={theme.colors.gray02}
                                                placeholder={translate('Shafee')}
                                                onChangeText={(value) => this.setState({ last_name: value })}
                                            />








                                            <Text style={{ color: theme.colors.gray04, marginTop: moderateScale(10), fontSize: moderateScale(15), paddingHorizontal: moderateScale(10), width: '100%', ...I18nManager.isRTL ? { textAlign: 'left' } : {}, }}>{translate('PHONE')}</Text>
                                            <Input
                                                labelStyle={{ color: theme.colors.secondary }}
                                                containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
                                                inputContainerStyle={{
                                                    width: '100%', height: moderateScale(45),
                                                    ...I18nManager.isRTL ? { paddingRight: 10 } : {}, backgroundColor: theme.colors.gray01, marginTop: moderateScale(5), borderRadius: moderateScale(10),
                                                    borderBottomWidth: 0,
                                                }}
                                                inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY, }}
                                                ref={(input) => { if (input) { this.inputRefs.phone = input; } }}
                                                onSubmitEditing={() => { this.inputRefs.email.focus() }}
                                                returnKeyType="next"
                                                placeholderTextColor={theme.colors.gray02}
                                                leftIcon={
                                                    <View style={{ flexDirection: 'row', flexDireaction: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', height: '100%' }}>
                                                        <Image resizeMode="stretch"
                                                            source={require('app/assets/uae.png')}
                                                            style={{ width: moderateScale(20), height: moderateScale(20) }} />
                                                        <View style={{ height: '80%', backgroundColor: theme.colors.gray05, width: moderateScale(1), marginHorizontal: moderateScale(10), }} />
                                                    </View>
                                                }
                                                placeholder="0XXXXXXXXXXX"
                                                defaultValue={this.state.phone}
                                                onChangeText={(value) => this.setState({ phone: value })}
                                                autoCapitalize="none"
                                                autoCompleteType="tel"
                                                textContentType={'telephoneNumber'}
                                                placeholderTextColor={theme.colors.gray02}
                                                keyboardType="phone-pad"
                                            />


                                            <Text style={{ color: theme.colors.gray04, marginTop: moderateScale(10), fontSize: moderateScale(15), paddingHorizontal: moderateScale(10), width: '100%', ...I18nManager.isRTL ? { textAlign: 'left' } : {}, }}>{translate('EMAIL')}</Text>
                                            <Input
                                                labelStyle={{ color: theme.colors.secondary }}
                                                containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
                                                inputContainerStyle={{
                                                    width: '100%', height: moderateScale(45),
                                                    ...I18nManager.isRTL ? { paddingHorizontal: moderateScale(10) } : { paddingHorizontal: moderateScale(10) }, borderBottomWidth: 0, backgroundColor: theme.colors.gray01, marginTop: moderateScale(5), borderRadius: moderateScale(10)
                                                }}
                                                inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                                returnKeyType="done"
                                                ref={(input) => { if (input) { this.inputRefs.email = input; } }}
                                                placeholderTextColor={theme.colors.gray02}
                                                placeholder={translate('zyx123456789@abc.com')}
                                                value={this.state.email}
                                                onChangeText={(value) => this.setState({ email: value })}
                                                autoCapitalize="none"
                                                autoCompleteType="email"
                                                placeholderTextColor={theme.colors.gray02}
                                                textContentType="emailAddress"
                                                keyboardType="email-address"
                                            />

                                        </View>

                                    </View>
                                }
                            </View>




                            {!this.state.optView &&
                                <Block
                                    space="between"
                                    style={{ marginBottom: theme.sizes.base * 0, margin: 15 }}>
                                    <Text gray2 style={{ color: theme.colors.gray04, textTransform: 'capitalize', ...I18nManager.isRTL ? { textAlign: 'left' } : {}, }}>{translate('your shipments are linked to your phone number listed abpveif you need to change the phone number linked with your accoun')}
                                    </Text>

                                    <Button mode="contained"
                                        disabled={this.state.name === '' || this.state.last_name === '' || this.state.phone === '' || this.state.email === ''}
                                        isLoading={this.state.isLoading} style={{
                                            borderColor: 'transparent', color: theme.colors.white, backgroundColor: theme.colors.primary,
                                            borderRadius: moderateScale(20), marginTop: moderateScale(20), marginBottom: moderateScale(10),
                                        }} textStyle={{
                                            fontSize: moderateScale(20),
                                            color: theme.colors.white,
                                            fontWeight: 'bold',
                                            fontFamily: FONT_FAMILY
                                        }}
                                        onPress={() => this.onPress()}>
                                        {translate('Done')}</Button>
                                </Block>


                            }

                        </KeyboardAwareScrollView>
                    </View>
                    <View style={{ height: Dimensions.get('screen').height / 30 }}></View>




                </View>

            </View >
        );
    }
}
const mapStateToProps = (state) => {
    return {}
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            login: bindActionCreators(loginActions, dispatch)
        }
    }
}

const styles = StyleSheet.create({
    container_scrolling: {
        flex: 1,
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        marginTop: 0,
    },
    label: {
        color: theme.colors.gray04,
    },
    labelOr: {
        marginBottom: 10,
        fontSize: 20,
        marginTop: 10,
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    container: {
        flex: 1,
        paddingEnd: 15,
        paddingStart: 15,
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    separatorContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 10
    },
    separatorLine: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        height: StyleSheet.hairlineWidth,
        borderColor: theme.colors.gray,
        borderWidth: 0.5,
    },
    separatorOr: {
        color: theme.colors.secondary,
        marginHorizontal: 20,
        fontSize: 18
    },
    transparentButton: {
        marginTop: 30,
        borderColor: '#3B5699',
        borderWidth: 2
    },
    inline: {
        flexDirection: 'row'
    },
    buttonBlueText: {
        fontSize: 20,
        color: '#3B5699'
    },
    buttonBigText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    containerSocial: {
        width: '90%',
        flexDirection: 'column',
    },
    GooglePlusStyle: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dc4e41',
        borderWidth: 1,
        borderColor: theme.colors.black,
        height: 40,
        borderRadius: 5,
        margin: 5,
    },
    FacebookStyle: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#485a96',
        borderWidth: 1,
        borderColor: theme.colors.black,
        height: 40,
        borderRadius: 5,
        margin: 5,
    },
    ImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
    },
    TextStyle: {
        color: '#fff',
        marginTop: 1,
        fontWeight: '600',
        marginStart: 10,
        marginRight: 20,
    },
    SeparatorLine: {
        backgroundColor: theme.colors.black,
        width: 1,
        height: 40,
    },
    placeholderText: {
        color: theme.colors.gray02
    },
    text: {
        width: '100%',
        color: theme.colors.black
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(UserInfo))
