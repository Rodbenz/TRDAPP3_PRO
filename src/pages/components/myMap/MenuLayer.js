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
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
export default function Menus({ childToParentmap }) {
    const [zone, setZone] = useState('47')
    const [REL, setREL] = useState(false)
    const [ROAD, setROAD] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [data, setData] = useState('');

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
    const RELClick = () => {
        setREL(!REL)
    }
    const ROADClick = () => {
        setROAD(!ROAD)
    }
    return (
        <ThemeProvider theme={theme}>
            <Grid sx={{ position: 'absolute', bottom: 15, left: 80, textAlign: 'right', display: 'flex' }}>
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
                    <img src={'/layers.png'} width={25} height={25} alt='' />
                </Button>


            </Grid>
            <Grid id="subMenu" item style={menuStyle}>
                <Grid id="subMenu" item style={menuStyle} sx={{ width: '200px', backgroundColor: 'white', position: 'absolute', bottom: 80, left: 85, display: 'flex', p: 1, borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)" }}>
                    <Typography sx={{ pl: 1, textAlign: 'center' }}>
                        -แสดง/ซ่อนชั้นข้อมูล-
                    </Typography>
                    <Typography sx={{ pl: 1 ,':hover':{backgroundColor:'rgba(0, 217, 122, 0.29)'},cursor:'pointer'}} onClick={RELClick}>
                        {REL ? <VisibilityOffIcon fontSize='10px' sx={{ color: '#b2102f' }} /> : <VisibilityIcon fontSize='10px' sx={{ color: '#4caf50' }} />} REL_{zone}
                    </Typography>
                    <Typography sx={{ pl: 1 ,':hover':{backgroundColor:'rgba(0, 217, 122, 0.29)'},cursor:'pointer'}} onClick={ROADClick}>
                        {ROAD ? <VisibilityOffIcon fontSize='10px' sx={{ color: '#b2102f' }} /> : <VisibilityIcon fontSize='10px' sx={{ color: '#4caf50' }} />} ROAD_{zone}
                    </Typography>
                    {/* <Button id="search" sx={{ backgroundColor: '#034EB1', color: 'white', minWidth: "30px !important", ":hover": { border: '4px solid #000a82', backgroundColor: "#034EB1", p: 0.5 }, p: 1, mx: 1 }} onClick={showSearchs}>
                        <img src={'/drawrel.png'} width={25} height={25} alt='' />
                    </Button>
                    <Button id="import" sx={{ backgroundColor: '#034EB1', color: 'white', minWidth: "30px !important", ":hover": { border: '4px solid #000a82', backgroundColor: "#034EB1", p: 0.5 }, p: 1, mx: 1 }}>
                        <img src={'/listmenu.png'} width={25} height={25} alt='' />
                    </Button>
                    <Button id="report" sx={{ backgroundColor: '#034EB1', color: 'white', minWidth: "30px !important", ":hover": { border: '4px solid #000a82', backgroundColor: "#034EB1", p: 0.5 }, p: 1, mx: 1 }}>
                        <img src={'/listmenu.png'} width={25} height={25} alt='' />
                    </Button>
                    <Button id="closeSubMenu" sx={{ color: '#034EB1', minWidth: "30px !important", ":hover": { color: "#397C54" }, mx: 1 }} onClick={showMenus}>
                        <HighlightOffOutlinedIcon />
                    </Button> */}
                </Grid>
                {/* <Button id="search" sx={{ backgroundColor: '#034EB1', color: 'white', minWidth: "30px !important", ":hover": { border: '4px solid #000a82', backgroundColor: "#034EB1", p: 0.5 }, p: 1, mx: 1 }} onClick={showSearchs}>
                        <img src={'/drawrel.png'} width={25} height={25} alt='' />
                    </Button>
                    <Button id="import" sx={{ backgroundColor: '#034EB1', color: 'white', minWidth: "30px !important", ":hover": { border: '4px solid #000a82', backgroundColor: "#034EB1", p: 0.5 }, p: 1, mx: 1 }}>
                        <img src={'/listmenu.png'} width={25} height={25} alt='' />
                    </Button>
                    <Button id="report" sx={{ backgroundColor: '#034EB1', color: 'white', minWidth: "30px !important", ":hover": { border: '4px solid #000a82', backgroundColor: "#034EB1", p: 0.5 }, p: 1, mx: 1 }}>
                        <img src={'/listmenu.png'} width={25} height={25} alt='' />
                    </Button>
                    <Button id="closeSubMenu" sx={{ color: '#034EB1', minWidth: "30px !important", ":hover": { color: "#397C54" }, mx: 1 }} onClick={showMenus}>
                        <HighlightOffOutlinedIcon />
                    </Button> */}
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