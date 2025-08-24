import { ApiConfig } from "../configs/ApiConfig";

export class AuthenticationService {
  public static async isAuthenticated() {
    var token =await this.getToken();
    return !!token;
  }

  public static async getToken() {  
    var token: any = localStorage.getItem(ApiConfig.Token);
    return token;
  }
}
