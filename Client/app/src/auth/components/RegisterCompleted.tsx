import { IonLabel, IonPage } from "@ionic/react";
import React, { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { AuthContext } from "../data/AuthProvider";

export const RegisterCompleted: React.FC<RouteComponentProps> = ({
  history,
}) => {
  const { email, registered, finishRegistration } = useContext(AuthContext);
  useEffect(() => {
    if (registered) {
      setTimeout(() => finishRegistration!(), 3000);
    } else {
      history.push("/");
    }
  }, [registered]);
  return (
    <IonPage>
      <IonLabel>{`Activation link was sent to ${email}. Redirecting to main page...`}</IonLabel>
    </IonPage>
  );
};

export default RegisterCompleted;
