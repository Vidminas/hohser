import * as React from "react";
import * as ReactDOM from "react-dom";
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
    <Stack direction="row" sx={{ backgroundColor: "firebrick" }}>
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

const topbar = document.createElement("div");
document.body.prepend(topbar);
ReactDOM.render(<TagBar />, topbar);

// Initialize storage manager
const storageManager = new StorageManager();
let options: Options;

// Check if Firefox or Chrome and assign the right storage object
const browserStorageSync = ((typeof browser !== 'undefined') && browser.storage.sync) ||
                         ((typeof chrome !== 'undefined') && (chrome.storage as any).promise.sync);