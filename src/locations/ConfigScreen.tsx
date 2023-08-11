import React, { useCallback, useState, useEffect } from "react";
import { ConfigAppSDK } from "@contentful/app-sdk";
import {
  Heading,
  Form,
  Paragraph,
  Flex,
  FormControl,
  TextInput,
  TextLink,
} from "@contentful/f36-components";
import { css } from "emotion";
import { useSDK } from "@contentful/react-apps-toolkit";

export interface AppInstallationParameters {
  apiKey: string;
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
    apiKey: "",
  });
  const sdk = useSDK<ConfigAppSDK>();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
    <Flex
      flexDirection="column"
      className={css({ margin: "80px", maxWidth: "800px" })}
    >
      <Form>
        <Heading>App Config</Heading>
        <Paragraph>
          Connect with your{" "}
          <TextLink
            href="https://www.pexels.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pexels
          </TextLink>{" "}
          API key. you can get one{" "}
          <TextLink
            href="https://www.pexels.com/api/new/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Here
          </TextLink>
          .
        </Paragraph>
        <FormControl>
          <TextInput
            type="text"
            value={parameters?.apiKey}
            onChange={(e) =>
              setParameters((params) => ({ ...params, apiKey: e.target.value }))
            }
            isRequired
            placeholder="Your Pexels API key"
          />
        </FormControl>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
