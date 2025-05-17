import React, { Component } from 'react';
import { StyleSheet, View, I18nManager, StatusBar, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native'
import { theme } from '../../../../core/theme';
import { Text } from '../../../../components/widget';
import * as loginActions from '../../../../actions/Actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showDanger, translate } from '../../../../utils/utils';
import { moderateScale } from 'react-native-size-matters';
import Header from '../childs/Header';
import { LiteCreditCardInput, CreditCardInput } from "../../../../components/react-native-credit-card-input";
import { FONT_FAMILY } from '../../../../services/config';
import Button from 'apsl-react-native-button'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'





class OptionSelectDate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: true, DateSelected: false, card: {}
        }


    }

    refs = null;
    componentDidMount() {

        if (this.props.data.newBookingData.card) {
            console.log(this.props.data.newBookingData.card)
            this.refs.setValues(this.props.data.newBookingData.card.values);
            this.setState({ card: this.props.data.newBookingData.card })
        }


    }












    render() {
        return (
            <View style={styles.container} >
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header backPress={() => { this.props.navigation.pop() }} Text={translate('Credit card')} color={'transparent'} back={true} navigation={this.props.navigation} search={false} more={false} />


                <KeyboardAwareScrollView
                    behavior='position'
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >

                    <View style={{ paddingHorizontal: moderateScale(25), marginTop: moderateScale(35) }}>
                        <View style={{
                            width: '100%', width: '100%',
                            ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) },
                            backgroundColor: theme.colors.white, paddingBottom: moderateScale(5)
                        }}>



                            <LiteCreditCardInput
                                number={'123'}
                                expiry={'1'}
                                ref={(ref) => { if (ref) this.refs = ref }}
                                cardFontFamily={FONT_FAMILY}
                                placeholders={{ number: "1000 2000 3000 4000", expiry: "Exp. Date", cvc: "cvv" }}
                                placeholderTextColor={theme.colors.gray}
                                inputStyle={{
                                    textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ?
                                        { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY,
                                }}
                                inputStyle={{

                                }}
                                onChange={(card) => {
                                    console.log(card);
                                    this.setState({ card: card })
                                }}
                            />

                            {/* 
                            <CreditCardInput
                                cardFontFamily={FONT_FAMILY}
                                placeholders={{ number: "1000 2000 3000 4000", expiry: "Exp. Date", cvc: "cvv" }}
                                placeholderTextColor={theme.colors.gray}
                                inputStyle={{
                                    textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ?
                                        { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY,
                                }}
                                inputStyle={{

                                }}
                                onChange={(card) => {
                                    console.log(card);
                                    this.setState({ card: card })
                                }}
                            /> */}


                        </View>

                    </View >
                </KeyboardAwareScrollView>



                <Button isDisabled={!!!this.state.card.valid}
                    disabledStyle={{ backgroundColor: theme.colors.disabled }}
                    style={{
                        borderColor: theme.colors.primary, marginTop: moderateScale(35),
                        borderRadius: moderateScale(10), borderWidth: moderateScale(0), height: moderateScale(45), width: '80%',
                        backgroundColor: theme.colors.primary, alignSelf: 'center', marginBottom: moderateScale(20), position: 'absolute', bottom: moderateScale(20),
                    }} textStyle={{ fontSize: moderateScale(16), color: theme.colors.white, fontFamily: FONT_FAMILY, fontWeight: 'bold' }}
                    onPress={() => {

                        if (!this.props.navigation.getParam('back', false)) {
                            this.props.data.newBookingData.card = this.state.card;
                            this.props.actions.newBookingData(this.props.data.newBookingData);
                            this.props.navigation.navigate('Review')
                        } else {
                            this.props.data.newBookingData.card = this.state.card;
                            this.props.actions.newBookingData(this.props.data.newBookingData);
                            this.props.navigation.pop(2)
                        }


                    }}>{translate('Next')}</Button>
            </View >
        )
    }



}

const mapStateToProps = (state) => ({
    data: {
        userInfo: state.login.userInfo,
        newBookingData: state.app.newBookingData,
    },
})


const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(loginActions, dispatch)
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
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(OptionSelectDate))