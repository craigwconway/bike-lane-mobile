import React from "react";
import { View } from "react-native";
import { Button, Input, Text, ThemeProvider } from "react-native-elements";

import { Auth } from "aws-amplify";

import StateService from "../services/StateService";

export default class SignInScreen extends React.Component {
  state = {
    username: "",
    password: ""
  };

  handleSignOut = () => {
    StateService.logout();
    this.setState({
      username: "",
      password: ""
    });
    this.props.navigation.navigate("Auth");
  };

  handleNavHome = async () => {
    this.props.navigation.navigate("Home");
  };

  handleSignIn = async () => {
    let { username, password } = this.state;
    if (username.length == 0 || password.length == 0) {
      console.log("missing credentials");
      alert("Username and password are required!");
      return false;
    }
    console.log("handleSignIn: " + username);
    Auth.signIn(username, password)
      .then(user => {
        this.props.navigation.navigate("Home");
        // StateService.login(user);
        console.log(user);
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <ThemeProvider>
        <View style={{ margin: 20 }}>
          <Text h4 style={{ marginBottom: 20, textAlign: "center" }}>
            Sign In
          </Text>
          <Input
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            autoFocus={true}
            placeholder="Username"
            placeholderTextColor="gray"
            style={{ marginBottom: 20 }}
            onChangeText={val => this.setState({ username: val })}
            spellCheck={false}
            textContentType="emailAddress"
          />
          <Input
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            placeholder="Password"
            placeholderTextColor="gray"
            style={{ marginBottom: 20 }}
            onChangeText={val => this.setState({ password: val })}
            secureTextEntry={true}
            spellCheck={false}
          />
          <Button
            title="Sign In"
            onPress={this.handleSignIn}
            buttonStyle={{ marginTop: 30 }}
          />
          <Button
            title="Back to App"
            onPress={this.handleNavHome}
            buttonStyle={{ marginTop: 30 }}
          />
        </View>
      </ThemeProvider>
    );
  }
}

SignInScreen.navigationOptions = {
  title: "Glass in the Bike Lane"
};
