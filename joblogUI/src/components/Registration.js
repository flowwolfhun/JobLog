import React from 'react';
import { Button , TextField, Container, Box} from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { CommonUtil } from '../util/CommonUtil';
import { Localize}  from '../localize/Localization';
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
                <TextField id="login_email" label={Localize.email}  variant="outlined" value={this.state.email} onChange={this.handleChange}  />
                <TextField id="login_password" label={Localize.password}  variant="outlined" type="password" value={this.state.password} onChange={this.handleChangePassword} />
                <TextField id="login_password2" label={Localize.password2} variant="outlined" type="password" value={this.state.password2} onChange={this.handleChangePassword2} />
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={this.state.aszf} onChange={()=>{this.setState({aszf:!this.state.aszf})}} />} label={Localize.licence} />
                  <FormControlLabel control={<Checkbox checked={this.state.gdpr} onChange={()=>{this.setState({gdpr:!this.state.gdpr})}}/>} label={Localize.gdpr}  />
                </FormGroup>
                {regErr}
                <Button variant="outlined" onClick={this.registrationClick}>{Localize.registration}</Button>
                </Box>
                </Container>
            
        );
    }

    
    async registrationClick(){
      let regerrors = [];
      if(!this.state.aszf){
        regerrors.push(Localize.licenceNotAccapted);
      }
      if(!this.state.gdpr){
        regerrors.push(Localize.gdprNotAccepted);
      }
      if(this.state.password !== this.state.password2){
        regerrors.push(Localize.passwordNotSame);
      }
      if(this.state.password.length<6){
        regerrors.push(Localize.passwordTooShort);
      }
      if(regerrors.length>0){
        this.setState({registrationError:regerrors});
      }
      else{
        CommonUtil.postData('http://localhost:3001/api/auth/registration', { 'email': this.state.email, 'password': this.state.password })
  .then((data) => {
    if(data==='ok')
    {
      this.handler(true);
    }
    else{
      if(data==='alreadyRegistered'){
        regerrors.push(Localize.alreadyRegistered)
      }
      this.setState({registrationError:regerrors})
    }
    //console.log(data); // JSON data parsed by `data.json()` call
  });
    }
  }

}

export { Registration};