import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './menuitems';
import Button from '@mui/material/Button';
import {Login} from './Login'

const drawerWidth = 240;
class Layout extends React.Component {

  constructor(props){
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: !this.state.isLoggedIn});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let content ;
    if(isLoggedIn){
       content = <Login></Login>;
    }
    else{
       content = <div>logged out</div>
    }
    return (
      <div>
        <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit" onClick={this.handleLoginClick}>Login</Button>
        </Toolbar>
      </AppBar>
      <br/>
      {content}
    </div>
    );
  }
}

// Dashboard.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export { Layout};