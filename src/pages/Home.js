import * as React from 'react';
import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Box, Link, Button } from "@mui/material";
import Header from './components/home/Header';
import Map from './components/myMap/Map';
export default function HomePage() {    
    if(window.sessionStorage.getItem("userid") === null){
        window.location.href = '/Main';
    }
    // console.log(window.sessionStorage.getItem("userid"));
    // window.sessionStorage.setItem("userid", "1605");
    const theme = createTheme({
        typography: {
            fontFamily: [
                'Kanit',
                'Roboto',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
    });
    const [mapresponsive, setMapresponsive] = useState(12);
    const [openmapresponsive, setopenMapresponsive] = useState(true);
    const importStyle = {
        display: (openmapresponsive) ? 'none' : 'block'
    }
    return (
        <ThemeProvider theme={theme}>
            <Grid container>
                <Grid item md={12} sx={{ dispaly: 'flex', zIndex: 1 }}>
                    <Header sx={{ zIndex: 1 }} />
                </Grid>
                <Grid item md={6} sx={{ zIndex: 0 }} style={importStyle}>
                    asdas
                </Grid>
                <Grid item md={mapresponsive} sx={{ zIndex: 0 }}>
                    {/* <MapWrapper features height={'calc(100vh - 60px)'} /> */}
                    <Map />
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}