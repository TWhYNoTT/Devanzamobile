// src/navigation/AppNavigation.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './TabNavigator';
import Splash from '../screens/other/Splash';
import Welcome from '../screens/other/Welcome';
import Login from '../screens/home/bottoms/auth/login/index';
import Register from '../screens/home/bottoms/auth/Register/Register';
import ForgetPassword from '../screens/home/bottoms/auth/ForgetPassword/index';
import LocationPicker from '../screens/home/bottoms/pages/LocationPicker';
import BranchDetails from '../screens/home/bottoms/pages/branchDetails';
import Search from '../screens/home/bottoms/search';
import BookingDetails from '../screens/home/bottoms/pages/bookingDetails';
import Categories from '../screens/home/bottoms/pages/categories';
import categoriesDetails from '../screens/home/bottoms/pages/categoriesDetails';
import ViewAll from '../screens/home/bottoms/pages/ViewAll';
import OptionsForService from '../screens/home/bottoms/pages/optionsForService';
import OptionSelectDate from '../screens/home/bottoms/pages/optionSelectDate';
import yourParcel from "../screens/home/bottoms/bookings";


const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
            }}
        >
            <Stack.Screen name="splash" component={Splash} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="home" component={BottomTabNavigator} />
            <Stack.Screen name="LocationPicker" component={LocationPicker} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="branchDetails" component={BranchDetails} />
            <Stack.Screen name="BookingDetails" component={BookingDetails} />
            <Stack.Screen name="categories" component={Categories} />
            <Stack.Screen name="categoriesDetails" component={categoriesDetails} />
            <Stack.Screen name="viewAll" component={ViewAll} />
            <Stack.Screen name="OptionsForService" component={OptionsForService} />
            <Stack.Screen name="OptionSelectDate" component={OptionSelectDate} />
            <Stack.Screen name="Bookings" component={yourParcel} />
        </Stack.Navigator>
    );
};

export default AppNavigation;