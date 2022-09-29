import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import CssBaseline from "@mui/material/CssBaseline";
import {Layout} from './components/Layout';

const theme = createTheme({
  
  palette: {
    background: {
      default: "#aaa"
    },
    primary: {
      main: red[500],
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
      
        <Layout></Layout>
      
    </ThemeProvider>
  );
}
