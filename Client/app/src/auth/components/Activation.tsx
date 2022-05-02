import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect } from "react";
import { RouteComponentProps, useParams } from "react-router";
import { AuthContext } from "../data/AuthProvider";

const Activation: React.FC<RouteComponentProps> = ({ history }) => {
  const route: { id: string } = useParams();
  const { activateEmail } = useContext(AuthContext);
  useEffect(activationEffect, []);
  useEffect(redirect, []);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Email activation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        Your account is now activated. Thank you. Redirecting to main page...
      </IonContent>
    </IonPage>
  );
  function activationEffect() {
    activateEmail!(route.id);
  }
  function redirect() {
    setTimeout(() => history.push("/"), 3000);
  }
};

export default Activation;
