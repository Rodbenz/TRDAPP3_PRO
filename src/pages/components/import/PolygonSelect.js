import * as React from 'react';
// import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid,  Typography, Box,  Button,  TextField } from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import CloseIcon from '@mui/icons-material/Close';
export default function PolygonSelect() {
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
    const savePropertiesPolygon = () => {
        document.getElementById('propertiespolygon').hidden = true;
    }
    const closePropertiesPolygon = () => {
        document.getElementsByClassName('properties_input_polygon').value = '';
        for (var i = 1; i <= 9; i++) {
            document.getElementById('input' + i + "_1").value = '';
        }
        document.getElementById('propertiespolygon').hidden = true;
    }
    return (
        <ThemeProvider theme={theme}>
            <Button size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={closePropertiesPolygon}><CloseIcon color="white" /></Button>
            <Box sx={{ textAlign: 'left', }} ><Typography sx={{ pl: 1, textAlign: 'left', display: 'inline-block', m: 1, }}><SortIcon color='error' />รายละเอียดแปลงที่ดิน</Typography></Box><br />
            <Grid sx={{ overFlow: 'scroll' }}>
                <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ประเภทเอกสารสิทธิ </Typography>
                <TextField id="input1_1" className="properties_inpu_polygont" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} disabled /><br />
                <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>เลขที่เอกสารสิทธิ   </Typography>
                <TextField id="input2_1" className="properties_input_polygon" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} disabled /><br />
                <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>อำเภอ <span style={{ color: 'red' }}>*</span></Typography>
                <TextField id="input3_1" className="properties_input_polygon" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} disabled /><br />
                <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>เทศบาล / ตำบล <span style={{ color: 'red' }}>*</span></Typography>
                <TextField id="input4_1" className="properties_input_polygon" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} disabled /><br />
                <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>หน่วยที่ดิน </Typography>
                {/* <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '250px' }}>
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
                            <MenuItem key={province.PRO_C} value={province.PRO_C}>{province.ON_PRO_THA}</MenuItem>
                        ))}
                    </Select>
                </FormControl> */}
                <TextField id="input5_1" className="properties_input_polygon" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00D97A', } } }} disabled /><br />
                <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ประเภทรูปแปลง </Typography>
                {/* <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '250px' }}>
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
                </FormControl> */}
                <TextField id="input6_1" className="properties_input_polygon" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00D97A', } } }} disabled /><br />
                <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>เนื้อที่ ไร่ <span style={{ color: 'red' }}>*</span> </Typography>
                <TextField id="input7_1" className="properties_input_polygon" size="small" sx={{ my: '1px', width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} />
                <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>งาน <span style={{ color: 'red' }}>*</span> </Typography>
                <TextField id="input8_1" className="properties_input_polygon" size="small" sx={{ my: '1px', width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} />
                <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>วา <span style={{ color: 'red' }}>*</span> </Typography>
                <TextField id="input9_1" className="properties_input_polygon" size="small" sx={{ my: '1px', width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} /><br />
            </Grid><br /><br />
            <Button variant="contained" color='primary' sx={{ m: '1px' }} onClick={savePropertiesPolygon}>บันทึก</Button>
            <Button variant="contained" color='error' sx={{ m: '1px' }} onClick={closePropertiesPolygon}>ยกเลิก</Button>
        </ThemeProvider>
    )
}