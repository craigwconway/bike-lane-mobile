import React from "react";
import { View } from "react-native";
import { Button, Input, Text, ThemeProvider } from "react-native-elements";

import { Auth } from "aws-amplify";

export default class SignInScreen extends React.Component {
  state = {
    username: "",
    password: "",
    error: {}
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
      })
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
