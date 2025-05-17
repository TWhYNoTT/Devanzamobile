import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { moderateScale } from 'react-native-size-matters';

import { theme } from '../core/theme';
import { translate } from '../utils/utils';
import { TabBar } from './tabs/TabBar';

// Import screens
import Browse from "../screens/home/bottoms/bro1";
import YourParcel from "../screens/home/bottoms/bookings";
import Calculator from "../screens/home/bottoms/favoutate";
import You from "../screens/home/bottoms/you";

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for each tab
const BrowseStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Browse" component={Browse} />
    </Stack.Navigator>
);

const YourParcelStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="YourParcel" component={YourParcel} />
    </Stack.Navigator>
);

const WishlistStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Calculator" component={Calculator} />
    </Stack.Navigator>
);

const YouStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="You" component={You} />
    </Stack.Navigator>
);

// Custom tab bar component wrapper
const TabBarComponent = (props: any) => <TabBar {...props} />;

export const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={props => <TabBarComponent {...props} />}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused }) => {
                    let iconSource;

                    switch (route.name) {
                        case 'BrowseTab':
                            iconSource = require('../assets/tab-home.png');
                            break;
                        case 'YourParcelTab':
                            iconSource = require('../assets/search.png');
                            break;
                        case 'WishlistTab':
                            iconSource = require('../assets/tab-fav.png');
                            break;
                        case 'YouTab':
                            iconSource = require('../assets/tab-more.png');
                            break;
                        default:
                            iconSource = require('../assets/tab-home.png');
                    }

                    return (
                        <Image
                            resizeMode="contain"
                            source={iconSource}
                            style={{
                                width: focused ? moderateScale(23) : moderateScale(21),
                                height: focused ? moderateScale(21) : moderateScale(21),
                                tintColor: focused ? theme.colors.primary : theme.colors.icon,
                                marginBottom: 5
                            }}
                        />
                    );
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.icon,
                tabBarLabelStyle: {
                    fontSize: moderateScale(10),
                    fontWeight: '500',
                },
            })}
        >
            <Tab.Screen
                name="BrowseTab"
                component={BrowseStack}
                options={{
                    tabBarLabel: translate('Hometab').toUpperCase(),
                }}
            />
            <Tab.Screen
                name="YourParcelTab"
                component={YourParcelStack}
                options={{
                    tabBarLabel: translate('Workshops').toUpperCase(),
                }}
            />
            <Tab.Screen
                name="WishlistTab"
                component={WishlistStack}
                options={{
                    tabBarLabel: translate('Notifications').toUpperCase(),
                }}
            />
            <Tab.Screen
                name="YouTab"
                component={YouStack}
                options={{
                    tabBarLabel: translate('Account').toUpperCase(),
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;