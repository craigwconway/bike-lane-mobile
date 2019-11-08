import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Button,
  Text,
  View,
  AsyncStorage,
} from 'react-native';

export default class ReportsScreen extends React.Component {

  state = {
    reports: {mine:[], following: [], nearby: []},
  }

  render(){
    return (
    <View>
      <Text style={{textAlign: 'center', top: Dimensions.get('window').height / 3}}>
        There are no current reports in your area.
      </Text>
    </View>
    );
  }

}

ReportsScreen.navigationOptions = {
  title: 'Glass in the Bike Lane',
};
