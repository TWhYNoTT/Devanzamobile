import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, I18nManager } from 'react-native';
import { theme } from '../../core/theme';
import { Badge, withBadge } from 'react-native-elements'
import Block from './Block';
import { translate } from '../../utils/utils';
import Text from '../components/Text'
import AnimateNumber from 'react-native-animate-number';

export default class RadioButtonsGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            radioButtons: this.validate(this.props.radioButtons),
        };
    }

    validate(data) {
        let selected = false; // Variable to check if "selected: true" for more than one button.
        data.map(e => {
            e.disabled = e.disabled ? e.disabled : false;
            e.title = e.title ? e.title : 'You forgot to give label';
            e.layout = e.layout ? e.layout : 'row';
            e.selected = e.selected ? e.selected : false;
            e.color = e.color ? e.color : theme.colors.primary;
            if (e.selected) {
                if (selected) {
                    e.selected = false; // Making "selected: false", if "selected: true" is assigned for more than one button.
                    // console.log('Found "selected: true" for more than one button');
                } else {
                    selected = true;
                }
            }
            e.size = e.size ? e.size : 25;
            e.value = e.value ? e.value : e.id;
            e.selected = false;
        });
        if (!selected) {
            data[0].selected = true;
        }
        return data;
    }

    onPress = id => {
        // console.log(id);
        const radioButtons = this.state.radioButtons;
        const selectedIndex = radioButtons.findIndex(e => e.selected == true);
        const selectIndex = radioButtons.findIndex(e => e.id == id);
        // console.log(selectedIndex);
        // console.log(selectIndex);
        if (selectedIndex != selectIndex) {
            radioButtons[selectedIndex].selected = false;
            radioButtons[selectIndex].selected = true;
            this.setState({ radioButtons });
            this.props.onPress(this.state.radioButtons);
        }
    };

    render() {
        return (
            <View style={styles.container}>

                <View style={{ flexDirection: this.props.flexDirection }}>
                    {this.state.radioButtons.map((data, index) => (

                        <TouchableOpacity key={`gallery-${index}`} data={data} onPress={() => {
                            this.onPress(data.id);
                        }}>
                            <View style={{ flexDirection: this.props.flexDirection, marginTop: 10 }}>
                                <RadioButton
                                    data={data}
                                    onPress={this.onPress}
                                />
                                <View style={{ flexDirection: 'row' }}>
                                    <Block
                                        flex={false}
                                        card
                                        center
                                        middle
                                        style={[{
                                            flexDirection: 'row', flex: 1, alignContent: 'flex-start',
                                            justifyContent: 'flex-start', marginTop: 14
                                        }]} >

                                        {I18nManager.isRTL &&
                                            <AnimateNumber style={[styles.totalPrice]} value={data.count_bought} formatter={(val) => {
                                                return <Text style={styles.totalPrice}>{translate('Boughtthis')}{parseFloat(val).toFixed(0)}</Text>
                                            }} />
                                        }

                                        {!I18nManager.isRTL &&
                                            <AnimateNumber style={[styles.totalPrice]} value={data.count_bought} formatter={(val) => {
                                                return <Text style={styles.totalPrice}>{parseFloat(val).toFixed(0)}{translate('Boughtthis')}</Text>
                                            }} />
                                        }



                                    </Block>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                        {I18nManager.isRTL &&
                                            <View style={{ flexDirection: 'row', marginEnd: 10 }}>
                                                <Text style={styles.listingPriceOld}>
                                                    {data.pre_price} {translate('JD')}
                                                </Text>

                                                <Text style={styles.listingPrice}>
                                                    {'-'}
                                                </Text>

                                                <Text style={styles.listingPrice}>
                                                    {data.new_price}  {translate('JD')}
                                                </Text>
                                            </View>
                                        }


                                        {!I18nManager.isRTL &&
                                            <View style={{ flexDirection: 'row', marginEnd: 10 }}>
                                                <Text style={styles.listingPriceOld}>
                                                    {translate('JD')} {data.pre_price}
                                                </Text>

                                                <Text style={styles.listingPrice}>
                                                    {'-'}
                                                </Text>

                                                <Text style={styles.listingPrice}>
                                                    {translate('JD')}{data.new_price}
                                                </Text>
                                            </View>
                                        }

                                        <Block
                                            flex={false}
                                            card
                                            center
                                            middle
                                            color="rgba(197,204,214,0.20)"
                                            style={styles.subDealOff}>
                                            <Text style={{ color: theme.colors.white }}>{data.percDiff}</Text>
                                        </Block>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        borderRadius: 10,
                                        overflow: 'hidden',
                                        marginTop: 10,
                                        borderColor: '#999',
                                        borderWidth: 0.3,
                                        backgroundColor: '#FFF',
                                        elevation: 1
                                    }}
                                />
                            </View>

                        </TouchableOpacity>

                    ))}
                </View>
            </View>
        );
    }
}

class RadioButton extends Component {
    render() {
        const data = this.props.data;
        const opacity = data.disabled ? 0.2 : 1;
        let layout = { flexDirection: 'row' };
        let margin = { marginLeft: 10 };
        if (data.layout === 'column') {
            layout = { alignItems: 'center' };
            margin = { marginTop: 0 };
        }
        return (

            <View style={[layout, { opacity, marginHorizontal: 5, marginVertical: 1 }]} onPress={() => {
                data.disabled ? null : this.props.onPress(data.id);
            }}>
                <View
                    style={[
                        styles.border,
                        {
                            borderColor: data.color,
                            width: data.size,
                            height: data.size,
                            borderRadius: data.size / 2,
                            alignSelf: 'center'
                        },
                    ]}>
                    {data.selected &&
                        <View
                            style={{
                                backgroundColor: data.color,
                                width: data.size / 2,
                                height: data.size / 2,
                                borderRadius: data.size / 2,
                            }}
                        />}
                </View>
                <Text style={[{ alignSelf: 'center', marginEnd: 10 }, margin]}>{data.title.trim()}</Text>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    border: {
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    listingPrice: {
        color: theme.colors.blue,
        marginTop: 4,
        marginBottom: 2,
        paddingLeft: 6,
        padding: 5,
        paddingRight: 6,
        fontSize: 15,
        fontWeight: '300',
    },

    listingPriceOld: {
        color: theme.colors.primary,
        marginTop: 4,
        marginBottom: 2,
        paddingLeft: 6,
        paddingRight: 6,
        fontSize: 15,
        fontWeight: '300',
        padding: 5,
        textDecorationLine: 'line-through',
    },
    boughtBandage: {
        color: theme.colors.blue,
        marginTop: 4,
        marginBottom: 2,
        paddingLeft: 6,
        paddingRight: 6,
        fontSize: 15,
        fontWeight: '300',
    },
    more: {
        height: 25,
        padding: 5,
    },
    subDealOff: {
        height: 25,
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
        marginBottom: 5,
        padding: 5,
    }
});
