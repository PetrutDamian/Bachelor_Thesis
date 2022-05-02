import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
} from "@ionic/react";
import React, { useContext, useEffect } from "react";
import { RecordContext } from "../data/RecordingsProvider";
import { thumbsUpOutline, thumbsDownOutline } from "ionicons/icons";
import { RouteComponentProps } from "react-router";
export const Result: React.FC<RouteComponentProps> = ({ history }) => {
  const { ripe, clear } = useContext(RecordContext);
  return (
    <IonPage>
      <IonContent>
        <IonLabel>Watermelon has been analyzed:</IonLabel>
        {ripe !== undefined && (
          <IonItem lines="none">
            <IonLabel>Your watermelon is {ripe}!</IonLabel>
            {ripe === "ripe" && (
              <IonIcon icon={thumbsUpOutline} color="success" />
            )}
            {ripe === "unripe" && (
              <IonIcon icon={thumbsDownOutline} color="danger" />
            )}
          </IonItem>
        )}
        <IonButton
          onClick={() => {
            clear!();
            history.push("/record");
          }}
        >
          Try another one
        </IonButton>
      </IonContent>
    </IonPage>
  );
};
