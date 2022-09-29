import React from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
class Login extends React.Component {
    render() {
        return (
            
            <form onSubmit={this.handleSubmit}>
                <Container maxWidth="xs">
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                </Container>
            </form>
            
        );
    }
}

export { Login};