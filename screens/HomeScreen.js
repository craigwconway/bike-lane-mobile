import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  AsyncStorage,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

function initialRegion(){
  return {
    latitude: 37.772083,
    longitude: -122.453444,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }
}

function mockMarker(){
  return {
    id: (new Date).getTime(),
    coordinate: {latitude: 37.772083, longitude: -122.453444},
    title: 'Glass',
    description: 'in the bike lane'
  }
}

if (__DEV__){
  console.log('########################');
  console.log('DEVELOPMENT MODE ENABLED');
  console.log('########################');
}

export default class HomeScreen extends React.Component {

  state = {
    username: '',
    location: 'No Location Data',
    region: initialRegion(),
    markers: [],
    locationEnabled: false,
  }

  onRegionChange = (region) => {
    this.setState({ region });
  }

  componentDidMount() {
    this.getUsername();
    this.getLocation();
  }

  getLocation = async () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        location: 'Location not available on Sketch in Android emulator.',
      });
    } else {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        alert('Please allow permission to use Location data.');
      }else{
        this.setState({ locationEnabled: true });
      }
      let location = await Location.getCurrentPositionAsync({});
      let {latitude, longitude} = location['coords'];
      this.setState({ location: {latitude, longitude} });
      this.setState({ region: {latitude, longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421} });
    }
  }

  getUsername = () => {
    AsyncStorage.getItem('username')
      .then(val => this.setState({username: val}))
      .catch(err => alert(err));
  }

  handleCreateReport = () => {
    alert('Report created!');
    let marker = mockMarker();
    marker['coordinate'] = this.state.location;
    let markers = this.state.markers;
    markers.push(marker)
    this.setState({markers})
  }

  render(){
    let {region, markers, locationEnabled } = this.state;
    return (
      <View style={styles.container}>

        <MapView 
            style={styles.map}
            region={region}
            >

          {markers.map(marker => (
            <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
            />
          ))}

        </MapView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.handleCreateReport()}
            style={[styles.button]}
          >
            <Text style={styles.buttonText}>Report Glass in the Bike Lane</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: ( Platform.OS === 'ios' ) ? 30 : 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 20,
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
});
