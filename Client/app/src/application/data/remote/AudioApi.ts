import { MediaFile } from "@ionic-native/media-capture";
import { File } from "@ionic-native/file";
import { FileTransfer, FileUploadOptions } from "@ionic-native/file-transfer";
import { baseUrl } from "../../../utils/url";
import axios, { AxiosRequestConfig } from "axios";

async function upload(
  filename: string,
  url: string,
  filepath: string,
  token: string
) {
  const file_url = (
    await File.resolveLocalFilesystemUrl(filepath)
  ).toInternalURL();
  let options: FileUploadOptions = {};
  options.chunkedMode = false;
  options.fileName = filename;
  options.mimeType = "audio/wav";
  options.headers = { Authorization: `Bearer ${token}` };
  options.params = {
    v1: 1,
    v2: 2,
  };
  const fileTransfer = FileTransfer.create();
  console.log("About to try file transfer upload");
  const result = await fileTransfer.upload(
    file_url,
    encodeURI(url),
    options,
    true
  );
  console.log("Nu a fost eroare la file trasnfer");
  return result.response;
}
export interface Recording {
  ripeness: "ripe" | "unripe";
  date: Date;
  _id: string;
}

export const sendRecording: (
  mediaFile: MediaFile[],
  token: string
) => Promise<string> = async (media, token) => {
  return upload(
    media[0].name,
    `http://${baseUrl}/api/recordings/upload`,
    media[0].fullPath,
    token
  );
};
const config: (token: string) => AxiosRequestConfig = (token: string) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};
export const fetchRecordings: (token: string) => Promise<Recording[]> = (
  token
) => {
  return axios
    .get(`http://${baseUrl}/api/recordings/`, config(token))
    .then((result) => result.data);
};
