import * as React from 'react';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { FILTER_OPTIONS, FILTER_TYPE } from '../../constants';

const CustomPopper = (props) => (
    <Popper
      {...props}
      placement="bottom"
      style={{ width: props.anchorEl.clientWidth, minWidth: "fit-content" }}
    />
);


interface FilterDropdownProps {
  label: FILTER_TYPE;
  options: FILTER_OPTIONS;
  selected: Set<string>;
  onChange: (value: Set<string>) => void;
}

function FilterDropdown({ label, options, selected, onChange }: FilterDropdownProps) {
  const [selections, setSelections] = React.useState<typeof options>(options.filter(x => selected.has(x[1])));

  return (
        <Autocomplete
          sx={{
            fontSize: 14,
            "& .MuiAutocomplete-inputRoot:not(.Mui-focused)": {
              flexWrap: "nowrap",
            },
          }}
          size="small"
          multiple
          value={selections}
          onChange={(_event, newValue) => {
            setSelections(newValue);
            onChange(new Set(newValue.map(x => x[1])));
          }}
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
              slotProps={{ inputLabel: { sx: { fontSize: 14 } } }}
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

export default FilterDropdown;