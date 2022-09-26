import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from './layout';

const theme = createTheme({
  
  palette: {
    background: {
      default: "#222222"
    },
    primary: {
      main: purple[500],
    },
    secondary: {
      main: '#f44336',
    },
  },
});

const Item = styled(Paper)(({ theme }) => ({
  //backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.secondary.main,
}));

export default function BasicGrid() {
  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
    <Box sx={{ flexGrow: 1 }}>
      <Dashboard></Dashboard>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Item></Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>md=4</Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>md=4</Item>
        </Grid>
        <Grid item xs={12} md={8}>
          <Item>md=8</Item>
        </Grid>
      </Grid>
    </Box>
    </ThemeProvider>
  );
}
