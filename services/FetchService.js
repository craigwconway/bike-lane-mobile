import { Auth } from "aws-amplify";

const HOST = "https://12laz39pv8.execute-api.us-west-2.amazonaws.com/Prod/";

export class FetchService {
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
    console.log(reports);
    return reports;
  };

  static async postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }
}
