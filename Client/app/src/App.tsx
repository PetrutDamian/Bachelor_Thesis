import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./auth/components/Login";
import { AuthProvider } from "./auth/data/AuthProvider";
import { PrivateRoute } from "./auth/components/PrivateRoute";
import { Record } from "./application/components/Record";
import Register from "./auth/components/Register";
import { RegisterCompleted } from "./auth/components/RegisterCompleted";
import Activation from "./auth/components/Activation";
import { AppUrlListener } from "./application/components/AppUrlListener";
import { RecordingsProvider } from "./application/data/RecordingsProvider";
import { Result } from "./application/components/Result";
import RecordingsList from "./application/components/RecordingsList";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AppUrlListener></AppUrlListener>
      <IonRouterOutlet>
        <AuthProvider>
          <Route path="/login" exact={true} component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/registered" exact component={RegisterCompleted} />
          <Route path="/activation/:id" component={Activation} exact={true} />
          <RecordingsProvider>
            <PrivateRoute path="/record" component={Record} exact={true} />
            <PrivateRoute path="/result" component={Result} exact={true} />
            <PrivateRoute path="/recordings" component={RecordingsList} exact />
          </RecordingsProvider>
          <Route exact path="/" render={() => <Redirect to="/login" />} />
        </AuthProvider>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
