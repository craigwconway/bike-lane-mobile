export default class Auth {
  constructor(username, idToken, refreshToken, accessToken) {
    this.username = username;
    this.idToken = idToken;
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
  }
}
