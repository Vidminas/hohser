import * as React from "react";
import * as ReactDOM from "react-dom";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import Grid2 from "@mui/material/Grid2";

import StorageManager from "./content/storageManager";
import { Options, FilterData } from './types';
import { COST_FILTER_OPTIONS, COST_FILTER_TYPE, FILTER_OPTIONS, FILTER_TYPE, LEVEL_FILTER_OPTIONS, LEVEL_FILTER_TYPE, LOCAL_STORAGE, MEDIA_TYPE_FILTER_OPTIONS, MEDIA_TYPE_FILTER_TYPE, SUBJECT_FILTER_OPTIONS, SUBJECT_FILTER_TYPE, SYNC_STORAGE } from "./constants";
import { getPageColorMode } from "./content/common";
import FilterDropdown from "./components/FilterDropdown/FilterDropdown";


interface TagType {
  label: FILTER_TYPE;
  options: FILTER_OPTIONS;
}

const tagTypes: TagType[] = [
  {
    label: MEDIA_TYPE_FILTER_TYPE,
    options: MEDIA_TYPE_FILTER_OPTIONS,
  },
  {
    label: SUBJECT_FILTER_TYPE,
    options: SUBJECT_FILTER_OPTIONS,
  },
  {
    label: LEVEL_FILTER_TYPE,
    options: LEVEL_FILTER_OPTIONS,
  },
  {
    label: COST_FILTER_TYPE,
    options: COST_FILTER_OPTIONS,
  },
];
interface TagBarProps {
  filterData: FilterData[];
  onSave: (tags: FilterData[]) => void;
}
const TagBar = ({ filterData, onSave }: TagBarProps) => {
  const theme = useTheme();
  const [tags, setTags] = React.useState(
    tagTypes.map((tagType) => ({
      ...tagType,
      selections: tagType.options.filter((option) => filterData.some((tag) => tag.type === tagType.label && tag.tag === option[1])),
    }))
  );
  const [unsaved, setUnsaved] = React.useState(false);

  const handleChange = (tagData: TagType, newSelections: FILTER_OPTIONS) => {
    setTags(tags.map((tag) => tag.label === tagData.label ? { ...tag, selections: newSelections } : tag));
    setUnsaved(true);
  };

  const handleSave = () => {
    onSave(tags.flatMap((tagData) => tagData.selections.map((selection) => ({ type: tagData.label, tag: selection[1] }))));
    setUnsaved(false);
  };

  const handleCancel = () => {
    setTags(tagTypes.map((tagType) => ({
      ...tagType,
      selections: tagType.options.filter((option) => filterData.some((tag) => tag.type === tagType.label && tag.tag === option[1])),
    })));
    setUnsaved(false);
  };

  return (
    <Grid2 container spacing={3} sx={{ backgroundColor: theme.palette.background.paper }}>
      <Grid2 size={1}>
      </Grid2>
      {tags.map((tagData) => (
          <Grid2 size={2}>
            <FilterDropdown {...tagData} onChange={(selections) => handleChange(tagData, selections)} />
          </Grid2>
      ))}
      <Grid2 size={1} marginY="auto">
        <Button variant="contained" endIcon={<SaveIcon />} disabled={!unsaved} onClick={handleSave}>
          Save
        </Button>
      </Grid2>
      <Grid2 size={1} marginY="auto">
        <Button variant="contained" endIcon={<CancelIcon />} disabled={!unsaved} onClick={handleCancel}>
          Cancel
        </Button>
      </Grid2>
    </Grid2>
  );
};


const hasPositionedParent = (el: Element) => {
	if (el.tagName === "BODY") {
    return false;
  }
	if (getComputedStyle(el.parentElement).position !== "static") {
		return true;
	}
	return hasPositionedParent(el.parentElement);
};

const skipPositionedChild = (el: HTMLElement) => {
	if (el.offsetParent && el.offsetParent.tagName !== "BODY") {
    return true;
  }
	if (hasPositionedParent(el)) {
    return true;
  }
	return false;
};

const height = "45px";

// Initialize storage manager
const storageManager = new StorageManager();
let options: Options;

// Check if Firefox or Chrome and assign the right storage object
const browserStorageSync = ((typeof browser !== 'undefined') && browser.storage.sync) ||
                         ((typeof chrome !== 'undefined') && (chrome.storage as any).promise.sync);

browserStorageSync.get('options')
  .then((result: any) => {
    options = result?.options as Options;
    const useLocalStorage = options && !!options.useLocalStorage;
    storageManager.storageType = useLocalStorage ? LOCAL_STORAGE : SYNC_STORAGE;
    return storageManager.fetchTags();
  })
  .then((filterData: {[key: string]: FilterData[]}) => {
    const pageElements = document.body.getElementsByTagName("*") as HTMLCollectionOf<HTMLElement>;
    for (const pageElement of pageElements) {
      const styles = getComputedStyle(pageElement);

      if ((styles.position === "absolute" || styles.position === "fixed") && styles.top !== "auto") {
        if ((styles.position === "absolute" && !skipPositionedChild(pageElement)) || (styles.position === "fixed" && styles.top !== height)) {
          // if (styles.top !== "0px") {
          //   pageElement.setAttribute("data-original-top", styles.top);
          //   pageElement.style.top = parseInt(styles.top, 10) + parseInt(height, 10) + "px";
          // }
          if (styles.marginTop !== "") {
            pageElement.setAttribute("data-original-mt", styles.marginTop);
            pageElement.style.marginTop = parseInt(styles.marginTop, 10) + parseInt(height, 10) + "px";
          } else if (styles.marginBottom !== "") {
            pageElement.setAttribute("data-original-mb", styles.marginBottom);
            pageElement.style.marginBottom = parseInt(styles.marginBottom, 10) + parseInt(height, 10) + "px";
          }
          if (styles.height !== "0px" && styles.top === "0px" && styles.bottom === "0px") {
            pageElement.setAttribute("data-original-height", styles.height);
            pageElement.style.height = "calc( " + styles.height + " - " + height + ")";
          }
        }
      }
    }

    const topbarContainer = document.createElement("topbar-container");
    topbarContainer.role = "toolbar";
    topbarContainer.style.position = "fixed";
    topbarContainer.style.border = "none";
    topbarContainer.style.height = height;
    topbarContainer.style.top = "0px";
    topbarContainer.style.left = "0px";
    topbarContainer.style.zIndex = "2147483647";
    topbarContainer.style.width = "100%";
    topbarContainer.style.boxSizing = "border-box";
    topbarContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";

    document.documentElement.appendChild(topbarContainer);
    topbarContainer.attachShadow({ mode: "open" });

    const topbarSpacer = document.createElement("div");
    topbarSpacer.style.height = height;
    topbarSpacer.style.width = "100%";
    topbarSpacer.style.display = "block";
    document.body.prepend(topbarSpacer);

    const topbar = document.createElement("div");
    topbarContainer.shadowRoot.appendChild(topbar);

    const cache = createCache({
      key: "topbar-css",
      prepend: true,
      container: topbarContainer.shadowRoot,
    })
    const theme = createTheme({
      cssVariables: {
        rootSelector: ":host",
        colorSchemeSelector: "class",
      },
      components: {
        MuiPopover: {
          defaultProps: {
            container: topbar,
          },
        },
        MuiPopper: {
          defaultProps: {
            container: topbar,
          },
        },
        MuiModal: {
          defaultProps: {
            container: topbar,
          },
        },
      },
      palette: {
        mode: getPageColorMode(),
      },
    });

    const url = window.location.href;

    ReactDOM.render(
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <TagBar
            filterData={url in filterData ? filterData[url] : []}
            onSave={(tags) => storageManager.saveTags({ ...filterData, [url]: tags })}
            />
        </ThemeProvider>
      </CacheProvider>,
      topbar
    );
  });