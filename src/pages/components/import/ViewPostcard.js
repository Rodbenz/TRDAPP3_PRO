import * as React from 'react';
import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Box, Link, Button, ListItemText, FormControl, InputLabel, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
// import Image from 'next/image';
import Menus from '../home/Menus';
import CircularProgress from '@mui/material/CircularProgress';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import {
    DataGrid,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
    GRID_CHECKBOX_SELECTION_COL_DEF,
} from '@mui/x-data-grid';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import LoadShp from './LoadShp';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import JsPDF from 'jspdf';
import pdfMake from "pdfmake/build/pdfmake";
import html2canvas from "html2canvas";
import pdfFonts from "../../font/vfs_fonts";
import { textAlign } from '@mui/system';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
    THSarabunNew: {
        normal: 'THSarabunNew.ttf',
        bold: 'THSarabunNew Bold.ttf',
        italics: 'THSarabunNew Italic.ttf',
        bolditalics: 'THSarabunNew BoldItalic.ttf'
    },
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    }
}
export default function Import1() {
    const theme = createTheme({
        typography: {
            fontFamily: [
                'Kanit',
                'Sarabun',
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
    // const [transaction, settransaction] = useState([]);
    // useEffect(()=>{
    var transaction = (JSON.parse(window.sessionStorage.getItem("transactionpush")))
    console.log(transaction)
    // },[transaction])

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return (
        <ThemeProvider theme={theme}>
            <Grid id="postcard"
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center" style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', height: 'calc(100vh - 230px)' }}>
                <Grid item sx={{ width: '100%', height: 'calc(100vh - 230px)', backgroundColor: 'white', p: '8px' }}>

                    <Grid id="postcard01"
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center" sx={{ pb: '50px' }}>
                        {transaction.map((items, i) =>
                            <Grid id={"postcard" + (i + 1)} className='postcard' item sx={{ width: '1100px', height: '820px', border: '1px solid gray', pl: 5, pt: 1, pr: 2, pb: 1, mb: 2,backgroundImage: 'url(/168182119131023762.png)',backgroundRepeat: 'no-repeat',backgroundPosition: 'bottom',backgroundSize: 'contain', }}>
                                <div style={{ position: 'relative' }}>
                                    {/* <div style={{ position: 'absolute', top: 0, left: 40, display: 'flex' }}>
                                    <img src={"/Exlorer_Illustration2.svg"} width={90} height={90} alt='' />
                                    <Typography sx={{ pl: 1, fontSize: { md: '12pt', xs: '6pt', color: '#D7A203', lineHeight: '16px' }, textAlign: 'left' }}>
                                        <br /><br />  กรมธนารักษ์ <br /> THE TREASURY DEPARTMENT
                                    </Typography>
                                </div> */}
                                    <table style={{ width: '100%', fontFamily: 'Sarabun', fontStyle: 'normal', fontSize: '16pt', lineHeight: '130%', color: '#2F4266', }}>
                                        <tbody>
                                            <tr style={{ height: '50px' }}>
                                                <td colSpan={3} style={{ color: '#2F4266', fontSize: '12pt', textAlign: 'right' }}>หน้าที่ {i + 1}/{transaction.length}</td>
                                            </tr>
                                            <tr style={{ height: '50px' }}>
                                                <td colSpan={3} style={{ textAlign: 'center', color: '#2D3F61', fontWeight: 700, }}>รายงานการคำนวณราคาประเมินที่ดินประเภทนอกเหนือ</td>
                                            </tr>
                                            <tr style={{ height: '50px' }}>

                                            </tr>
                                            <tr style={{ height: '50px' }}>
                                                <td colSpan={2}><b><span style={{ color: '#084291' }}>ประเภทเอกสาร</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{((items.LAND_TYPE == 'อื่นๆ') ? items.REMARK : items.LAND_TYPE)}</td><td><b><span style={{ color: '#084291' }}>เลขที่</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.CHANODE_NO}</td>
                                            </tr>
                                            <tr style={{ height: '50px' }}>
                                                <td colSpan={2}><b><span style={{ color: '#084291' }}>จังหวัด</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.CHANGWAT_NAME}</td><td><b><span style={{ color: '#084291' }}>อำเภอ</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.AMPHUR_NAME}</td>
                                            </tr>
                                            <tr style={{ height: '50px' }}>
                                                <td colSpan={2}><b><span style={{ color: '#084291' }}>เทศบาล/ตำบล</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.OPT_NAME}</td><td></td>
                                            </tr>
                                            <tr style={{ height: '50px' }}>
                                                <td colSpan={2}></td><td></td>
                                            </tr>
                                            <tr style={{ height: '50px' }}>
                                                <td><span style={{ color: '#084291' }}><b>ชื่อหน่วย</b></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.STREET_NAME}</td><td colSpan={2}><span style={{ color: '#084291' }}><b>ราคาประเมินหน่วยที่ดิน </b>(บาท)</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{numberWithCommas(items.ST_VALUE)}</td>
                                            </tr>
                                            <tr style={{ height: '50px' }}>
                                                <td><span style={{ color: '#084291' }}><b>ความลึกมาตรฐาน </b>(เมตร)</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.STANDARD_DEPTH}</td><td colSpan={2}><span style={{ color: '#084291' }}><b>ความลึกแปลง </b>(เมตร)</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.DEPTH_R}</td>
                                            </tr>
                                            <tr style={{ height: '50px' }}>
                                                <td><span style={{ color: '#084291' }}><b>เนื้อที่ </b>(ไร่-งาน-ตร.ว.)</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.NRAI}-{items.NNHAN}-{parseFloat(items.NWAH).toFixed(1)}</td><td colSpan={2}><span style={{ color: '#084291' }}><b>ประเภทรูปร่างแปลงที่ดิน</b></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.LAND_TYPE_NAME}</td><td></td>
                                            </tr>

                                            <tr style={{ height: '50px' }}>
                                                <td colSpan={2}></td><td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table style={{ width: '100%', fontFamily: 'Sarabun', fontStyle: 'normal', fontSize: '16pt', lineHeight: '130%', color: '#2F4266', }}>
                                        <tbody>
                                            <tr style={{ height: '50px' }}>
                                                <td style={{ width: '220px' }}><span style={{ color: '#084291' }}><b>ราคา </b>(บาท/ตร.ว.)</span></td><td><Box sx={{ padding: '10px', backgroundColor: 'rgba(15, 235, 138, 0.7)', width: '150px', textAlign: 'center' }}>{((items.VAL_PER_WAH === null) ? 0 : items.VAL_PER_WAH.toLocaleString('en-US'))}</Box></td>
                                            </tr>
                                            <tr style={{ height: '50px' }}>
                                                <td style={{ width: '220px' }}><span style={{ color: '#084291' }}><b>ราคาทั้งแปลง</b> (บาท)</span></td><td><Box sx={{ padding: '10px', backgroundColor: 'rgba(252, 90, 90, 0.7)', width: '150px', textAlign: 'center' }}>{((items.VAL_PER_WAH === null) ? 0 : items.VAL_AREA.toLocaleString('en-US'))}</Box></td>
                                            </tr>
                                            <tr style={{ height: '50px' }}>

                                            </tr>
                                            <tr style={{ height: '50px', textAlign: 'right', fontSize: '15pt' }}>
                                                <td colSpan={3}><br></br><b>วันที่พิมพ์  {items.PROCESS_2STS_DATE}</b></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Grid>
                        )}

                    </Grid>

                </Grid>

            </Grid>
        </ThemeProvider>
    )
}