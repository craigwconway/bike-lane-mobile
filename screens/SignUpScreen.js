import React from "react";
import { View } from "react-native";
import { Button, Input, Text, ThemeProvider } from "react-native-elements";

import { Auth } from "aws-amplify";

export default class SignUpScreen extends React.Component {
  state = {
    username: "",
    password: "",
    code: "",
    error: {}
  };

  handleSignUp = async () => {
    let { username, email, password } = this.state;
    console.log("handleSignUp: " + username);
    if (username.length == 0 || username.email == 0 || username.password == 0) {
      alert("Username required");
      return false;
    }
    Auth.signUp({
      username,
      password,
      attributes: {
        email
      },
      validationData: []
    })
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  handleSignUpCode = async () => {
    let { username, code } = this.state;
    console.log("handleSignUpCode: " + username);
    Auth.confirmSignUp(username, code)
      .then(data => {
        console.log(data);
        if (data === "SUCCESS") {
          alert("Account created. Please Sign In!");
          this.props.navigation.navigate("SignInStack");
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <ThemeProvider>
        <View style={{ margin: 20 }}>
          <Text h4 style={{ marginBottom: 20, textAlign: "center" }}>
            Sign Up
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
            autoFocus={true}
            placeholder="Email"
            placeholderTextColor="gray"
            style={{ marginBottom: 20 }}
            onChangeText={val => this.setState({ email: val })}
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
            title="Sign Up"
            onPress={this.handleSignUp}
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
            title="Confirmation Code"
            onPress={this.handleSignUpCode}
            buttonStyle={{ marginTop: 30 }}
          />
        </View>
      </ThemeProvider>
    );
  }
}

SignUpScreen.navigationOptions = {
  title: "Glass in the Bike Lane"
};
