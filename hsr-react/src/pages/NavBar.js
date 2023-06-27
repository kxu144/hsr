import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function NavBar() {

  return (
    <AppBar position='static'>
      <Toolbar>
        <Button variant="text" color="inherit" LinkComponent={Link} to="/">Home</Button>
        <Button variant="text" color="inherit" LinkComponent={Link} to="/relic">Relics</Button>
        <Button variant="text" color="inherit" LinkComponent={Link} to="/build">Builds</Button>
      </Toolbar>
    </AppBar>
  );
}
export default NavBar;