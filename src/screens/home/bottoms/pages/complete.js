import React, { Component } from 'react';
import { StyleSheet, View, I18nManager, StatusBar, Image } from 'react-native'
import { theme } from '../../../../core/theme';
import { Text } from '../../../../components/widget';
import * as loginActions from '../../../../actions/Actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { translate } from '../../../../utils/utils';
import { moderateScale } from 'react-native-size-matters';
import Header from '../childs/Header';
import { FONT_FAMILY } from '../../../../services/config';
import Button from 'apsl-react-native-button'
import { DeviceEventEmitter } from 'react-native';





class OptionSelectDate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: true, DateSelected: false
        }


    }

    componentDidMount() {
        DeviceEventEmitter.emit('bookingRefreash', { value: 1 });
    }












    render() {
        return (
            <View style={styles.container} >
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />

                <Header backPress={() => { this.props.navigation.pop() }} Text={translate('')} color={'transparent'} back={false} navigation={this.props.navigation} search={false} more={false} />

                <View style={{ paddingHorizontal: moderateScale(25), marginTop: moderateScale(15) }}>

                    <View style={{
                        width: '100%', height: '100%',
                        backgroundColor: theme.colors.white, paddingBottom: moderateScale(5), justifyContent: 'center', alignItems: 'center', alignContent: 'center',
                    }}>
                        <Image resizeMode={'contain'} source={require('../../../../assets/complete.png')} style={{ width: moderateScale(100), height: moderateScale(100) }} />

                        <Text style={{
                            color: theme.colors.black,
                            fontSize: moderateScale(25),
                            textAlign: 'left', textTransform: 'capitalize', marginHorizontal: moderateScale(10), fontWeight: '900', marginTop: moderateScale(10)
                        }}>{'Payment success'}</Text>

                        <Text style={{
                            color: theme.colors.grayText,
                            fontSize: moderateScale(15),
                            textAlign: 'left', textTransform: 'capitalize', marginHorizontal: moderateScale(10), marginTop: moderateScale(2)
                        }}>{'Your booking has been sent'}</Text>



                        <Button isLoading={this.state.disabled}
                            disabledStyle={{ backgroundColor: theme.colors.disabled }}
                            style={{
                                borderColor: theme.colors.primary, marginTop: moderateScale(35),
                                borderRadius: moderateScale(10), borderWidth: moderateScale(0), height: moderateScale(45), width: '60%',
                                backgroundColor: theme.colors.primary, alignSelf: 'center', marginBottom: moderateScale(200),
                            }} textStyle={{ fontSize: moderateScale(14), color: theme.colors.white, fontFamily: FONT_FAMILY, fontWeight: 'bold' }}
                            onPress={() => {
                                this.props.navigation.navigate('yourParcel');
                                this.props.navigation.navigate('BookingDetails', { item: this.props.navigation.state.params.data })
                            }}>{translate('See booking')}</Button>

                    </View>

                </View>
            </View >
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
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(OptionSelectDate))