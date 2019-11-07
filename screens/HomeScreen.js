import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  View,
  AsyncStorage,
  Dimensions,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';


export default class HomeScreen extends React.Component {

  state = {
    username: '',
    markers: [
      {
        id: 'abc',
        latlng: {latitude: 37.772083, longitude: -122.453444},
        title: 'Glass',
        description: 'in the bike lane'
      }
    ]
  }

  componentDidMount(){
    this.getUsername()
  }

  async getUsername(){
    AsyncStorage.getItem('username')
      .then(val => this.setState({username: val}))
      .catch(err => alert(err));
  }

  async handleCreateReport(){
    alert('Report created!')
  }

  render(){
    return (
      <View style={styles.container}>

          <View style={styles.getStartedContainer}>

            <Text style={styles.getStartedText}>Welcome {this.state.username}</Text>

            <DevelopmentModeNotice />

            <MapView 
                style={styles.mapStyle}
                initialRegion={{
                  latitude: 37.772083,
                  longitude: -122.453444,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                >

              {this.state.markers.map(marker => (
                <Marker
                  key={marker.id}
                  coordinate={marker.latlng}
                  title={marker.title}
                  description={marker.description}
                />
              ))}

              <Button 
                title='Create Report' 
                onPress={this.handleCreateReport.bind(this)} />

            </MapView>

          </View>


      </View>
    );
  d}
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled
      </Text>
    );
  } else {
    return (
      <Text />
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
