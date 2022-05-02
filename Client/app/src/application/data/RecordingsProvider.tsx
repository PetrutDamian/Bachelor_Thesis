import React, { useCallback, useContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../auth/data/AuthProvider";
import { MediaFile } from "@ionic-native/media-capture";
import { fetchRecordings, Recording, sendRecording } from "./remote/AudioApi";

export interface RecordingState {
  upload?: UploadFn;
  uploading: boolean;
  ripe?: string;
  clear?: ClearFn;
  getRecordings?: GetRecordingsFn;
  recordings: Recording[];
  fetching: boolean;
}
export type UploadFn = (media: MediaFile[]) => void;
export type ClearFn = () => void;
export type GetRecordingsFn = () => void;

const initialState: RecordingState = {
  uploading: false,
  fetching: false,
  recordings: [],
};

export const RecordContext = React.createContext<RecordingState>(initialState);

interface RecordProviderProps {
  children: PropTypes.ReactNodeLike;
}
interface ActionProps {
  type: string;
  payload?: any;
}
const START_UPLOAD = "START_UPLOAD";
const UPLOAD_FINISHED = "UPLOAD_FINISHED";
const CLEAR = "CLEAR";
const START_FETCHING = "START_FETCHING";
const FINISHED_FETCHING = "FINISHED_FETCHING";

const reducer: (state: RecordingState, action: ActionProps) => RecordingState =
  (state, { type, payload }) => {
    switch (type) {
      case START_UPLOAD:
        return { ...state, uploading: true };
      case UPLOAD_FINISHED:
        console.log("in dispatch" + payload);
        return { ...state, uploading: false, ripe: payload };
      case CLEAR:
        return { ...state, ripe: undefined };
      case START_FETCHING:
        return { ...state, fetching: true };
      case FINISHED_FETCHING:
        return { ...state, fetching: false, recordings: payload };
      default:
        return state;
    }
  };

export const RecordingsProvider: React.FC<RecordProviderProps> = ({
  children,
}) => {
  const { token } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { fetching, uploading, ripe, recordings } = state;
  const upload = useCallback<UploadFn>(uploadRecordingCallback, [token]);
  const clear = useCallback<ClearFn>(ClearFnCallback, []);
  const getRecordings = useCallback<GetRecordingsFn>(getRecordingsCallback, []);
  useEffect(() => {
    if (fetching) fetchingEffect();
  }, [fetching]);
  const value = {
    uploading: uploading,
    upload,
    clear,
    ripe: ripe,
    getRecordings,
    fetching: fetching,
    recordings,
  };
  return (
    <RecordContext.Provider value={value}>{children}</RecordContext.Provider>
  );

  async function uploadRecordingCallback(mediaFile: MediaFile[]) {
    dispatch({ type: START_UPLOAD });
    const result = await sendRecording(mediaFile, token);
    dispatch({ type: UPLOAD_FINISHED, payload: result });
  }
  function ClearFnCallback() {
    dispatch({ type: CLEAR });
  }
  function getRecordingsCallback() {
    dispatch({ type: START_FETCHING });
  }
  async function fetchingEffect() {
    const recordings = await fetchRecordings(token);
    console.log("i got recordings:" + JSON.stringify(recordings));
    dispatch({ type: FINISHED_FETCHING, payload: recordings });
  }
};
