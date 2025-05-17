import React, { PureComponent } from 'react';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { ExpandableList } from "./ExpandableList";
import { theme } from '../../core/theme';
import { translate } from '../../utils/utils';
import { I18nManager } from 'react-native'
import Text from '../../src/components/Text'

export class ConditionsOrInfo extends PureComponent {



    constructor(props) {


        super(props);
        this._renderGroupListItem = this._renderGroupListItem.bind(this);
        this._renderGroupHeader = this._renderGroupHeader.bind(this);
    }

    _renderGroupListItem({ item, groupId, rowId }) {

        const { details } = item;
        return (
            <View style={styles.listItemContainer}>
                <View style={styles.info}>
                    <Text style={[styles.nickName]}>{details}</Text>
                </View>
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
                        <Text style={[styles.groupTitleText]}>{title}</Text>
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

        const { data, dataGo = [] } = this.props;
        // console.log('Terms and Conditions', data.terms_and_conditions)

        let obj = {};

        obj.groupHeaderData = {
            title: translate('GeneralConditions'),
        };

        var general = [];
        general.push({ details: data.terms_and_conditions });
        obj.groupListData = general;
        dataGo.push(obj)


        obj = {};
        obj.groupHeaderData = {
            title: translate('Conditions'),
        };
        obj.groupListData = data.deals_conditions;

        dataGo.push(obj)


        obj = {};

        obj.groupHeaderData = {
            title: translate('Information'),
        };
        obj.groupListData = data.deals_infos;
        dataGo.push(obj)

        return (
            <View style={{ flex: 1, marginTop: -10 }}>
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
        height: 40,
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
        paddingHorizontal: 10,
        fontSize: 17,
        color: theme.colors.gray04,
        ...I18nManager.isRTL ? { textAlign: 'left' } : {}
    },
    groupOnlinePercent: {
        color: '#999',
        fontSize: 13
    },
    listItemContainer: {
        backgroundColor: theme.colors.gray03,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: theme.colors.gray03,
        borderBottomWidth: 0.3,
    },

    info: {
        width: '100%',
        backgroundColor: theme.colors.white,
        marginHorizontal: 10,
        borderColor: 'transparent',
        borderBottomWidth: 0.3,
        padding: 10,
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