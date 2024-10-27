import * as React from "react";
import * as ReactDOM from "react-dom";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Image from "@mui/icons-material/Image";
import VideoLibrary from "@mui/icons-material/VideoLibrary";
import PictureAsPdf from "@mui/icons-material/PictureAsPdf";
import Web from "@mui/icons-material/Web";
import Palette from "@mui/icons-material/Palette";
import Diversity3 from "@mui/icons-material/Diversity3";
import Science from "@mui/icons-material/Science";
import Spa from "@mui/icons-material/Spa";
import Translate from "@mui/icons-material/Translate";
import Synagogue from "@mui/icons-material/Synagogue";
import Calculate from "@mui/icons-material/Calculate";
import Handyman from "@mui/icons-material/Handyman";
import MoneyOff from "@mui/icons-material/MoneyOff";
import Paid from "@mui/icons-material/Paid";
import Payments from "@mui/icons-material/Payments";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Button, IconButton, ListItemButton, Stack, Typography } from "@mui/material";

import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from "@mui/material/SvgIcon";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import StorageManager from "./content/storageManager";
import { Options } from './types';
import { LOCAL_STORAGE, SYNC_STORAGE } from "./constants";
import { getPageColorMode } from "./content/common";


interface TagType {
  label: string;
  options: [typeof SvgIcon, string][];
}

const ChipsDropdown = ({label, options}: TagType) => {
  const [selections, setSelections] = React.useState<typeof options>([]);

  const handleChange = (
    event: React.SyntheticEvent,
    value,
    reason,
    details?,
  ): void => {
    setSelections(value);
  };

  return <Autocomplete
                  sx={{ fontSize: 14, ml: 1, mr: 1, width: 300 }}
                  size="small"
                  id={label}
                  multiple
                  limitTags={2}
                  disableClearable
                  disableCloseOnSelect
                  options={options}
                  value={selections}
                  onChange={handleChange}
                  renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => {
                    const { key, ...tagProps } = getTagProps({ index });
                    return <Chip key={key} label={option[1]} size="small" {...tagProps} />;
                    })
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined"  />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    const [OptionIcon, optLabel] = option;
                    return (
                      <MenuItem key={key} {...optionProps} dense sx={{ padding: "0px 16px 0px 0px"}}>
                        {OptionIcon && <ListItemIcon>
                          <OptionIcon fontSize="small" />
                        </ListItemIcon>}
                        <ListItemText primary={optLabel} />
                      </MenuItem>
                    );
                  }
                }
                />
};

const tagTypes: TagType[] = [
  {
    label: "Media type(s)",
    options: [
      [Image, "Images"],
      [VideoLibrary, "Videos"],
      [PictureAsPdf, "Documents"],
      [Web, "Websites"],
    ],
  },
  {
    label: "Subject(s)",
    options: [
      [Palette, "Expressive Arts"],
      [Diversity3, "Social studies"],
      [Science, "Sciences"],
      [Spa, "Health and wellbeing"],
      [Translate, "Languages"],
      [Synagogue, "Religious and moral education"],
      [Calculate, "Numeracy and mathematics"],
      [Handyman, "Technologies"],
    ],
  },
  {
    label: "Level(s)",
    options: [
      [null, "BGE Early (ELC and P1)"],
      [null, "BGE First (P2-P4)"],
      [null, "BGE Second (P5-P7)"],
      [null, "BGE Third (S1-S3)"],
      [null, "National 3 (S3)"],
      [null, "National 4 (S4)"],
      [null, "National 5 (S4)"],
      [null, "Higher (S5-S6)"],
      [null, "Advanced Higher (S5-S6)"],
    ],
  },
  {
    label: "Cost",
    options: [
      [MoneyOff, "Free"],
      [Payments, "Subscription"],
      [Paid, "Paid"],
    ],
  },
];

const TagBar = () => {
  return (
    <>
    <Stack direction="row" sx={{ backgroundColor: theme.palette.background.paper }}>
      {tagTypes.map((tagType) => (
        <span key={tagType.label}>
          <Typography variant="h6">{tagType.label}</Typography>
          <Paper>
            <ChipsDropdown {...tagType} />
          </Paper>
        </span>
      ))}
    </Stack>
    <Box sx={{ textAlign: "right" }}>
      <Button variant="contained" endIcon={<SaveIcon />}>
        Save
      </Button>
      <Button variant="contained" endIcon={<CancelIcon />}>
        Cancel
      </Button>
    </Box>
    </>
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

const height = "72px";

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

ReactDOM.render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      <TagBar />
    </ThemeProvider>
  </CacheProvider>,
  topbar
);


// // Initialize storage manager
// const storageManager = new StorageManager();
// let options: Options;

// // Check if Firefox or Chrome and assign the right storage object
// const browserStorageSync = ((typeof browser !== 'undefined') && browser.storage.sync) ||
//                          ((typeof chrome !== 'undefined') && (chrome.storage as any).promise.sync);

// browserStorageSync.get('options')
//   .then((o: any) => {
//     options = o && o.options as Options;
//     const useLocalStorage = options && !!options.useLocalStorage;
//     storageManager.storageType = useLocalStorage ? LOCAL_STORAGE : SYNC_STORAGE;
//     return storageManager.fetchTags(location.host);
//   })
//   .then((d: Domain[]) => {
