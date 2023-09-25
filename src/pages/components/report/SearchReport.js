import * as React from 'react';
// import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, FormControl, InputLabel, Select, MenuItem, Typography,   Button } from "@mui/material";
import TextField from '@mui/material/TextField';
// import Image from 'next/image';
// import Avatar from '@mui/material/Avatar';
// import Stack from '@mui/material/Stack';
// import CachedIcon from '@mui/icons-material/Cached';
// import HighlightOffIcon from '@mui/icons-material/HighlightOff';
// import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
// import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
// import SearchIcon from '@mui/icons-material/Search';
// import CloseIcon from '@mui/icons-material/Close';
// import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
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

    const [selectedMunicipal] = React.useState('');
    const [value, setValue] = React.useState(dayjs('2014-08-18T21:11:54'));

    const handleChange = (newValue) => {
        setValue(newValue);
    };
    const handleChangeMunicipal = (event) => {

    }
    return (
        <ThemeProvider theme={theme}>
            <Grid container sx={{
                borderRadius: '10px', width: '100%', display: 'flex', alignItems: 'center',
                flexDirection: 'column',
            }}>
                <Grid container sx={{ width: '80%', backgroundColor: '#fff', borderRadius: '15px 15px 0px 0px', pb: '20px' }}>
                    <Grid item md={12} xs={12} sx={{ textAlign: 'left', backgroundColor: '#266AC5', borderRadius: '15px 15px 0px 0px', }}>
                        <Typography sx={{  fontSize: '18pt', px: 2, color: 'white' }}>รายงานนำเข้าข้อมูลแปลงที่ดิน</Typography>
                    </Grid>
                    <Grid item md={12} xs={12} sx={{ textAlign: 'left', backgroundColor: '#fff', border: '1px solid #707992' }}>
                        <Grid container sx={{ p: 1, pr: 3 }}>
                            <Grid item md={4} xs={4} sx={{ p: 1 }}>
                                <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                    <InputLabel id="municipal-label">เทศบาล <span style={{color:'red'}}>*</span></InputLabel>
                                    <Select
                                        labelId="municipal-label"
                                        id="municipal"
                                        value={selectedMunicipal}
                                        label="เลือกเขตการปกครอง"
                                        onChange={handleChangeMunicipal}
                                    >
                                        <MenuItem value="">
                                            <em>-เลือกเขตการปกครอง-</em>
                                        </MenuItem>
                                        <MenuItem value={1}>ขอบเขตเทศบาล</MenuItem>
                                        <MenuItem value={2}>ขอบเขตตำบล</MenuItem>
                                    </Select>
                                    {/* <FormHelperText>With label + helper text</FormHelperText> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={4} sx={{ p: 1 }}>
                                <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                    <InputLabel id="municipal-label">จังหวัด <span style={{color:'red'}}>*</span></InputLabel>
                                    <Select
                                        labelId="municipal-label"
                                        id="municipal"
                                        value={selectedMunicipal}
                                        label="เลือกเขตการปกครอง"
                                        onChange={handleChangeMunicipal}
                                    >
                                        <MenuItem value="">
                                            <em>-เลือกเขตการปกครอง-</em>
                                        </MenuItem>
                                        <MenuItem value={1}>ขอบเขตเทศบาล</MenuItem>
                                        <MenuItem value={2}>ขอบเขตตำบล</MenuItem>
                                    </Select>
                                    {/* <FormHelperText>With label + helper text</FormHelperText> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={4} sx={{ p: 1 }}>
                                <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                    <InputLabel id="municipal-label">อำเภอ <span style={{color:'red'}}>*</span></InputLabel>
                                    <Select
                                        labelId="municipal-label"
                                        id="municipal"
                                        value={selectedMunicipal}
                                        label="เลือกเขตการปกครอง"
                                        onChange={handleChangeMunicipal}
                                    >
                                        <MenuItem value="">
                                            <em>-เลือกเขตการปกครอง-</em>
                                        </MenuItem>
                                        <MenuItem value={1}>ขอบเขตเทศบาล</MenuItem>
                                        <MenuItem value={2}>ขอบเขตตำบล</MenuItem>
                                    </Select>
                                    {/* <FormHelperText>With label + helper text</FormHelperText> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={4} sx={{ p: 1 }}>
                                <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                    <InputLabel id="municipal-label">เทศบาล <span style={{color:'red'}}>*</span></InputLabel>
                                    <Select
                                        labelId="municipal-label"
                                        id="municipal"
                                        value={selectedMunicipal}
                                        label="เลือกเขตการปกครอง"
                                        onChange={handleChangeMunicipal}
                                    >
                                        <MenuItem value="">
                                            <em>-เลือกเขตการปกครอง-</em>
                                        </MenuItem>
                                        <MenuItem value={1}>ขอบเขตเทศบาล</MenuItem>
                                        <MenuItem value={2}>ขอบเขตตำบล</MenuItem>
                                    </Select>
                                    {/* <FormHelperText>With label + helper text</FormHelperText> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={4} sx={{ p: 1 }}>
                                <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                    <InputLabel id="municipal-label">อบต. <span style={{color:'red'}}>*</span></InputLabel>
                                    <Select
                                        labelId="municipal-label"
                                        id="municipal"
                                        value={selectedMunicipal}
                                        label="เลือกเขตการปกครอง"
                                        onChange={handleChangeMunicipal}
                                    >
                                        <MenuItem value="">
                                            <em>-เลือกเขตการปกครอง-</em>
                                        </MenuItem>
                                        <MenuItem value={1}>ขอบเขตเทศบาล</MenuItem>
                                        <MenuItem value={2}>ขอบเขตตำบล</MenuItem>
                                    </Select>
                                    {/* <FormHelperText>With label + helper text</FormHelperText> */}
                                </FormControl>
                            </Grid>
                            <Grid item md={4} xs={4} sx={{ p: 1 }}>
                                <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                    <InputLabel id="municipal-label">สถานะดำเนินการ <span style={{color:'red'}}>*</span></InputLabel>
                                    <Select
                                        labelId="municipal-label"
                                        id="municipal"
                                        value={selectedMunicipal}
                                        label="เลือกเขตการปกครอง"
                                        onChange={handleChangeMunicipal}
                                    >
                                        <MenuItem value="">
                                            <em>-เลือกเขตการปกครอง-</em>
                                        </MenuItem>
                                        <MenuItem value={1}>ขอบเขตเทศบาล</MenuItem>
                                        <MenuItem value={2}>ขอบเขตตำบล</MenuItem>
                                    </Select>
                                    {/* <FormHelperText>With label + helper text</FormHelperText> */}
                                </FormControl>
                            </Grid>

                            <Grid item md={4} xs={4} sx={{ p: 1 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker sx={{ m: 1, minWidth: '100%' }}
                                        label="วัน/เดือน/ปี นำเข้า"
                                        inputFormat="MM/DD/YYYY"
                                        value={value}
                                        onChange={handleChange}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item md={4} xs={4} sx={{ p: 1 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker sx={{ m: 1, minWidth: '100%' }}
                                        label="วัน/เดือน/ปี นำเข้า"
                                        inputFormat="MM/DD/YYYY"
                                        value={value}
                                        onChange={handleChange}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item md={4} xs={4} sx={{ p: 1 }} >
                                <Button variant="contained" color="primary">ค้นหา</Button>
                                <Button variant="contained" color="warning">ล้างค่า</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider >
    )
}