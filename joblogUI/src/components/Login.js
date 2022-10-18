import React from 'react';
import { Button , TextField, Container, Box} from '@mui/material';
import { CommonUtil } from '../util/CommonUtil';
class Login extends React.Component {
    handler=null;
    constructor(props){        
        super(props);
        this.state = {email: '', password:'', incorrentLogin:false};
        this.handler = this.props.handler;
        //this.handleChange = this.handleChange.bind(this);
        this.loginClick = this.loginClick.bind(this);
    }

    
    handleChange = (event) => {
        this.setState({email: event.target.value});
      };
      
      handleChangePassword = (event) => {
        this.setState({password: event.target.value});
      };

    render() {
      var badlogin ;
      var incorrentLogin = this.state.incorrentLogin;
      if(incorrentLogin){
        badlogin = <div>Incorrect Email address or Password!</div>
      }
        return (
            
                <Container maxWidth="sm">
                     <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '55ch' },
      }}
      noValidate
      autoComplete="off"
    >
                <TextField id="login_email" label="Email" variant="outlined" value={this.state.email} onChange={this.handleChange}  />
                <TextField id="login_password" label="password" variant="outlined" type="password" value={this.state.password} onChange={this.handleChangePassword} />               
                {badlogin}
                <Button variant="outlined" onClick={this.loginClick}>Belépés</Button>
                </Box>
                </Container>
            
        );
    }

    
    async loginClick(){
        CommonUtil.postData('http://localhost:3001/api/auth/login', { 'email': this.state.email, 'password': this.state.password })
  .then((data) => {
    if(data)
    {
      this.handler(data);
    }
    else{
      this.setState({incorrentLogin: true})
    }
    //console.log(data); // JSON data parsed by `data.json()` call
  });
    }


}

export { Login};