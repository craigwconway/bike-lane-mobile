import React from 'react';
import { ScrollView, View } from 'react-native';
import { Rating, Button, Card, Text, ThemeProvider } from 'react-native-elements';

import { mock_report } from '../services/ReportService'

export default class ReportsScreen extends React.Component {

  state = {
    all_reports: {mine:[], following: [], nearby: [
      mock_report()
    ]},
    report: mock_report(),
  }

  render(){
    let { username, address, comment, severity, created } = this.state.report;
    return (
    <ScrollView>
      <ThemeProvider>
      <Card>
        <Text style={{marginBottom: 10, fontWeight: 'bold'}}>{address.street}</Text>
        <Text style={{marginBottom: 10}}>by {username} @ {created}</Text>
        <Rating
          readonly
          type='bell'
          startingValue={severity}
        />
        <Text style={{marginBottom: 10}}>{comment}</Text>
        <Button title='Update' style={{margin: 5}}/>
        <Button title='Follow' style={{margin: 5}}/>
      </Card>
      </ThemeProvider>
    </ScrollView>
    );
  }

}

ReportsScreen.navigationOptions = {
  title: 'Glass in the Bike Lane',
};
