import React from "react";
import { Platform, StyleSheet, View, TouchableOpacity } from "react-native";
import {
  Button,
  ButtonGroup,
  Input,
  Overlay,
  Text,
  ThemeProvider
} from "react-native-elements";
import MapView, { Marker } from "react-native-maps";

import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";

import {
  Report,
  ReportService,
  initialRegion
} from "../services/ReportService";
import { StateService } from "../services/StateService";

const MAP_SCALE = 0.001; // MOVE TO CONFIG
const MARKER_SIZE = 25;
const PIN_COLORS = ["gray", "orange", "red"];

export default class HomeScreen extends React.Component {
  state = {
    loading: true,
    location: {},
    locationEnabled: false,
    markers: [],
    markersRef: [],
    overlay: false,
    region: initialRegion(),
    report: new Report(),
    reports: [],
    reportsRef: [],
    user: {}
  };

  async componentDidMount() {
    this.getLocation();
  }

  getLocation = async () => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      alert("Location not available on Sketch in Android emulator.");
      this.setState({ loading: false });
    } else {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        alert(
          "To more effectivly use this app, go to Device Settings and enable Location services."
        );
        this.setState({ loading: false });
      } else {
        let location = await Location.getCurrentPositionAsync({});
        // TODO log location for notifications
        let { latitude, longitude } = location["coords"];
        this.setState({
          region: {
            latitude,
            longitude,
            latitudeDelta: MAP_SCALE,
            longitudeDelta: MAP_SCALE
          }
        });
        this.setState({ location: { latitude, longitude } });
        this.setState({ locationEnabled: true });
        this.setState({ loading: false });
        this.getMarkers(latitude, longitude, MAP_SCALE, MAP_SCALE);
        StateService.set("nearby", this.state.markers);
        setTimeout(() => this.showMarkerCallout(), 1000);
      }
    }
  };

  onRegionChange = regionChange => {
    this.setState({ region: regionChange });
    this.getMarkers(
      regionChange.latitude,
      regionChange.longitude,
      regionChange.latitudeDelta,
      regionChange.longitudeDelta
    );
  };

  showMarkerCallout = () => {
    const { markersRef } = this.state;
    if (markersRef.length > 0) {
      markersRef[0].showCallout();
    }
  };

  getMarkers = async (latitude, longitude, latitudeDelta, longitudeDelta) => {
    let markers = await ReportService.byLocation(
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    );
    this.setState({ markers });
  };

  handleCreateReport = async () => {
    let { report, reports, reportsRef, snappedPoints, user } = this.state;
    report.latitude = snappedPoints.latitude;
    report.longitude = snappedPoints.longitude;
    report = await ReportService.post(report);
    if (report.error) {
      alert("Oops");
      this.setState({ overlay: false });
    } else {
      // hide overlay and show marker
      reports.push(report);
      this.setState({ reports });
      this.setState({ report: new Report() });
      this.setState({ overlay: false });
      setTimeout(() => reportsRef[reportsRef.length - 1].showCallout(), 100);
    }
  };

  handleReportClick = index => {
    let report = this.state.reports[index];
    this.setState({ report });
    this.setState({ overlay: true });
  };

  handleSeverity = val => {
    let report = this.state.report;
    report.severity = val;
    this.setState({ report });
  };

  handleComment = val => {
    let report = this.state.report;
    report.comment = val;
    this.setState({ report });
  };

  handleMapPress = event => {
    if (
      event.nativeEvent.action !== "marker-press" &&
      event.nativeEvent.coordinate
    ) {
      console.log(JSON.stringify(event.nativeEvent.coordinate));
      let { latitudeDelta, longitudeDelta } = this.state.region;
      this.setState({
        region: {
          ...event.nativeEvent.coordinate,
          latitudeDelta,
          longitudeDelta
        }
      });
      this.setState({ location: event.nativeEvent.coordinate });
      this.setState({ snappedPoints: event.nativeEvent.coordinate });
      this.setState({ overlay: true });
    }
  };

  mapPinColor = severity => {
    return PIN_COLORS[severity];
  };

  render() {
    let { loading, markers, overlay, region, report, reports } = this.state;
    return loading ? (
      <Loading />
    ) : (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChange={this.onRegionChange}
          onPress={this.handleMapPress}
        >
          {reports.map((report, i) => (
            <Marker
              key={i}
              ref={ref => this.state.reportsRef.push(ref)}
              coordinate={report.marker().coordinate}
              title={report.marker().title}
              description={report.marker().description}
              onPress={_ => this.handleReportClick(i)}
              pinColor={this.mapPinColor(report.severity)}
            >
              <Ionicons
                name={Platform.OS === "ios" ? "ios-warning" : "md-warning"}
                size={MARKER_SIZE}
                color={this.mapPinColor(report.severity)}
              />
            </Marker>
          ))}

          {markers.map((report, i) => (
            <Marker
              key={i}
              ref={ref => this.state.markersRef.push(ref)}
              coordinate={report.marker().coordinate}
              title={report.marker().title}
              description={report.marker().description}
              pinColor={this.mapPinColor(report.severity)}
            >
              <Ionicons
                name={Platform.OS === "ios" ? "ios-warning" : "md-warning"}
                size={MARKER_SIZE}
                color={this.mapPinColor(report.severity)}
              />
            </Marker>
          ))}
        </MapView>

        <ThemeProvider>
          <Overlay
            isVisible={overlay}
            onBackdropPress={() => this.setState({ overlay: false })}
          >
            <View>
              <Text h4 style={{ textAlign: "center", paddingBottom: 40 }}>
                {this.state.report.id ? "Update" : "Create"} Report
              </Text>

              <Text
                style={{
                  marginLeft: 5,
                  marginBottom: 14,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "gray"
                }}
              >
                How bad is it?
              </Text>

              <ButtonGroup
                onPress={this.handleSeverity}
                selectedIndex={report.severity}
                buttons={Report.SEVERITY}
              />

              <View style={{ marginTop: 14, marginBottom: 40 }}>
                <Input
                  label="Comment"
                  placeholder="(optional)"
                  value={report.comment}
                  onChangeText={this.handleComment}
                />
              </View>

              <Button
                title={this.state.report.id ? "Update" : "Create"}
                onPress={this.handleCreateReport}
              />

              <Button
                title="Cancel"
                onPress={() => this.setState({ overlay: false })}
                buttonStyle={{ backgroundColor: "red", marginTop: 20 }}
              />

              <ContactDPW severity={report.severity} />
            </View>
          </Overlay>
        </ThemeProvider>
      </View>
    );
  }
}

export function ContactDPW(props) {
  return props.severity !== 2 ? null : (
    <View style={{ marginTop: 30 }}>
      <Text style={{ fontSize: 20, color: "red", textAlign: "center" }}>
        Notify the San Francisco Department of Public Works.
      </Text>
      <Input
        readonly
        value="415-555-5555"
        inputStyle={{ textAlign: "center", borderWidth: 0 }}
      />
      <Button title="Call now" onPress={() => alert("Calling...")} />
    </View>
  );
}

export function Loading() {
  return (
    <View style={styles.container}>
      <Text h1>Loading...</Text>
    </View>
  );
}

export function ReportMarker(props) {
  return props.isVisible ? <Marker {...props} /> : null;
}

export function ReportButton(props) {
  return props.isVisible ? (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={props.onPress} style={[styles.button]}>
        <Text style={styles.buttonText}>Create Report</Text>
      </TouchableOpacity>
    </View>
  ) : null;
}

HomeScreen.navigationOptions = {
  title: "Glass in the Bike Lane"
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff"
  },
  button: {
    alignItems: "center",
    backgroundColor: "rgba(145,30,30,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    marginBottom: 30
  }
});
