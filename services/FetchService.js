import { Auth } from "aws-amplify";

const HOST = "https://12laz39pv8.execute-api.us-west-2.amazonaws.com/Prod/";

export default class FetchService {
  static fetchReports = async () => {
    user = await Auth.currentAuthenticatedUser();
    const response = await fetch(HOST + "report/", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken
      }
    });
    let reports = await response.json();
    return reports;
  };
}
