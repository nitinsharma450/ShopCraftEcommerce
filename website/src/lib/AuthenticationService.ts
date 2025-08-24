export class AuthenticationService {
  public static async isAuthenticated() {
    var token =await this.getToken();
    return !!token;
  }

  public static async getToken() {
    var token: any = localStorage.getItem("auth_token");
    if (token) {
      try {
        token = JSON.parse(token);
        token = token.validAccessToken;
      } catch (error) {
        token = "";
      }
    } else {
      token = "";
    }

    return token;
  }
}
