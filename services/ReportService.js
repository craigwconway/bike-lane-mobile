export const SEVERITY = ['Minimal', 'Moderate', 'Severe']

export const mock_report = () => {
  return { 
    id: new Date().getTime(),
    username: '[username]',
    coordinate: {
      latitude: 37.7,
      longitude: -122.4
    },
    address: {
      street: '[2160 Fell Street]',
      city: '[San Francisco]',
      state: '[CA]',
    },
    comment: "",
    severity: 1,
    created: new Date().getTime(),
    updated: new Date().getTime(),
    resolved: 0,
  }
}

export const mock_comment = () => {
  return { report: {
    username: 'anon',
    report: '[ID]',
    comment: "First!",
    severity: 0,
    created: new Date().getTime(),
    isResolved: false,
  }}
}

export const initialRegion = () => {
  return {
    latitude: 37.772083,
    longitude: -122.453444,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }
}

export const makeMarker = (username, severity, comment) => {
  const now = new Date();
  return {
    id: now.getTime(),
    coordinate: {latitude: 37.0, longitude: -122.0},
    title: username + ' @ ' + now,
    description: 'Severity: ' + severity + '\n' + comment
  }
}

export const calcDistance = (lat1, lon1, lat2, lon2) => {
  var R = 6371e3; // metres
  var φ1 = lat1 * (Math.PI/180);
  var φ2 = lat2 * (Math.PI/180);
  var Δφ = (lat2-lat1) * (Math.PI/180);
  var Δλ = (lon2-lon1) * (Math.PI/180);
  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}