import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { activate, login as loginApi } from "./remote/AuthApi";
import { register as registerApi } from "./remote/AuthApi";

type LoginFn = (email?: string, password?: string) => void;
type LogoutFn = () => void;
type FinishRegistrationFn = () => void;
type ActivateFn = (token: string) => void;
export interface AuthState {
  authenticationError: Error | null;
  registerError: Error | null;
  registered: boolean;
  isAuthenticated: boolean;
  login?: LoginFn;
  logout?: LogoutFn;
  register?: LoginFn;
  pendingAuthentication?: boolean;
  email?: string;
  password?: string;
  token: string;
  finishRegistration?: FinishRegistrationFn;
  activateEmail?: ActivateFn;
}

const initialState: AuthState = {
  registerError: null,
  isAuthenticated: false,
  authenticationError: null,
  pendingAuthentication: false,
  token: "",
  registered: false,
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
  children: PropTypes.ReactNodeLike;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const {
    isAuthenticated,
    authenticationError,
    pendingAuthentication,
    token,
    registerError,
    registered,
    email,
  } = state;
  const login = useCallback<LoginFn>(loginCallback, []);
  const logout = useCallback<LogoutFn>(logoutCallback, []);
  const register = useCallback<LoginFn>(registerCallback, []);
  const finishRegistration = finishRegistrationCallback;
  const activateEmail = useCallback<ActivateFn>(activateEmailCallback, []);
  useEffect(authenticationEffect, [pendingAuthentication]);
  const value = {
    isAuthenticated,
    pendingAuthentication,
    login,
    logout,
    register,
    authenticationError,
    registerError,
    token,
    registered,
    email,
    finishRegistration,
    activateEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

  function loginCallback(email?: string, password?: string): void {
    console.log("!MESAJ! login call back, email:" + email + " pass" + password);
    setState({
      ...state,
      pendingAuthentication: true,
      email,
      password,
    });
  }
  function registerCallback(email?: string, password?: string): void {
    registerFn(email, password);
  }

  async function registerFn(email?: string, password?: string) {
    try {
      console.log(
        "!mesaj! in provider, about to call api with email" +
          email +
          " pass:" +
          password
      );
      await registerApi(email, password);
      console.log("!Mesaj! this is after api");
      setState({
        ...state,
        registerError: null,
        registered: true,
        email,
      });
    } catch (error) {
      console.log("!mesaj! error from await api");
      setState({ ...state, registerError: error });
    }
  }
  function authenticationEffect() {
    console.log(
      "!MESAJ! in authentification effect with pending auth:" +
        pendingAuthentication
    );
    let canceled = false;
    authenticate();
    return () => {
      canceled = true;
    };
    async function authenticate() {
      if (pendingAuthentication) {
        try {
          console.log(
            "!MESAJ! in authentifcate about to call loginApi..." +
              pendingAuthentication
          );
          const response = await loginApi(state.email, state.password);
          console.log(
            "!MESAJ! In authentificate, after I called loginApi, this is resposne: " +
              response
          );
          if (canceled) return;
          setState({
            ...state,
            token: response.data.token,
            pendingAuthentication: false,
            isAuthenticated: true,
            authenticationError: null,
          });
        } catch (error) {
          if (canceled) return;
          console.log("!MESAJ!, erroare");
          console.log(error);
          console.log("finished logging error");
          setState({
            ...state,
            authenticationError: error,
            pendingAuthentication: false,
          });
        }
      }
    }
  }
  function finishRegistrationCallback() {
    setState({ ...state, registered: false });
  }
  function activateEmailCallback(token: string) {
    (async () => {
      await activate(token);
    })();
  }
  function logoutCallback() {
    setState({ ...state, token: "", isAuthenticated: false });
  }
};
