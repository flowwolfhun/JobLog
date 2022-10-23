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
import {Registration} from './Registration'
import { Localize}  from '../localize/Localization';

const drawerWidth = 240;
class Layout extends React.Component {

  constructor(props){
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleRegistrationClick = this.handleRegistrationClick.bind(this);
    this.handler = this.handler.bind(this);
    this.state = {isLoggedIn: false, menu:'layout'};
  }

  handleLoginClick() {
    this.setState({menu: 'login'});
  }
  handleLogoutClick(){
    this.setState({isLoggedIn: false, menu:'logout'})
  }

  handler(loggedIn){
    this.setState({isLoggedIn: loggedIn, menu:'layout'})
  }
  handleRegistrationClick(){
    this.setState({ menu:'registration'})

  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    const menu = this.state.menu;
    let content ;
    let loginButton;
    let registration;
    let timeRecordMenu;
    let projectMenu;
    let companyMenu;
    if(!isLoggedIn){       
       loginButton = <Button color="inherit" onClick={this.handleLoginClick}>{Localize.menu.login}</Button>
       registration = <Button color="inherit" onClick={this.handleRegistrationClick}>{Localize.menu.registration}</Button>
    }
    else{
       loginButton = <Button color="inherit" onClick={this.handleLogoutClick}>{Localize.menu.logout}</Button>
       timeRecordMenu = <Button color="inherit" onClick={()=>this.setState({menu:'timeRecordMenu'})}>TimeRecord</Button>
       projectMenu = <Button color="inherit" onClick={()=>this.setState({menu:'projectMenu'})}>Project</Button>
       companyMenu = <Button color="inherit" onClick={()=>this.setState({menu:'companyMenu'})}>Company</Button>
    }
    switch (menu){
      case 'layout':
        content = <div>Layout</div>
        break;
      case 'login':
        content = <Login handler={this.handler} ></Login>;
        break;
      case 'logout':
        content = <div>logged out</div>
        break;
      case 'registration':
        content = <Registration handler={this.handler}></Registration>
        break;
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
          {Localize.menu.news}
          </Typography>
          {timeRecordMenu}
          {projectMenu}
          {companyMenu}
          {registration}
          {loginButton}
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