import { Collapse, Radio, Stack } from "@contentful/f36-components";
import { useEffect, useState } from "react";
import { DEFAULT_PER_PAGE } from "../constants";
import { IPhotoData } from "./Dialog";

import { FieldAppSDK } from "@contentful/app-sdk";
import {
  AssetCard,
  Button,
  Form,
  FormControl,
  TextInput
} from "@contentful/f36-components";
import {
  useAutoResizer,
  useSDK
} from "@contentful/react-apps-toolkit";
import { generatePhotoEndpoints } from "../utils";

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  useAutoResizer();


  const apiKey = sdk.parameters.installation.apiKey;



  const [showForm, setShowForm] = useState(false);

  const [photoSearch, setPhotoSearch] = useState<string>("");

  const [orientationFilter, setOrientationFilter] = useState<
    "landscape" | "square" | "portrait" | undefined
  >(undefined);
  const val = sdk.field.getValue();

  const openDialog = async () => {
    sdk.parameters.instance.pexels = { opens: 1 };
    const data: IPhotoData = await sdk.dialogs.openCurrentApp({
      width: 800,
      position: "center",
      minHeight: "800px",
      parameters: {
        q: {
          query: photoSearch,
          per_page: DEFAULT_PER_PAGE,
          orientation: orientationFilter ? orientationFilter : "",
        },
      },
      title: "Pexels Photo Search",
      allowHeightOverflow: true,
      shouldCloseOnEscapePress: true,
      shouldCloseOnOverlayClick: true,
    });
    if (data) {
      sdk?.field.setValue(data);
      setShowForm(false);
      try {
        const potentialTitleField = sdk.entry.fields.title;
        const potentialInternalTitle = sdk.entry.fields.internalTitle;
    

        const title = `Pexels / ${data?.alt} | ${data?.photographer_attribution}`;

        if (potentialTitleField) {
          potentialTitleField?.setValue(title);
        }
        if (potentialInternalTitle) {
          potentialInternalTitle?.setValue(title);
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    if (!val) {
      setShowForm(true);
    }

    return () => {};
  }, [val]);

  const voluntaryFormReval = () => {
    setShowForm(true);
  };

  useEffect(() => {
    return () => {
      setShowForm(false);
    };
  }, []);

  return (
    <Stack
      padding="spacingM"
      flexDirection="column"
      spacing="spacingM"
      alignItems="start"
      // fullWidth
      // fullHeight
    >
      {val && !showForm && (
        <Button variant="primary" onClick={voluntaryFormReval}>
          Change Photo
        </Button>
      )}
      <Collapse isExpanded={showForm}>
        <Form onSubmit={() => openDialog()}>
          <FormControl>
            <FormControl.Label>Search Images Pexels</FormControl.Label>

            <TextInput
              type="text"
              onChange={(e) => setPhotoSearch(e.target.value)}
              isRequired
              placeholder="Search for free photos"
            />
          </FormControl>

          <FormControl>
            <FormControl.Label isRequired>Orientation </FormControl.Label>

            <Stack flexDirection="row">
              <Radio
                id="default"
                name="radio-default"
                value={orientationFilter}
                isChecked={orientationFilter === undefined}
                onChange={() => setOrientationFilter(undefined)}
              >
                Default
              </Radio>
              <Radio
                id="landscape"
                name="radio-landscape"
                value={orientationFilter}
                isChecked={orientationFilter === "landscape"}
                onChange={() => setOrientationFilter("landscape")}
              >
                Landscape
              </Radio>
              <Radio
                id="portrait"
                name="radio-portrait"
                value={orientationFilter}
                isChecked={orientationFilter === "portrait"}
                onChange={() => setOrientationFilter("portrait")}
              >
                Portrait
              </Radio>
            </Stack>
          </FormControl>

          <FormControl>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </FormControl>
        </Form>
      </Collapse>

      {val && (
        <AssetCard
          type="image"
          title={`${val?.alt} | ${val?.photographer_attribution}`}
          src={val?.src?.medium}
          // actions={[
          //   <MenuItem key="remove" onClick={() => setPhotoData(undefined)}>
          //     Remove
          //   </MenuItem>,
          // ]}
        />
      )}
    </Stack>
  );
};

export default Field;
