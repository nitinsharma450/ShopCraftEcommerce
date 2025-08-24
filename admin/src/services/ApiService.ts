
import { ApiConfig } from "../configs/ApiConfig";
import { AuthenticationService } from "./AuthenticationService ";
export async function Api(
  endpoint: string,
  body: any = {}
): Promise<false | any> {
  const token = await AuthenticationService.getToken();

  try {
    const headers: any = {
      Accept: "application/json",
    };

    const isFormData = body instanceof FormData;

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${ApiConfig.EndPoint}${endpoint}`, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
      headers,
    });

    if (response.status === 403) {
      window.location.href = "/";
    }

    const json = await response.json();
    return json;
   

  } catch (error) {
    alert("Something went wrong");
    return null;
  }
}
