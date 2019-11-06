import React from 'react';
import { createAppContainer, 
        createSwitchNavigator,
        createStackNavigator } from 'react-navigation';

import SignInScreen from '../screens/SignInScreen';
import MainTabNavigator from './MainTabNavigator';

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(
  createSwitchNavigator({
    Auth: AuthStack,
    App: MainTabNavigator,
  })
);
