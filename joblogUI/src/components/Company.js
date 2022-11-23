import React from 'react';
import { Button , TextField, Container, Box} from '@mui/material';
import { CommonUtil } from '../util/CommonUtil';
import { Localize}  from '../localize/Localization';
class Company extends React.Component {
    handler=null;
    constructor(props){        
        super(props);
        this.state = {companyName: this.props.companyName, id: this.props.id};
        this.handler = this.props.handler;
        this.SaveClick = this.SaveClick.bind(this);
    }

    
    handleChange = (event) => {
        this.setState({companyName: event.target.value});
      };
      

    render() {
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
          <TextField id="companyName" label={Localize.company.name} variant="outlined" value={this.state.companyName} onChange={this.handleChange}  />     
          <Button variant="outlined" onClick={this.saveClick}>{Localize.save}</Button>
          </Box>
          </Container>
            
        );
    }

    
    async SaveClick(){
      if(this.Validate()){
       
        CommonUtil.postData('http://localhost:3001/api/company/save', { 'companyname': this.state.companyName, 'id': this.state.id})
        .then((data) => {
          if(data)
          {
            this.handler(true);
          }
          else{

          }
        });
      }
    }

    async validate(){
      let saveError = [];
      if(this.state.companyName == null || this.state.companyName.lenght<1){
        saveError.push(Localize.company.nameRequired);
      }
    }


}

export { Company};