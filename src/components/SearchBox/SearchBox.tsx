import * as React from 'react';
import withStyles from '@mui/styles/withStyles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';

interface Props {
  toggle: () => void;
  onChangeSearchTextField: (e: any) => void;
  classes: any;
  open: boolean;
  value: string;
}

const styles = (theme: any) => ({
  searchField: {
    marginBottom: 0,
    marginTop: 0,
  }
});

const SearchBox = (props: Props) => {
  const classes = props.classes;
  const handleSubmit = (event: any) => {
    event.preventDefault();
    props.toggle();
  };
  return (
    <SwipeableDrawer
      anchor="top"
      open={props.open}
      onClose={() => props.toggle()}
      onOpen={() => props.toggle()}
    >
      <form onSubmit={handleSubmit}>
        <FormControl variant="standard" fullWidth>
          <TextField
            autoFocus
            id="standard-search"
            label="Search"
            type="search"
            className={classes.searchField}
            margin="normal"
            variant="filled"
            value={props.value}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    style={{marginRight: -8}}
                    aria-label="Search"
                    onClick={() => props.toggle()}
                    size="large">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={props.onChangeSearchTextField}
          />
        </FormControl>
      </form>
    </SwipeableDrawer>
  );
};

export default withStyles(styles)(SearchBox);
