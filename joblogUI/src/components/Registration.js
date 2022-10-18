import React from 'react';
import { Button , TextField, Container, Box} from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { CommonUtil } from '../util/CommonUtil';
class Registration extends React.Component {
    handler=null;
    constructor(props){        
        super(props);
        this.state = {email: '', password:'', password2:'', aszf:false, gdpr: false, registrationError:[]};
        this.handler = this.props.handler;
        //this.handleChange = this.handleChange.bind(this);
        this.registrationClick = this.registrationClick.bind(this);
    }

    
    handleChange = (event) => {
        this.setState({email: event.target.value});
      };
      
      handleChangePassword = (event) => {
        this.setState({password: event.target.value});
      };

      handleChangePassword2 = (event) => {
        this.setState({password2: event.target.value});
      };
    render() {
      var regErr ;
      var registrationError = this.state.registrationError;
      if(registrationError){
        const lis = registrationError.map((n)=>
          <li>
            {n}
          </li>

        );
        regErr = <ul>{lis}</ul>
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
                <TextField id="login_password2" label="password" variant="outlined" type="password" value={this.state.password2} onChange={this.handleChangePassword2} />
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={this.state.aszf} onChange={()=>{this.setState({aszf:!this.state.aszf})}} />} label="ASZF" />
                  <FormControlLabel control={<Checkbox checked={this.state.gdpr} onChange={()=>{this.setState({gdpr:!this.state.gdpr})}}/>} label="GDPR" />
                </FormGroup>
                {regErr}
                <Button variant="outlined" onClick={this.registrationClick}>Registration</Button>
                </Box>
                </Container>
            
        );
    }

    
    async registrationClick(){
      let regerrors = [];
      if(!this.state.aszf){
        regerrors.push('ASZF -et el kell fogadni');
      }
      if(!this.state.gdpr){
        regerrors.push('GDPR -et el kell fogadni');
      }
      if(this.state.password != this.state.password2){
        regerrors.push('Két jelszó nem egyezik');
      }
      if(this.state.password.length<6){
        regerrors.push('A jelszó legalább 6 hosszú kell, hogy legyen');
      }
      if(regerrors){
        this.setState({registrationError:regerrors});
      }
      else{
        CommonUtil.postData('http://localhost:3001/api/auth/registration', { 'email': this.state.email, 'password': this.state.password })
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

}

export { Registration};