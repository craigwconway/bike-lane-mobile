import React from "react";
import { Platform, ScrollView, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  Button,
  ButtonGroup,
  Card,
  Text,
  ThemeProvider
} from "react-native-elements";

import { Ionicons } from "@expo/vector-icons";

import { ReportService, initialRegion } from "../services/ReportService";
import { StateService } from "../services/StateService";

const MARKER_SIZE = 25;
const PIN_COLORS = ["gray", "orange", "red"];

export default class ReportsScreen extends React.Component {
  state = {
    following: [],
    myReports: [],
    nearby: [],
    reports: [],
    tabIndex: 0,
    tabs: ["Nearby", "Following", "My Reports"],
    region: initialRegion()
  };

  async componentDidMount() {
    this.nearby();
  }

  handleTabSelect = val => {
    this.setState({ tabIndex: val });
    if (val == 0) {
      this.nearby();
    } else if (val == 1) {
      this.following();
    } else if (val == 2) {
      this.myReports();
    }
    this.refs.ScrollViewRef.scrollTo({ x: 0, y: 0, animated: false });
  };

  nearby = async () => {
    if (this.state.nearby.length > 0) {
      this.setState({ reports: this.state.nearby });
    } else {
    }
  };

  following = async () => {
    if (this.state.following.length > 0) {
      this.setState({ reports: this.state.following });
    } else {
      this.setState({ reports: [] });
    }
  };

  myReports = async () => {
    let reports = await ReportService.fetchReports();
    this.setState({ reports });
  };

  // TODO Refactor (used in home screen too)
  mapPinColor = severity => {
    return PIN_COLORS[severity];
  };

  render() {
    return (
      <ThemeProvider>
        <ButtonGroup
          selectedIndex={this.state.tabIndex}
          buttons={this.state.tabs}
          onPress={this.handleTabSelect}
        />
        <ScrollView style={{ backgroundColor: "gray" }} ref="ScrollViewRef">
          {this.state.reports.map((report, i) => (
            <Card key={i}>
              <Text style={{ marginBottom: 10 }}>
                {report.severityText()} by {report.user} @{" "}
                {report.createdText()}
              </Text>
              <Text style={{ marginBottom: 10, fontStyle: "italic" }}>
                {report.comment}
              </Text>
              <View>
                <MapView
                  style={{ height: 100 }}
                  region={report.marker().coordinate}
                  mapType="standard"
                  cacheEnabled={true}
                >
                  <Marker
                    coordinate={report.marker().coordinate}
                    title={report.marker().title}
                    description={report.marker().description}
                  >
                    <Ionicons
                      name={
                        Platform.OS === "ios" ? "ios-bicycle" : "md-bicycle"
                      }
                      size={MARKER_SIZE}
                      color={this.mapPinColor(report.severity)}
                    />
                  </Marker>
                </MapView>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <Ionicons
                  name={
                    Platform.OS === "ios" ? "ios-heart-empty" : "md-heart-empty"
                  }
                  size={20}
                  style={{ padding: 10, margin: 10 }}
                >
                  <Text style={{ fontSize: 14, margin: 10 }}>Follow</Text>
                </Ionicons>
                <Ionicons
                  name={
                    Platform.OS === "ios" ? "ios-chatboxes" : "md-chatboxes"
                  }
                  size={20}
                  style={{ padding: 10, margin: 10 }}
                >
                  <Text style={{ fontSize: 14, margin: 10 }}>Comment</Text>
                </Ionicons>
              </View>
            </Card>
          ))}
          <Text
            h4
            style={{
              color: "white",
              paddingTop: 20,
              paddingBottom: 20,
              textAlign: "center"
            }}
          >
            No more results
          </Text>
        </ScrollView>
      </ThemeProvider>
    );
  }
}

ReportsScreen.navigationOptions = {
  title: "Reports Feed"
};
