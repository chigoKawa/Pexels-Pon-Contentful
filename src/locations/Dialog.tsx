import { DialogAppSDK } from "@contentful/app-sdk";
import {
  AssetCard,
  Grid,
  Pagination,
  Stack,
  Text,
  DisplayText,
  Subheading,
  Flex,
  Paragraph,
} from "@contentful/f36-components";
import { useAutoResizer, useSDK } from "@contentful/react-apps-toolkit";
import { useEffect, useState, useRef } from "react";
import { DEFAULT_PER_PAGE, ATTRIBUTION_TEXT } from "../constants";
import { generatePhotoEndpoints } from "../utils";
import { IQuery, IPexelPhotos, IPexelPhotoData } from "../types/pexels";

export interface IPhotoData {
  photographer: string;
  photographer_url: string;
  image: string;
  src: IPexelPhotos["src"];
  alt: string;
  avg_color: string;
  url: string;
  attribution: string;
  photographer_attribution: string;
  width: number;
  height?: number;
}

const Dialog = () => {
  const sdk = useSDK<DialogAppSDK>();
  useAutoResizer();

  const bodyRef = useRef<HTMLDivElement>(null);

  const [pexelsData, setPexelsData] = useState<IPexelPhotoData | undefined>(
    undefined
  );

  const [orientationFilter, setOrientationFilter] = useState<
    "landscape" | "square" | "portrait" | null
  >("landscape");

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [queryString, setQueryString] = useState<string>("");
  const [perPage, setPerPage] = useState<number>(DEFAULT_PER_PAGE);

  const { apiKey } = sdk.parameters.installation;
  const pexelPhotoClient = generatePhotoEndpoints(apiKey);

  const handlePexelsSearch = async (q: IQuery) => {
    if (q) {
      try {
        const data = await pexelPhotoClient.search(q);

        setPexelsData(data);
        sdk.window.startAutoResizer();
        try {
          bodyRef?.current?.scrollIntoView({ behavior: "smooth" });
        } catch (error) {
          // just being defensive
        }
        setErrorMsg("");
      } catch (error) {
        setErrorMsg("Could not fetch data! Check your API key");
      }
    }
  };

  useEffect(() => {
    // @ts-expect-error
    const qry = sdk.parameters.invocation.q;

    if (qry?.query) {
      setQueryString(qry?.query);
      setPerPage(qry?.per_page);
      setOrientationFilter(qry?.orientation);
      handlePexelsSearch({
        query: qry?.query,
        per_page: qry?.per_page,
        orientation: qry?.orientation,
      });
    }
  }, [sdk.parameters.invocation]);

  const onPageChange = (pg: number) => {
    handlePexelsSearch({
      query: queryString,
      per_page: perPage,
      orientation: orientationFilter!,
      page: pg,
    });
  };

  useEffect(() => {
    return () => {
      setErrorMsg("");
    };
  }, []);

  if (errorMsg) {
    return (
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src="https://images.pexels.com/photos/2882552/pexels-photo-2882552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="By Miguel Á. Padriñán from Pexels"
          />
          <Subheading marginTop="spacingM" marginBottom="spacingM">
            An Error Occured!
          </Subheading>
          <Paragraph>{errorMsg}</Paragraph>
        </Flex>
      </Flex>
    );
  }

  if (Number(pexelsData?.total_results) < 1) {
    return (
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src="https://images.pexels.com/photos/302428/pexels-photo-302428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="By Pixabay from Pexels"
          />
          <Subheading marginTop="spacingM" marginBottom="spacingM">
            An Empty Train!
          </Subheading>
          <Paragraph>Nothing found for your search. Try again.</Paragraph>
        </Flex>
      </Flex>
    );
  }

  return (
    <Stack
      padding="spacingM"
      flexDirection="column"
      spacing="spacingM"
      fullWidth
      fullHeight
    >
      {pexelsData?.photos && (
        <Grid
          style={{
            width: "100%",
            minHeight: "400px",
            padding: "20px 20px",
          }}
          columns="1fr 1fr"
          rowGap="spacingM"
          justifyContent="space-between"
          ref={bodyRef}
        >
          {pexelsData?.photos?.map((item, i) => {
            return (
              <Grid.Item
                key={`key-${i}-${item?.url}`}
                area="span 1 / span 1"
                style={{ height: "300px" }}
              >
                <AssetCard
                  type="image"
                  title={item.alt}
                  src={item?.src?.medium}
                  onClick={() =>
                    sdk.close({
                      photographer: item.photographer,
                      photographer_url: item.photographer_url,
                      image: item.src?.medium,
                      src: item.src,
                      alt: item.alt,
                      avg_color: item.avg_color,
                      width: item.width,
                      height: item.height,
                      url: item.url,
                      attribution: ATTRIBUTION_TEXT,
                      photographer_attribution: `Photo by ${item.photographer} on Pexels`,
                    } as IPhotoData)
                  }
                />
              </Grid.Item>
            );
          })}
        </Grid>
      )}

      {pexelsData?.total_results && (
        <Pagination
          activePage={pexelsData?.page}
          onPageChange={onPageChange}
          itemsPerPage={DEFAULT_PER_PAGE}
          totalItems={pexelsData?.total_results}
          // isLastPage={Number(pexelsData?.page)* DEFAULT_PER_PAGE > Number(pexelsData?.total_results)}
        />
      )}
    </Stack>
  );
};

export default Dialog;
