import axios from "axios";
import { baseUrl } from "../../../utils/url";
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};
const authUrl = `http://${baseUrl}/api/auth`;

export interface AuthProps {
  data: { token: string };
}

export const login: (email?: string, password?: string) => Promise<AuthProps> =
  (email, password) => {
    console.log("!MESAJ! IN axios, emaiL: " + email + " pass" + password);
    return axios
      .post(`${authUrl}/login`, { email, password }, config)
      .catch((error) => {
        console.log("!MESAJ! Error");
        throw new Error(error.response.data);
      });
  };
export const register: (email?: string, password?: string) => Promise<any> = (
  email,
  password
) => {
  console.log("!mesaj in axios :email-" + email + " pass:" + password);
  return axios
    .post(`${authUrl}/register`, { email, password }, config)
    .catch((error) => {
      console.log("!mesaj!register errorrr");
      throw new Error(error.response.data);
    });
};
export const activate: (token: string) => Promise<any> = (token) => {
  return axios
    .put(`${authUrl}/activate/${token}`, undefined, config)
    .catch((error) => {
      throw new Error(error.response.data);
    });
};
