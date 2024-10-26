import * as React from 'react';
import { withStyles } from 'tss-react/mui';
import type { Theme } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import SvgIcon from "@mui/material/SvgIcon";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

const CustomPopper = (props) => (
    <Popper
      {...props}
      placement="bottom"
      style={{ width: props.anchorEl.clientWidth, minWidth: "fit-content" }}
    />
);


interface FilterDropdownProps {
  label: string;
  options: [typeof SvgIcon, string][];
}

function MultipleSelectCheckmarks({ label, options }: FilterDropdownProps) {
  const labelId = label.replace(' ', '-');
  const [selections, setSelections] = React.useState<string[]>([]);
  const optionsMap = React.useMemo(() => Object.fromEntries(options.map(x => [x[1], x[0]])), [options]);

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
        <Autocomplete
          sx={{ fontSize: 14 }}
          size="small"
          multiple
          limitTags={1}
          options={options}
          disableClearable
          disableCloseOnSelect
          renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return <Chip {...tagProps} key={key} label={option[1]} size="small" />;
            })
          }
          renderInput={(params) => (
            <TextField {...params} variant="standard" size="small" label={label}
              slotProps={{ inputLabel: { sx: { fontSize: 14 } } } }
             />
          )}
          renderOption={(props, option, { selected }) => {
            const { key, ...optionProps } = props;
            const [OptionIcon, optLabel] = option;
            return (
              <MenuItem key={key} {...optionProps} dense sx={{ padding: "0px 16px 0px 0px"}}>
                <Checkbox checked={selected} size="small" sx={{ padding: 0, marginRight: 1 }} />
                {OptionIcon && <ListItemIcon>
                  <OptionIcon fontSize="small" />
                </ListItemIcon>}
                <ListItemText primary={optLabel} />
              </MenuItem>
            );
          }
        }
        PopperComponent={CustomPopper}
      />
  );
}

export default MultipleSelectCheckmarks;