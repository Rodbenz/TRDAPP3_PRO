import * as React from 'react';
import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Box, Link, Button } from "@mui/material";
import Header from './components/home/Header';
import Map from './components/myMap/Map';
export default function FirtProcess() {
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
    window.sessionStorage.removeItem("userid");
    window.sessionStorage.removeItem("name");
    window.sessionStorage.removeItem("lastname");
    window.sessionStorage.removeItem("org");
    window.location.href='/Main'
    return (
        <ThemeProvider theme={theme}>
            
        </ThemeProvider>
    )
}