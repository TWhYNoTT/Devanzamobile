import React, { Component } from 'react';
import { StyleSheet, View, I18nManager, StatusBar, Image, TouchableOpacity } from 'react-native'
import { theme } from '../../../../core/theme';
import { Text } from '../../../../components/widget';
import * as loginActions from '../../../../actions/Actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from '../../../../utils/utils';
import { moderateScale } from 'react-native-size-matters';
import Header from '../childs/Header';





class OptionsForpayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: true
        }


    }

    componentDidMount() {


    }












    render() {
        return (
            <View style={styles.container} >
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header backPress={() => { this.props.navigation.pop() }} Text={translate('')} color={'transparent'} back={true} navigation={this.props.navigation} search={false} more={false} />
                <View style={{ alignContent: 'center', width: '100%', padding: moderateScale(25), paddingBottom: moderateScale(0) }}>
                    <Text bold style={{ fontSize: moderateScale(30), marginTop: moderateScale(0) }}>
                        {translate('How would you like to pay?')}
                    </Text>
                </View>


                <View style={{ paddingHorizontal: moderateScale(20), marginTop: moderateScale(20) }}>
                    <View style={{ borderColor: theme.colors.primary, borderRadius: moderateScale(20), }}>
                        <TouchableOpacity onPress={() => {




                            if (!this.props.navigation.getParam('back', false)) {
                                this.props.data.newBookingData.paymentType = 1;
                                this.props.actions.newBookingData(this.props.data.newBookingData);
                                this.props.navigation.navigate('Addcard')
                            } else {
                                this.props.data.newBookingData.paymentType = 1;
                                this.props.actions.newBookingData(this.props.data.newBookingData);
                                this.props.navigation.push('Addcard', { back: this.props.navigation.getParam('back', false) })
                            }

                        }}
                            style={{
                                flexDirection: 'row', width: '100%', alignSelf: 'center', alignItems: 'center',
                                borderBottomWidth: moderateScale(1), borderColor: theme.colors.line, paddingBottom: moderateScale(15), justifyContent: 'center'
                            }}>

                            <Image resizeMode="contain"
                                source={require('../../../../assets/card-option.png')}
                                style={{ height: moderateScale(45), width: moderateScale(45), }} />
                            <View style={{ paddingHorizontal: moderateScale(10), flex: 1, flexDirection: 'column' }}>
                                <Text style={{
                                    color: theme.colors.blackText,
                                    fontSize: moderateScale(15), textAlign: 'left', textTransform: 'capitalize', fontWeight: '800'
                                }}>{'Credit card'}</Text>
                                <Text style={{
                                    color: theme.colors.grayText,
                                    fontSize: moderateScale(10), textAlign: 'left', textTransform: 'capitalize', fontWeight: '400'
                                }}>{'Pay woth Visa or mastercard'}</Text>

                            </View>
                            <Image resizeMode="contain"
                                source={require('../../../../assets/arrow-gray.png')}
                                style={{ height: moderateScale(15), width: moderateScale(15), }} />

                        </TouchableOpacity>
                    </View>



                    <View style={{ borderColor: theme.colors.primary, borderRadius: moderateScale(20), marginTop: moderateScale(20) }}>
                        <TouchableOpacity onPress={() => {



                       




                            if (!this.props.navigation.getParam('back', false)) {
                                this.props.navigation.navigate('Review')
                                this.props.data.newBookingData.paymentType = 2;
                                this.props.actions.newBookingData(this.props.data.newBookingData);
                            } else {
                                this.props.data.newBookingData.paymentType = 2;
                                this.props.actions.newBookingData(this.props.data.newBookingData);
                                this.props.navigation.pop(1)
                            }

                        }}
                            style={{
                                flexDirection: 'row', width: '100%', alignSelf: 'center', alignItems: 'center',
                                borderBottomWidth: moderateScale(1), borderColor: theme.colors.line, paddingBottom: moderateScale(15), justifyContent: 'center'
                            }}>

                            <Image resizeMode="contain"
                                source={Platform.OS !== 'android' ? require('../../../../assets/apple-pay.png') : require('../../../../assets/googlepay.png')}
                                style={{ height: moderateScale(40), width: moderateScale(90), }} />
                            <View style={{ paddingHorizontal: moderateScale(10), flex: 1, flexDirection: 'column' }} />
                            <Image resizeMode="contain"
                                source={require('../../../../assets/arrow-gray.png')}
                                style={{ height: moderateScale(15), width: moderateScale(15), }} />

                        </TouchableOpacity>
                    </View>


                </View>

            </View>
        )
    }


    getTotalPrice(item) {


        var price = 0;

        for (let k in item.categories) {
            for (let kk in item.categories[k].services) {

                if (item.categories[k].services[kk].selected) {
                    console.log(item.categories[k].services[kk])
                    if (item.categories[k].services[kk].SubService.length === 0) {
                        price = price + parseFloat(item.categories[k].services[kk].price);
                    } else {
                        for (let kkk in item.categories[k].services[kk].SubService) {
                            if (item.categories[k].services[kk].SubService[kkk].selected) {
                                price = price + parseFloat(item.categories[k].services[kk].SubService[kkk].price);
                            }

                        }
                    }

                }


            }
        }


        return parseFloat(price).toFixed(2)
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
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(OptionsForpayment))