import {
  IonAlert,
  IonButton,
  IonCol,
  IonContent,
  IonFab,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { emailIsValid } from "../../utils/helper";
import { AuthContext } from "../data/AuthProvider";
import { arrowBackCircleOutline } from "ionicons/icons";

const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { isAuthenticated, registerError, register, registered } =
    useContext(AuthContext);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  useEffect(registeredEffect, [registered]);
  useEffect(authentificatedEffect, [isAuthenticated]);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
          <IonButton
            onClick={() => history.push("/login")}
            fill="clear"
            slot="end"
          >
            Back
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Email:</IonLabel>
                <IonInput
                  placeholder="example@gmail.com"
                  pattern={"email"}
                  onIonChange={(e) => {
                    setEmail(e.detail.value || "");
                  }}
                />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Password:</IonLabel>
                <IonInput
                  type={"password"}
                  onIonChange={(e) => {
                    setPassword(e.detail.value || "");
                  }}
                />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonRow>
          <IonCol>
            <IonButton onClick={() => checkAndRegister()}>Submit</IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            {registerError && (
              <div>{registerError.message || "Failed to register"}</div>
            )}
          </IonCol>
        </IonRow>
        <IonAlert
          buttons={["close"]}
          isOpen={alertOpen}
          message="Invalid email or password!"
          onDidDismiss={() => setAlertOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
  function checkAndRegister() {
    console.log("in register check with email:" + email + "  pass" + password);
    if (password.length === 0 || !emailIsValid(email)) setAlertOpen(true);
    else register!(email, password);
  }
  function registeredEffect() {
    if (registered) history.push("/registered");
  }
  function authentificatedEffect() {
    if (isAuthenticated) history.push("/main");
  }
};

export default Register;
