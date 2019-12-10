import React from "react";
import { ScrollView, View } from "react-native";
import { Button, CheckBox, Text, ThemeProvider } from "react-native-elements";

import { Auth } from "aws-amplify";

export default class SettingsScreen extends React.Component {
  state = {
    username: "",
    email: "",
    notify_updates: true,
    notify_following: true,
    notify_new: true
  };

  async componentDidMount() {
    const user = await Auth.currentUserInfo();
    this.setState({ username: user.username });
    this.setState({ email: user.attributes.email });
    console.log("USER ID: " + user.id);
  }

  signOut = async () => {
    Auth.signOut()
      .then(_ => this.props.navigation.navigate("Auth"))
      .catch(err => console.log(err));
  };

  render() {
    let {
      username,
      email,
      notify_updates,
      notify_following,
      notify_new
    } = this.state;
    return (
      <ScrollView>
        <ThemeProvider>
          <View style={{ margin: 20 }}>
            <View style={{ marginBottom: 20 }}>
              <Text h4>User Profile</Text>
              <Text style={{ margin: 10, fontWeight: "300" }}>Username</Text>
              <Text style={{ margin: 10, fontWeight: "600" }}>{username}</Text>
              <Text style={{ margin: 10, fontWeight: "300" }}>Email</Text>
              <Text style={{ margin: 10, fontWeight: "600" }}>{email}</Text>
              <Button title="Reset Password" onPress={this.signOut} />
              <Text />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text h4>Notifications</Text>
              <CheckBox
                title="Notify me when my reports are updated."
                checked={notify_updates}
                onPress={() =>
                  this.setState({ notify_updates: !notify_updates })
                }
              />
              <CheckBox
                title="Notify me when followed reports are updated."
                checked={this.state.notify_following}
                onPress={() =>
                  this.setState({ notify_following: !notify_following })
                }
              />
              <CheckBox
                title="Notify me of new reports in my area."
                checked={this.state.notify_new}
                onPress={() => this.setState({ notify_new: !notify_new })}
              />
            </View>

            <View>
              <Button
                title="Sign Out"
                onPress={this.signOut}
                buttonStyle={{ marginTop: 20 }}
              />
            </View>

            <View>
              <Button
                title="Delete Account"
                onPress={this.signOut}
                buttonStyle={{ backgroundColor: "red", marginTop: 30 }}
              />
            </View>
          </View>
        </ThemeProvider>
      </ScrollView>
    );
  }
}

SettingsScreen.navigationOptions = {
  title: "Settings"
};
