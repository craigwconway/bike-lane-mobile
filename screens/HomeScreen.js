import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';


export default class HomeScreen extends React.Component {

  initialRegion = () => {
    return {
      latitude: 37.772083,
      longitude: -122.453444,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  }

  state = {
    username: '',
    location: 'No Location Data',
    region: this.initialRegion(),
    markers: [],
    locationEnabled: false,
  }

  componentDidMount() {
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
      this.setState({ region: {latitude, longitude, latitudeDelta: 0.001, longitudeDelta: 0.001} });
    }
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
            <Text style={styles.buttonText}>Glass in the Bike Lane!</Text>
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
    marginBottom: 30,
  },
});
