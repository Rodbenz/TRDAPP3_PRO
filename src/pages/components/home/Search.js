import * as React from 'react';
import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, FormControl, InputLabel, Select, MenuItem, Typography, Box, Link, Button, Input, TextField } from "@mui/material";
// import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import CachedIcon from '@mui/icons-material/Cached';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
export default function Search({ childToParent, parentToChild }) {
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
    const [userid, setUserid] = useState(window.sessionStorage.getItem("userid"))
    const [showLoad, setShowLoad] = useState(false)
    const [labelMunicipal, setLabelMunicipal] = React.useState('-เลือกขอบเขตเทศบาล/อบต.-');
    const [province, setProvince] = React.useState([]);
    const [selectedProvince, setSelectedProvince] = React.useState('');
    const [vselectedProvince, setvSelectedProvince] = React.useState('');
    const [district, setDistrict] = React.useState([]);
    const [selectedDistrict, setSelectedDistrict] = React.useState('');
    const [vselectedDistrict, setvSelectedDistrict] = React.useState('');
    const [selType, setselType] = React.useState([]);
    const [selectedselType, setSelectedselType] = React.useState('');
    const [municipal, setMunicipal] = React.useState('');
    const [selectedMunicipal, setSelectedMunicipal] = React.useState('');
    const [tumbol, setTumbol] = React.useState([]);
    const [selectedTumbol, setSelectedTumbol] = React.useState('');
    const [vselectedTumbol, setvSelectedTumbol] = React.useState('');
    const [selectedZone, setSelectedZone] = React.useState('');
    const [zone, setZone] = React.useState('');
    const [showMenu, setShowMenu] = useState(false)
    useEffect(() => {
        const getprovince = async () => {
            setShowLoad(true)
            const res = await fetch(process.env.REACT_APP_HOST_API + "/MASTER/searchchangwat", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "USER_ID": userid
                })
            });
            //console.log(res);
            const response = await res.json();
            setProvince(response.result);
            setZone(response.result[0].MAPZONE);
            setShowLoad(false)
        };
        getprovince()
        var mousePosition;
        var offset = [0, 0];
        var div = document.getElementById('divsearch');
        var isDown = false;

        div.style.position = "absolute";
        div.style.left = "calc(50vw - 300px)";
        div.style.top = "calc(50vh - 200px)";
        div.addEventListener('mousedown', function (e) {
            isDown = true;
            offset = [
                div.offsetLeft - e.clientX,
                div.offsetTop - e.clientY
            ];
        }, true);

        document.addEventListener('mouseup', function () {
            isDown = false;
        }, true);

        document.addEventListener('mousemove', function (event) {
            event.preventDefault();
            if (isDown) {
                mousePosition = {

                    x: event.clientX,
                    y: event.clientY

                };
                div.style.left = (mousePosition.x + offset[0]) + 'px';
                div.style.top = (mousePosition.y + offset[1]) + 'px';
            }
        }, true);
    }, []);
    const selectStyle1 = {
        display: showMenu ? 'block' : 'none',
    };
    const selectStyle2 = {
        display: showMenu ? 'none' : 'block',
    };
    const handleChangeMunicipal = (event) => {
        // console.log(selectedMunicipal, municipal)
        setSelectedMunicipal(event.target.value);
        setSelectedselType(event.target.value);
        var url = '';
        // console.log(selectedMunicipal, municipal)
        if (event.target.value == 1) {
            url = process.env.REACT_APP_HOST_API + "/MASTER/searchOpt";
            // AD_CHANGWA = '81' and AD_AMPHOE = '02' and MUNISAN_ID = '05810201'
            // setLabelMunicipal('-เลือกเทศบาล-');
        } else {
            url = process.env.REACT_APP_HOST_API + "/MASTER/searchOpt";
            // setLabelMunicipal('-เลือกตำบล-');
        }
        const getTumbol = async () => {

            setShowLoad(true)
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "CHANGWAT_CODE": selectedProvince + "",
                    "AMPHUR_CODE": selectedDistrict + "",
                    "OPT_TYPE": event.target.value + "",
                    "ZONE": zone + ""
                })
            });
            const response = await res.json();
            // setTumbol(response);
            if (response.status == 200) {
                setTumbol(response.result);
                setShowLoad(false)
            } else {
                alert(response.message);
                setShowLoad(false)
            }
        };
        getTumbol();
        setShowMenu(!showMenu)
    };
    const handleChangeFinal = (event) => {
        // setZone(47)
        // setTimeout(() => {
        //     if (document.getElementById('tumbol').innerText.includes('47')) {
        //         setZone(47)
        //     } else if (document.getElementById('tumbol').innerText.includes('48')) {
        //         setZone(48)
        //     } else {
        //         setZone(47)
        //     }
        // }, 100)
        var val = event.target.value.split('|')
        var value = val[0]
        var valzone = val[1]
        setSelectedTumbol(value);
        setvSelectedTumbol(event.target.value);
        console.log(tumbol);
        var name = '';
        selType.forEach((item, i) => {
            if (item.OPT_TYPE === selectedselType) {
                name += item.OPT_NAME_TYPE;
            }
        });
        tumbol.forEach((item, i) => {
            if (item.OPT_CODE === value) {
                name += item.OPT_NAME_ABBR;
            }
        });
        setTimeout(() => {
            console.log({ selectedProvince, selectedDistrict, selectedTumbol: value, zone, selType: selectedselType, name: name });
            childToParent({ selectedProvince, selectedDistrict, selectedTumbol: value, zone, selType: selectedselType, name: name })
        }, 500);

    };
    const handleRefresh = () => {
        setSelectedProvince('');
        setSelectedDistrict('');
        setvSelectedProvince('');
        setvSelectedDistrict('');
        setDistrict([]);
        setSelectedMunicipal('');
        setSelectedselType('')
        setselType([])
        setSelectedTumbol('');
        setvSelectedTumbol('');
        setTumbol([]);
        setLabelMunicipal('-เลือกขอบเขตเทศบาล/อบต.-')
        if (showMenu) {
            setShowMenu(!showMenu)
        }

    }
    const handleChangeProvince = (event) => {
        if (event.target.value == '') {
            setSelectedProvince('');
            setvSelectedProvince('');
            setDistrict([]);
            setSelectedDistrict('');
            setvSelectedDistrict('');
            setMunicipal([]);
        } else {
            var val = event.target.value.split('|')
            var value = val[0]
            var valzone = val[1]
            setZone(valzone)
            setDistrict([]);
            setSelectedDistrict('');
            setvSelectedDistrict('');
            setSelectedProvince(value);
            setvSelectedProvince(event.target.value);
            const getDistrict = async () => {
                setShowLoad(true)
                const res = await fetch(process.env.REACT_APP_HOST_API + "/MASTER/SearchAmphur", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "USER_ID": userid,
                        "CHANGWAT_CODE": value + "",
                        "ZONE": zone + ""
                    })
                });
                //console.log(res);
                const response = await res.json();
                if (response.status == 200) {
                    setDistrict(response.result);
                    setShowLoad(false)
                } else {
                    alert(response.message);
                    setShowLoad(false)
                }
            };
            getDistrict();
            childToParent({ selectedProvince: value, selectedDistrict, selectedTumbol, zone, selType: selectedselType, name: '' })
        }



    };
    const handleChangeDistrict = (event) => {
        // setTimeout(() => {
        //     if (document.getElementById('district').innerText.includes('47')) {
        //         setZone(47)
        //     } else if (document.getElementById('district').innerText.includes('48')) {
        //         setZone(48)
        //     } else {
        //         setZone(47)
        //     }
        // }, 100)
        if (event.target.value == '') {
            setSelectedDistrict('');
            setvSelectedDistrict('');
            setSelectedselType('')
            setselType([])
        } else {
            var val = event.target.value.split('|')
            var value = val[0]
            var valzone = val[1]
            setSelectedDistrict(value);
            setvSelectedDistrict(event.target.value);
            const getSelType = async () => {
                setShowLoad(true)
                const res = await fetch(process.env.REACT_APP_HOST_API + "/MASTER/selType", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "USER_ID": userid,
                        "CHANGWAT_CODE": selectedProvince + "",
                        "AMPHUR_CODE": value + "",
                        "ZONE": zone + ""
                    })
                });
                //console.log(res);
                const response = await res.json();
                if (response.status == 200) {
                    setselType(response.result);
                    setSelectedselType('')
                    setShowLoad(false)
                } else {
                    setselType([
                        {
                            "CHANGWAT_CODE": "58",
                            "AMPHUR_CODE": "03",
                            "OPT_TYPE": 1,
                            "OPT_NAME_TYPE": "เทศบาลตำบล"
                        },
                        {
                            "CHANGWAT_CODE": "58",
                            "AMPHUR_CODE": "03",
                            "OPT_TYPE": 2,
                            "OPT_NAME_TYPE": "องค์การบริหารส่วนตำบล"
                        }
                    ]);
                    alert(response.message);
                    setShowLoad(false)
                }
            };
            getSelType();
            childToParent({ selectedProvince, selectedDistrict: value, selectedTumbol, zone, selType: selectedselType, name: '' })
        }

    };
    const handleChange3 = (event) => {
        setSelectedMunicipal(event.target.value);
    };
    const handleBackword = () => {
        if (showMenu) {
            setShowMenu(!showMenu)
        }
    }
    const handleForword = () => {
        if (!showMenu) {
            setShowMenu(!showMenu)
        }
    }
    const handleCancel = () => {
        setSelectedProvince('');
        setSelectedDistrict('');
        setDistrict([]);
        setSelectedMunicipal('');
        setSelectedselType('')
        setselType([])
        setSelectedTumbol('');
        setTumbol([]);
        setLabelMunicipal('-เลือกขอบเขตเทศบาล/อบต.-')
        // setZone('')
        if (!showMenu) {
            setShowMenu(!showMenu)
            childToParent({ selectedProvince: '', selectedDistrict: '', selectedTumbol: '', zone: '', selType: '', name: '' })
        }
        handleRefresh();
    }

    const LoadingStyle = {
        display: showLoad ? 'block' : 'none',
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container sx={{
                borderRadius: '10px', mt: 10, width: '100%', display: 'flex', alignItems: 'center',
                flexDirection: 'column',
            }}>
                {/* <Grid sx={{ display: 'flex', position: 'fixed', backgroundColor: '#e0e0e0', borderRadius: '10px', p: 10, mt: 5 }} style={LoadingStyle}>
                    <CircularProgress />
                </Grid> */}
                <Grid id="divsearch" container sx={{ width: '600px', backgroundColor: '#fff', borderRadius: '10px', pb: '20px' }}>
                    <br /><br />
                    <Grid item md={6} xs={6} sx={{ textAlign: 'left', px: '20px', pt: '20px' }}>
                        <Typography sx={{ color: '#2F4266', fontSize: '18pt' }}><SearchIcon sx={{ fontSize: '30px' }} /> ค้นหาขอบเขต</Typography>
                    </Grid>
                    <Grid item md={6} xs={6} sx={{ textAlign: 'right', px: '20px', pt: '20px' }}>
                        <CachedIcon sx={{ color: '#2368C4', ':hover': { color: '#2F4266', cursor: 'pointer' } }} onClick={handleRefresh} />
                        <CloseIcon sx={{ color: 'rgb(211, 47, 47)', ':hover': { color: 'red', cursor: 'pointer' } }} onClick={handleCancel} />
                    </Grid>
                    <Grid item md={6} xs={6} >
                        <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '250px' }}>
                            <InputLabel id="province-label">-เลือกจังหวัด-</InputLabel>
                            <Select
                                labelId="province-label"
                                id="province"
                                value={vselectedProvince}
                                onChange={handleChangeProvince}
                                label="-เลือกจังหวัด-"
                            >
                                <MenuItem value="">
                                    <em>-เลือกจังหวัด-</em>
                                </MenuItem>
                                {province.map((province, index) => (
                                    <MenuItem key={index} value={province.PRO_C + '|' + province.MAPZONE} >{province.ON_PRO_THA}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={6} >
                        <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '250px' }}>
                            <InputLabel id="district-label">-เลือกอำเภอ-</InputLabel>
                            <Select
                                labelId="district-label"
                                id="district"
                                value={vselectedDistrict}
                                onChange={handleChangeDistrict}
                                label="-เลือกอำเภอ-"
                            >
                                <MenuItem value="">
                                    <em>-เลือกอำเภอ-</em>
                                </MenuItem>
                                {district.map((district, index) => (
                                    <MenuItem key={index} value={district.AMPHUR_CODE + '|' + district.MAPZONE} >{district.AMPHUR_DESCRIPTION}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={6} >
                        <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '250px' }}>
                            <InputLabel id="municipal-label">-เลือกขอบเขต-</InputLabel>
                            <Select
                                labelId="municipal-label"
                                id="municipal"
                                value={selectedselType}
                                onChange={handleChangeMunicipal}
                                label="-เลือกขอบเขต-"
                            >
                                <MenuItem value="">
                                    <em>-เลือกขอบเขต-</em>
                                </MenuItem>
                                {selType.map((selType, index) => (
                                    <MenuItem key={index} value={selType.OPT_TYPE} >{selType.OPT_NAME_TYPE}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={6} xs={6} >
                        <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '250px' }}>
                            <InputLabel id="tumbol-label">{'-เลือกเทศบาล/ตำบล-'}</InputLabel>
                            <Select
                                labelId="tumbol-label"
                                id="tumbol"
                                value={vselectedTumbol}
                                onChange={handleChangeFinal}
                                label={'เลือกเทศบาล/ตำบล'}
                            >
                                <MenuItem value="">
                                    <em>{'เลือกเทศบาล/ตำบล'}</em>
                                </MenuItem>
                                {tumbol.map((tumbol, index) => (
                                    <MenuItem key={index} value={tumbol.OPT_CODE + '|' + tumbol.MAPZONE} >{tumbol.OPT_NAME_ABBR + '(' + tumbol.MAPZONE + ')'}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={12} xs={12} >
                        <TextField id="standard-basic" label="Zone" variant="standard" focused value={zone} size='small' sx={{ m: 1, width: '100px' }} inputProps={
                            { readOnly: true, }
                        }></TextField>
                        {/* <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '250px' }}>
                            <InputLabel id="zone-label">-เลือกโซน-</InputLabel>
                            <Input id="zone" value={zone}></Input>
                             <Select
                                labelId="tumbol-label"
                                id="tumbol"
                                value={selectedZone}
                                onChange={handleChangeFinal}
                                label="-โซน-"
                            >
                                <MenuItem value="">
                                    <em>-เลือกโซน-</em>
                                </MenuItem>
                                <MenuItem value={47}>47</MenuItem>
                                <MenuItem value={48}>48</MenuItem>
                            </Select> 

                        </FormControl> */}
                    </Grid>
                    {/* <Grid item md={6} xs={6} >
                        <Button >ค้นหา</Button>
                        <Button onClick={handleCancel}>ยกเลิก</Button>
                    </Grid> */}
                </Grid>
                {/* <Grid container sx={{ width: '300px', backgroundColor: '#397C54', borderRadius: '10px 10px 0 0' }}>
                    <Grid item md={3} xs={3} >
                        <Button onClick={handleBackword} sx={{ minWidth: '10px !important', p: 0, m: 1, color: 'black' }}>
                            <KeyboardDoubleArrowLeftIcon />
                        </Button>

                        <Button onClick={handleForword} sx={{ minWidth: '10px !important', p: 0, color: 'black' }}>
                            <KeyboardDoubleArrowRightIcon />
                        </Button>
                    </Grid>
                    <Grid item md={6} xs={6} sx={{ display: 'flex', alignItems: 'center', }}>
                        <Typography sx={{ width: '100%' }}>
                            ค้นหาขอบเขต
                        </Typography>
                    </Grid>

                    <Grid item md={3} xs={3} >
                        <Button onClick={handleRefresh} sx={{ minWidth: '10px !important', p: 0, m: 1, color: 'black' }}>
                            <CachedIcon sx={{ borderRadius: 20, backgroundColor: '#e0e0e0' }} onClick={handleRefresh} />
                        </Button>

                        <Button onClick={() => childToParent({ selectedProvince, selectedDistrict, selectedTumbol })} sx={{ minWidth: '10px !important', p: 0, color: 'red' }}>
                            <HighlightOffIcon sx={{ borderRadius: 20, backgroundColor: '#e0e0e0' }} onClick={handleRefresh} />
                        </Button>
                    </Grid>
                </Grid>
                <Grid item md={12} xs={12} sx={{ width: '300px', backgroundColor: 'white', pb: 2, }} style={selectStyle2}>
                    <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '250px' }}>
                        <InputLabel id="province-label">-เลือกจังหวัด-</InputLabel>
                        <Select
                            labelId="province-label"
                            id="province"
                            value={selectedProvince}
                            onChange={handleChangeProvince}
                            label="-เลือกจังหวัด-"
                        >
                            <MenuItem value="">
                                <em>-เลือกจังหวัด-</em>
                            </MenuItem>
                            {province.map((province) => (
                                <MenuItem key={province.CHANGWAT_CODE} value={province.CHANGWAT_CODE}>{province.CHANGWAT_NAME}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '250px' }}>
                        <InputLabel id="district-label">-เลือกอำเภอ-</InputLabel>
                        <Select
                            labelId="district-label"
                            id="district"
                            value={selectedDistrict}
                            onChange={handleChangeDistrict}
                            label="-เลือกอำเภอ-"
                        >
                            <MenuItem value="">
                                <em>-เลือกอำเภอ-</em>
                            </MenuItem>
                            {district.map((district) => (
                                <MenuItem key={district.AMPHUR_CODE} value={district.AMPHUR_CODE}>{district.AMPHUR_DESCRIPTION}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '250px' }}>
                        <InputLabel id="municipal-label">-เลือกเขตการปกครอง-</InputLabel>
                        <Select
                            labelId="municipal-label"
                            id="municipal"
                            value={selectedMunicipal}
                            onChange={handleChangeMunicipal}
                            label="-เลือกเขตการปกครอง-"
                        >
                            <MenuItem value="">
                                <em>-เลือกเขตการปกครอง-</em>
                            </MenuItem>
                            <MenuItem value={1}>ขอบเขตเทศบาล</MenuItem>
                            <MenuItem value={2}>ขอบเขตตำบล</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sx={{ width: '300px', backgroundColor: 'white', pb: 2, }} style={selectStyle1}>
                    <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '250px' }}>
                        <InputLabel id="tumbol-label">{labelMunicipal}</InputLabel>
                        <Select
                            labelId="tumbol-label"
                            id="tumbol"
                            value={selectedTumbol}
                            onChange={handleChangeFinal}
                            label={labelMunicipal}
                        >
                            <MenuItem value="">
                                <em>{labelMunicipal}</em>
                            </MenuItem>
                            {tumbol.map((tumbol) => (
                                <MenuItem key={(tumbol.TUMBON_CODE != undefined) ? tumbol.TUMBON_CODE : tumbol.MU_CODE} value={(tumbol.TUMBON_CODE != undefined) ? tumbol.TUMBON_CODE : tumbol.MU_CODE}>{(tumbol.TUMBON_DESCRIPTION != undefined) ? tumbol.TUMBON_DESCRIPTION : tumbol.MU_NAME}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid> */}
            </Grid>
        </ThemeProvider >
    )
}