import * as React from 'react';
import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Box, Link, Button } from "@mui/material";
// import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import ListIcon from '@mui/icons-material/List';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Search from './Search';
export default function Menus({ childToParentmap }) {
    const [showMenu, setShowMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [data, setData] = useState('');

    const parentToChild = () => {
        setData("This is data from Parent Component to the Child Component.");
    }
    const childToParent = ({ selectedProvince, selectedDistrict, selectedTumbol }) => {
        // console.log({selectedProvince,selectedDistrict,selectedTumbol});
        // setShowSearch(!showSearch);
        if (selectedTumbol != '') {
            setShowSearch(!showSearch);
        }
        childToParentmap({ selectedProvince, selectedDistrict, selectedTumbol })
    }
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
    const showMenus = () => {
        setShowMenu(!showMenu);
    };
    const showSearchs = () => {
        setShowSearch(!showSearch);
    };
    const menuStyle = {
        display: showMenu ? 'block' : 'none',
    };
    const SearchStyle = {
        display: showSearch ? 'block' : 'none',
    };
    const onDownload = () => {
        const link = document.createElement("a");
        link.download = `template.zip`;
        link.href = "./template.zip";
        link.click();
    };
    return (
        <ThemeProvider theme={theme}>
            <Grid sx={{ position: 'absolute', top: 15, right: 15, textAlign: 'right' }}>
                <Button id="downloadTemplate"
                    sx={{ backgroundColor: 'white', minWidth: "30px !important", ":hover": { backgroundColor: "#e0e0e0" }, mb: 1 }}
                    onClick={onDownload}
                >
                    <CloudDownloadOutlinedIcon />
                    <Typography sx={{ pl: 1 }}>
                        Download Template
                    </Typography>
                </Button>
            </Grid>
        </ThemeProvider>
    )
}