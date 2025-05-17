import React, { Component } from 'react';
import { Image, StyleSheet, View, I18nManager, StatusBar, Modal, TouchableWithoutFeedback,TouchableOpacity } from 'react-native'

import { theme } from '../../../../core/theme';
import { Block, Text } from '../../../../components/widget';
import * as loginActions from '../../../../actions/Actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showSuccess, showDanger, translate, getCountryCode } from '../../../../utils/utils';
import { BASE_API_URL, FONT_FAMILY } from '../../../../services/config';
import Button from 'apsl-react-native-button'
import { Input } from 'react-native-elements';
import { moderateScale } from 'react-native-size-matters';
import Header from '../childs/Header';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CountryPicker from 'react-native-country-picker-modal';
import emojiFlags from 'emoji-flags';



class Profile extends Component {



    constructor(props) {
        super(props);
        this.state = {
            notifications: true, language: false, electCountry: false, flag: emojiFlags.countryCode(getCountryCode(this.props.data.userInfo.phone.split(' ')[0])), profileUrl: {}, settings: {}, user: {}, isImageViewVisible: false, isLoading: false, SaveprofileLoading: false, updatePasswrod: false
        }
        this.inputRefs = {
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true, user: this.props.data.userInfo })
        setTimeout(() => {
            this.props.actions.settings.fetchUserInfo(this.onSuccessProfile, this.onErrorProfile)
        }, 500);

    }

    onSuccess = (response) => {
        this.setState({ isLoading: false });
        console.log(response);
        if (response.code === 200) {
            var url = response.data.urls[0];
            if (url) {
                this.state.user.profile = url;
                this.setState({ user: this.state.user })
                this.props.actions.settings.updateProfile(this.state.user, this.ProfileonSuccess, this.ProfileonError);
            }
        }

    }

    onError = (error) => {
        this.setState({ isLoading: false });
        console.log(error);
        showSuccess('Try Again');
    }




    onSuccessProfile = (user) => {
        this.setState({ isLoading: false });

        // console.log('Profile', user)
        if (user) {
            this.setState({ user: user });
            if (user.newsletter) {
                this.setState({ notifications: true });
            } else {
                this.setState({ notifications: false });
            }

            if (this.state.user.profile && this.state.user.profile.includes("facebook") && this.state.user.profile.includes("google")) {
                this.setState({ profileUrl: { source: { uri: this.state.user.profile } } })
            } else {
                this.setState({ profileUrl: { source: { uri: BASE_API_URL + this.state.user.profile } } })
            }

        }

    }

    onErrorProfile = (error) => {
        this.setState({ isLoading: false });
        // console.log(error);
        // showDanger(error.message);
    }

    ProfileonSuccess = (response) => {
        this.setState({ isLoading: false, SaveprofileLoading: false });
        console.log('Profile', response);
        showSuccess('PROFILE UPDATED');
        delete this.state.user.old_password
        delete this.state.old_password;
        delete this.state.user.new_password
        delete this.state.new_password;
        delete this.state.confirm_new_password;
        this.props.navigation.pop();
    }

    ProfileonError = (error) => {
        this.setState({ isLoading: false, SaveprofileLoading: false });
        console.log('Profile', error);
        showDanger(translate(error.message));
    }






    getopacityforUpdatePasswordButton() {
        if (!this.state.old_password || !this.state.new_password || !this.state.confirm_new_password) {
            return 0;
        }
        if (this.state.new_password !== this.state.confirm_new_password) {
            return 0;
        }

        return 1;
    }

    saveProfile() {

        if (this.state.old_password && this.state.new_password) {
            if (this.state.new_password !== this.state.confirm_new_password) {
                showDanger("Password not Match");
                return;
            }
            this.state.user.old_password = this.state.old_password;
            this.state.user.new_password = this.state.new_password;
        }

        // this.state.user.phone = formatePhoneNumber(this.state.user.phone);
        // var phone = String(this.state.user.phone).startsWith('0') ? '' + this.state.user.phone : '0' + this.state.user.phone;
        // console.log(phone, String(this.state.user.phone).startsWith('0'))
        // let reg = /^(?:\+971|00971|0)(?:2|3|4|6|7|9|50|51|52|55|56)[0-9]{7}$/;
        // if (reg.test(phone) === false) {
        //     showDanger(translate('INVALID PHONE NUMBER'));
        //     return;
        // }

        // this.state.user.phone = formatePhoneNumber(this.state.user.phone);
        // delete this.state.user.fcm;
        // delete this.state.user._v;
        // delete this.state.user._id;
        // delete this.state.user.password;
        // delete this.state.user.active;
        // delete this.state.user.createdAt;
        // delete this.state.user.updatedAt;
        // delete this.state.user.__v;


        console.log(this.state.user)
        this.setState({ SaveprofileLoading: true })
        this.props.actions.settings.updateProfile(this.state.user, this.ProfileonSuccess, this.ProfileonError);
    }

    Newsletter(value) {
        this.setState({ notifications: value });
        if (value) {
            this.state.user.newsletter = 1;
        } else {
            this.state.user.newsletter = 0;
        }
        this.setState({ user: this.state.user })

    }


    render() {
        return (
            <View style={styles.container} >
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header backPress={() => { this.props.navigation.pop() }} Text={translate('')} color={'transparent'} back={true} navigation={this.props.navigation} search={false} more={false} />



                {this.state.selectCountry &&
                    <CountryPicker
                        modalProps={{ visible: this.state.selectCountry }}
                        countryList={'AE', 'PK'}
                        onClose={() => { this.setState({ selectCountry: false }) }}
                        onSelect={(value) => {
                            console.log(value)
                            this.setState({ cca2: value.cca2, callingCode: value.callingCode, selectCountry: false, flag: emojiFlags.countryCode(value.cca2) });
                        }}
                        cca2={this.state.cca2}
                        translation='eng'
                    />
                }



                <View style={{ alignContent: 'center', width: '100%', padding: moderateScale(25), paddingBottom: moderateScale(0) }}>
                    <Text bold style={{ fontSize: moderateScale(30), marginTop: moderateScale(20) }}>
                        {translate('Profile')}
                    </Text>
                </View>

                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'center', width: '100%', alignContent: 'center', alignSelf: 'center', paddingBottom: moderateScale(100) }}>
                    <Block style={styles.toggles}>




                        <View style={{ marginHorizontal: moderateScale(10), marginTop: moderateScale(20) }}>

                            <Input
                                labelStyle={{ color: theme.colors.secondary }}
                                defaultValue={this.state.user.name}
                                containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
                                inputContainerStyle={{
                                    width: '100%', width: '100%', height: moderateScale(45),
                                    ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) }, borderBottomWidth: 1, borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                                }}
                                inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                ref={(input) => { if (input) { this.inputRefs.first_name = input; } }}
                                onSubmitEditing={() => { this.inputRefs.email.focus() }}
                                returnKeyType="next"
                                placeholderTextColor={theme.colors.gray02}
                                placeholder={translate('Muhammad')}
                                onChangeText={(value) => { this.setState({ user: { ...this.state.user, name: value } }); }}
                            />




                            <View style={{
                                width: '100%', flexDirection: 'row', marginTop: moderateScale(20)

                            }}>
                                <TouchableOpacity style={{
                                    flexDirection: 'row', flexDireaction: 'column', justifyContent: 'center', alignItems: 'center',
                                    alignContent: 'center', height: '80%', borderBottomWidth: moderateScale(1), borderColor: theme.colors.line,
                                    marginEnd: moderateScale(10), height: moderateScale(45)
                                }} onPress={() => {
                                    // this.setState({ selectCountry: true }) 
                                }}>
                                    <Text style={[{
                                        textAlign: 'center',
                                        color: theme.colors.secondary, fontSize: moderateScale(25), marginEnd: moderateScale(5)
                                    }]}>{this.state.flag.emoji}</Text>
                                    <Text style={[{
                                        textAlign: 'center',
                                        color: theme.colors.secondary, fontSize: moderateScale(15), marginEnd: moderateScale(5)
                                    }]}>{String(this.state.user.phone).split(' ')[0]}</Text>
                                    <Image resizeMode={'contain'} style={{ height: moderateScale(10), width: moderateScale(13), marginEnd: moderateScale(10) }} source={require('../../../../assets/arrow-down-gray.png')} />

                                </TouchableOpacity>
                                <Input
                                    disabled
                                    labelStyle={{ color: theme.colors.secondary }}
                                    containerStyle={{ paddingLeft: 0, paddingRight: 0, }}
                                    inputContainerStyle={{
                                        width: '100%', width: '100%', height: moderateScale(45),
                                        ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) }, borderBottomWidth: 1, borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                                    }}
                                    inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                    ref={(input) => { if (input) { this.inputRefs.phone = input; } }}
                                    onSubmitEditing={() => { this.inputRefs.email.focus() }}
                                    returnKeyType="next"
                                    placeholderTextColor={theme.colors.gray02}
                                    placeholder={translate('+971XXXXXXXXXXX')}
                                    defaultValue={String(this.state.user.phone).split(' ')[1]}
                                    onChangeText={(value) => { this.setState({ user: { ...this.state.user, phone: value } }); console.log('we are in change ', this.state.user); }}
                                />

                            </View>




                            <Input
                                labelStyle={{ color: theme.colors.secondary }}
                                containerStyle={{ paddingLeft: 0, paddingRight: 0, marginTop: moderateScale(20) }}
                                inputContainerStyle={{
                                    width: '100%', width: '100%', height: moderateScale(45),
                                    ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) }, borderBottomWidth: 1, borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                                }}
                                inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                ref={(input) => { this.inputRefs.country = input; }}
                                returnKeyType="done"
                                ref={(input) => { if (input) { this.inputRefs.email = input; } }}
                                placeholderTextColor={theme.colors.gray02}
                                placeholder={translate('zyx123456789@abc.com')}
                                defaultValue={this.state.user.email}
                                onChangeText={(value) => this.setState({ user: { ...this.state.user, email: value } })}
                            />



                            <View>
                                <Input
                                    labelStyle={{ color: theme.colors.secondary }}
                                    defaultValue={this.state.last_name}
                                    containerStyle={{ paddingLeft: 0, paddingRight: 0, marginTop: moderateScale(10) }}
                                    inputContainerStyle={{
                                        width: '100%', width: '100%', height: moderateScale(45),
                                        ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) }, borderBottomWidth: 1, borderBottomColor: theme.colors.line, backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                                    }}
                                    placeholderTextColor={theme.colors.gray}
                                    inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                    ref={(input) => { if (input) { this.inputRefs.password = input; } }}
                                    returnKeyType="done"
                                    placeholder={translate('Password')}
                                    value={this.state.password}
                                    onChangeText={(value) => this.setState({ password: value })}
                                    secureTextEntry={!this.state.HideShow}
                                />
                                <View style={{ position: 'absolute', right: 0, top: moderateScale(20), }}>
                                    <TouchableOpacity onPress={() => { this.setState({ HideShow: !this.state.HideShow }) }}>
                                        <Text style={{
                                            color: theme.colors.primary,
                                            fontSize: moderateScale(15), textAlign: 'left', textTransform: 'capitalize', fontWeight: 'bold'
                                        }}>{translate(this.state.HideShow ? 'Hide' : 'Show')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>


                            <Block
                                column
                                space="between"
                                style={{ marginBottom: theme.sizes.base * 0, margin: 0 }}>
                                <TouchableOpacity >
                                    <Text style={{ color: theme.colors.primary, textTransform: 'capitalize', marginTop: moderateScale(10), fontSize: moderateScale(15), ...I18nManager.isRTL ? { textAlign: 'left' } : {}, fontWeight: 'bold' }}>{('\n' + translate('Update Password') + '\n'.toUpperCase())}</Text>
                                </TouchableOpacity>
                            </Block>









                        </View>


                    </Block>






                </KeyboardAwareScrollView>

                <Button isLoading={this.state.SaveprofileLoading}

                    isDisabled={this.state.user.first_name === '' || this.state.user.email === ''}
                    style={{
                        borderColor: theme.colors.primary, marginTop: moderateScale(35),
                        borderRadius: moderateScale(10), borderWidth: moderateScale(0), height: moderateScale(40), width: '80%', backgroundColor: theme.colors.primary, bottom: moderateScale(20), alignSelf: 'center', position: 'absolute',
                    }} textStyle={{ fontSize: moderateScale(16), color: theme.colors.white, fontFamily: FONT_FAMILY, fontWeight: 'bold' }}
                    onPress={() => {

                        delete this.state.user.old_password
                        delete this.state.old_password;
                        delete this.state.user.new_password
                        delete this.state.new_password;
                        delete this.state.confirm_new_password;


                        this.saveProfile();
                    }}>{translate('SAVE')}</Button>


                {this.state.updatePasswrod &&
                    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: "center" }}>
                        <Modal
                            animationType="slide"
                            presentationStyle={'pageSheet'}
                            visible={this.state.updatePasswrod}
                            onRequestClose={() => {
                                this.setState({ updatePasswrod: false })
                            }}
                            onDismiss={() => {
                                this.setState({ updatePasswrod: false })
                            }}>
                            <TouchableWithoutFeedback
                                activeOpacity={1}
                                onPressOut={(e) => {
                                    if (e.nativeEvent.locationY < 0) {
                                        this.setState({ updatePasswrod: false });
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}>
                                <View style={{
                                    flex: 1,
                                    height: '100%',
                                    backgroundColor: "white",
                                }}>
                                    <View style={{
                                        marginTop: 20,
                                        borderRadius: 20, marginHorizontal: moderateScale(20)
                                    }}>


                                        <Text style={styles.heading}>{translate('UPDATE PASSWORD').toUpperCase()}</Text>


                                        <Text style={{ color: theme.colors.gray04, marginTop: moderateScale(10), fontSize: moderateScale(15), paddingHorizontal: moderateScale(10), width: '100%', ...I18nManager.isRTL ? { textAlign: 'left' } : {}, }}>{translate('OLD PASSWORD')}</Text>
                                        <Input
                                            autoFocus
                                            labelStyle={{ color: theme.colors.secondary }}
                                            defaultValue={this.state.last_name}
                                            containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
                                            inputContainerStyle={{
                                                width: '100%', height: moderateScale(45),
                                                ...I18nManager.isRTL ? { paddingHorizontal: moderateScale(10) } : { paddingHorizontal: moderateScale(10) }, borderBottomWidth: 0, backgroundColor: theme.colors.gray01, marginTop: moderateScale(5), borderRadius: moderateScale(10)
                                            }}
                                            inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                            ref={(input) => { if (input) { this.inputRefs.old_password = input; } }}
                                            onSubmitEditing={() => { this.inputRefs.new_password.focus() }}
                                            returnKeyType="next"
                                            placeholderTextColor={theme.colors.gray02}
                                            placeholder="*****"
                                            value={this.state.old_password}
                                            onChangeText={(value) => this.setState({ old_password: value })}
                                            secureTextEntry
                                        />


                                        <Text style={{ color: theme.colors.gray04, marginTop: moderateScale(10), fontSize: moderateScale(15), paddingHorizontal: moderateScale(10), width: '100%', ...I18nManager.isRTL ? { textAlign: 'left' } : {}, }}>{translate('NEW PASSWORD')}</Text>
                                        <Input
                                            labelStyle={{ color: theme.colors.secondary }}
                                            defaultValue={this.state.last_name}
                                            containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
                                            inputContainerStyle={{
                                                width: '100%', height: moderateScale(45),
                                                ...I18nManager.isRTL ? { paddingHorizontal: moderateScale(10) } : { paddingHorizontal: moderateScale(10) }, borderBottomWidth: 0, backgroundColor: theme.colors.gray01, marginTop: moderateScale(5), borderRadius: moderateScale(10)
                                            }}
                                            inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                            ref={(input) => { if (input) { this.inputRefs.new_password = input; } }}
                                            onSubmitEditing={() => { this.inputRefs.confirm_new_password.focus() }}
                                            returnKeyType="next"
                                            placeholderTextColor={theme.colors.gray02}
                                            placeholder="*****"
                                            value={this.state.new_password}
                                            onChangeText={(value) => this.setState({ new_password: value })}
                                            secureTextEntry
                                        />



                                        <Text style={{ color: theme.colors.gray04, marginTop: moderateScale(10), fontSize: moderateScale(15), paddingHorizontal: moderateScale(10), width: '100%', ...I18nManager.isRTL ? { textAlign: 'left' } : {}, }}>{translate('CONFIRM NEW PASSWORD')}</Text>
                                        <Input
                                            labelStyle={{ color: theme.colors.secondary }}
                                            defaultValue={this.state.last_name}
                                            containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
                                            inputContainerStyle={{
                                                width: '100%', height: moderateScale(45),
                                                ...I18nManager.isRTL ? { paddingHorizontal: moderateScale(10) } : { paddingHorizontal: moderateScale(10) }, borderBottomWidth: 0, backgroundColor: theme.colors.gray01, marginTop: moderateScale(5), borderRadius: moderateScale(10)
                                            }}
                                            inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                            ref={(input) => { if (input) { this.inputRefs.confirm_new_password = input; } }}
                                            returnKeyType="done"
                                            placeholderTextColor={theme.colors.gray02}
                                            placeholder="*****"
                                            value={this.state.confirm_new_password}
                                            onChangeText={(value) => this.setState({ confirm_new_password: value })}
                                            secureTextEntry
                                        />

                                        {this.getopacityforUpdatePasswordButton() !== 0 &&

                                            <View style={{
                                                borderColor: theme.colors.primary, marginTop: moderateScale(45),
                                                borderRadius: moderateScale(10), borderWidth: moderateScale(0), height: moderateScale(40), width: '100%', backgroundColor: theme.colors.primary, bottom: moderateScale(10),
                                                opacity: this.getopacityforUpdatePasswordButton()
                                            }}>
                                                <TouchableOpacity onPress={() => {
                                                    if (!this.state.old_password || !this.state.new_password || !this.state.confirm_new_password) {
                                                        showDanger(translate('PLEASE FILL REQUIRED FEILDS'));
                                                        return;
                                                    }

                                                    this.setState({ updatePasswrod: false })
                                                    this.saveProfile();
                                                }} style={{ width: '100%', height: "100%", alignSelf: 'center', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: moderateScale(16), color: theme.colors.white, fontFamily: FONT_FAMILY, fontWeight: 'bold' }}>{translate('UPDATE PASSWORD').toUpperCase()}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }



                                        {this.getopacityforUpdatePasswordButton() !== 1 &&
                                            <View style={{
                                                borderColor: theme.colors.primary, marginTop: moderateScale(45),
                                                borderRadius: moderateScale(10), borderWidth: moderateScale(0), height: moderateScale(40), width: '100%', backgroundColor: theme.colors.primary, bottom: moderateScale(10), opacity: 0.5
                                            }}>
                                                <View onPress={() => {
                                                    if (!this.state.old_password || !this.state.new_password || !this.state.confirm_new_password) {
                                                        showDanger(translate('PLEASE FILL REQUIRED FEILDS'));
                                                        return;
                                                    }

                                                    this.setState({ updatePasswrod: false })
                                                    this.saveProfile();
                                                }} style={{ width: '100%', height: "100%", alignSelf: 'center', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: moderateScale(16), color: theme.colors.white, fontFamily: FONT_FAMILY, fontWeight: 'bold' }}>{translate('UPDATE PASSWORD').toUpperCase()}</Text>
                                                </View>
                                            </View>
                                        }


                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </View>
                }

            </View>
        )
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
        width: '100%',
        backgroundColor: theme.colors.white,
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
        backgroundColor: theme.colors.secondary,
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
        color: theme.colors.white
    },
    groupTitleArrow: {
        width: 12,
        tintColor: theme.colors.white,
        height: 12,
        flex: 0.1,
        marginRight: 5
    },
    toggles: {
        marginTop: 10,
        paddingHorizontal: theme.sizes.base * 1
    },
    iconCounter: {
        height: 120,
        width: 120,
    },
    iconCounterDummy: {
        height: 130,
        width: 130,
    },
    iconCounterText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        textAlign: "center"
    },
    heading: {
        fontSize: moderateScale(25),
        color: theme.colors.primary,
        width: '100%', alignSelf: 'center', marginVertical: moderateScale(20), marginTop: moderateScale(20), ...I18nManager.isRTL ? { textAlign: 'left' } : {},
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Profile))