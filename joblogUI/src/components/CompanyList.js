import React from 'react';
import { Button , TextField, Container, Box} from '@mui/material';
import { CommonUtil } from '../util/CommonUtil';
import { Localize}  from '../localize/Localization';
import Grid from '@mui/material/Grid';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
}));

class CompanyList extends React.Component {
    
    constructor(props){        
        super(props);
        this.state = {
          list: []
        }
    }

    componentDidMount(){
      CommonUtil.postData('http://localhost:3001/api/company/list')  .then((data) => {
          this.setState({list: data});
    }
      )
    }

    render() {
      const numbers = [1, 2, 3, 4, 5];
      const listItems = this.state.list.map((listItem) =>
      <Grid key={listItem.ID.toString()} container spacing={1} className="grid">
                            <Grid item xs={8}>
                              <Item  className="item">
                                 {listItem.Name}
                              </Item>
                            </Grid>
                            <Grid item xs={4}>
                              <Item  className="item">
                                <Button variant="outlined" onClick={()=>this.Open(listItem.ID)}>{Localize.edit} </Button>
                              </Item>
                            </Grid>
                          </Grid>
      );

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
                      {listItems}
                  </Box>
                </Container>
            
        );
    }
    async Open(id){
      console.log(id)

    }
}

export { CompanyList};