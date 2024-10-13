import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import SvgIcon from "@mui/material/SvgIcon";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Input } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  MenuListProps: {
    dense: true,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
  },
  // PaperProps: {
  //   style: {
  //     maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
  //     width: 250,
  //   },
  // },
};

interface FilterDropdownProps {
  label: string;
  colourScheme?: 'light' | 'dark';
  options: [typeof SvgIcon, string][];
}

export default function MultipleSelectCheckmarks({ label, colourScheme, options }: FilterDropdownProps) {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const labelId = label.replace(' ', '-');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: colourScheme ?? 'light',
        },
      }),
    [colourScheme],
  );

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <FormControl sx={{ ml: 1, mr: 1, width: 100 }} size="small" variant="standard">
        <InputLabel sx={{ fontSize: 14 }} id={labelId} size="small">{label}</InputLabel>
        <Select
          sx={{ fontSize: 14 }}
          labelId={labelId}
          multiple
          value={personName}
          onChange={handleChange}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
          size="small"
        >
          {options.map(([OptionIcon, opt]) => (
            <MenuItem key={opt} value={opt} dense sx={{ padding: "0px 16px 0px 0px"}}>
              {/* <Switch checked={personName.indexOf(opt) > -1} size="small" /> */}
              <Checkbox checked={personName.indexOf(opt) > -1} size="small" />
              <ListItemIcon>
                <OptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={opt} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  );
}