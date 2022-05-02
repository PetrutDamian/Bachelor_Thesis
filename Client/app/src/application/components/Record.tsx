import {
  IonAlert,
  IonButton,
  IonContent,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { MediaCapture, MediaFile } from "@ionic-native/media-capture";
import { RecordContext } from "../data/RecordingsProvider";
import { RouteComponentProps } from "react-router";
import { AuthContext } from "../../auth/data/AuthProvider";
import { logOutOutline } from "ionicons/icons";

export const Record: React.FC<RouteComponentProps> = ({ history }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const { logout } = useContext(AuthContext);
  const { upload, uploading, ripe } = useContext(RecordContext);
  useEffect(() => {
    if (ripe !== undefined) history.push("/result");
  }, [ripe]);

  async function record() {
    MediaCapture.captureAudio({ duration: 3 })
      .then((result) => {
        const media = result as MediaFile[];
        setMedia(media);
        setShowModal(true);
      })
      .catch((error) => {
        console.log("erorr la capture audio");
      });
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
          <IonItem lines="none" slot="end">
            <IonIcon onClick={() => logout!()} icon={logOutOutline} />
          </IonItem>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading message={"Uploading... "} isOpen={uploading}></IonLoading>
        <IonLabel>
          Start the recording and knock the watermelon 3 times as shown in the
          picture.
        </IonLabel>
        <IonImg
          src="./knock.png"
          style={{ height: "200px", width: "200px" }}
        ></IonImg>
        <IonButton onClick={() => record()}> Record </IonButton>
        <IonButton
          fill="outline"
          onClick={() => {
            history.push("/recordings");
          }}
        >
          Recordings history
        </IonButton>
        <IonAlert
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          message={
            "This recording will be sent to check if the watermelon is ripe."
          }
          buttons={[
            {
              text: "Cancel",
              handler: () => {
                setMedia([]);
                setShowModal(false);
              },
            },
            {
              text: "Confirm",
              handler: () => {
                upload!(media);
                setShowModal(false);
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};
