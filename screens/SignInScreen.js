import React from "react";
import { View } from "react-native";
import { Button, Input, Text, ThemeProvider } from "react-native-elements";

import { Auth } from "aws-amplify";

import { StateService } from "../services/StateService";

export default class SignInScreen extends React.Component {
  state = {
    username: "",
    password: "",
    code: "",
    error: {}
  };

  componentDidMount = async () => {
    let user = await Auth.currentUserInfo();
    if (user) this.props.navigation.navigate("Home");
  };

  handleSignIn = async () => {
    let { username, password } = this.state;
    console.log("handleSignIn: " + username);
    if (username.length == 0 || password.length == 0) {
      console.log("missing credentials");
      alert("Username and password are required!");
      return false;
    }
    Auth.signIn(username, password)
      .then(user => {
        console.log(user);
        this.props.navigation.navigate("Home");
        StateService.set("user");
      })
      .catch(error => {
        console.log(error);
        this.setState({ error });
      });
  };

  handleForgotPassword = async () => {
    let { username } = this.state;
    console.log("handleForgotPassword: " + username);
    if (username.length == 0) {
      alert("Username required");
      return false;
    }
    Auth.forgotPassword(username)
      .then(data => console.log(data))
      .catch(error => {
        console.log(error);
        this.setState({ error });
      });
  };

  handleForgotPasswordCode = async () => {
    let { username, password, code } = this.state;
    console.log("handleForgotPasswordCode: " + username);
    if (username.length == 0 || password.length == 0 || code.length == 0) {
      console.log("missing credentials");
      alert("Username, password, and code are required!");
      return false;
    }
    Auth.forgotPasswordSubmit(username, code, password)
      .then(_ => this.handleSignIn())
      .catch(error => {
        console.log(error);
        this.setState({ error });
      });
  };

  render() {
    return (
      <ThemeProvider>
        <View style={{ margin: 20 }}>
          <Text h4 style={{ marginBottom: 20, textAlign: "center" }}>
            Sign In
          </Text>
          <ErrorText error={this.state.error.message} />
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
            title="Forgot Password"
            onPress={this.handleForgotPassword}
            buttonStyle={{ marginTop: 30 }}
          />
          <Input
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            placeholder="Code"
            placeholderTextColor="gray"
            style={{ marginTop: 20, marginBottom: 20 }}
            onChangeText={val => this.setState({ code: val })}
            spellCheck={false}
          />
          <Button
            title="Update Password"
            onPress={this.handleForgotPasswordCode}
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

function ErrorText(props) {
  return props.error === "" ? null : <Text>{props.error}</Text>;
}
