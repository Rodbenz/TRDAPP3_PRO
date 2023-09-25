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
    const queryParameters = new URLSearchParams(window.location.search)
    queryParameters.get("a")
    window.sessionStorage.setItem("userid", queryParameters.get("userid"));
    window.sessionStorage.setItem("name", queryParameters.get("name"));
    window.sessionStorage.setItem("lastname", queryParameters.get("lastname"));
    window.sessionStorage.setItem("org", queryParameters.get("org"));
    window.location.href = '/';
    return (
        <ThemeProvider theme={theme}>
            
        </ThemeProvider>
    )
}