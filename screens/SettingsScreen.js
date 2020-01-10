import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Button, CheckBox, Text, ThemeProvider } from "react-native-elements";

import { Auth } from "aws-amplify";
import { initialRegion } from "../services/ReportService";

const initialState = {
  username: "",
  email: "",
  notify_updates: true,
  notify_following: true,
  notify_new: true
};

export default function SettingsScreen(props) {
  const [user, setUser] = useState(initialState);

  async function getUser() {
    const user = await Auth.currentUserInfo();
    setUser({
      username: user.username,
      email: user.attributes.email,
      notify_updates: true,
      notify_following: true,
      notify_new: true
    });
    console.log("USER ID: " + user.id);
  }

  useEffect(() => {
    getUser();
  }, []);

  signOut = async () => {
    Auth.signOut()
      .then(() => {
        console.log("SIGNED OUT");
        props.navigation.navigate("Home");
        props.onStateChange("signedOut", null);
      })
      .catch(err => console.log(err));
  };

  return (
    <ScrollView>
      <ThemeProvider>
        <View style={{ margin: 20 }}>
          <View style={{ marginBottom: 20 }}>
            <Text h4>User Profile</Text>
            <Text style={{ margin: 10, fontWeight: "300" }}>Username</Text>
            <Text style={{ margin: 10, fontWeight: "600" }}>
              {user.username}
            </Text>
            <Text style={{ margin: 10, fontWeight: "300" }}>Email</Text>
            <Text style={{ margin: 10, fontWeight: "600" }}>{user.email}</Text>
            <Button title="Reset Password" onPress={this.signOut} />
            <Text />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Text h4>Notifications</Text>
            <CheckBox
              title="Notify me when my reports are updated."
              checked={user.notify_updates}
              onPress={() =>
                setUser({ ...user, notify_updates: !notify_updates })
              }
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

SettingsScreen.navigationOptions = {
  title: "Settings"
};
