const uuid = require('uuid/v4');

export class Report {
  static SEVERITY = ['Minimal', 'Moderate', 'Severe']

  constructor() {
    this.user = 'anon'
    this.latitude = 0
    this.longitude = 0
    this.street_address = 
    this.severity = 1
    this.comment = ''
    this.isResolved = false
    this.isDeleted = false
    this.comments =[]
  }

  severityText() {
    return Report.SEVERITY[this.severity]
  }

  createdText() {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const days = (new Date().getTime() - this.created) / millisecondsPerDay;
    if(Math.round(days) === 0){
      let hours = new Date(this.created).getHours()+1;
      return hours > 12 ? hours - 12 + 'pm' : hours + 'am';
    }else if(Math.round(days) === 0){
      return 'yesterday'
    }else{
      return days + ' days ago'
    }
  }

  getMarker() {
    return {
      title: this.comment !== '' ? this.comment : this.severityText(),
      description: this.user + ' @ ' + this.createdText(),
      coordinate: { 
        latitude: this.latitude, 
        longitude: this.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001, }
      }
  }

  static from(user, latitude, longitude, severity, comment, created, isResolved){
    let r = new Report();
    r.user = user
    r.latitude = latitude
    r.longitude = longitude
    r.severity = severity
    r.comment = comment
    r.created = created
    r.isResolved = isResolved
    return r;
  }
}

export class Comment {
  constructor(){
    this.user = 'anon'
    this.report = {}
    this.comment = ''
    this.severity = 1
    this.created = new Date().getTime()
    this.isResolved = false
    this.isdeleted = false
  }

}

export class ReportService{

  static create = report => {
    report.id = uuid()
    report.created = new Date().getTime()
    console.log('ReportService.create: ' + JSON.stringify(report))
    return report
  }

  static update = report => {
    report.updated = new Date().getTime()
    console.log('ReportService.update: ' + JSON.stringify(report))
    return report
  }

  static delete = report => {
    report.isDeleted = true
    console.log('ReportService.delete: ' + JSON.stringify(report))
    return ReportService.update(report)
  }

  static async getSnappedPoints(latitude, longitude) {
    // const GOOGLE_MAPS_KEY = 'KEY'; 
    // const url = 'https://roads.googleapis.com/v1/snapToRoads?path=' + latitude + ',' + longitude + '&key=' + GOOGLE_MAPS_KEY;
    // console.log('Location from API: ' + url);
    // const response = await fetch(url);
    // const responseJson = await response.json();
    // let snappedPoints = responseJson['snappedPoints'][0]['location'];
    // // add distance
    // distance = calcDistance(
    //   parseFloat(latitude), parseFloat(longitude), 
    //   parseFloat(snappedPoints.latitude), parseFloat(snappedPoints.longitude));
    // snappedPoints = { ...snappedPoints, distance}
    snappedPoints = { latitude, longitude, distance: 0}
    console.log(JSON.stringify(snappedPoints));
    return snappedPoints;
  }

  static findByProximity(latitude, longitude, distance){
    const now = new Date().getTime()
    return [
      Report.from('anon', 37.78561478825257, -122.40678737039494, 0, 'Auto-generated', now, false),
      Report.from('anon', 37.78529790044189, -122.40640089696501, 1, 'Auto-generated', now, false),
      Report.from('anon', 37.78656544353201, -122.40640331242392, 2, 'Auto-generated', now, false),
      Report.from('anon', 37.78630582804297, -122.4063630547627, 0, 'Auto-generated', now, false),
      Report.from('anon', 37.78602584952297, -122.4062785136999, 1, 'Auto-generated', now, false),
      Report.from('anon', 37.78568223808341, -122.40605790179588, 2, 'Auto-generated', now, false),
      Report.from('anon', 37.78514836456705, -122.40660138005678, 2, 'Auto-generated', now, false),
    ];
  }
}

export const initialRegion = () => {
  return {
    latitude: 37.772083,
    longitude: -122.453444,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
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