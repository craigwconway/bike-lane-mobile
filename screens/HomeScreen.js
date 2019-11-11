import React from 'react';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, ButtonGroup, Input, Overlay, Slider, Text, ThemeProvider } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import { calcDistance, initialRegion, makeMarker, mock_report, SEVERITY } from '../services/ReportService'
import StateService from '../services/StateService'

const SCALE = 0.001; // MOVE TO CONFIG 

export default class HomeScreen extends React.Component {

  state = {
    coordinate: {},
    location: {},
    locationEnabled: false, 
    markers: [],
    overlay: false,
    region: initialRegion(),
    report: mock_report(),
    reportButton: false,
    reportButtonOverlay: false,
    reportRef: {},
    snappedPoints: {},
    streetAddress: '',
  }

  componentWillMount() {
    this.getLocation();
    this.getUsername();
  }

  async getUsername(){
    let username = await StateService.get('username');
    this.setState({username});
  }

  getLocation = async () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      alert('Location not available on Sketch in Android emulator.');
    } else {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        alert('Location data is necessary to effectivly use this app.');
      }else{
        this.setState({ locationEnabled: true });
      }
      let location = await Location.getCurrentPositionAsync({});
      let {latitude, longitude} = location['coords'];
      this.setState({ location: {latitude, longitude} });
      this.setState({ reportButton: true });
      this.setState({ region: { latitude, longitude, latitudeDelta: SCALE, longitudeDelta: SCALE } });
    }
  }

  handleOverlay = () => {
    this.snapToRoad();
    this.state.overlay = true;
  }

  handleCreateReport = () => {
    const { location, snappedPoints } = this.state;
    const snappedDistance = calcDistance(
      parseFloat(location.latitude), parseFloat(location.longitude), 
      parseFloat(snappedPoints.latitude), parseFloat(snappedPoints.longitude));
    console.log('snappedDistance: ' + snappedDistance);
    if(snappedDistance > 25){
      alert('Reports must be made from the bike lane.')
    }else{
      let report = this.state.report;
      report.coordinate = snappedPoints;
      let markers = this.state.markers;
      markers[0] = report;
      this.setState({markers});
      this.state.overlay = false;
      setTimeout(() => this.state.reportRef.showCallout(), 100);
    }
  }

  snapToRoad = () => {
    const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY; 
    const { latitude, longitude } = this.state.location;
    const url = 'https://roads.googleapis.com/v1/snapToRoads?path=' + latitude + ',' + longitude + '&key=' + GOOGLE_MAPS_KEY;
    // let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + latitude + ',' + longitude + '&key=' + GOOGLE_MAPS_KEY;
    console.log('Location from API: ' + url);
    fetch(url)
          .then((response) => response.json())
          .then((responseJson) => {
            const snappedPoints = responseJson['snappedPoints'][0]['location'];
            this.setState({snappedPoints})
            this.setState({ reportButtonOverlay: true })
          });
  }

  handleSeverity = val => {
    let report = this.state.report;
    report.severity = val;
    this.setState({report});
  } 

  handleComment = val => {
    let report = this.state.report;
    report.comment = val;
    this.setState({report});
  } 

  render(){
    let {region, markers } = this.state;
    return (
      <View style={styles.container}>

        <MapView 
            style={styles.map}
            region={region} >

          {markers.map(marker => (
            <Marker 
                key={marker.id}
                ref={(ref) => this.state.reportRef = ref}
                coordinate={marker.coordinate}
                title={new Date(marker.created).toLocaleString()}
                description={SEVERITY[marker.severity] + ' ' + marker.comment} 
                onPress={() => this.setState({ overlay: true })}
                >
            </Marker>
          ))}

        </MapView>

        <ReportButton isVisible={this.state.reportButton} onPress={this.handleOverlay} />

        <ThemeProvider>

          <Overlay
            isVisible={this.state.overlay}
            onBackdropPress={() => this.setState({ overlay: false })} 
            >
              <View>

                <Text h4 style={{ textAlign: 'center', paddingBottom: 20}}>
                  New Report
                </Text>

                <Text style={{ textAlign: 'center', paddingBottom: 20}}>
                  Reported by {this.state.username} @ {new Date(this.state.report.created).toLocaleString()}
                </Text>
                
                <ButtonGroup
                  onPress={this.handleSeverity}
                  selectedIndex={this.state.report.severity}
                  buttons={SEVERITY}
                />

                <View style={{ marginTop: 20, marginBottom: 20 }} >
                  <Input 
                    placeholder='Comment'
                    style={{ marginBottom: 20 }}
                    onChangeText={this.handleComment} 
                    /> 
                </View>        

                <ReportButtonOverlay 
                  isVisible={this.state.reportButtonOverlay} 
                  title='Create' 
                  onPress={this.handleCreateReport} />

                <Button title='Cancel' onPress={() => this.setState({ overlay: false })} 
                  buttonStyle={{backgroundColor: 'red', marginTop: 20}}/>
              
              </View>

          </Overlay>

        </ThemeProvider>

      </View>
    );
  }
}

export function ReportButton(props){
  return props.isVisible ? (
    <View style={styles.buttonContainer}>
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.button]}>
      <Text style={styles.buttonText}>Glass in the Bike Lane!</Text>
    </TouchableOpacity>
  </View>
  ) : <View/>
}

export function ReportButtonOverlay(props){
  return props.isVisible ? (
    <Button {...props} />
  ) : null
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
