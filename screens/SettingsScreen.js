import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Button,
  Text,
  View,
  AsyncStorage,
} from 'react-native';

import StateService from '../services/StateService'

export default class SettingsScreen extends React.Component {

  state = {
    username: '',
  }

  componentDidMount = () => {
    this.getUsername();
  }

  getUsername = async () => {
    let username = await StateService.get('username');
    this.setState({username});
  }

  signOut = async () => {
    await StateService.clear();
    this.props.navigation.navigate('Auth');
  }

  render(){
    const fontSize = 20;
    return (
      <ScrollView style={styles.container}>

        <View style={{flex: 3, flexDirection: 'row'}}>
          <Text style={styles.text}>Username</Text>
          <Text style={styles.text}>{this.state.username}</Text>
          <Button style={styles.button} title='(Sign Out)' onPress={this.signOut} />
        </View>

        <View style={{flex: 3, flexDirection: 'row'}}>
          <Text style={styles.text}>Email</Text>
          <Text style={styles.text}>craig@urbanmarsupial.com</Text>
          <Text/>
        </View>

        <View style={{flex: 3, flexDirection: 'row'}}>
          <Text  style={styles.text}>Password</Text>
          <Button style={styles.button} title='Reset' onPress={this.signOut} />
          <Text/>
        </View>

      </ScrollView>
    );
  }

}

SettingsScreen.navigationOptions = {
  title: 'Settings',
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 20,
    padding: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'rgba(145,30,30,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'red',
  },
});
