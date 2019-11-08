import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const SignInStack = createStackNavigator(
  {
    SignIn: SignInScreen,
  },
  config
);

SignInStack.navigationOptions = {
  tabBarLabel: 'Sign In',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused} name={Platform.OS === 'ios' ? 'ios-log-in' : 'md-log-in'}/>
  ),
};

SignInStack.path = '';

const SignUpStack = createStackNavigator(
  {
    SignUp: SignUpScreen,
  },
  config
);

SignUpStack.navigationOptions = {
  tabBarLabel: 'Sign Up',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person-add' : 'md-person-add'} />
  ),
};

SignUpStack.path = '';


const tabNavigator = createBottomTabNavigator({
  SignInStack,
  SignUpStack,
});

tabNavigator.path = '';

export default tabNavigator;
