import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import SvgIcon from "@mui/material/SvgIcon";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';

const MenuProps = {
  MenuListProps: {
    dense: true,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
  },
};

interface FilterDropdownProps {
  label: string;
  colourScheme?: 'light' | 'dark';
  options: [typeof SvgIcon, string][];
}

export default function MultipleSelectCheckmarks({ label, colourScheme, options }: FilterDropdownProps) {
  const labelId = label.replace(' ', '-');
  const [selections, setSelections] = React.useState<string[]>([]);
  const optionsMap = React.useMemo(() => Object.fromEntries(options.map(x => [x[1], x[0]])), [options]);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: colourScheme ?? 'light',
        },
      }),
    [colourScheme],
  );

  const handleChange = (event: SelectChangeEvent<typeof selections>) => {
    const {
      target: { value },
    } = event;
    setSelections(
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
          value={selections}
          onChange={handleChange}
          renderValue={
            (selected) => 
            <AvatarGroup max={5} variant="circular" slotProps={{additionalAvatar: { sx: { width: 16, height: 16, fontSize: 16, backgroundColor: "rgb(251, 247, 241)" } }}}>
              {selected.map((value) => {
                const OptionIcon = optionsMap[value];
                return (<Avatar alt={value} variant="circular" sx={{ width: 16, height: 16, backgroundColor: "rgb(251, 247, 241)" }}>
                  {OptionIcon && <OptionIcon sx={{ fontSize: 16 }} />}
                </Avatar>);
              })}        
            </AvatarGroup>
          }
          MenuProps={MenuProps}
          size="small"
        >
          {options.map(([OptionIcon, opt]) => (
            <MenuItem key={opt} value={opt} dense sx={{ padding: "0px 16px 0px 0px"}}>
              <Checkbox checked={selections.indexOf(opt) > -1} size="small" />
              {OptionIcon && <ListItemIcon>
                <OptionIcon fontSize="small" />
              </ListItemIcon>}
              <ListItemText primary={opt} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ThemeProvider>
  );
}