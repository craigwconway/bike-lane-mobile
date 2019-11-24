import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import AuthTabNavigator from "./AuthTabNavigator";

export default createAppContainer(
  createSwitchNavigator({
    Auth: AuthTabNavigator,
    Home: MainTabNavigator
  })
);
