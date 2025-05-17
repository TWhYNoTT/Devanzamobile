import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import { ExpandableList } from "./ExpandableList";
import { theme } from '../../core/theme';

export class ChangePassword extends PureComponent {

    constructor(props) {


        super(props);
        this._renderGroupListItem = this._renderGroupListItem.bind(this);
        this._renderGroupHeader = this._renderGroupHeader.bind(this);
    }

    _renderGroupListItem({ item, groupId, rowId }) {

        const { details } = item;
        return (
            <View style={styles.listItemContainer}>
                <Block row space="between" margin={[5, 0]} style={styles.inputRow}>
                    <Block>
                        <TextInput
                            label="Password"
                            returnKeyType="next"
                            secureTextEntry
                            onChangeText={text => {
                                details.password = text;
                            }}
                            autoCapitalize="none"
                        />
                    </Block>
                </Block>

                <Block row space="between" margin={[5, 0]} style={styles.inputRow}>
                    <Block>
                        <TextInput
                            label="New Password"
                            returnKeyType="next"
                            secureTextEntry
                            onChangeText={text => {
                                details.newPassword = text;
                            }}
                            autoCapitalize="none"
                        />
                    </Block>
                </Block>

                <Block row space="between" margin={[5, 0]} style={styles.inputRow}>
                    <Block>
                        <TextInput
                            label="New Password"
                            returnKeyType="next"
                            secureTextEntry
                            onChangeText={text => {
                                details.ReTypenewPassword = text;
                            }}
                            autoCapitalize="none"
                        />
                    </Block>
                </Block>
            </View>
        );
    }

    _renderGroupHeader({ item, groupId, status, toggleStatus }) {

        const { title } = item;

        return (
            <TouchableOpacity onPress={() => toggleStatus()}>
                <View style={styles.groupHeader}>
                    <View style={styles.groupTitle}>
                        <Text style={styles.groupTitleText}>{title}</Text>
                        {/* <Image style={styles.groupTitleArrow} source={arrowImage} /> */}
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


        const { data} = this.props;
        // console.log('main kasmy bhut tenshan main hon bookh lagii ha noman kam kar raha ha mer',data)

        return (
            <View style={{ flex: 1, marginTop: -10 }}>
                {/* <ExpandableList
                    data={data}
                    implementedBy={'ListView'}
                    renderGroupHeader={this._renderGroupHeader}
                    renderGroupListItem={this._renderGroupListItem}
                /> */}
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
        marginRight: 5
    },
    groupTitleText: {
        flex: 0.9,
        paddingHorizontal: 10,
        fontSize: 17,
        fontWeight: '500',
        color: theme.colors.gray04
    },
    groupOnlinePercent: {
        color: '#999',
        fontSize: 13
    },
    listItemContainer: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: theme.colors.primary,
        borderBottomWidth: 0.3,
    },

    info: {
        width: '100%',
        backgroundColor: theme.colors.white,
        marginHorizontal: 10,
        borderColor: theme.colors.primary,
        borderBottomWidth: 0.3,
        padding: 10,
        justifyContent: 'space-between'
    },
    nickName: {
        color: theme.colors.gray04,
        fontSize: 18,
    },
    signature: {
        width: 200,
        color: '#999',
        fontSize: 14,
        marginLeft: 5
    }
});