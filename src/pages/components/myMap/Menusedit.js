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
import Search from '../home/Search';
export default function Menus({ childToParentmap }) {
    const [showMenu, setShowMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [data, setData] = useState('');
    const [Province, setProvince] = useState('');
    const [District, setDistrict] = useState('');
    const [Tumbol, setTumbol] = useState('');
    const [zone, setzone] = useState('');
    // const [Province, setProvince] = useState('');

    const parentToChild = () => {
        setData("This is data from Parent Component to the Child Component.");
    }
    const childToParent = ({ selectedProvince, selectedDistrict, selectedTumbol, zone }) => {
        console.log({ selectedProvince, selectedDistrict, selectedTumbol, zone });
        // setShowSearch(!showSearch);
        if (selectedTumbol == '' && selectedProvince == '' && selectedDistrict == '') {
            setShowSearch(!showSearch);
        }
        if (selectedProvince !== '' && selectedDistrict !== '' && selectedTumbol !== '') {
            setProvince(selectedProvince);
            setDistrict(selectedDistrict);
            setTumbol(selectedTumbol);
            setzone(zone);
            setShowSearch(!showSearch);
        }
        childToParentmap({ selectedProvince, selectedDistrict, selectedTumbol, zone })
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
        link.download = `SampleFile.xlsx`;
        link.href = "./SampleFile.xlsx";
        link.click();
    };
    return (
        <ThemeProvider theme={theme}>
            <Grid sx={{ position: 'absolute', top: 15, left: 15, textAlign: 'right', display: 'flex' }}>
                {/* <Button id="downloadTemplate"
                    sx={{ backgroundColor: 'white', minWidth: "30px !important", ":hover": { backgroundColor: "#e0e0e0" }, mb: 1 }}
                    onClick={onDownload}
                >
                    <CloudDownloadOutlinedIcon />
                    <Typography sx={{ pl: 1 }}>
                        Download Template
                    </Typography>
                </Button><br /> */}
                <Button id="menu" sx={{ backgroundColor: '#034EB1', minWidth: "30px !important", ":hover": { border: '4px solid #000a82', backgroundColor: "#034EB1", p: 0.5 }, p: 1, mx: 1 }} onClick={showMenus}>
                    <img src={'/menuedit.png'} width={25} height={25} alt='' />
                </Button>
                <Grid id="subMenu" item style={menuStyle}>
                    <Button id="search" sx={{ backgroundColor: '#034EB1', color: 'white', minWidth: "30px !important", ":hover": { border: '4px solid #000a82', backgroundColor: "#034EB1", p: 0.5 }, p: 1, mx: 1 }} onClick={showSearchs}>
                        <img src={'/drawrel.png'} width={25} height={25} alt='' />
                    </Button>
                    <Button id="import" sx={{ backgroundColor: '#D9D9D9', color: 'white', minWidth: "30px !important",":hover":{backgroundColor: "#D9D9D9"},  p: 1, mx: 1 }}>
                        <img src={'/waterfloof.png'} width={25} height={25} alt='' />
                    </Button>
                    <Button id="report" sx={{ backgroundColor: '#D9D9D9', color: 'white', minWidth: "30px !important",":hover":{backgroundColor: "#D9D9D9"},  p: 1, mx: 1 }}>
                        <img src={'/electricpole.png'} width={25} height={25} alt='' />
                    </Button>
                    <Button id="closeSubMenu" sx={{ color: '#034EB1', minWidth: "30px !important", ":hover": { color: "#397C54" }, mx: 1 }} onClick={showMenus}>
                        <HighlightOffOutlinedIcon />
                    </Button>
                </Grid>

            </Grid>
            {/* <Grid container sx={{
                position: 'absolute', top: 0, bottom: 0, alignItems: 'center',
                flexDirection: 'column', height: 'calc(100vh - 66px)', display: 'flex', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)',
            }}
                style={SearchStyle}>
                <Grid item md={12} >
                    <Search childToParent={childToParent} />
                </Grid>

            </Grid> */}
        </ThemeProvider>
    )
}