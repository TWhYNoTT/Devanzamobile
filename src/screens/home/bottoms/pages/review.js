import React, { Component } from 'react';
import { StyleSheet, View, I18nManager, StatusBar, Image, ScrollView } from 'react-native'
import { theme } from '../../../../core/theme';
import { Text } from '../../../../components/widget';
import * as loginActions from '../../../../actions/Actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showDanger, translate } from '../../../../utils/utils';
import { moderateScale } from 'react-native-size-matters';
import Header from '../childs/Header';
import { LiteCreditCardInput } from "react-native-credit-card-input";
import { FONT_FAMILY } from '../../../../services/config';
import Button from 'apsl-react-native-button'
import { TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import moment from 'moment'
import * as Apis from '../../../../services/Apis';


import { GooglePay } from 'react-native-google-pay';
import { Platform } from 'react-native';

const PaymentRequest = require('react-native-payments').PaymentRequest;






class OptionSelectDate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: true, DateSelected: false, discount: 0
        }


    }

    componentDidMount() {


    }












    render() {


        console.log(this.props.data.newBookingData.item)

        return (
            <View style={styles.container} >
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header backPress={() => { this.props.navigation.pop() }} Text={translate('Review')} color={'transparent'} back={true} navigation={this.props.navigation} search={false} more={false} />

                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: moderateScale(25), marginTop: moderateScale(20) }}
                    contentContainerStyle={{ paddingBottom: moderateScale(100) }}>

                    <View style={{ flexDirection: 'row', borderBottomColor: theme.colors.line, borderBottomWidth: moderateScale(1), paddingBottom: moderateScale(20) }}>
                        <View style={{
                            backgroundColor: theme.colors.grayBackground, width: moderateScale(80),
                            height: moderateScale(80), justifyContent: 'center', alignItems: 'center', borderRadius: moderateScale(20)
                        }}>
                            <Image resizeMode={'contain'} source={require('../../../../assets/devura.png')} style={{ width: moderateScale(40), height: moderateScale(40) }} />
                        </View>

                        <View style={{ flexDirection: 'column', width: '100%' }}>
                            <Text style={{
                                color: theme.colors.black,
                                fontSize: moderateScale(15),
                                textAlign: 'left', textTransform: 'capitalize', marginHorizontal: moderateScale(10), fontWeight: '800', width: '100%'
                            }}>{this.props.data.newBookingData.item.name}</Text>

                            <View style={{
                                flexDirection: 'row', marginTop: moderateScale(7), width: '90%'
                            }}>
                                <Text style={{
                                    color: theme.colors.black,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                        moderateScale(10), fontWeight: '800',
                                    flex: 1
                                }}>{'Time'}</Text>
                                <Text style={{
                                    color: theme.colors.black,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                        moderateScale(10), fontWeight: '800',
                                    flex: 1
                                }}>{'Date'}</Text>


                            </View>


                            <View style={{
                                flexDirection: 'row', marginTop: moderateScale(7), width: '90%'
                            }}>
                                <Text style={{
                                    color: theme.colors.black,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left', marginHorizontal:
                                        moderateScale(10), fontWeight: '400',
                                    flex: 1
                                }}>{String(this.props.data.newBookingData.bookingSlot.formated).toUpperCase()}</Text>
                                <Text style={{
                                    color: theme.colors.black,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                        moderateScale(10), fontWeight: '400',
                                    flex: 1
                                }}>{moment(this.props.data.newBookingData.bookingDate).format('MMMM DD')}</Text>


                            </View>
                        </View>



                    </View>


                    {this.props.data.newBookingData.employee.name &&

                        <View style={{
                            flexDirection: 'row', borderBottomColor: theme.colors.line,
                            borderBottomWidth: moderateScale(1), paddingBottom: moderateScale(20), marginTop: moderateScale(20)
                        }}>

                            <View style={{ flex: 1 }}>


                                <View style={{
                                    flexDirection: 'row', marginTop: moderateScale(7),
                                }}>
                                    <Text style={{
                                        color: theme.colors.black,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10), fontWeight: '900',
                                        flex: 1
                                    }}>{'Booking With'}</Text>

                                </View>


                                <View style={{
                                    flexDirection: 'column', marginTop: moderateScale(7)
                                }}>
                                    <Text style={{
                                        color: theme.colors.blackText,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10), fontWeight: '800'
                                    }}>{this.props.data.newBookingData.employee.name}</Text>
                                    <Text style={{
                                        color: theme.colors.blackText,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10),
                                    }}>{this.props.data.newBookingData.employee.type}</Text>

                                </View>

                            </View>

                            <TouchableOpacity onPress={() => { this.props.navigation.push('employee', { back: true }) }} style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Text style={{
                                    color: theme.colors.primary,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left', textTransform: 'capitalize', fontWeight: '800',
                                }}>{'Change'}</Text>
                            </TouchableOpacity>
                        </View>

                    }





                    {!this.props.data.newBookingData.employee.name &&

                        <View style={{
                            flexDirection: 'row', borderBottomColor: theme.colors.line,
                            borderBottomWidth: moderateScale(1), paddingBottom: moderateScale(20), marginTop: moderateScale(20)
                        }}>

                            <View style={{ flex: 1 }}>


                                <View style={{
                                    flexDirection: 'row', marginTop: moderateScale(7),
                                }}>
                                    <Text style={{
                                        color: theme.colors.black,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10), fontWeight: '900',
                                        flex: 1
                                    }}>{'Booking With'}</Text>

                                </View>


                                <View style={{
                                    flexDirection: 'column', marginTop: moderateScale(7)
                                }}>
                                    <Text style={{
                                        color: theme.colors.blackText,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10), fontWeight: '800'
                                    }}>{'Flaxible'}</Text>
                                    <Text style={{
                                        color: theme.colors.blackText,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10),
                                    }}>{'Service will be provided by random employee.'}</Text>

                                </View>

                            </View>

                            <TouchableOpacity onPress={() => { this.props.navigation.push('employee', { back: true }) }} style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Text style={{
                                    color: theme.colors.primary,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left', textTransform: 'capitalize', fontWeight: '800',
                                }}>{'Change'}</Text>
                            </TouchableOpacity>
                        </View>

                    }

                    {this.props.data.newBookingData.option === 1 &&
                        <View style={{
                            flexDirection: 'row', borderBottomColor: theme.colors.line,
                            borderBottomWidth: moderateScale(1), paddingBottom: moderateScale(20), marginTop: moderateScale(20)
                        }}>

                            <View style={{ flex: 1 }}>


                                <View style={{
                                    flexDirection: 'row', marginTop: moderateScale(7),
                                }}>
                                    <Text style={{
                                        color: theme.colors.black,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10), fontWeight: '900',
                                        flex: 1
                                    }}>{'Address'}</Text>

                                </View>


                                <View style={{
                                    flexDirection: 'column', marginTop: moderateScale(7)
                                }}>
                                    <Text style={{
                                        color: theme.colors.blackText,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10), fontWeight: '800'
                                    }}>{this.props.data.newBookingData.address.name}</Text>
                                    <Text style={{
                                        color: theme.colors.blackText,
                                        fontSize: moderateScale(15), marginTop: moderateScale(5),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10),
                                    }}>{this.props.data.newBookingData.address.street + ' , ' + this.props.data.newBookingData.address.building + ' , ' + this.props.data.newBookingData.address.city + ' , ' + this.props.data.newBookingData.address.zipcode}</Text>
                                    <Text style={{
                                        color: theme.colors.blackText,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10),
                                    }}>{this.props.data.newBookingData.address.phone}</Text>

                                </View>

                            </View>

                            <TouchableOpacity onPress={() => { this.props.navigation.push('OptionsForService', { back: true }) }} style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Text style={{
                                    color: theme.colors.primary,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left', textTransform: 'capitalize', fontWeight: '800',
                                }}>{'Change'}</Text>
                            </TouchableOpacity>
                        </View>
                    }



                    {this.props.data.newBookingData.option === 2 &&
                        <View style={{
                            flexDirection: 'row', borderBottomColor: theme.colors.line,
                            borderBottomWidth: moderateScale(1), paddingBottom: moderateScale(20), marginTop: moderateScale(20)
                        }}>

                            <View style={{ flex: 1 }}>


                                <View style={{
                                    flexDirection: 'row', marginTop: moderateScale(7),
                                }}>
                                    <Text style={{
                                        color: theme.colors.black,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10), fontWeight: '900',
                                        flex: 1
                                    }}>{'Salon walk-in'}</Text>

                                </View>
                            </View>

                            <TouchableOpacity onPress={() => {
                                this.props.navigation.push('OptionsForService', { back: true })
                            }} style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Text style={{
                                    color: theme.colors.primary,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left', textTransform: 'capitalize', fontWeight: '800',
                                }}>{'Change'}</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={{
                        flexDirection: 'row', marginTop: moderateScale(20)
                    }}>

                        <View style={{
                            flex: 1, marginHorizontal:
                                moderateScale(10),
                        }}>

                            <View style={{
                                flexDirection: 'row', marginTop: moderateScale(7),
                            }}>
                                <Text style={{
                                    color: theme.colors.black,
                                    fontSize: moderateScale(15),
                                    textTransform: 'capitalize', fontWeight: '900',
                                }}>{'Have a promo code?'}</Text>

                            </View>


                            <View style={{
                                flexDirection: 'column', marginTop: moderateScale(7)
                            }}>


                                <View style={{ width: '100%' }}>
                                    <Input
                                        labelStyle={{ color: theme.colors.secondary }}
                                        containerStyle={{ paddingLeft: 0, paddingRight: 0 }}
                                        inputContainerStyle={{
                                            height: moderateScale(50),
                                            ...I18nManager.isRTL ? { paddingRight: moderateScale(10) } : { paddingLeft: moderateScale(5) }, borderBottomWidth: 1, borderBottomColor: theme.colors.disabled, backgroundColor: theme.colors.white,
                                        }}
                                        inputStyle={{ textAlignVertical: 'center', height: '100%', ...I18nManager.isRTL ? { textAlign: 'right' } : {}, fontFamily: FONT_FAMILY }}
                                        returnKeyType="next"
                                        placeholder={translate('Code')}
                                        value={this.state.password}
                                        onChangeText={(value) => this.setState({ password: value })}
                                    />
                                    <View style={{ position: 'absolute', right: 0, top: moderateScale(10), }}>
                                        <TouchableOpacity onPress={() => { this.setState({ HideShow: !this.state.HideShow }) }}>
                                            <Text style={{
                                                color: theme.colors.primary,
                                                fontSize: moderateScale(15), textAlign: 'left', textTransform: 'capitalize', fontWeight: 'bold'
                                            }}>{translate(this.state.HideShow ? 'Remove' : 'Apply')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>


                            </View>

                        </View>


                    </View>


                    {this.props.data.newBookingData.paymentType === 1 &&
                        <View style={{
                            flexDirection: 'row', borderBottomColor: theme.colors.line,
                            borderBottomWidth: moderateScale(1), paddingBottom: moderateScale(20), marginTop: moderateScale(20)
                        }}>

                            <View style={{ flex: 1 }}>


                                <View style={{
                                    flexDirection: 'row', marginTop: moderateScale(7),
                                }}>
                                    <Text style={{
                                        color: theme.colors.black,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10), fontWeight: '900',
                                        flex: 1
                                    }}>{'Payment type'}</Text>

                                </View>


                                <View style={{
                                    flexDirection: 'column', marginTop: moderateScale(7)
                                }}>
                                    <Text style={{
                                        color: theme.colors.blackText,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10),
                                    }}>{'Visa ending ' + this.props.data.newBookingData.card.values.number.split(' ')[this.props.data.newBookingData.card.values.number.split(' ').length - 1]}</Text>

                                </View>

                            </View>

                            <TouchableOpacity onPress={() => { this.props.navigation.push('OptionsForpayment', { back: true }) }} style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Text style={{
                                    color: theme.colors.primary,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left', textTransform: 'capitalize', fontWeight: '800',
                                }}>{'Change'}</Text>
                            </TouchableOpacity>

                        </View>

                    }


                    {this.props.data.newBookingData.paymentType === 2 &&
                        <View style={{
                            flexDirection: 'row', borderBottomColor: theme.colors.line,
                            borderBottomWidth: moderateScale(1), paddingBottom: moderateScale(20), marginTop: moderateScale(20)
                        }}>

                            <View style={{ flex: 1 }}>


                                <View style={{
                                    flexDirection: 'row', marginTop: moderateScale(7),
                                }}>
                                    <Text style={{
                                        color: theme.colors.black,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10), fontWeight: '900',
                                        flex: 1
                                    }}>{'Payment type'}</Text>

                                </View>


                                <View style={{
                                    flexDirection: 'column', marginTop: moderateScale(7)
                                }}>
                                    <Text style={{
                                        color: theme.colors.blackText,
                                        fontSize: moderateScale(15),
                                        textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                            moderateScale(10),
                                    }}>{Platform.OS === 'android' ? 'Via Google Pay' : 'Via Apple pay'}</Text>

                                </View>

                            </View>

                            <TouchableOpacity onPress={() => { this.props.navigation.push('OptionsForpayment', { back: true }) }} style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Text style={{
                                    color: theme.colors.primary,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left', textTransform: 'capitalize', fontWeight: '800',
                                }}>{'Change'}</Text>
                            </TouchableOpacity>

                        </View>

                    }




                    <View style={{
                        flexDirection: 'row', paddingBottom: moderateScale(20), marginTop: moderateScale(20)
                    }}>

                        <View style={{ flex: 1 }}>


                            {this.props.data.newBookingData.selectedServices.map((item, key) => {
                                return (
                                    <View style={{
                                        flexDirection: 'row', marginTop: moderateScale(8)
                                    }}>
                                        <Text style={{
                                            color: theme.colors.black,
                                            fontSize: moderateScale(15),
                                            textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                                moderateScale(10), fontWeight: '500',
                                            flex: 1
                                        }}>{item.name}</Text>
                                        <Text style={{
                                            color: theme.colors.black,
                                            fontSize: moderateScale(15),
                                            textAlign: 'left', marginHorizontal: moderateScale(10), fontWeight: '400',
                                        }}>{this.getPrice(item)}<Text style={{
                                            color: theme.colors.black,
                                            fontSize: moderateScale(12),
                                            textAlign: 'left', marginHorizontal: moderateScale(10),
                                        }}>{' AED'}</Text></Text>

                                    </View>
                                );
                            })}


                            <View style={{
                                flexDirection: 'row', marginTop: moderateScale(20)
                            }}>
                                <Text style={{
                                    color: theme.colors.black,
                                    fontSize: moderateScale(17),
                                    textAlign: 'left', textTransform: 'capitalize', marginHorizontal:
                                        moderateScale(10), fontWeight: '900',
                                    flex: 1
                                }}>{'Total'}</Text>
                                <Text style={{
                                    color: theme.colors.black,
                                    fontSize: moderateScale(15),
                                    textAlign: 'left', marginHorizontal: moderateScale(10), fontWeight: '900',
                                }}>{this.getTotalPrice(this.props.data.newBookingData.item)}<Text style={{
                                    color: theme.colors.black,
                                    fontSize: moderateScale(17),
                                    textAlign: 'left', marginHorizontal: moderateScale(10),
                                }}>{' AED'}</Text></Text>

                            </View>



                        </View>
                    </View>




                </ScrollView>


                <View style={{
                    backgroundColor: theme.colors.white,
                    position: 'absolute', width: '100%', bottom: 0
                }}>
                    <Button isLoading={this.state.isLoading}
                        disabledStyle={{ backgroundColor: theme.colors.disabled }}
                        style={{
                            borderColor: theme.colors.primary, marginTop: moderateScale(5),
                            borderRadius: moderateScale(10), borderWidth: moderateScale(0), height: moderateScale(45), width: '80%',
                            backgroundColor: theme.colors.primary, alignSelf: 'center', marginBottom: moderateScale(40),
                        }} textStyle={{
                            fontSize: moderateScale(16),
                            color: theme.colors.white, fontFamily: FONT_FAMILY, fontWeight: 'bold'
                        }}
                        onPress={() => {


                            if (this.props.data.newBookingData.paymentType + '' === '2') {
                                this.makeBooking();
                                return;
                            }


                            var service = [];
                            for (let k in this.props.data.newBookingData.selectedServices) {
                                if (this.props.data.newBookingData.selectedServices[k].selected) {
                                    if (this.props.data.newBookingData.selectedServices[k].SubService.length !== 0) {
                                        for (let kk in this.props.data.newBookingData.selectedServices[k].SubService) {
                                            if (this.props.data.newBookingData.selectedServices[k].SubService[kk].selected) {
                                                service.push({
                                                    SubService: this.props.data.newBookingData.selectedServices[k].SubService[kk]._id,
                                                    Service: this.props.data.newBookingData.selectedServices[k]._id
                                                })
                                            }
                                        }

                                    } else {
                                        service.push({
                                            Service: this.props.data.newBookingData.selectedServices[k]._id
                                        })
                                    }
                                }
                            }



                            var bookingParams = {
                                total: Number(this.getTotalPrice(this.props.data.newBookingData.item)).toFixed(2),
                                vat: '0',
                                extra: '0',
                                note: this.props.data.newBookingData.note ? this.props.data.newBookingData.note : '',
                                type: "0",
                                status: '0',
                                paymentMethod: this.props.data.newBookingData.paymentType + "",
                                inside: this.props.data.newBookingData.option,
                                paymentStatus: '0',
                                bookingdDate: new Date(this.props.data.newBookingData.bookingDate),
                                bookingBy: this.props.data.userInfo.id ? this.props.data.userInfo.id : this.props.data.userInfo._id,
                                bookingFor: this.props.data.newBookingData.employee.id ? this.props.data.newBookingData.employee.id : '5f514da181bc19147181d400',
                                address: this.props.data.newBookingData.address && this.props.data.newBookingData.address.id ? this.props.data.newBookingData.address.id : '5f514da181bc19147181d400',
                                branch: this.props.data.newBookingData.item._id,
                                app: this.props.data.newBookingData.item.app,
                                services: service,
                                points: 0,
                                discount: this.state.discount,
                                promotions: [],
                                pointsMoney: 0,
                                usedPoints: 0,
                            };

                            console.log(bookingParams)
                            this.setState({ isLoading: true })
                            Apis.Post('bookings', bookingParams).then((data) => {
                                console.log(data);
                                this.props.navigation.navigate('Complete', { data: data })
                                this.setState({ isLoading: false })
                                this.props.actions.refreashTimeBookings({});
                                this.props.actions.refreashBookings({ page: 0, limit: 10 }, null, null)
                            }).catch((error) => {
                                console.log(error);
                                this.setState({ isLoading: false })
                            })

                        }}>{translate('Confirm booking')}</Button>

                </View>
            </View >
        )
    }




    makeBooking() {
        if (Platform.OS !== 'android') {
            const DETAILS = {
                id: 'appointment-payment',
                displayItems: [],
                total: {
                    label: 'Devanza',
                    amount: {
                        currency: 'AED', value:
                            // 1
                            Number(this.getTotalPrice(this.props.data.newBookingData.item)).toFixed(2) + ''
                    }
                }
            };


            for (let k in this.props.data.newBookingData.selectedServices) {
                if (this.props.data.newBookingData.selectedServices[k].selected) {
                    if (this.props.data.newBookingData.selectedServices[k].SubService.length !== 0) {
                        for (let kk in this.props.data.newBookingData.selectedServices[k].SubService) {
                            if (this.props.data.newBookingData.selectedServices[k].SubService[kk].selected) {

                                DETAILS.displayItems.push({
                                    label: this.props.data.newBookingData.selectedServices[k].SubService[kk].name,
                                    amount: {
                                        currency: 'AED', value:
                                            this.props.data.newBookingData.selectedServices[k].SubService[kk].price
                                    }
                                })

                            }
                        }

                    } else {

                        DETAILS.displayItems.push({
                            label: this.props.data.newBookingData.selectedServices[k].name,
                            amount: {
                                currency: 'AED', value:
                                    this.props.data.newBookingData.selectedServices[k].price
                            }
                        })

                    }
                }
            }


            const METHOD_DATA = [{
                supportedMethods: ['apple-pay'],
                data: {
                    merchantIdentifier: 'merchant.com.majdi.devura',
                    supportedNetworks: ['visa', 'mastercard', 'amex'],
                    countryCode: 'AE',
                    currencyCode: 'AED'
                }
            }];


            const OPTIONS = {
                requestPayerName: true,
                requestPayerPhone: true,
                requestPayerEmail: true,
            };

            const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);

            paymentRequest.canMakePayments().then((canMakePayment) => {
                if (canMakePayment) {
                    console.log('Can Make Payment')
                    paymentRequest.show()
                        .then(paymentResponse => {
                            // Your payment processing code goes here
                            paymentResponse.complete('success');
                            console.log('payment done');

                        });
                }
                else {
                    console.log('Cant Make Payment')
                }
            })

            return;
        } else {

            const allowedCardNetworks = ['VISA', 'MASTERCARD'];
            const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

            const requestData = {
                cardPaymentMethod: {
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        // stripe (see Example):
                        gateway: 'stripe',
                        gatewayMerchantId: '',
                        stripe: {
                            publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
                            version: '2018-11-08',
                        },
                        // other:
                        gateway: 'example',
                        gatewayMerchantId: 'exampleGatewayMerchantId',
                    },
                    allowedCardNetworks,
                    allowedCardAuthMethods,
                },
                transaction: {
                    totalPrice: Number(this.state.price).toFixed(2),
                    totalPriceStatus: 'FINAL',
                    currencyCode: 'AED',
                },
                merchantName: this.props.auth.user.app.name,
            };

            // Set the environment before the payment request
            GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);

            // Check if Google Pay is available
            GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods)
                .then((ready) => {
                    if (ready) {
                        // Request payment token
                        GooglePay.requestPayment(requestData)
                            .then((token) => {

                                console.log('payment done');
                                this.createBooking("1", selectedServices, booking, user, selectedemployee, selectedBranch)
                                // Send a token to your payment gateway
                            })
                            .catch((error) => console.log(error.code, error.message));
                    }
                })

        }


    }

    getPrice(item) {

        if (item.SubService.length !== 0) {
            for (let k in item.SubService) {
                if (item.SubService[k].selected) {
                    return item.SubService[k].price;
                }
            }

        } else {
            return item.price;
        }

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
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(OptionSelectDate))