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
  Text,
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
  const [errorMsg, setErrorMsg] = useState<string>("");
  const sdk = useSDK<ConfigAppSDK>();

  const onConfigure2 = useCallback(async () => {
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

  // Configure the app when the user installs or updates settings
  const onConfigure = async () => {


    // Save parameters and current state for app configuration
    const currentState = await sdk.app.getCurrentState();
    const appConfig = {
      parameters,
      targetState: currentState,
    };

    // Complete the configuration process
    return appConfig;
  };

  useEffect(() => {
    // Register the onConfigure callback when apiKey is set

    setErrorMsg("");
    if (parameters.apiKey) {
      sdk.app.onConfigure(() => onConfigure());
    } else {
      setErrorMsg("Please set an API Key");
    }
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Retrieve and set current parameters, then signal readiness
      const prepareApp = async () => {
        const currentParameters: AppInstallationParameters | null =
          await sdk.app.getParameters();

        if (currentParameters) {
          setParameters(currentParameters);
        }

        // Signal app readiness after setup
        sdk.app.setReady();
      };

      prepareApp();
    })();
  }, [sdk]);

  return (
    <Flex
      flexDirection="column"
      className={css({ margin: "80px", maxWidth: "800px" })}
    >
      <Form>
        <Heading>App Config </Heading>
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

        <Text fontColor="red500" marginBottom="spacingM">
          {errorMsg && errorMsg}
        </Text>
        <FormControl>
          <TextInput
            type="text"
            value={parameters?.apiKey}
            isInvalid={!!errorMsg}
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
