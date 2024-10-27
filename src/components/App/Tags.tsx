import * as React from 'react';
import { withStyles } from 'tss-react/mui';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import HelpIcon from '@mui/icons-material/Help';
import EditIcon from '@mui/icons-material/EditNote';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import SvgIcon from "@mui/material/SvgIcon";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
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

import { FilterData } from "../../types";

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  searchButton: {
    marginRight: -12,
  },
  appBar: {
    bottom: 'auto',
    top: 0,
  },
};

interface Props {
  classes?: Partial<Record<keyof typeof styles, string>>;
  currentTabUrl: string | null;
}

const subjects = [
  "Expressive Arts",
  "Social studies",
  "Sciences",
  "Health and wellbeing",
  "Languages",
  "Religious and moral education",
  "Numeracy and mathematics",
  "Technologies",
]

const levels = [
  "BGE Early (ELC and P1)",
  "BGE First (P2-P4)",
  "BGE Second (P5-P7)",
  "BGE Third (S1-S3)",
  "National 3 (S3)",
  "National 4 (S4)",
  "National 5 (S4)",
  "Higher (S5-S6)",
  "Advanced Higher (S5-S6)",
];

export function ChipsArray({ initData, highlightTags }: { initData: FilterData[] | null, highlightTags: string[] }) {
  if (!initData) {
    return null;
  }

  const [chipData, setChipData] = React.useState<readonly FilterData[]>(initData);

  const handleDelete = (chipToDelete: FilterData) => () => {
    setChipData((chips) => chips.filter((chip) => chip.type !== chipToDelete.type));
  };

  return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {chipData.map((data) => (
                <Chip key={data.type} label={data.tag} sx={highlightTags.find(h => h === data.tag) && { backgroundColor: "green" }} />
              ))}
            </Box>
    // <Paper
    //   sx={{
    //     display: 'flex',
    //     justifyContent: 'center',
    //     flexWrap: 'wrap',
    //     listStyle: 'none',
    //     p: 0.5,
    //     m: 0,
    //   }}
    //   component="ul"
    // >
    //   {chipData.map((data) => {
    //     let icon;
    //     return (
    //       <ListItem key={data.key}>
    //         <Chip
    //           icon={icon}
    //           label={data.label}
    //           onDelete={data.label === 'React' ? undefined : handleDelete(data)}
    //         />
    //       </ListItem>
    //     );
    //   })}
    // </Paper>
  );
}

interface TagType {
  label: string;
  options: [typeof SvgIcon, string][];
}

export const ChipsDropdown = ({label, options}: TagType) => {
  return <Autocomplete
                  sx={{ fontSize: 14, ml: 1, mr: 1, width: 300 }}
                  size="small"
                  id={label}
                  multiple
                  limitTags={2}
                  disableClearable
                  disableCloseOnSelect
                  options={options}
                  // value={selections}
                  // onChange={(event, newValue) => {
                  //   setSelections(newValue);
                  // }}
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



const Tags = (props: Props) => {
  const classes = withStyles.getClasses(props);

  const [tagTypes, setTagTypes] = React.useState<readonly TagType[]>([
    { label: "Media type(s)", options: [
      [Image, "Images"],
      [VideoLibrary, "Videos"],
      [PictureAsPdf, "Documents"],
      [Web, "Websites"],
    ]
   },
    { label: "Subject(s)", options: [
      [Palette, "Expressive Arts"],
      [Diversity3, "Social studies"],
      [Science, "Sciences"],
      [Spa, "Health and wellbeing"],
      [Translate, "Languages"],
      [Synagogue, "Religious and moral education"],
      [Calculate, "Numeracy and mathematics"],
      [Handyman, "Technologies"],
    ] },
    { label: "Level(s)", options: [
      [null, "BGE Early (ELC and P1)"],
      [null, "BGE First (P2-P4)"],
      [null, "BGE Second (P5-P7)"],
      [null, "BGE Third (S1-S3)"],
      [null, "National 3 (S3)"],
      [null, "National 4 (S4)"],
      [null, "National 5 (S4)"],
      [null, "Higher (S5-S6)"],
      [null, "Advanced Higher (S5-S6)"],
    ] },
    { label: "Cost", options: [
      [MoneyOff, "Free"],
      [Payments, "Subscription"],
      [Paid, "Paid"],
    ] },
  ]);

  return (
    <>
      <List dense style={{ position: "relative", top: 54, overflowX: "hidden", width: "100%" }}>
        <Toolbar >
          <Typography variant="h6" color="inherit" className={classes.grow} >
            {props.currentTabUrl ? props.currentTabUrl : window.location.href}
          </Typography>
        </Toolbar>
        {tagTypes.map((tagType) => (
          <ListItem
            key={tagType.label}
            // secondaryAction={
            //   <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(tagType)}>
            //     <EditIcon />
            //   </IconButton>
            // }
          >
            <ListItemText
              primary={tagType.label}
              secondary={<ChipsDropdown {...tagType} />}
            />
          </ListItem>)
        )}
      </List>
    </>
  );
};

export default withStyles(Tags, styles);
