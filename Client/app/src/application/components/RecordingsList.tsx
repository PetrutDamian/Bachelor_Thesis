import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { RecordContext } from "../data/RecordingsProvider";
import { thumbsUpOutline, thumbsDownOutline } from "ionicons/icons";

const RecordingsList: React.FC<RouteComponentProps> = ({ history }) => {
  const { getRecordings, recordings } = useContext(RecordContext);
  useEffect(() => {
    getRecordings!();
  }, []);
  console.log(JSON.stringify(recordings));
  console.log("in recorinds list");
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recordings History</IonTitle>
          <IonButton
            onClick={() => history.push("/record")}
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
            <IonCol size="3">No.</IonCol>
            <IonCol size="7">Date</IonCol>
            <IonCol size="2">Ripe</IonCol>
          </IonRow>
          {recordings.map((x) => (
            <IonRow>
              <IonCol size="2">
                {recordings.findIndex((p) => p._id === x._id)}
              </IonCol>
              <IonCol size="9">{`${new Date(x.date).toDateString()} ${new Date(
                x.date
              ).getHours()}:${new Date(x.date).getMinutes()}`}</IonCol>
              <IonCol size="1">
                {x.ripeness === "ripe" ? (
                  <IonIcon icon={thumbsUpOutline} color="success" />
                ) : (
                  <IonIcon icon={thumbsDownOutline} color="danger" />
                )}
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default RecordingsList;
