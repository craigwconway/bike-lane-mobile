const uuid = require("uuid/v4");

import { Auth } from "aws-amplify";

export class Report {
  static SEVERITY = ["Minimal", "Moderate", "Severe"];

  constructor() {
    this.username = "Anon";
    this.latitude = 0;
    this.longitude = 0;
    this.severity = 1;
    this.comment = "";
  }

  severityText() {
    return Report.SEVERITY[this.severity];
  }

  createdText() {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const days = (new Date().getTime() - this.created) / millisecondsPerDay;
    if (Math.round(days) === 0) {
      let hours = new Date(this.created).getHours() + 1;
      return hours > 12 ? hours - 12 + "pm" : hours + "am";
    } else if (Math.round(days) === 0) {
      return "yesterday";
    } else {
      return days + " days ago";
    }
  }

  marker() {
    return {
      title: this.comment !== "" ? this.comment : this.severityText(),
      description: this.username + " @ " + this.createdText(),
      coordinate: {
        latitude: this.latitude,
        longitude: this.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      }
    };
  }

  static fromJson(json) {
    let r = new Report();
    try {
      r.id = json.id;
      r.userId = json.userId;
      r.username = json.username;
      r.latitude = parseFloat(json.latitude);
      r.longitude = parseFloat(json.longitude);
      r.severity = json.severity;
      r.comment = json.comment;
      r.created = json.created;
      r.updated = json.updated;
    } catch (err) {
      console.log(err);
    }
    return r;
  }

  static from(
    username,
    latitude,
    longitude,
    severity,
    comment,
    created,
    isResolved
  ) {
    let r = new Report();
    r.username = username;
    r.latitude = latitude;
    r.longitude = longitude;
    r.severity = severity;
    r.comment = comment;
    r.created = created;
    r.isResolved = isResolved;
    return r;
  }
}

export class Comment {
  constructor() {
    this.username = "anon";
    this.report = {};
    this.comment = "";
    this.severity = 1;
    this.created = new Date().getTime();
    this.isResolved = false;
    this.isdeleted = false;
  }
}

export class ReportService {
  static HOST =
    "https://0jtafcy5k6.execute-api.us-west-2.amazonaws.com/Prod/report/";

  static post = async report => {
    auth = await Auth.currentAuthenticatedUser();
    console.log("ReportService.post report: " + JSON.stringify(report));
    response = await fetch(this.HOST, {
      method: "POST",
      headers: { Authorization: auth.signInUserSession.idToken.jwtToken },
      body: JSON.stringify(report)
    });
    json = await response.json();
    console.log("ReportService.create response: " + JSON.stringify(json));
    return Report.fromJson(json);
  };

  static fetchReports = async () => {
    console.log("ReportService.fetchReports");
    auth = await Auth.currentAuthenticatedUser();
    const response = await fetch(this.HOST, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        Authorization: auth.signInUserSession.idToken.jwtToken
      }
    });
    let objects = await response.json();
    let reports = [];
    for (i = 0; i < objects.length; i++) {
      reports.push(Report.fromJson(objects[i]));
    }
    console.log(
      "ReportService.fetchReports reposonse: " + JSON.stringify(reports)
    );
    return reports;
  };

  static byLocation = async (
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta
  ) => {
    console.log("ReportService.byLocation");
    auth = await Auth.currentAuthenticatedUser();
    url =
      this.HOST +
      "nearby/?latitude=" +
      latitude +
      "&longitude=" +
      longitude +
      "&latitudeDelta=" +
      latitudeDelta +
      "&longitudeDelta=" +
      longitudeDelta;
    console.log(url);
    const response = await fetch(url, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        Authorization: auth.signInUserSession.idToken.jwtToken
      }
    });
    let objects = await response.json();
    let reports = [];
    for (i = 0; i < objects.length; i++) {
      reports.push(Report.fromJson(objects[i]));
    }
    console.log(
      "ReportService.byLocation reposonse: " + JSON.stringify(reports)
    );
    return reports;
  };
}

export const initialRegion = () => {
  return {
    latitude: 37.772083,
    longitude: -122.453444,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };
};

export const calcDistance = (lat1, lon1, lat2, lon2) => {
  var R = 6371e3; // metres
  var φ1 = lat1 * (Math.PI / 180);
  var φ2 = lat2 * (Math.PI / 180);
  var Δφ = (lat2 - lat1) * (Math.PI / 180);
  var Δλ = (lon2 - lon1) * (Math.PI / 180);
  var a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};
