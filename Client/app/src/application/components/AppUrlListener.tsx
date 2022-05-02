import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Plugins } from "@capacitor/core";
const { App: CapApp } = Plugins;

export const AppUrlListener: React.FC<any> = () => {
  let history = useHistory();
  useEffect(() => {
    CapApp.addListener("appUrlOpen", (data: any) => {
      // Example url: https://beerswift.app/tabs/tab2
      // slug = /tabs/tab2
      const slug = data.url.split(".app").pop();
      if (slug) history.push(slug);
    });
  }, []);

  return null;
};
