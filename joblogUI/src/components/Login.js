import React from 'react';
import { Button , TextField, Container, Box} from '@mui/material';
class Login extends React.Component {

    constructor(props){        
        super(props);
        this.state = {email: '', password:''};

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
        return (
            
                <Container maxWidth="xs">
                     <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
                <TextField id="login_email" label="Email" variant="outlined" value={this.state.email} onChange={this.handleChange}  />
                
                
                 <TextField id="login_password" label="password" variant="outlined" type="password" value={this.state.password} onChange={this.handleChangePassword} />
               
                <Button variant="outlined" onClick={this.loginClick}>Belépés</Button>
                </Box>
                </Container>
            
        );
    }

    
    async loginClick(){
        this.postData('http://localhost:3001/api/auth/login', { 'email': this.state.email, 'password': this.state.password })
  .then((data) => {
    console.log(data); // JSON data parsed by `data.json()` call
  });
    }

    async postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }
}

export { Login};