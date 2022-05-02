import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonLoading,
  IonButton,
  IonLabel,
  IonItem,
  IonChip,
  IonImg,
} from "@ionic/react";
import "../../utils/constants.css";
import React, { useContext, useState } from "react";
import { RouteComponentProps } from "react-router";
import { AuthContext } from "../data/AuthProvider";
export interface LoginState {
  email?: string;
  password?: string;
}

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    isAuthenticated,
    pendingAuthentication,
    login,
    authenticationError,
  } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { email, password } = state;
  const handleLogin = () => {
    login?.(email, password);
  };
  if (isAuthenticated) {
    history.push("/record");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
          placeholder="Email"
          value={email}
          onIonChange={(e) =>
            setState({
              ...state,
              email: e.detail.value || "",
            })
          }
        />
        <IonInput
          type="password"
          placeholder="Password"
          value={password}
          onIonChange={(e) =>
            setState({
              ...state,
              password: e.detail.value || "",
            })
          }
        />
        <IonLoading isOpen={pendingAuthentication || false} />
        {authenticationError && (
          <div>{authenticationError.message || "Failed to authenticate"}</div>
        )}
        <IonButton onClick={handleLogin}>Login</IonButton>
        <IonItem>
          <IonLabel
            id="register_label"
            onClick={() => history.push("/register")}
          >
            Don't have an account? Click here to register.
          </IonLabel>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Login;
