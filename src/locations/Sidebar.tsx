import React, { useState, useEffect } from "react";
import { Paragraph } from "@contentful/f36-components";
import { SidebarAppSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import eventDispatcher from "../eventDispatcher";

const Sidebar = () => {
  // const [message, setMessage] = useState("");
  const sdk = useSDK<SidebarAppSDK>();

  const [message, setMessage] = useState("");
  useEffect(() => {
    const messageChangeHandler = (event: CustomEvent) => {
      console.log("pexelin 34", message);
      setMessage(event.detail);
    };

    eventDispatcher.subscribe("messageChange", messageChangeHandler);

    return () => {
      eventDispatcher.unsubscribe("messageChange", messageChangeHandler);
    };
  }, []);

  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  return (
    <Paragraph>
      Hello Sidebar Component (AppId: {sdk.ids.app}){JSON.stringify(message)}
    </Paragraph>
  );
};

export default Sidebar;
