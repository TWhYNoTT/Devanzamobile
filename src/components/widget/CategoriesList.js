import React, { PureComponent } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { ExpandableList } from "./ExpandableListCategories";
import { theme } from '../../core/theme';
import { translate } from '../../utils/utils';
import { I18nManager } from 'react-native'
import Text from './Text'

export class CategoriesList extends PureComponent {



    constructor(props) {


        super(props);
        this._renderGroupListItem = this._renderGroupListItem.bind(this);
        this._renderGroupHeader = this._renderGroupHeader.bind(this);
    }

    _renderGroupListItem({ item, groupId, rowId, sub_category_clicked }) {

        const { details } = item;
        return (
            <View style={styles.listItemContainer}>
                <TouchableOpacity style={styles.info} onPress={() => {


                    // console.log(this.props.selected)
                    // console.log(item)
                    // console.log(this.props.categories)
                    // console.log(this.props.selectedCity)

                    if (this.props.selected) {
                        // this.props.navigation.navigate('categoriesAndCities', {
                        //     // selected: this.props.selected, sub_category_id: item
                        // });

                        this.props.navigation.navigate('filters', {
                            selected: this.props.selected, sub_category_id: item, categories: this.props.categories, selectedCity: this.props.selectedCity
                        });
                    } else {
                        // this.props.navigation.navigate('categoriesAndCities', {
                        //     sub_category_id: item
                        // });

                        this.props.navigation.navigate('filters', {
                            sub_category_id: item, categories: this.props.categories, selectedCity: this.props.selectedCity
                        });
                    }


                }}>
                    <Text style={[styles.nickName]}>{details}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _renderGroupHeader({ item, groupId, status, toggleStatus }) {

        const { title } = item;
        const arrowImage = false ? require('app/assets/icon_down_arrow.png') : require('app/assets/icon_right_arrow.png');



        return (
            <TouchableOpacity onPress={() => toggleStatus()}>
                <View style={styles.groupHeader}>
                    <View style={styles.groupTitle}>
                        <Text style={[styles.groupTitleText, status ? { color: theme.colors.primary } : { color: theme.colors.black }]}>{title}</Text>
                        <Image style={styles.groupTitleArrow} source={arrowImage} />
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        borderRadius: 10,
                        overflow: 'hidden',
                        marginTop: 2,
                        borderColor: '#999',
                        borderWidth: 0.3,
                        backgroundColor: '#FFF',
                        elevation: 1
                    }}
                />
            </TouchableOpacity>
        );
    }

    render() {

        const { data, dataGo = [], selected } = this.props;
        // console.log('Terms and Conditions', data)

        for (let k in data) {
            let obj = {};

            obj.groupHeaderData = {
                title: data[k].name,
            };

            var general = [];
            general.push({
                details: translate('All'), category_id: data[k].shop_category_id,
                sub_cateory_id: 0
            });
            for (let kk in data[k].shop_sub_categories) {

                general.push({
                    details: data[k].shop_sub_categories[kk].sub_name, category_id: data[k].shop_category_id,
                    sub_cateory_id: data[k].shop_sub_categories[kk].sub_category_id
                });
            }
            obj.groupListData = general;
            if (selected && selected.shop_category_id === data[k].shop_category_id)
                obj.groupStatus = true;
            dataGo.push(obj)

        }

        // console.log(dataGo)


        return (
            <View style={{ flex: 1, marginTop: 0 }}>
                <ExpandableList
                    data={dataGo}
                    implementedBy={'ListView'}
                    renderGroupHeader={this._renderGroupHeader}
                    renderGroupListItem={this._renderGroupListItem}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    groupHeader: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    groupTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    groupTitleArrow: {
        width: 12,
        height: 12,
        flex: 0.1,
        marginRight: 5,
        ...I18nManager.isRTL ? { transform: [{ rotate: '180deg' }] } : {}
    },
    groupTitleText: {
        flex: 0.9,
        padding: 10,
        fontSize: 17,
        ...I18nManager.isRTL ? { textAlign: 'left' } : {}
    },
    groupOnlinePercent: {
        color: '#999',
        fontSize: 13
    },
    listItemContainer: {
        backgroundColor: theme.colors.gray,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: theme.colors.gray,
        borderBottomWidth: 0.5,
    },

    info: {
        width: '100%',
        backgroundColor: theme.colors.white,
        marginHorizontal: 10,
        borderColor: 'transparent',
        padding: 12,
        justifyContent: 'space-between'
    },
    nickName: {
        color: theme.colors.gray04,
        fontSize: 18,
        ...I18nManager.isRTL ? { textAlign: 'left' } : {}
    },
    signature: {
        width: 200,
        color: '#999',
        fontSize: 14,
        marginLeft: 5
    }
});