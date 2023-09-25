import * as React from 'react';
import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Box, Link, Button } from "@mui/material";
// import Image from 'next/image';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import ListIcon from '@mui/icons-material/List';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Search from './Search';
import LoadTemplate from './LoadTemplate';
// var CryptoJS = require("crypto-js");
export default function Menus({ childToParentmap }) {
    const menustyle = { borderBottom: '5px solid rgba(3, 78, 177, 0.8)', }
    const [showMenu, setShowMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [data, setData] = useState('');
    const [Province, setProvince] = useState('');
    const [District, setDistrict] = useState('');
    const [selType, setselType] = React.useState('');
    const [Tumbol, setTumbol] = useState('');
    const [Tumbolname, setTumbolname] = useState('');
    const [zone, setzone] = useState('');
    const [showImport, setShowImport] = useState(true)
    const [showload, setShowload] = useState(true)
    const [stylemunu1, setStylemunu1] = useState(menustyle)
    const [stylemunu2, setStylemunu2] = useState({})
    const [stylemunu3, setStylemunu3] = useState({})
    const [stylemunu4, setStylemunu4] = useState({})
    const [stylemunu5, setStylemunu5] = useState({})
    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search)
        const splitUrl = (window.location.href).split('/');
        if (splitUrl[splitUrl.length - 1].includes('Report') || splitUrl[splitUrl.length - 1].includes('Import')) {
            setShowload(false)
            setStylemunu2({display: 'none'})
        }
        if (splitUrl[splitUrl.length - 1].includes('Report')) {
            setStylemunu1({})
            setStylemunu4(menustyle)
        } else if (splitUrl[splitUrl.length - 1].includes('Import')) {
            // if (queryParameters.get("p") == '' || queryParameters.get("a") == '' || queryParameters.get("t") == '' || queryParameters.get("z") == '' || queryParameters.get("tt") == '') {
            //     alert('กรุณาค้นหาขอบเขตก่อนการนำเข้า');
            //     window.location.href = '/Report';
            // } else {
            if (queryParameters.get("search") !== null || queryParameters.get("ss") !== null) {
                
                
                setStylemunu1({})
                setStylemunu5(menustyle)
            } else {
                setStylemunu1({})
                setStylemunu3(menustyle)
            }
            if (queryParameters.get("p") !== null) {
                setProvince(queryParameters.get("p"));
                setDistrict(queryParameters.get("a"));
                setTumbol(queryParameters.get("t"));
                setzone(queryParameters.get("z"));
                setselType(queryParameters.get("tt"));
                setTumbolname(queryParameters.get("n"));
            }
            // }


        }
    })
    const parentToChild = () => {
        setData("This is data from Parent Component to the Child Component.");
    }
    const childToParent = ({ selectedProvince, selectedDistrict, selectedTumbol, zone, selType, name }) => {
        console.log({ selectedProvince, selectedDistrict, selectedTumbol, zone, selType, name });
        // setShowSearch(!showSearch);
        if (selectedTumbol == '' && selectedProvince == '' && selectedDistrict == '') {
            setShowSearch(!showSearch);
        }
        if (selectedProvince !== '' && selectedDistrict !== '' && selectedTumbol !== '') {
            setProvince(selectedProvince);
            setDistrict(selectedDistrict);
            setTumbol(selectedTumbol);
            setzone(zone);
            setselType(selType);
            setTumbolname(name);
            setShowSearch(!showSearch);
        }
        childToParentmap({ selectedProvince, selectedDistrict, selectedTumbol, zone, selType, name })
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
        // setShowMenu(!showMenu);
        window.location.href = '/'
    };
    const goImport = () => {
        // var encrypted = CryptoJS.Rabbit.encrypt('p=' + Province + '&a=' + District + '&tt=' + 2 + '&t=' + Tumbol + '&z=' + zone, "TRD3my-secrete@123");
        //U2FsdGVkX18ZUVvShFSES21qHsQEqZXMxQ9zgHy+bu0=
        // alert(encrypted)
        // var decrypted = CryptoJS.Rabbit.decrypt(encrypted, "TRD3my-secrete@123");

        // // decrypted.toString(CryptoJS.enc.Utf8)
        // console.log(decrypted.toString(CryptoJS.enc.Utf8),encrypted);
        // location.href = '/Import?' + encrypted
        window.location.href = '/Import?' + 'p=' + Province + '&a=' + District + '&tt=' + selType + '&t=' + Tumbol + '&z=' + zone + '&n=' + Tumbolname
    };
    const goSearchImport = () => {
        // var encrypted = CryptoJS.Rabbit.encrypt('p=' + Province + '&a=' + District + '&tt=' + 2 + '&t=' + Tumbol + '&z=' + zone, "TRD3my-secrete@123");
        //U2FsdGVkX18ZUVvShFSES21qHsQEqZXMxQ9zgHy+bu0=
        // alert(encrypted)
        // var decrypted = CryptoJS.Rabbit.decrypt(encrypted, "TRD3my-secrete@123");

        // // decrypted.toString(CryptoJS.enc.Utf8)
        // console.log(decrypted.toString(CryptoJS.enc.Utf8),encrypted);
        // location.href = '/Import?' + encrypted
        window.location.href = '/Import?' + 'search'
    };
    const goReport = () => {
        window.location.href = '/Report'
    }

    const showSearchs = () => {
        const splitUrl = (window.location.href).split('/');
        if (splitUrl[splitUrl.length - 1].includes('Report') || splitUrl[splitUrl.length - 1].includes('Import')) {
            window.location.href = '/'
        } else {
            setShowSearch(!showSearch);
        }
        setStylemunu1({})
        setStylemunu2(menustyle)

    };
    // const showImport1 = () => {
    //     const splitUrl = (window.location.href).split('/');
    //     if (splitUrl[splitUrl.length - 1] == 'Home') {
    //         setShowImport(true)
    //     }
    // };
    // showImport1()
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
            <Grid sx={{ position: 'absolute', top: 0, textAlign: 'center', display: 'flex' }}>
                <Grid container sx={{ minHeight: '70px', backgroundColor: 'rgba(255, 255, 255, 0.78)', minWidth: '100vw', }} >
                    <Grid item md={12} sx={{ minWidth: '100vw', display: 'flex', }}>
                        <Grid item style={stylemunu1} sx={{ height: '70px', width: '150px', pt: 1, ':hover': { borderBottom: '5px solid rgba(3, 78, 177, 0.8)', cursor: 'pointer' } }} onClick={showMenus}>
                            <img src={'/home.svg'} width={25} height={25} alt='' /><br />
                            หน้าหลัก
                        </Grid>
                        <Grid style={stylemunu2} sx={{ height: '70px', width: '150px', pt: 1, ':hover': { borderBottom: '5px solid rgba(3, 78, 177, 0.8)', cursor: 'pointer' } }} onClick={showSearchs}>
                            <img src={'/search.svg'} width={25} height={25} alt='' /><br />
                            ค้นหาขอบเขต
                        </Grid>
                        <Grid style={stylemunu3} sx={{ height: '70px', width: '150px', pt: 1, ':hover': { borderBottom: '5px solid rgba(3, 78, 177, 0.8)', cursor: 'pointer' } }} onClick={goImport}>
                            <img src={'/import.svg'} width={25} height={25} alt='' /><br />
                            นำเข้าข้อมูล
                        </Grid>
                        <Grid style={stylemunu5} sx={{ height: '70px', width: '150px', pt: 1, ':hover': { borderBottom: '5px solid rgba(3, 78, 177, 0.8)', cursor: 'pointer' } }} onClick={goSearchImport}>
                            <ManageSearchIcon sx={{ fontSize: 25 }} /><br />
                            ค้นหาแปลงนำเข้า
                        </Grid>
                        <Grid style={stylemunu4} sx={{ height: '70px', width: '150px', pt: 1, ':hover': { borderBottom: '5px solid rgba(3, 78, 177, 0.8)', cursor: 'pointer' } }} onClick={goReport}>
                            <img src={'/report.svg'} width={25} height={25} alt='' /><br />
                            รายงานเผยแพร่
                        </Grid>
                        {/* </Grid> */}
                    </Grid>
                    {showload ? <LoadTemplate /> : ''}
                </Grid>

            </Grid>
            <Grid container sx={{
                position: 'absolute', top: 0, bottom: 0, alignItems: 'center',
                flexDirection: 'column', height: 'calc(100vh - 66px)', display: 'flex', textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.5)',
            }}
                style={SearchStyle}>
                <Grid item md={12} >
                    <Search childToParent={childToParent} />
                </Grid>

            </Grid>
        </ThemeProvider>
    )
}