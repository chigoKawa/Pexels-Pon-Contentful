import { SidebarAppSDK } from "@contentful/app-sdk";
import { AssetCard, Flex, Paragraph } from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";
import { css } from "emotion";
import { createClient } from "pexels";
import { useEffect, useState } from "react";
import eventDispatcher from "../eventDispatcher";
import { IPexelPhotoData } from "../types/pexels";

const Sidebar = () => {
  // const [message, setMessage] = useState("");
  const sdk = useSDK<SidebarAppSDK>();
  const { apiKey } = sdk.parameters.installation;

  const [pexelsData, setPexelsData] = useState<any | undefined>(undefined);

  useEffect(() => {
    if (apiKey) {
      const pexelsClient = createClient(apiKey);

      const fetchCuratedPhoto = async () => {
        try {
          const response: any = await pexelsClient.photos.curated({
            per_page: 1,
          });

          setPexelsData(response?.photos as IPexelPhotoData["photos"]);
    
        } catch (error) {
          console.error("Error fetching curated photo:", error);
        }
      };

      // Load a new curated image every 15 minutes
      const interval = 15 * 60 * 1000;
      const intervalId = setInterval(fetchCuratedPhoto, interval);
      fetchCuratedPhoto();

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [apiKey]);

  const [message, setMessage] = useState("");
  useEffect(() => {
    const messageChangeHandler = (event: CustomEvent) => {
      setMessage(event.detail);
    };

    eventDispatcher.subscribe("messageChange", messageChangeHandler);

    return () => {
      eventDispatcher.unsubscribe("messageChange", messageChangeHandler);
    };
  }, []);

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      className={css({ margin: "10px", maxWidth: "800px" })}
    >
      <Paragraph>Curated from Pexels</Paragraph>
      <AssetCard
        size="small"
        type="image"
        title={pexelsData?.[0]?.alt}
        src={pexelsData?.[0]?.src?.medium}
      />
    </Flex>
  );
};

export default Sidebar;
