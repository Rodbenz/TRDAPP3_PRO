import * as React from 'react';
import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider, makeStyles } from '@mui/material/styles';
import { Grid, Typography, Box, Select, MenuItem, Button, ListItemText, FormControl, InputLabel, FormLabel, RadioGroup, FormControlLabel, Radio, Tooltip } from "@mui/material";
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
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import LoadShp from './LoadShp';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CloseIcon from '@mui/icons-material/Close';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import JsPDF from 'jspdf';
import pdfMake from "pdfmake/build/pdfmake";
import html2canvas from "html2canvas";
import pdfFonts from "../../font/vfs_fonts";
import { textAlign } from '@mui/system';
import dayjs from 'dayjs';
import { asArray } from 'ol/color';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { print, printElementById, printElementsById, printPreview } from '../../../libs/controlPrint';
import axios from "axios";
import { dateFormatTime, getPopupData, getPopupData2 } from '../../../libs/dataOutputImport';
import OverwriteAdapterDayjs from '../date_adapter/OverwriteLibs';


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
var htmlToPdfmake = require("html-to-pdfmake");
function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            variant="outlined"
            shape="rounded"
            page={page + 1}
            count={pageCount}
            // @ts-expect-error
            renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}
export default function Import1({ fullscreen, typeimport, infoSeqimp, data2table, reloadTb, steppoint2map, point2map, zoomtofeature, infoSeqimpcal, activeCellId, setActiveCellId }) {
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
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    async function generatePDF() {
        var div1 = document.getElementById('loadingpopup1');
        div1.style.left = "calc(50vw - 200px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('loadingpopup');
        div2.style.display = 'flex';
        var imgObj = [];
        // console.log(transaction.length);
        for (let i = 1; i <= transaction.length; i++) {
            const pdfTable = document.getElementById("postcard" + i);
            // console.log(document.getElementById("postcard" + i));
            await html2canvas(pdfTable).then(function (canvas) {
                // console.log(canvas);
                imgObj.push({
                    image: canvas.toDataURL(),
                    width: 750,
                    style: {
                        alignment: "center"
                    }
                });
                // console.log(imgObj);
                return imgObj;
            });
            if (i === transaction.length) {
                // console.log(imgObj);
                setTimeout(() => {
                    loadPdf(imgObj)
                }, 1000);
            }
        }


    }
    function loadPdf(imgObj) {

        // console.log(imgObj);
        const documentDefinition = {
            // content: [imgObj], 
            content: [imgObj],
            defaultStyle: {
                font: "THSarabunNew"
            },
            pageSize: "A4",
            pageOrientation: "landscape",
            pageMargins: [0, 15, 0, 0],
        };
        const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
        pdfDocGenerator.download();

        document.getElementById('loadingpopup').style.display = 'none';
    }
    function calcScreenWidthByPercent(percent) {
        const table = document.getElementsByTagName('body');
        const screenWidth = table[0].scrollWidth - 114;
        const width = (percent / 100) * screenWidth;
        return width;
    }

    const columns1 = [
        { field: 'id', headerName: 'ลำดับ', width: calcScreenWidthByPercent(4), align: 'center', headerAlign: 'center', },
        { field: 'no', headerName: '', width: calcScreenWidthByPercent(1), align: 'center', headerAlign: 'center', renderCell: (params) => <Button size="small" id={'zoomto' + params.value} style={{ cursor: 'pointer', minWidth: '25px' }} data={params.value} onClick={zoomtopolygon}><img width={25} height={25} src={'./viewpoint.svg'} /></Button>, },
        { field: 'EDIT_NO', headerName: '', width: calcScreenWidthByPercent(1), align: 'center', headerAlign: 'center', renderCell: (params) => <Button title='แก้ไข' size="small" id={'edit' + params.value} style={{ cursor: 'pointer', minWidth: '25px' }} data={params.value} onClick={editDataPolygon}><img width={25} height={25} src={'./edit-247-256.png'} /></Button>, },
        { field: 'LAND_TYPE', headerName: 'ประเภทเอกสาร', width: calcScreenWidthByPercent(12), align: 'center', headerAlign: 'center', },
        { field: 'PARCEL_NO', headerName: 'เลขที่', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        // { field: 'REFERENCE_NO', headerName: 'เลขทีอ้างอิง', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        // { field: 'AMPHUR_CODE', headerName: 'รหัส อำเภอ', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        { field: 'AMPHUR_NAME', headerName: 'อำเภอ', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        // { field: 'OPT_CODE', headerName: 'รหัส อปท/ตำบล', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        { field: 'OPT_NAME', headerName: 'เทศบาล/ตำบล', width: calcScreenWidthByPercent(15), align: 'center', headerAlign: 'center', },
        // { field: 'TYPE_CODE', headerName: 'ประเภท หน่วยที่ดิน', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'TYPE_NAME', headerName: 'ชื่อหน่วย', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'STREET_VALUE', headerName: 'ราคาประเมินหน่วยที่ดิน (บาท/ตร.ว.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'STREET_VALUE_', headerName: 'ราคาหน่วยที่ดินนอกเหนือ (บาท/ตร.ว.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'STANDARD_DEPTH', headerName: 'ความลึกมาตรฐาน (ม.)', type: 'number', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'DEPTH_R', headerName: 'ความลึกแปลง (ม.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'LAND_TYPE_NAME', headerName: 'ประเภทรูปร่างแปลงที่ดิน', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'AREA', headerName: 'เนื้อที่ (ไร่-งาน-ตร.ว.)', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'VAL_PER_WAH', headerName: 'ราคา (บาท/ตร.ว.)', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'AMT_VALUE', headerName: 'ราคาทั้งแปลง (บาท)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'DATE_IMPORT', headerName: 'วันที่นำเข้า', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
    ];
    const columns2 = [
        { field: 'id', headerName: 'ลำดับ', width: calcScreenWidthByPercent(4), align: 'center', headerAlign: 'center', },
        { field: 'no', headerName: '', width: calcScreenWidthByPercent(1), align: 'center', headerAlign: 'center', renderCell: (params) => <Button size="small" id={'zoomto' + params.value} style={{ cursor: 'pointer', minWidth: '25px' }} data={params.value} onClick={zoomtopolygon}><img width={25} height={25} src={'./viewpoint.svg'} /></Button>, },
        { field: 'EDIT_NO', headerName: '', width: calcScreenWidthByPercent(1), align: 'center', headerAlign: 'center', renderCell: (params) => <Button title='แก้ไข' size="small" id={'edit' + params.value} style={{ cursor: 'pointer', minWidth: '25px' }} data={params.value} onClick={editDataPolygon}><img width={25} height={25} src={'./edit-247-256.png'} /></Button>, },
        { field: 'LAND_TYPE', headerName: 'ประเภทเอกสาร', width: calcScreenWidthByPercent(12), align: 'center', headerAlign: 'center', },
        { field: 'PARCEL_NO', headerName: 'เลขที่', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        // { field: 'REFERENCE_NO', headerName: 'เลขทีอ้างอิง', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        // { field: 'AMPHUR_CODE', headerName: 'รหัส อำเภอ', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        { field: 'AMPHUR_NAME', headerName: 'อำเภอ', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        // { field: 'OPT_CODE', headerName: 'รหัส อปท/ตำบล', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        { field: 'OPT_NAME', headerName: 'เทศบาล/ตำบล', width: calcScreenWidthByPercent(15), align: 'center', headerAlign: 'center', },
        // { field: 'TYPE_CODE', headerName: 'ประเภท หน่วยที่ดิน', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'TYPE_NAME', headerName: 'ชื่อหน่วย', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'STREET_VALUE', headerName: 'ราคาประเมินหน่วยที่ดิน (บาท/ตร.ว.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'STREET_VALUE_', headerName: 'ราคาหน่วยที่ดินนอกเหนือ (บาท/ตร.ว.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'STANDARD_DEPTH', headerName: 'ความลึกมาตรฐาน (ม.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'DEPTH_R', headerName: 'ความลึกแปลง (ม.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'LAND_TYPE_NAME', headerName: 'ประเภทรูปร่างแปลงที่ดิน', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'AREA', headerName: 'เนื้อที่ (ไร่-งาน-ตร.ว.)', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'VAL_PER_WAH', headerName: 'ราคา (บาท/ตร.ว.)', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'AMT_VALUE', headerName: 'ราคาทั้งแปลง (บาท)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'DATE_IMPORT', headerName: 'วันที่คำนวณราคา', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
    ];
    const columns3 = [
        { field: 'id', headerName: 'ลำดับ', width: calcScreenWidthByPercent(4), align: 'center', headerAlign: 'center', },
        { field: 'no', headerName: '', width: calcScreenWidthByPercent(1), align: 'center', headerAlign: 'center', renderCell: (params) => <Button size="small" id={'zoomto' + params.value} style={{ cursor: 'pointer', minWidth: '25px' }} data={params.value} onClick={zoomtopolygon}><img width={25} height={25} src={'./viewpoint.svg'} /></Button>, },
        { field: 'LAND_TYPE', headerName: 'ประเภทเอกสาร', width: calcScreenWidthByPercent(12), align: 'center', headerAlign: 'center', },
        { field: 'PARCEL_NO', headerName: 'เลขที่', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        // { field: 'REFERENCE_NO', headerName: 'เลขทีอ้างอิง', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        // { field: 'AMPHUR_CODE', headerName: 'รหัส อำเภอ', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        { field: 'AMPHUR_NAME', headerName: 'อำเภอ', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        // { field: 'OPT_CODE', headerName: 'รหัส อปท/ตำบล', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        { field: 'OPT_NAME', headerName: 'เทศบาล/ตำบล', width: calcScreenWidthByPercent(15), align: 'center', headerAlign: 'center', },
        // { field: 'TYPE_CODE', headerName: 'ประเภท หน่วยที่ดิน', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'TYPE_NAME', headerName: 'ชื่อหน่วย', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'STREET_VALUE', headerName: 'ราคาประเมินหน่วยที่ดิน (บาท/ตร.ว.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'STREET_VALUE_', headerName: 'ราคาหน่วยที่ดินนอกเหนือ (บาท/ตร.ว.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'STANDARD_DEPTH', headerName: 'ความลึกมาตรฐาน (ม.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'DEPTH_R', headerName: 'ความลึกแปลง (ม.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'LAND_TYPE_NAME', headerName: 'ประเภทรูปร่างแปลง ที่ดิน', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'AREA', headerName: 'เนื้อที่ (ไร่-งาน-ตร.ว.)', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'VAL_PER_WAH', headerName: 'ราคา (บาท/ตร.ว.)', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'AMT_VALUE', headerName: 'ราคาทั้งแปลง (บาท)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'DATE_IMPORT', headerName: 'วันที่ยืนยันคำนวณราคา', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
    ];
    const columns4 = [
        { field: 'id', headerName: 'ลำดับ', width: calcScreenWidthByPercent(4), align: 'center', headerAlign: 'center', },
        { field: 'no', headerName: '', width: calcScreenWidthByPercent(1), align: 'center', headerAlign: 'center', renderCell: (params) => <Button size="small" id={'zoomto' + params.value} style={{ cursor: 'pointer', minWidth: '25px' }} data={params.value} onClick={zoomtopolygon}><img width={25} height={25} src={'./viewpoint.svg'} /></Button>, },
        { field: 'LAND_TYPE', headerName: 'ประเภทเอกสาร', width: calcScreenWidthByPercent(12), align: 'center', headerAlign: 'center', },
        { field: 'PARCEL_NO', headerName: 'เลขที่', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        // { field: 'REFERENCE_NO', headerName: 'เลขทีอ้างอิง', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        // { field: 'AMPHUR_CODE', headerName: 'รหัส อำเภอ', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        { field: 'AMPHUR_NAME', headerName: 'อำเภอ', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        // { field: 'OPT_CODE', headerName: 'รหัส อปท/ตำบล', width: calcScreenWidthByPercent(5), align: 'center', headerAlign: 'center', },
        { field: 'OPT_NAME', headerName: 'เทศบาล/ตำบล', width: calcScreenWidthByPercent(15), align: 'center', headerAlign: 'center', },
        // { field: 'TYPE_CODE', headerName: 'ประเภท หน่วยที่ดิน', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'TYPE_NAME', headerName: 'ชื่อหน่วย', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'STREET_VALUE', headerName: 'ราคาประเมินหน่วยที่ดิน (บาท/ตร.ว.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'STREET_VALUE_', headerName: 'ราคาหน่วยที่ดินนอกเหนือ (บาท/ตร.ว.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'STANDARD_DEPTH', headerName: 'ความลึกมาตรฐาน (ม.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'DEPTH_R', headerName: 'ความลึกแปลง (ม.)', type: 'number', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'LAND_TYPE_NAME', headerName: 'ประเภทรูปร่างแปลง ที่ดิน', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'AREA', headerName: 'เนื้อที่ (ไร่-งาน-ตร.ว.)', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'VAL_PER_WAH', headerName: 'ราคา (บาท/ตร.ว.)', width: calcScreenWidthByPercent(8), align: 'center', headerAlign: 'center', },
        { field: 'AMT_VALUE', headerName: 'ราคาทั้งแปลง (บาท)', type: 'number', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
        { field: 'DATE_IMPORT', headerName: 'วันที่ออกรายงาน', width: calcScreenWidthByPercent(10), align: 'center', headerAlign: 'center', },
    ];
    String.prototype.lpad = function (padString, length) {
        var str = this;
        while (str.length < length)
            str = padString + str;
        return str;
    }
    var datagridpoint = [];
    var points3 = [];
    const [pointdata2table, setpointdata2table] = useState('')
    const queryParameters = new URLSearchParams(window.location.search)
    const [pageSize, setPageSize] = useState(10);
    const [pageDoc, setpageDoc] = useState('https://www.google.com');
    const [selectionModel, setSelectionModel] = useState([]);
    var [selectionModel2, setSelectionModel2] = useState([]);
    var selectionModel3 = [];
    var [rows1, setrows1] = useState([]);
    var [columns, setcolumns] = useState(columns1);
    var [rowsold, setrowsold] = useState([]);
    var infoSeq = "";
    var userid = window.sessionStorage.getItem("userid");
    const d = new Date();
    const [infoSeqdel, setinfoSeqdel] = useState('');
    const [showfullscreen, setshowfullscreen] = useState(true);
    const [showMain, setShowMain] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlert1, setShowAlert1] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [showSearchData, setShowSearchData] = useState(false);
    const [showLDatatable, setShowDatatable] = useState(false);
    const [inboundary, setinboundary] = useState(0);
    const [outboundary, setoutboundary] = useState(0);
    const [userId, setuserId] = useState(window.sessionStorage.getItem("userid"));
    const [transaction, settransaction] = useState([]);
    const [steppoint, setsteppoint] = useState(1);
    const [tabletypeimport, settabletypeimport] = useState('');
    const [selectedReportType, setSelectedReportType] = React.useState('');
    const [selectedBoundary, setSelectedBoundary] = React.useState('');
    const [province, setProvince] = React.useState([]);
    const [selectedProvince, setSelectedProvince] = React.useState('');
    const [vselectedProvince, setvSelectedProvince] = React.useState('');
    const [aumpher, setAumpher] = React.useState([]);
    const [selectedAumpher, setSelectedAumpher] = React.useState('');
    const [labelMunicipal, setLabelMunicipal] = React.useState('-เลือกเทศบาล/ตำบล-');
    const [selType, setselType] = React.useState([]);
    const [selectedselType, setSelectedselType] = React.useState('');
    const [municipal, setMunicipal] = React.useState([]);
    const [selectedMunicipal, setSelectedMunicipal] = React.useState('');
    const [tumbol, setTumbol] = React.useState([]);
    const [selectedTumbol, setSelectedTumbol] = React.useState('');
    const [status, setStatus] = React.useState([]);
    const [selectedStatus, setSelectedStatus] = React.useState('');
    const [stateMunicipal, setStateMunicipal] = React.useState(false);
    const [stateTumbol, setStateTumbol] = React.useState(false);
    const [DateStart, setDateStart] = React.useState(dayjs(d.getFullYear() + '-' + (d.getMonth() + 1).toString().lpad('0', 2) + '-01'));
    const [DateEnd, setDateEnd] = React.useState(dayjs(d.getFullYear() + '-' + (d.getMonth() + 1).toString().lpad('0', 2) + '-' + d.getDate()));
    const [zone, setZone] = React.useState('');
    const [Tumbolname, setTumbolname] = useState('');
    const [totalcalc, settotalcalc] = useState(0);
    const [numcalc, setnumcalc] = useState(0);
    const [pointst1, setpointst1] = useState([]);
    const [pointst2, setpointst2] = useState([]);
    const [pointst3, setpointst3] = useState([]);
    const [dataReport, setDataReport] = useState([]);

    var transactionpush = [];
    function zoomtopolygon(event) {
        // console.log(event.target.parentElement.attributes['data'].value);
        event.stopPropagation()
        const zoomto = event.target.parentElement.attributes['data'].value;
        console.log(zoomto, 'zoomtopolygon');
        zoomtofeature(0);
        setTimeout(() => {
            zoomtofeature(zoomto);
        }, 100);
    }
    const deldata = () => {
        setrows1([])
    }
    function editDataPolygon(event) {
        event.stopPropagation()
        let seq = event.target.parentElement.attributes['data'].value;
        console.log(seq, 'editDataPolygon');
        let zone = queryParameters.get("z") + ""
        let type = document.getElementById('typeImport').value;
        let tabtype = document.getElementById('typetables').value;
        let tabletype = tabtype == '' ? 1 : Number(tabtype);
        let ss = queryParameters.get("ss");
        let tt = queryParameters.get("tt")
        let types = type == '' ? ss : type;
        console.log(seq, zone, types, tabletype, tt);
        setActiveCellId(Number(seq));
        if (tabletype === 1) {
            getPopupData(seq, zone, types);
        } else if (tabletype === 2) {
            console.log(seq, zone, types, 'yuyuy');
            getPopupData2(seq, zone, types, tt);
        }
        // if (tabletypeimport === 'polygon') {
        //     SelParcelSTS1ByParcelSeq(rowsold);
        // } else if (tabletypeimport === 'point') {
        //     SelPointSTS1ByParcelSeq(rowsold);
        // }

    }
    useEffect(() => {

        // console.log(reloadTb);
        if (rowsold.length > 0) {
            for (var x in rowsold) {
                if (rowsold[x] !== {}) {
                    points3.push(rowsold[x]);
                }
            }
        }
        points3.push(data2table)
        // console.log(queryParameters.get("ss"));
        if (queryParameters.get("ss") === null) {
            SelPointSTS1ByParcelSeq(points3);
        }
        // SelPointCalByParcelSeq(points3);
        setrowsold(points3)
    }, [data2table])
    useEffect(() => {
        var mousePosition;
        var offset = [0, 0];
        var div = document.getElementById('alertsearch1');
        var adiv = document.getElementById('alertsearch');
        var isDown = false;

        div.style.position = "absolute";
        div.style.left = "calc(50vw - 150px)";
        div.style.top = "calc(50vh - 100px)";
        div.addEventListener('mousedown', function (e) {
            isDown = true;
            offset = [
                div.offsetLeft - e.clientX,
                div.offsetTop - e.clientY
            ];
        }, true);
        var mousePosition1;
        var offset1 = [0, 0];
        var div1 = document.getElementById('alertconfirmcheck1');
        var adiv1 = document.getElementById('alertconfirmcheck');

        div1.style.position = "absolute";
        div1.style.left = "calc(50vw - 150px)";
        div1.style.top = "calc(50vh - 100px)";
        div1.addEventListener('mousedown', function (e) {
            isDown = true;
            offset1 = [
                div1.offsetLeft - e.clientX,
                div1.offsetTop - e.clientY
            ];
        }, true);
        var mousePosition2;
        var offset2 = [0, 0];
        var div2 = document.getElementById('alertconfirmlist1');
        var adiv2 = document.getElementById('alertconfirmlist');

        div2.style.position = "absolute";
        div2.style.left = "calc(50vw - 150px)";
        div2.style.top = "calc(50vh - 100px)";
        div2.addEventListener('mousedown', function (e) {
            isDown = true;
            offset2 = [
                div2.offsetLeft - e.clientX,
                div2.offsetTop - e.clientY
            ];
        }, true);
        var mousePosition3;
        var offset3 = [0, 0];
        var div3 = document.getElementById('alertselectlist1');
        var adiv3 = document.getElementById('alertselectlist');

        div3.style.position = "absolute";
        div3.style.left = "calc(50vw - 150px)";
        div3.style.top = "calc(50vh - 100px)";
        div3.addEventListener('mousedown', function (e) {
            isDown = true;
            offset3 = [
                div3.offsetLeft - e.clientX,
                div3.offsetTop - e.clientY
            ];
        }, true);
        var mousePosition4;
        var offset4 = [0, 0];
        var div4 = document.getElementById('alertcompleatrel1');
        var adiv4 = document.getElementById('alertcompleatrel');

        div4.style.position = "absolute";
        div4.style.left = "calc(50vw - 150px)";
        div4.style.top = "calc(50vh - 100px)";
        div4.addEventListener('mousedown', function (e) {
            isDown = true;
            offset4 = [
                div4.offsetLeft - e.clientX,
                div4.offsetTop - e.clientY
            ];
        }, true);
        var mousePosition5;
        var offset5 = [0, 0];
        var div5 = document.getElementById('alertconfirm1');
        var adiv5 = document.getElementById('alertconfirm');

        div5.style.position = "absolute";
        div5.style.left = "calc(50vw - 150px)";
        div5.style.top = "calc(50vh - 100px)";
        div5.addEventListener('mousedown', function (e) {
            isDown = true;
            offset5 = [
                div5.offsetLeft - e.clientX,
                div5.offsetTop - e.clientY
            ];
        }, true);
        var mousePosition6;
        var offset6 = [0, 0];
        var div6 = document.getElementById('alertcal1');
        var adiv6 = document.getElementById('alertcal');

        div6.style.position = "absolute";
        div6.style.left = "calc(50vw - 150px)";
        div6.style.top = "calc(50vh - 100px)";
        div6.addEventListener('mousedown', function (e) {
            isDown = true;
            offset6 = [
                div6.offsetLeft - e.clientX,
                div6.offsetTop - e.clientY
            ];
        }, true);
        var mousePosition7;
        var offset7 = [0, 0];
        var div7 = document.getElementById('loadingprogress1');
        var adiv7 = document.getElementById('loadingprogress');

        div7.style.position = "absolute";
        div7.style.left = "calc(50vw - 150px)";
        div7.style.top = "calc(50vh - 100px)";
        div7.addEventListener('mousedown', function (e) {
            isDown = true;
            offset7 = [
                div7.offsetLeft - e.clientX,
                div7.offsetTop - e.clientY
            ];
        }, true);
        var mousePosition8;
        var offset8 = [0, 0];
        var div8 = document.getElementById('loadingpopup1');
        var adiv8 = document.getElementById('loadingpopup');

        div8.style.position = "absolute";
        div8.style.left = "calc(50vw - 200px)";
        div8.style.top = "calc(50vh - 100px)";
        div8.addEventListener('mousedown', function (e) {
            isDown = true;
            offset8 = [
                div8.offsetLeft - e.clientX,
                div8.offsetTop - e.clientY
            ];
        }, true);
        document.addEventListener('mouseup', function () {
            isDown = false;
        }, true);

        document.addEventListener('mousemove', function (event) {
            event.preventDefault();
            if (adiv1.style.display !== 'none') {
                if (isDown) {
                    mousePosition1 = {
                        x: event.clientX,
                        y: event.clientY
                    };
                    div1.style.left = (mousePosition1.x + offset1[0]) + 'px';
                    div1.style.top = (mousePosition1.y + offset1[1]) + 'px';
                }
            } else if (adiv.style.display !== 'none') {
                if (isDown) {
                    mousePosition = {
                        x: event.clientX,
                        y: event.clientY
                    };
                    div.style.left = (mousePosition.x + offset[0]) + 'px';
                    div.style.top = (mousePosition.y + offset[1]) + 'px';
                }
            } else if (adiv2.style.display !== 'none') {
                if (isDown) {
                    mousePosition2 = {
                        x: event.clientX,
                        y: event.clientY
                    };
                    div2.style.left = (mousePosition2.x + offset2[0]) + 'px';
                    div2.style.top = (mousePosition2.y + offset2[1]) + 'px';
                }
            } else if (adiv3.style.display !== 'none') {
                if (isDown) {
                    mousePosition3 = {
                        x: event.clientX,
                        y: event.clientY
                    };
                    div3.style.left = (mousePosition3.x + offset3[0]) + 'px';
                    div3.style.top = (mousePosition3.y + offset3[1]) + 'px';
                }
            } else if (adiv4.style.display !== 'none') {
                if (isDown) {
                    mousePosition4 = {
                        x: event.clientX,
                        y: event.clientY
                    };
                    div4.style.left = (mousePosition4.x + offset4[0]) + 'px';
                    div4.style.top = (mousePosition4.y + offset4[1]) + 'px';
                }
            } else if (adiv5.style.display !== 'none') {
                if (isDown) {
                    mousePosition5 = {
                        x: event.clientX,
                        y: event.clientY
                    };
                    div5.style.left = (mousePosition5.x + offset5[0]) + 'px';
                    div5.style.top = (mousePosition5.y + offset5[1]) + 'px';
                }
            } else if (adiv6.style.display !== 'none') {
                if (isDown) {
                    mousePosition6 = {
                        x: event.clientX,
                        y: event.clientY
                    };
                    div6.style.left = (mousePosition6.x + offset6[0]) + 'px';
                    div6.style.top = (mousePosition6.y + offset6[1]) + 'px';
                }
            } else if (adiv7.style.display !== 'none') {
                if (isDown) {
                    mousePosition7 = {
                        x: event.clientX,
                        y: event.clientY
                    };
                    div7.style.left = (mousePosition7.x + offset7[0]) + 'px';
                    div7.style.top = (mousePosition7.y + offset7[1]) + 'px';
                }
            } else if (adiv8.style.display !== 'none') {
                if (isDown) {
                    mousePosition8 = {
                        x: event.clientX,
                        y: event.clientY
                    };
                    div8.style.left = (mousePosition8.x + offset8[0]) + 'px';
                    div8.style.top = (mousePosition8.y + offset8[1]) + 'px';
                }
            }
        }, true);
    }, []);
    useEffect(() => {
        if (tabletypeimport == 'point') {
            if (steppoint === 1) {
                SelPointSTS1ByParcelSeq(rowsold);
            } else if (steppoint === 2) {
                SelPointCalByParcelSeq(rowsold);
            }
        } else if (tabletypeimport == 'polygon') {
            if (steppoint === 1) {
                SelParcelSTS1ByParcelSeq(rowsold);
            } else if (steppoint === 2) {
                SelParcelSTS2ByParcelSeq(rowsold);
            }
        }
        if (tabletypeimport == 'polygon') {
            var div1 = document.getElementById('loadingprogress1');
            div1.style.left = "calc(50vw - 150px)";
            div1.style.top = "calc(50vh - 100px)";
            var div2 = document.getElementById('loadingprogress');
            div2.style.display = 'flex';
            if (steppoint === 1) {
                selParcelroload();
            } else if (steppoint === 2) {
                // console.log(rowsold);
                SelParcelSTS2ByParcelSeqTable(rowsold);
            } else if (steppoint === 3) {
                SelParcelSTS3ByParcelSeqTable(rowsold);
            }
            document.getElementById('alertcompleatrel').style.display = 'none';

        }
        // handlereloadTable();
    }, [reloadTb])
    async function SelPointCalByParcelSeq(points2) {
        var i = 1;
        var dttomap = [];
        for (var y in points2) {
            if (points2[y] !== {}) {
                var row = JSON.stringify({
                    "PARCEL_S3_SEQ": points2[y] + "",
                    "ZONE": queryParameters.get("z") + ""
                });
                dttomap.push(points2[y]);
                const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/SelPointSTS2ByParcelSeq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: row
                });
                const response = await res.json();
                if (response.status === "200") {
                    var result = response.result
                    // console.log(result);
                    if (result.length !== 0) {
                        datagridpoint.push({
                            id: i,
                            no: result[0].PARCEL_S3_SEQ,
                            EDIT_NO: result[0].PARCEL_S3_SEQ,
                            LAND_TYPE: ((result[0].LAND_TYPE == 'อื่นๆ') ? result[0].REMARK : result[0].LAND_TYPE),
                            PARCEL_NO: result[0].PARCEL_ID,
                            AMPHUR_CODE: result[0].AMPHUR_CODE,
                            AMPHUR_NAME: result[0].AMPHUR_NAME_TH,
                            OPT_CODE: result[0].OPT_CODE,
                            OPT_NAME: result[0].OPT_NAME,
                            TYPE_CODE: result[0].TYPE_CODE,
                            TYPE_NAME: result[0].STREET_NAME,
                            STREET_VALUE: result[0].ST_VALUE,
                            STREET_VALUE_: result[0].STREET_VALUE_,
                            STANDARD_DEPTH: result[0].STANDARD_DEPTH,
                            DEPTH_R: result[0].DEPTH_R,
                            LAND_TYPE_NAME: result[0].LAND_TYPE_NAME,
                            AREA: result[0].NRAI + "-" + result[0].NNHAN + "-" + parseFloat(result[0].NWAH).toFixed(1),
                            VAL_PER_WAH: ((result[0].VAL_PER_WAH === null) ? result[0].VAL_PER_WAH : numberWithCommas(result[0].VAL_PER_WAH)),
                            // VAL_PER_WAH: null,
                            AMT_VALUE: result[0].VALAREA,
                            DATE_IMPORT: dateFormatTime(result[0].DATE_CREATED),
                            REMARK: result[0].REMARK,
                            REFERENCE_NO: result[0].REFERENCE_NO

                        })
                        i++;
                    }
                }

            }
        }

        if (queryParameters.get("ss") === '2') {
            infoSeqimpcal(dttomap);
        }
        const steppoint2 = document.getElementById('steppoint2');
        const steppoint3 = document.getElementById('steppoint3');
        const steppoint4 = document.getElementById('steppoint4');

        steppoint3.disabled = false
        steppoint3.classList.remove("Mui-disabled")
        steppoint3.style.display = 'none';
        steppoint3.disabled = true;
        steppoint3.classList.remove("Mui-disabled")
        steppoint4.disabled = false
        steppoint4.classList.remove("Mui-disabled")
        steppoint4.style.display = 'inline-flex';
        // steppoint3.addEventListener('click', approve);

        steppoint2.disabled = true
        steppoint2.classList.add("Mui-disabled")
        if (steppoint === 1) {
            var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
            // console.log(obj);
            obj.scroll({ left: 0 })
            var checkboxes = document.querySelectorAll('input[type=checkbox]')
            checkboxes[0].click();
        }

        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(el);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + ((result.length === undefined) ? i - 1 : i - 1 + ' รายการ')
        el.prepend(div);
        setTimeout(() => {
            setcolumns(columns2)
            setrows1(datagridpoint)
            unclickImpdetail();
            document.getElementById('loadingpopup').style.display = 'none';
        }, 100);
        point2map(points2)
        var div1 = document.getElementById('alertcompleatrel3');
        div1.style.left = "calc(50vw - 150px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('alertcompleatrel2');
        div2.style.display = 'flex';
        // caldetailClick();

        // console.log("selected :" + selectionModel);

    }

    async function SelPointSTS1ByParcelSeq(points3) {
        var i = 1;
        var datagridpointp1 = [];
        var datapoint = [0];
        for (var y in points3) {
            if (points3[y] !== {}) {
                var row = JSON.stringify({
                    "PARCEL_S3_SEQ": points3[y] + "",
                    "ZONE": queryParameters.get("z") + ""
                });
                const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/SelPointSTS1ByParcelSeq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: row
                });
                const response = await res.json();
                if (response.status === "200") {
                    var result = response.result
                    // console.log(result);
                    if (result.length !== 0) {
                        datapoint.push(result[0].PARCEL_S3_SEQ);
                        datagridpointp1.push({
                            id: i,
                            no: result[0].PARCEL_S3_SEQ,
                            EDIT_NO: result[0].PARCEL_S3_SEQ,
                            LAND_TYPE: ((result[0].LAND_TYPE == 'อื่นๆ') ? result[0].REMARK : result[0].LAND_TYPE),
                            PARCEL_NO: result[0].PARCEL_ID,
                            AMPHUR_CODE: result[0].AMPHUR_CODE,
                            AMPHUR_NAME: result[0].AMPHUR_NAME_TH,
                            OPT_CODE: result[0].OPT_CODE,
                            OPT_NAME: result[0].OPT_NAME,
                            TYPE_CODE: result[0].TYPE_CODE,
                            TYPE_NAME: result[0].STREET_NAME,
                            STREET_VALUE: result[0].ST_VALUE,
                            STREET_VALUE_: result[0].STREET_VALUE_,
                            STANDARD_DEPTH: result[0].STANDARD_DEPTH,
                            DEPTH_R: result[0].DEPTH_R,
                            LAND_TYPE_NAME: result[0].LAND_TYPE_NAME,
                            AREA: result[0].NRAI + "-" + result[0].NNHAN + "-" + parseFloat(result[0].NWAH).toFixed(1),
                            VAL_PER_WAH: ((result[0].VAL_PER_WAH === null) ? result[0].VAL_PER_WAH : numberWithCommas(result[0].VAL_PER_WAH)),
                            // VAL_PER_WAH: null,
                            AMT_VALUE: result[0].VALAREA,
                            DATE_IMPORT: dateFormatTime(result[0].DATE_CREATED),
                            REMARK: result[0].REMARK,
                            REFERENCE_NO: result[0].REFERENCE_NO

                        })

                        i++;
                    }
                }

            }

        }
        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(el);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + ((result === undefined) ? i - 1 + ' รายการ' : i - 1 + ' รายการ')
        if (result !== undefined) {
            el.prepend(div);
        }
        setrows1(datagridpointp1)
        unclickImpdetail();
        // if (queryParameters.get("ss") != null) {
        zoomtofeature(0);
        infoSeqimpcal(datapoint);
        // }
        setTimeout(() => {
            document.getElementById('loadingprogress').style.display = 'none';
        }, 1000);
    }
    async function SelPointSTS2ByParcelSeq(points3) {
        var i = 1;
        var datagridpointp2 = [];
        var datapoint = [0];
        for (var y in points3) {
            if (points3[y] !== {}) {
                var row = JSON.stringify({
                    "PARCEL_S3_SEQ": points3[y] + "",
                    "ZONE": queryParameters.get("z") + ""
                });
                const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/SelPointSTS2ByParcelSeq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: row
                });
                const response = await res.json();
                if (response.status === "200") {
                    var result = response.result
                    // console.log(result);
                    if (result.length !== 0) {
                        datapoint.push(result[0].PARCEL_S3_SEQ);
                        datagridpointp2.push({
                            id: i,
                            no: result[0].PARCEL_S3_SEQ,
                            EDIT_NO: result[0].PARCEL_S3_SEQ,
                            LAND_TYPE: ((result[0].LAND_TYPE == 'อื่นๆ') ? result[0].REMARK : result[0].LAND_TYPE),
                            PARCEL_NO: result[0].PARCEL_ID,
                            AMPHUR_CODE: result[0].AMPHUR_CODE,
                            AMPHUR_NAME: result[0].AMPHUR_NAME_TH,
                            OPT_CODE: result[0].OPT_CODE,
                            OPT_NAME: result[0].OPT_NAME,
                            TYPE_CODE: result[0].TYPE_CODE,
                            TYPE_NAME: result[0].STREET_NAME,
                            STREET_VALUE: result[0].ST_VALUE,
                            STREET_VALUE_: result[0].STREET_VALUE_,
                            STANDARD_DEPTH: result[0].STANDARD_DEPTH,
                            DEPTH_R: result[0].DEPTH_R,
                            LAND_TYPE_NAME: result[0].LAND_TYPE_NAME,
                            AREA: result[0].NRAI + "-" + result[0].NNHAN + "-" + parseFloat(result[0].NWAH).toFixed(1),
                            VAL_PER_WAH: ((result[0].VAL_PER_WAH === null) ? result[0].VAL_PER_WAH : numberWithCommas(result[0].VAL_PER_WAH)),
                            // VAL_PER_WAH: null,
                            AMT_VALUE: result[0].VALAREA,
                            DATE_IMPORT: dateFormatTime(result[0].DATE_CREATED),
                            REMARK: result[0].REMARK,
                            REFERENCE_NO: result[0].REFERENCE_NO

                        })
                        i++;
                    }
                }

            }

        }
        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(el);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + ((result === undefined) ? i - 1 + ' รายการ' : i - 1 + ' รายการ')
        if (result !== undefined) {
            el.prepend(div);
        }
        setrows1(datagridpointp2)
        unclickImpdetail();
        // if (queryParameters.get("ss") != null) {
        zoomtofeature(0);
        infoSeqimpcal(datapoint);
        // }
        setTimeout(() => {
            document.getElementById('loadingprogress').style.display = 'none';
        }, 1000);
    }
    async function SelParcelSTS1ByParcelSeq(points3) {
        var datacalc = [0];
        let datagridpoint = [];
        var i = 1;
        for (var y in points3) {
            if (points3[y] !== {}) {
                var row = JSON.stringify({
                    "PARCEL_S3_SEQ": points3[y] + "",
                    "ZONE": queryParameters.get("z") + ""
                });
                const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelSTS1ByParcelSeq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: row
                });
                const response = await res.json();
                if (response.status === "200") {
                    var result = response.result
                    // console.log(result);
                    if (result.length !== 0) {
                        datacalc.push(result[0].PARCEL_S3_SEQ);
                        let dataset = {
                            id: i,
                            no: result[0].PARCEL_S3_SEQ,
                            EDIT_NO: result[0].PARCEL_S3_SEQ,
                            LAND_TYPE: result[0].LAND_TYPE,
                            PARCEL_NO: result[0].PARCEL_ID,
                            AMPHUR_CODE: result[0].AMPHUR_CODE,
                            AMPHUR_NAME: result[0].AMPHUR_NAME_TH,
                            OPT_CODE: result[0].OPT_CODE,
                            OPT_NAME: result[0].OPT_NAME,
                            TYPE_CODE: result[0].TYPE_CODE,
                            TYPE_NAME: result[0].STREET_NAME,
                            STREET_VALUE: result[0].ST_VALUE,
                            STREET_VALUE_: result[0].STREET_VALUE_,
                            STANDARD_DEPTH: result[0].STANDARD_DEPTH,
                            DEPTH_R: result[0].DEPTH_R,
                            LAND_TYPE_NAME: result[0].LAND_TYPE_NAME,
                            AREA: result[0].NRAI + "-" + result[0].NNHAN + "-" + parseFloat(result[0].NWAH).toFixed(1),
                            VAL_PER_WAH: ((result[0].VAL_PER_WAH === null) ? result[0].VAL_PER_WAH : numberWithCommas(result[0].VAL_PER_WAH)),
                            // VAL_PER_WAH: null,
                            AMT_VALUE: result[0].VALAREA,
                            DATE_IMPORT: dateFormatTime(result[0].DATE_CREATED),
                        }
                        i++;
                        datagridpoint.push(dataset)
                    }
                }

            }

        }
        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(el);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + ((result === undefined) ? i - 1 : i - 1 + ' รายการ')
        if (result !== undefined) {
            el.prepend(div);
        }
        console.log(datagridpoint, 'datagridpoint');
        point2map(points3)
        // steppoint2map(2)
        setrows1(datagridpoint)
        // selParcelroload();
        unclickImpdetail();
        // var infoall = '';
        // rowsold.forEach(function (i, item) {
        //     if (item[i] !== {}) {
        //         if (i < rowsold.length - 1) {
        //             infoall += item[i] + ',';
        //         } else {
        //             infoall += item[i];
        //         }
        //     }
        // })

        zoomtofeature(0);
        infoSeqimpcal(datacalc);
        setTimeout(() => {
            document.getElementById('loadingprogress').style.display = 'none';
        }, 1000);

    }
    async function SelParcelSTS2ByParcelSeq(points2) {
        var datagridpoint2 = [];
        var datacalc = [0];
        var i = 1;
        for (var y in points2) {
            if (points2[y] !== {}) {
                var row = JSON.stringify({
                    "PARCEL_S3_SEQ": points2[y] + "",
                    "ZONE": queryParameters.get("z") + ""
                });
                const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelSTS2ByParcelSeq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: row
                });
                const response = await res.json();
                if (response.status === "200") {
                    var result = response.result
                    // console.log(result);
                    if (result.length != 0) {
                        datacalc.push(result[0].PARCEL_S3_SEQ);
                        datagridpoint2.push({
                            id: i,
                            no: result[0].PARCEL_S3_SEQ,
                            EDIT_NO: result[0].PARCEL_S3_SEQ,
                            CHANGWAT_CODE: result[0].CHANGWAT_CODE,
                            LAND_TYPE: result[0].LAND_TYPE,
                            PARCEL_NO: result[0].PARCEL_ID,
                            AMPHUR_CODE: result[0].AMPHUR_CODE,
                            AMPHUR_NAME: result[0].AMPHUR_NAME_TH,
                            OPT_CODE: result[0].OPT_CODE,
                            OPT_NAME: result[0].OPT_NAME,
                            OPT_TYPE: result[0].OPT_TYPE,
                            TYPE_CODE: result[0].TYPE_CODE,
                            TYPE_NAME: result[0].STREET_NAME,
                            STREET_VALUE: result[0].ST_VALUE,
                            STREET_VALUE_: result[0].STREET_VALUE_,
                            STANDARD_DEPTH: result[0].STANDARD_DEPTH,
                            DEPTH_R: result[0].DEPTH_R,
                            LAND_TYPE_NAME: result[0].LAND_TYPE_NAME,
                            NRAI: result[0].NRAI,
                            NNHAN: result[0].NNHAN,
                            NWAH: result[0].NWAH,
                            PARCEL_SHAPE: result[0].PARCEL_SHAPE,
                            VAL_PER_WAH_: result[0].VAL_PER_WAH,
                            AREA: result[0].NRAI + "-" + result[0].NNHAN + "-" + parseFloat(result[0].NWAH).toFixed(1),
                            VAL_PER_WAH: ((result[0].VAL_PER_WAH === null) ? result[0].VAL_PER_WAH : numberWithCommas(result[0].VAL_PER_WAH)),
                            // VAL_PER_WAH: null,
                            AMT_VALUE: result[0].VALAREA,
                            DATE_IMPORT: dateFormatTime(result[0].DATE_CREATED),

                        })
                        i++;
                    }
                }

            }
        }
        const steppoint2 = document.getElementById('steppoint2');
        const steppoint3 = document.getElementById('steppoint3');
        const steppoint4 = document.getElementById('steppoint4');

        steppoint3.disabled = false
        steppoint3.classList.remove("Mui-disabled")
        steppoint3.style.display = 'none';
        steppoint4.disabled = false
        steppoint4.classList.remove("Mui-disabled")
        steppoint4.style.display = 'inline-flex';
        // steppoint3.addEventListener('click', approve);

        steppoint2.disabled = true
        steppoint2.classList.add("Mui-disabled")
        if (steppoint === 1) {
            var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
            // console.log(obj);
            obj.scroll({ left: 0 })
            var checkboxes = document.querySelectorAll('input[type=checkbox]')
            checkboxes[0].click();
        }

        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(el);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + ((datagridpoint.length === 0) ? i - 1 + ' รายการ' : i - 1 + ' รายการ')
        el.prepend(div);
        setTimeout(() => {
            setcolumns(columns2)
            setrows1(datagridpoint2)
            unclickImpdetail();
            document.getElementById('loadingpopup').style.display = 'none';
        }, 100);
        zoomtofeature(0);
        infoSeqimpcal(datacalc);
        point2map(points2)
        setTimeout(() => {
            document.getElementById('loadingprogress').style.display = 'none';
        }, 1000);
        // console.log("selected :" + selectionModel);

    }
    async function SelParcelSTS2ByParcelSeqTable(points2) {
        var datagridpointp2t = [];
        var datacalc = [0];
        var i = 1;
        for (var y in points2) {
            if (points2[y] !== {}) {
                var row = JSON.stringify({
                    "PARCEL_S3_SEQ": points2[y] + "",
                    "ZONE": queryParameters.get("z") + ""
                });
                const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelSTS2ByParcelSeq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: row
                });
                const response = await res.json();
                if (response.status === "200") {
                    var result = response.result
                    // console.log(result);
                    if (result.length != 0) {
                        datacalc.push(result[0].PARCEL_S3_SEQ);
                        datagridpointp2t.push({
                            id: i,
                            no: result[0].PARCEL_S3_SEQ,
                            EDIT_NO: result[0].PARCEL_S3_SEQ,
                            LAND_TYPE: result[0].LAND_TYPE,
                            PARCEL_NO: result[0].PARCEL_ID,
                            AMPHUR_CODE: result[0].AMPHUR_CODE,
                            AMPHUR_NAME: result[0].AMPHUR_NAME_TH,
                            OPT_CODE: result[0].OPT_CODE,
                            OPT_NAME: result[0].OPT_NAME,
                            TYPE_CODE: result[0].TYPE_CODE,
                            TYPE_NAME: result[0].STREET_NAME,
                            STREET_VALUE: result[0].ST_VALUE,
                            STREET_VALUE_: result[0].STREET_VALUE_,
                            STANDARD_DEPTH: result[0].STANDARD_DEPTH,
                            DEPTH_R: result[0].DEPTH_R,
                            LAND_TYPE_NAME: result[0].LAND_TYPE_NAME,
                            AREA: result[0].NRAI + "-" + result[0].NNHAN + "-" + parseFloat(result[0].NWAH).toFixed(1),
                            VAL_PER_WAH: ((result[0].VAL_PER_WAH === null) ? result[0].VAL_PER_WAH : numberWithCommas(result[0].VAL_PER_WAH)),
                            // VAL_PER_WAH: null,
                            AMT_VALUE: result[0].VALAREA,
                            DATE_IMPORT: dateFormatTime(result[0].DATE_CREATED),

                        })
                        i++;
                    }
                }

            }
        }
        const steppoint2 = document.getElementById('steppoint2');
        const steppoint3 = document.getElementById('steppoint3');
        const steppoint4 = document.getElementById('steppoint4');

        steppoint3.disabled = false
        steppoint3.classList.remove("Mui-disabled")
        steppoint3.style.display = 'none';
        steppoint4.disabled = false
        steppoint4.classList.remove("Mui-disabled")
        steppoint4.style.display = 'inline-flex';
        // steppoint3.addEventListener('click', approve);

        steppoint2.disabled = true
        steppoint2.classList.add("Mui-disabled")
        if (steppoint === 1) {
            var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
            // console.log(obj);
            obj.scroll({ left: 0 })
            var checkboxes = document.querySelectorAll('input[type=checkbox]')
            checkboxes[0].click();
        }

        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(el);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + ((datagridpointp2t.length === 0) ? i - 1 + ' รายการ' : i - 1 + ' รายการ')
        el.prepend(div);
        setTimeout(() => {
            setcolumns(columns2)
            setrows1(datagridpointp2t)
            unclickImpdetail();
            document.getElementById('loadingpopup').style.display = 'none';
        }, 100);
        setTimeout(() => {
            document.getElementById('loadingprogress').style.display = 'none';
        }, 1000);
        // console.log("selected :" + selectionModel);

    }
    async function SelParcelSTS3ByParcelSeq(points3) {
        var datacalc = [0];
        var i = 1;
        datagridpoint = [];
        for (var y in points3) {
            if (points3[y] !== {}) {
                var row = JSON.stringify({
                    "PARCEL_S3_SEQ": points3[y] + "",
                    "ZONE": queryParameters.get("z") + ""
                });
                // console.log(row, 'row');
                const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelSTS3ByParcelSeq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: row
                });
                const response = await res.json();
                if (response.status === "200") {
                    var result = response.result;
                    console.log('result', result);
                    if (result.length !== 0) {
                        datacalc.push(result[0].PARCEL_S3_SEQ);
                        datagridpoint.push({
                            id: i,
                            no: result[0].PARCEL_S3_SEQ,
                            CHANGWAT_CODE: result[0].CHANGWAT_CODE,
                            LAND_TYPE: result[0].LAND_TYPE,
                            PARCEL_NO: result[0].PARCEL_ID,
                            AMPHUR_CODE: result[0].AMPHUR_CODE,
                            AMPHUR_NAME: result[0].AMPHUR_NAME_TH,
                            OPT_CODE: result[0].OPT_CODE,
                            OPT_NAME: result[0].OPT_NAME,
                            OPT_TYPE: result[0].OPT_TYPE,
                            TYPE_CODE: result[0].TYPE_CODE,
                            TYPE_NAME: result[0].STREET_NAME,
                            STREET_VALUE: result[0].ST_VALUE,
                            STREET_VALUE_: result[0].STREET_VALUE_,
                            STANDARD_DEPTH: result[0].STANDARD_DEPTH,
                            PARCEL_SHAPE: result[0].PARCEL_SHAPE,
                            DEPTH_R: result[0].DEPTH_R,
                            NNHAN: result[0].NNHAN,
                            NRAI: result[0].NRAI,
                            NWAH: result[0].NWAH,
                            LAND_TYPE_NAME: result[0].LAND_TYPE_NAME,
                            VAL_PER_WAH_: result[0].VAL_PER_WAH,
                            AREA: result[0].NRAI + "-" + result[0].NNHAN + "-" + parseFloat(result[0].NWAH).toFixed(1),
                            VAL_PER_WAH: ((result[0].VAL_PER_WAH === null) ? result[0].VAL_PER_WAH : numberWithCommas(result[0].VAL_PER_WAH)),
                            // VAL_PER_WAH: null,
                            AMT_VALUE: result[0].VALAREA,
                            DATE_IMPORT: dateFormatTime(result[0].DATE_CREATED),

                        })
                        i++;
                    }
                }

            }

        }
        var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
        // console.log(obj);
        obj.scroll({ left: 0 })
        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(el);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + ((result.length === undefined) ? i - 1 : i - 1 + ' รายการ')
        el.prepend(div);
        setTimeout(() => {
            // var checkboxes = document.querySelectorAll('input[type=checkbox]')
            // checkboxes[0].click()
            zoomtofeature(0);
            infoSeqimpcal(datacalc);
            point2map(points3)
            setrows1(datagridpoint)
            unclickImpdetail();
            setTimeout(() => {
                document.getElementById('loadingprogress').style.display = 'none';
            }, 1000);

            const steppoint1 = document.getElementById('steppoint1');
            const steppoint5 = document.getElementById('steppoint5');
            steppoint1.disabled = false
            steppoint1.classList.remove("Mui-disabled")
            steppoint5.disabled = false
            steppoint5.classList.remove("Mui-disabled")
            const steppoint3 = document.getElementById('steppoint3');
            steppoint3.disabled = true
            steppoint3.classList.add("Mui-disabled")
        }, 100);

    }
    async function SelParcelSTS3ByParcelSeqTable(points3) {
        var datacalc = [0];
        var i = 1;
        datagridpoint = [];
        for (var y in points3) {
            if (points3[y] !== {}) {
                var row = JSON.stringify({
                    "PARCEL_S3_SEQ": points3[y] + "",
                    "ZONE": queryParameters.get("z") + ""
                });
                const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelSTS3ByParcelSeq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: row
                });
                const response = await res.json();
                if (response.status === "200") {
                    var result = response.result
                    // console.log(result);
                    if (result.length !== 0) {
                        datacalc.push(result[0].PARCEL_S3_SEQ);
                        datagridpoint.push({
                            id: i,
                            no: result[0].PARCEL_S3_SEQ,
                            LAND_TYPE: result[0].LAND_TYPE,
                            PARCEL_NO: result[0].PARCEL_ID,
                            AMPHUR_CODE: result[0].AMPHUR_CODE,
                            AMPHUR_NAME: result[0].AMPHUR_NAME_TH,
                            OPT_CODE: result[0].OPT_CODE,
                            OPT_NAME: result[0].OPT_NAME,
                            TYPE_CODE: result[0].TYPE_CODE,
                            TYPE_NAME: result[0].STREET_NAME,
                            STREET_VALUE: result[0].ST_VALUE,
                            STREET_VALUE_: result[0].STREET_VALUE_,
                            STANDARD_DEPTH: result[0].STANDARD_DEPTH,
                            DEPTH_R: result[0].DEPTH_R,
                            LAND_TYPE_NAME: result[0].LAND_TYPE_NAME,
                            AREA: result[0].NRAI + "-" + result[0].NNHAN + "-" + parseFloat(result[0].NWAH).toFixed(1),
                            VAL_PER_WAH: ((result[0].VAL_PER_WAH === null) ? result[0].VAL_PER_WAH : numberWithCommas(result[0].VAL_PER_WAH)),
                            // VAL_PER_WAH: null,
                            AMT_VALUE: result[0].VALAREA,
                            DATE_IMPORT: dateFormatTime(result[0].DATE_CREATED),

                        })
                        i++;
                    }
                }

            }

        }
        var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
        // console.log(obj);
        obj.scroll({ left: 0 })
        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(el);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + ((result.length === undefined) ? i - 1 : i - 1 + ' รายการ')
        el.prepend(div);
        setTimeout(() => {
            // var checkboxes = document.querySelectorAll('input[type=checkbox]')
            // checkboxes[0].click()
            setrows1(datagridpoint)
            unclickImpdetail();
            setTimeout(() => {
                document.getElementById('loadingprogress').style.display = 'none';
            }, 1000);

            const steppoint1 = document.getElementById('steppoint1');
            steppoint1.disabled = true
            steppoint1.classList.add("Mui-disabled")
            const steppoint3 = document.getElementById('steppoint3');
            steppoint3.disabled = true
            steppoint3.classList.add("Mui-disabled")
        }, 100);

    }
    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    const SearchStyle0 = {
        display: showMain ? 'block' : 'none',
    };
    const SearchStyle1 = {
        display: showAlert ? 'block' : 'none',
    };
    const SearchStyle11 = {
        display: showAlert1 ? 'block' : 'none',
    };
    const SearchStyle2 = {
        display: showImport ? 'block' : 'none',
    };
    const SearchStyle3 = {
        display: showLoading ? 'block' : 'none',
    };
    const SearchStyle4 = {
        display: showLDatatable ? 'block' : 'none',
    };
    const SearchStyle5 = {
        display: showSearchData ? 'block' : 'none',
    };
    const handleClick1 = () => {
        if (queryParameters.get("p") == '' || queryParameters.get("a") == '' || queryParameters.get("t") == '' || queryParameters.get("z") == '' || queryParameters.get("tt") == '') {
            alert('กรุณาค้นหาขอบเขตก่อนการนำเข้า');
            window.location.href = '/';
        } else {
            setShowMain(false)
            setShowAlert(true)
            settabletypeimport('polygon');
            typeimport('polygon')
            document.getElementById('typeImport').value = '1';
        }
    }
    const handleClick11 = () => {
        if (queryParameters.get("p") == '' || queryParameters.get("a") == '' || queryParameters.get("t") == '' || queryParameters.get("z") == '' || queryParameters.get("tt") == '') {
            alert('กรุณาค้นหาขอบเขตก่อนการนำเข้า');
            window.location.href = '/';
        } else {
            setShowMain(false)
            setShowAlert1(true)
            settabletypeimport('point');
            typeimport('point')
            document.getElementById('typeImport').value = '2';
        }
    }
    const handleClick111 = () => {
        setShowMain(false)
        setShowSearchData(true)
        settabletypeimport('search');
        typeimport('search')
    }
    const handleClick2 = () => {
        setShowAlert(false)
        setShowImport(true)
    }
    const handleClick12 = () => {
        setShowAlert1(false)
        setShowDatatable(true)
    }
    const handleChose = () => {
        document.getElementById('fileChoseinput').click()
    }
    const handleClick3 = () => {
        setShowImport(false)
        setShowLoading(true)
    }
    const handleClick4 = () => {
        setShowLoading(false)
        setShowDatatable(true)
        impdetailClick();
    }
    const handleFullscreen = () => {
        setshowfullscreen(!showfullscreen)
        fullscreen({ showfullscreen })

    }
    var errorCount = 0;
    var successCount = 0;

    const deletePropertiesPolygon = async () => {
        var row = JSON.stringify({
            "INFO_SEQ": infoSeqdel + "",
            "ZONE": queryParameters.get("z") + ""
        });
        // console.log(infoSeqdel);
        const res = await fetch(process.env.REACT_APP_HOST_API + "/IMPORT/Del_ParcelByInfoSeq", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: row,
            redirect: 'follow'
        })
        const response = await res.json();
        if (response.status === "200") {
            window.location.reload();
        } else {

        }
    }
    const selParcel = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const res = await fetch(process.env.REACT_APP_HOST_API + "/IMPORT/selParcel", {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "INFO_SEQ": infoSeq + ""
            })
        });
        //console.log(res);
        const response = await res.json();
        // console.log(response.result);
        const itemlist = response.result;
        var datagrid = [];
        var itemrows = [];
        infoSeqimp(infoSeq)
        itemlist.forEach((item, i) => {
            // console.log(i,item);

            itemrows.push(item.PARCEL_S3_SEQ);
            datagrid.push({
                id: i + 1,
                no: item.PARCEL_S3_SEQ,
                EDIT_NO: item.PARCEL_S3_SEQ,
                LAND_TYPE: item.LAND_TYPE,
                PARCEL_NO: item.PARCEL_ID,
                AMPHUR_CODE: item.AMPHUR_CODE,
                AMPHUR_NAME: item.AMPHUR_NAME_TH,
                OPT_CODE: item.OPT_CODE,
                OPT_NAME: item.OPT_NAME,
                TYPE_CODE: item.TYPE_CODE,
                TYPE_NAME: item.TYPE_NAME,
                STREET_VALUE: item.ST_VALUE,
                STREET_VALUE_: item.STREET_VALUE_,
                STANDARD_DEPTH: item.STANDARD_DEPTH,
                DEPTH_R: item.DEPTH_R,
                LAND_TYPE_NAME: item.LAND_TYPE_NAME,
                AREA: item.NRAI + "-" + item.NNHAN + "-" + parseFloat(item.NWAH).toFixed(1),
                VAL_PER_WAH: ((item.VAL_PER_WAH === null) ? item.VAL_PER_WAH : numberWithCommas(item.VAL_PER_WAH)),
                AMT_VALUE: item.AMT_VALUE,
                DATE_IMPORT: dateFormatTime(item.DATE_CREATED),
            })
        })
        setrowsold(itemrows);
        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(datagrid);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + itemlist.length + ' รายการ'
        el.prepend(div);
        setrows1(
            datagrid
        )
        unclickImpdetail();
    }
    const importPolygons = async (item) => {
        var coordinates = "";
        var seqimpportadll = rowsold;
        var i = 1;
        item.geometry.coordinates[0].forEach(element => {
            if (i != item.geometry.coordinates[0].length) {
                coordinates += element[0] + " " + element[1] + ", ";
            } else {
                coordinates += element[0] + " " + element[1];
            }
            i++;

        })
        var raw = JSON.stringify({
            "INFO_SEQ": infoSeq + "",
            "PARCEL_ID": (item.properties.PARCEL_ID == null) ? 0 + "" : item.properties.PARCEL_ID + "",
            "PARCEL_TYPE": item.properties.PARCEL_TYP + "",
            "UTMMAP1": item.properties.UTMMAP1 + "",
            "UTMMAP2": item.properties.UTMMAP2 + "",
            "UTMMAP3": item.properties.UTMMAP3 + "",
            "UTMMAP4": item.properties.UTMMAP4 + "",
            "UTMSCALE": item.properties.UTMSCALE + "",
            "LAND_NO": (item.properties.LAND_NO == null) ? 0 + "" : item.properties.LAND_NO + "",
            // "BRANCH_CODE": item.properties.BRANCH_COD + "",
            "CHANGWAT_CODE": item.properties.CHANGWAT_C + "",
            "SHAPE": "MULTIPOLYGON (((" + coordinates + ")))",
            "USER_ID": userId + "",
            "NRAI": (item.properties.NRAI == null) ? 0 + "" : item.properties.NRAI + "",
            "NNHAN": (item.properties.NNHAN == null) ? 0 + "" : item.properties.NNHAN + "",
            "NWAH": (item.properties.NWAH == null) ? 0 + "" : parseFloat(item.properties.NWAH).toFixed(1) + "",
        });
        if (item.properties.PARCEL_TYP === undefined || item.properties.PARCEL_TYP === '') {
            // errorCount++;
        } else if (item.properties.UTMMAP1 === undefined || item.properties.UTMMAP1 === '') {
            // errorCount++;
        } else if (item.properties.UTMMAP2 === undefined || item.properties.UTMMAP2 === '') {
            // errorCount++;
        } else if (item.properties.UTMMAP3 === undefined || item.properties.UTMMAP3 === '') {
            // errorCount++;
        } else if (item.properties.UTMMAP4 === undefined || item.properties.UTMMAP4 === '') {
            // errorCount++;
        } else if (item.properties.UTMSCALE === undefined || item.properties.UTMSCALE === '') {
            // errorCount++;
        }
        // else if (item.properties.LAND_NO === undefined || item.properties.LAND_NO === '') {
        //     // errorCount++;
        // } 
        // else if (item.properties.BRANCH_COD === undefined || item.properties.BRANCH_COD === '') {
        // errorCount++;
        else if (item.properties.CHANGWAT_C === undefined || item.properties.CHANGWAT_C === '') {
            // errorCount++;
        } else {
            // successCount++;           
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const res = await fetch(process.env.REACT_APP_HOST_API + "/IMPORT/insimportParcel" + queryParameters.get("z"), {
                method: 'POST',
                headers: myHeaders,
                body: raw
            });
            const response = await res.json();
            // console.log(process.env.REACT_APP_HOST_API + "/IMPORT/insimportParcel" + queryParameters.get("z"),res,response);
            console.log(response, 'COUNT_OPT');
            if (response.status == 200) {
                if (response.result[0].COUNT_OPT == 0) {
                    errorCount++;
                } else {
                    successCount++;
                }
            } else {
                errorCount++;
            }
            setinboundary(successCount)
            setoutboundary(errorCount)
        }
    }


    const getImportInfo = async (a) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const res = await fetch(process.env.REACT_APP_HOST_API + "/IMPORT/insImportInfo", {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "CHANGWAT_CODE": queryParameters.get("p") + "",
                "AMPHUR_CODE": queryParameters.get("a") + "",
                "OPT_CODE": queryParameters.get("t") + "",
                "OPT_NAME": queryParameters.get("n") + "",
                "OPT_TYPE": queryParameters.get("tt") + "",
                "ZONE": queryParameters.get("z") + "",
                "TABLE_MAPNAME": "MUNISAN_" + queryParameters.get("z"),
                "FILE_NAME": a + "",
                "USER_ID": userId
            })
        });
        const response = await res.json();
        infoSeq = response.result[0].INFO_SEQ + "";
        return infoSeq
    }

    const resgeojson = async (e, a) => {
        document.getElementById('totable').disable = true;
        infoSeq = await getImportInfo(a)
        // console.log(e);
        e.features.forEach(importPolygons)
        handleClick3()
        selParcel()
        document.getElementById('totable').disable = false;
        setinfoSeqdel(infoSeq)
        // console.log(infoSeq);

    }
    const impdetail = () => {
        // document.getElementById('impdetail').style = "border-bottom: 5px solid red;";
        // document.getElementById('caldetail').style = "";
        // document.getElementById('approve').style = "";MuiDataGrid-virtualScroller
        var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
        // console.log(obj);
        obj.scroll({ left: 0 })
        setTimeout(() => {
            var checkboxes = document.querySelectorAll('input[type=checkbox]')
            checkboxes[0].click();
        }, 100);
    }

    const unclickImpdetail = () => {
        // document.getElementById('impdetail').style = "border-bottom: 5px solid red;";
        // document.getElementById('caldetail').style = "";
        // document.getElementById('approve').style = "";MuiDataGrid-virtualScroller
        var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
        // console.log(obj);
        obj.scroll({ left: 0 })
        setTimeout(() => {
            var checkboxes = document.querySelectorAll('input[type=checkbox]')
            if (checkboxes) {
                // console.log(checkboxes[0].ariaLabel);
                if (checkboxes[0].ariaLabel !== 'Select all rows') {
                    checkboxes[0].click();
                }
            }

        }, 1000);

    }
    const caldetail = async () => {
        document.getElementById('impdetail').style = "";
        document.getElementById('caldetail').style = "border-bottom: 5px solid red;";
        document.getElementById('approve').style = "";
        var div1 = document.getElementById('loadingpopup1');
        div1.style.left = "calc(50vw - 200px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('loadingpopup');
        div2.style.display = 'flex';
        var recal = [];
        selectionModel.forEach((item, i) => {
            recal.push(rows1[item - 1].no)
        })
        if (tabletypeimport === 'polygon') {
            // alert('ยังไม่มีเส้น REL')
            document.getElementById('loadingpopup').style.display = 'none';
            // console.log(recal);
            settotalcalc(recal.length)
            UpdCalREL_TEST(recal)
        } else {
            UpdCalPoint(recal)
        }
    }
    const step1cal = () => {
        setsteppoint(2)
        steppoint2map(2)
        document.getElementById('typetables').value = '2';
        if (selectionModel.length === 0) {
            var div1 = document.getElementById('alertselectlist1');
            div1.style.left = "calc(50vw - 150px)";
            div1.style.top = "calc(50vh - 100px)";
            var div2 = document.getElementById('alertselectlist');
            div2.style.display = 'flex';
        } else {
            var div1 = document.getElementById('alertcal1');
            div1.style.left = "calc(50vw - 150px)";
            div1.style.top = "calc(50vh - 100px)";
            var div2 = document.getElementById('alertcal');
            div2.style.display = 'flex';
        }
    }
    const UpdCalREL_TEST = async (recal) => {
        var div1 = document.getElementById('loadingpopup1');
        div1.style.left = "calc(50vw - 200px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('loadingpopup');
        div2.style.display = 'flex';
        // console.log(recal);
        var datacal = [];
        var i = 1;
        for (var y in recal) {
            // console.log('sentcal : ' + recal[y]);
            var row = JSON.stringify({
                "PARCEL_S3_SEQ": recal[y] + "",
                "ZONE": queryParameters.get("z") + ""
            });
            // console.log(row);
            const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/UpdCalREL_TEST", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: row
            });
            const response = await res.json();
            if (response.status === "200") {
                // console.log('go SelCalREL_TEST ' + recal[y]);

                setnumcalc(y * 1 + 1)
                // var result = response.result
                // console.log(row);
                setTimeout(async () => {
                    const res1 = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelSTS2ByParcelSeq", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: row
                    });
                    // console.log(row);
                    const response1 = await res1.json();
                    // console.log(response1.result);
                    const result = response1.result;
                    var datacalc = [0];
                    if (result.length !== 0) {
                        datacalc.push(result[0].PARCEL_S3_SEQ);
                        datacal.push({
                            id: i,
                            no: result[0].PARCEL_S3_SEQ,
                            EDIT_NO: result[0].PARCEL_S3_SEQ,
                            LAND_TYPE: result[0].LAND_TYPE,
                            PARCEL_NO: result[0].PARCEL_ID,
                            AMPHUR_CODE: result[0].AMPHUR_CODE,
                            AMPHUR_NAME: result[0].AMPHUR_NAME_TH,
                            OPT_CODE: result[0].OPT_CODE,
                            OPT_NAME: result[0].OPT_NAME,
                            TYPE_CODE: result[0].TYPE_CODE,
                            TYPE_NAME: result[0].STREET_NAME,
                            STREET_VALUE: result[0].ST_VALUE,
                            STREET_VALUE_: result[0].STREET_VALUE_,
                            STANDARD_DEPTH: result[0].STANDARD_DEPTH,
                            DEPTH_R: result[0].DEPTH_R,
                            LAND_TYPE_NAME: result[0].LAND_TYPE_NAME,
                            AREA: result[0].NRAI + "-" + result[0].NNHAN + "-" + parseFloat(result[0].NWAH).toFixed(1),
                            VAL_PER_WAH: ((result[0].VAL_PER_WAH === null) ? result[0].VAL_PER_WAH : numberWithCommas(result[0].VAL_PER_WAH)),
                            // VAL_PER_WAH: null,
                            AMT_VALUE: result[0].VALAREA,
                            DATE_IMPORT: dateFormatTime(result[0].DATE_CREATED),

                        })
                        i++;
                    }
                }, 5000);
            }
        }
        setTimeout(async () => {
            setcolumns(columns2)
            const steppoint2 = document.getElementById('steppoint2');
            const steppoint3 = document.getElementById('steppoint3');
            const steppoint4 = document.getElementById('steppoint4');

            steppoint3.disabled = false
            steppoint3.classList.remove("Mui-disabled")
            steppoint3.style.display = 'none';
            steppoint4.disabled = false
            steppoint4.classList.remove("Mui-disabled")
            steppoint4.style.display = 'inline-flex';
            // steppoint3.addEventListener('click', approve);

            steppoint2.disabled = true
            steppoint2.classList.add("Mui-disabled")
            setsteppoint(2)
            document.getElementById('typetables').value = '2';
            infoSeqimpcal(datacalc);
            // infoSeqimpcal(recal)
            setrows1(datacal);
            unclickImpdetail();
            // setrowsold(recal);
            document.getElementById('loadingpopup').style.display = 'none';
            if (datacal.length == 0) {
                var datacalc = [0];
                for (var y in recal) {
                    var i = 1;
                    const res1 = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelSTS2ByParcelSeq", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: row
                    });
                    // console.log(row);
                    const response1 = await res1.json();
                    // console.log(response1.result);
                    const result = response1.result;
                    if (result.length !== 0) {
                        datacalc.push(result[0].PARCEL_S3_SEQ);
                        datacal.push({
                            id: i,
                            no: result[0].PARCEL_S3_SEQ,
                            EDIT_NO: result[0].PARCEL_S3_SEQ,
                            LAND_TYPE: result[0].LAND_TYPE,
                            PARCEL_NO: result[0].PARCEL_ID,
                            AMPHUR_CODE: result[0].AMPHUR_CODE,
                            AMPHUR_NAME: result[0].AMPHUR_NAME_TH,
                            OPT_CODE: result[0].OPT_CODE,
                            OPT_NAME: result[0].OPT_NAME,
                            TYPE_CODE: result[0].TYPE_CODE,
                            TYPE_NAME: result[0].STREET_NAME,
                            STREET_VALUE: result[0].ST_VALUE,
                            STREET_VALUE_: result[0].STREET_VALUE_,
                            STANDARD_DEPTH: result[0].STANDARD_DEPTH,
                            DEPTH_R: result[0].DEPTH_R,
                            LAND_TYPE_NAME: result[0].LAND_TYPE_NAME,
                            AREA: result[0].NRAI + "-" + result[0].NNHAN + "-" + parseFloat(result[0].NWAH).toFixed(1),
                            VAL_PER_WAH: ((result[0].VAL_PER_WAH === null) ? result[0].VAL_PER_WAH : numberWithCommas(result[0].VAL_PER_WAH)),
                            // VAL_PER_WAH: null,
                            AMT_VALUE: result[0].VALAREA,
                            DATE_IMPORT: dateFormatTime(result[0].DATE_CREATED),

                        })
                        i++;
                    }
                }
                setTimeout(() => {
                    infoSeqimpcal(datacalc);
                    setrows1(datacal);
                    unclickImpdetail();
                }, 500)
            }
            var div1 = document.getElementById('alertcompleatrel1');
            div1.style.left = "calc(50vw - 150px)";
            div1.style.top = "calc(50vh - 100px)";
            var div2 = document.getElementById('alertcompleatrel');
            div2.style.display = 'flex';
            setnumcalc(0);
        }, 6000);
        // console.log();
        // SelPointCalByParcelSeq(recal)
    }
    const UpdCalPoint = async (recal) => {

        for (var y in recal) {
            var row = JSON.stringify({
                "PARCEL_S3_SEQ": recal[y] + "",
                "ZONE": queryParameters.get("z") + ""
            });
            // console.log(row);
            const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/UpdCalPoint", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: row
            });
            const response = await res.json();
            if (response.status === "200") {
                var result = response.result

                // console.log(result);
            }
        }
        // console.log();
        SelPointCalByParcelSeq(rowsold)
    }

    async function SelPointSTS3ByParcelSeq(points3) {
        var i = 1;
        datagridpoint = [];
        var datapoint = [0];
        for (var y in points3) {
            if (points3[y] !== {}) {
                var row = JSON.stringify({
                    "PARCEL_S3_SEQ": points3[y] + "",
                    "ZONE": queryParameters.get("z") + ""
                });
                const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/SelPointSTS3ByParcelSeq", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: row
                });
                const response = await res.json();
                if (response.status === "200") {
                    var result = response.result
                    // console.log(result);
                    await setDataReport(result);
                    if (result.length !== 0) {
                        datapoint.push(result[0].PARCEL_S3_SEQ);
                        datagridpoint.push({
                            id: i,
                            no: result[0].PARCEL_S3_SEQ,
                            EDIT_NO: result[0].PARCEL_S3_SEQ,
                            LAND_TYPE: ((result[0].LAND_TYPE == 'อื่นๆ') ? result[0].REMARK : result[0].LAND_TYPE),
                            PARCEL_NO: result[0].PARCEL_ID,
                            AMPHUR_CODE: result[0].AMPHUR_CODE,
                            AMPHUR_NAME: result[0].AMPHUR_NAME_TH,
                            OPT_CODE: result[0].OPT_CODE,
                            OPT_NAME: result[0].OPT_NAME,
                            TYPE_CODE: result[0].TYPE_CODE,
                            TYPE_NAME: result[0].STREET_NAME,
                            STREET_VALUE: result[0].ST_VALUE,
                            STREET_VALUE_: result[0].STREET_VALUE_,
                            STANDARD_DEPTH: result[0].STANDARD_DEPTH,
                            DEPTH_R: result[0].DEPTH_R,
                            LAND_TYPE_NAME: result[0].LAND_TYPE_NAME,
                            AREA: result[0].NRAI + "-" + result[0].NNHAN + "-" + parseFloat(result[0].NWAH).toFixed(1),
                            VAL_PER_WAH: ((result[0].VAL_PER_WAH === null) ? result[0].VAL_PER_WAH : numberWithCommas(result[0].VAL_PER_WAH)),
                            // VAL_PER_WAH: null,
                            AMT_VALUE: result[0].VALAREA,
                            DATE_IMPORT: dateFormatTime(result[0].DATE_CREATED),

                        })
                        i++;
                    }
                }

            }

        }
        var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
        // console.log(obj);
        obj.scroll({ left: 0 })
        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(el);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + ((result.length === undefined) ? i - 1 : i - 1 + ' รายการ')
        el.prepend(div);
        setTimeout(() => {
            // var checkboxes = document.querySelectorAll('input[type=checkbox]')
            // checkboxes[0].click();
            point2map(points3)
            setrows1(datagridpoint)
            unclickImpdetail();
            // if (queryParameters.get("ss") != null) {
            zoomtofeature(0);
            infoSeqimpcal(datapoint);
            // }
            setTimeout(() => {
                document.getElementById('loadingprogress').style.display = 'none';
            }, 1000);
            const steppoint1 = document.getElementById('steppoint1');
            const steppoint5 = document.getElementById('steppoint5');
            steppoint1.disabled = false
            steppoint1.classList.remove("Mui-disabled")
            steppoint5.disabled = false
            steppoint5.classList.remove("Mui-disabled")
            const steppoint3 = document.getElementById('steppoint3');
            steppoint3.disabled = true
            steppoint3.classList.add("Mui-disabled")
        }, 100);
    }
    const UpdCalPointConfirm = async (confirmcal) => {
        for (var y in confirmcal) {
            var row = JSON.stringify({
                "PARCEL_S3_SEQ": confirmcal[y] + "",
                "ZONE": queryParameters.get("z") + "",
                "USER_ID": window.sessionStorage.getItem("userid")
            });
            // console.log(row);
            const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/UpdCalPointConfirm", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: row
            });
            const response = await res.json();
            if (response.status === "200") {
                var result = response.result
                // console.log(result);
            }
        }
        // console.log(rowsold);
        // SelPointSTS3ByParcelSeq(rowsold)

        approveClick();

        const steppoint4 = document.getElementById('steppoint4');
        steppoint4.disabled = true
        steppoint4.classList.add("Mui-disabled")
        // document.getElementById('exportPostcard').hidden = false;
    }
    const UpdCalParcelConfirm = async (confirmcal) => {
        for (var y in confirmcal) {
            var row = JSON.stringify({
                "PARCEL_S3_SEQ": confirmcal[y] + "",
                "ZONE": queryParameters.get("z") + "",
                "USER_ID": window.sessionStorage.getItem("userid")
            });
            // console.log(row);
            const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/UpdCalParcelConfirm", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: row
            });
            const response = await res.json();
            if (response.status === "200") {
                var result = response.result
                // console.log(result);
            }
        }
        // console.log(rowsold);
        // SelParcelSTS3ByParcelSeq(confirmcal)
        approveClick();
        // document.getElementById('loadingprogress').style.display = 'none';
        // document.getElementById('exportPostcard').hidden = false;
    }
    const toPostcart = async () => {
        // alert('ยังไม่เสร็จจ้า เหลือ export word')
        // handleFullscreen()
        // setShowDatatable(false)

        var confirmcal = [];
        selectionModel.forEach((item, i) => {
            if (rows1[item - 1] !== undefined) {
                confirmcal.push(rows1[item - 1].no)
            }
        })
        // console.log(selectionModel);
        if (tabletypeimport === 'polygon') {
            // InsTDS3ParcelVal_PARCEL(confirmcal)
            let del = await DeleteVal(confirmcal)
            if (del.length > 0) {
                console.log(del, 'del');
                InsTDS3ParcelVal_PARCEL(confirmcal)
            }
        } else if (tabletypeimport === 'point') {
            InsTDS3ParcelVal(confirmcal)
        }
    }
    const DeleteVal = async (confirmcal) => {
        console.log(rows1, 'rows1');
        let newdata = [];
        try {
            let url = process.env.REACT_APP_HOST_API + "/CALCULATE/DeleteVal";
            for (var i in rows1) {
                if (confirmcal.includes(rows1[i].no)) {
                    let datasend = {
                        "PARCEL_S3_SEQ": String(rows1[i].no),
                        "OPT_CODE": String(rows1[i].OPT_CODE),
                        "CHANGWAT_CODE": String(rows1[i].CHANGWAT_CODE),
                        "AMPHUR_CODE": String(rows1[i].AMPHUR_CODE),
                        "OPT_TYPE": String(rows1[i].OPT_TYPE),
                        "TYPE_CODE": String(rows1[i].TYPE_CODE),
                        "STANDARD_DEPTH": rows1[i].STANDARD_DEPTH != null ? String(rows1[i].STANDARD_DEPTH) : null,
                        "DEPTH_R": String(rows1[i].DEPTH_R),
                        "NRAI": String(rows1[i].NRAI),
                        "NNHAN": String(rows1[i].NNHAN),
                        "NWAH": String(rows1[i].NWAH),
                        "PARCEL_SHAPE": String(rows1[i].PARCEL_SHAPE),
                        "VAL_PER_WAH": String(rows1[i].VAL_PER_WAH_),
                        "CREATE_USER": window.sessionStorage.getItem("userid"),

                    }
                    console.log(datasend, 'confirmcal');
                    let res = await axios.post(url, datasend);
                    let data = res.data;
                    newdata.push(data.result);
                }
            }
        } catch (e) {
            console.log(e);
        }
        console.log(newdata, 'newdata');
        // if(newdata.length > 0){
        //     InsTDS3ParcelVal(confirmcal)
        // }
        return newdata;
    }
    const InsTDS3ParcelVal = async (confirmcal) => {
        for (var y in confirmcal) {
            var row = JSON.stringify({
                "PARCEL_S3_SEQ": confirmcal[y] + "",
                "ZONE": queryParameters.get("z") + "",
                "USER_ID": window.sessionStorage.getItem("userid"),
                "PARCEL_S3VAL_SEQ": ""
            });
            const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/InsTDS3ParcelVal", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: row
            });
            const response = await res.json();
            if (response.status === "200") {
                var result = response.result
                // console.log(result);
                if (transaction.length > 0) {
                    for (var x in transaction) {
                        if (transaction[x] !== {}) {
                            transactionpush.push(transaction[x]);
                        }
                    }
                }
                transactionpush.push(result[0]);
                // console.log(transactionpush);
            }
        }
        await setDataTable4()
        // settransaction(transactionpush)
        // window.sessionStorage.setItem("transactionpush", JSON.stringify(transactionpush));
        // document.getElementById('postcard').style.display = 'flex';
        // SelPointCalByParcelSeq(rowsold)
        // document.getElementById('exportPostcard').hidden = false;
    }
    const InsTDS3ParcelVal_PARCEL = async (confirmcal) => {
        console.log(confirmcal, 'confirmcal', rows1);
        // return
        for (var y in confirmcal) {
            var row = JSON.stringify({
                "PARCEL_S3_SEQ": confirmcal[y] + "",
                "ZONE": queryParameters.get("z") + "",
                "USER_ID": window.sessionStorage.getItem("userid"),
                "PARCEL_S3VAL_SEQ": ""
            });
            console.log(row, 'response');
            const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/InsTDS3ParcelVal_PARCEL", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: row
            });
            const response = await res.json();
            console.log(response, 'response');
            if (response.status === "200") {
                var result = response.result
                if (transaction.length > 0) {
                    for (var x in transaction) {
                        if (transaction[x] !== {}) {
                            transactionpush.push(transaction[x]);
                        }
                    }
                }
                transactionpush.push(result[0]);
                // console.log(transactionpush);
            }
        }
        await setDataTable4()
        // settransaction(transactionpush)
        // window.sessionStorage.setItem("transactionpush", JSON.stringify(transactionpush));
        // document.getElementById('postcard').style.display = 'flex';
        // SelPointCalByParcelSeq(rowsold)
        // document.getElementById('exportPostcard').hidden = false;
    }
    const lestgocal = () => {
        document.getElementById('alertcal').style.display = 'none';
        caldetail()
    }

    const cancelcal = () => {
        document.getElementById('alertcal').style.display = 'none';
    }

    const cancelconfirm = () => {
        document.getElementById('alertconfirm').style.display = 'none';
    }
    const cancelconfirm2 = () => {
        document.getElementById('alertconfirmlist').style.display = 'none';
    }
    const cancelconfirm3 = () => {
        document.getElementById('alertconfirmcheck').style.display = 'none';
    }
    const cancelalertsearch = () => {
        document.getElementById('alertsearch').style.display = 'none';
    }
    const cancelselectlist = () => {
        document.getElementById('alertselectlist').style.display = 'none';
    }
    const cancelselectlist2 = () => {
        document.getElementById('alertselectlist2').style.display = 'none';
    }
    const exportpostcard = () => {
        window.open('/Import/ViewPostcard', '_blank');
        // alert('ยังไม่เสร็จจ้า')
    }
    const backpostcard = () => {
        document.getElementById('postcard').style.display = 'none';
        // setrows1(columns4);
        unclickImpdetail();
        handleFullscreen();
        setShowDatatable(true);
        setDataTable4()
        // approveClick();
    }
    const printpostcard = () => {
        let arrid = [];
        Array.isArray(transaction) && transaction.forEach((el, index) => {
            selectionModel.includes((index + 1)) && arrid.push(`postcard${(index + 1)}`)
        });
        // print(arrid)
        // printElementById('postcard')
        printElementsById(arrid);
        // printPreview(datasent);

    }
    useEffect(() => {
        if (queryParameters.get("search") !== null) {

            handleClick111()
        } else {
            setShowMain(true)
        }
        const getprovince = async () => {
            // setShowLoad(true)
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
            // setZone(response.result[0].MAPZONE);
            // setShowLoad(false)
            // console.log(response.result);
        };
        getprovince()
        const SearchFlagParcel = async () => {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SearchFlagParcel");
            const response = await res.json();
            setStatus(response.result)

        }
        SearchFlagParcel()
        if (queryParameters.get("ss") === '1' || queryParameters.get("ss") === '2') {
            // setSelectedStatus(queryParameters.get("ss"))
            // setSelectedProvince(queryParameters.get("p"))
            // setSelectedAumpher(queryParameters.get("a"))
            // setSelectedselType(queryParameters.get("tt"))
            // setSelectedTumbol(queryParameters.get("t"))
            // setZone(queryParameters.get("z"))
            // setDateStart(queryParameters.get("sd"))
            // setDateEnd(queryParameters.get("ed"))

            if (queryParameters.get("ss") === "1") {
                settabletypeimport('polygon');
                typeimport('polygon')
            } else {
                settabletypeimport('point');
                typeimport('point')
            }
            setShowMain(false)
            setShowSearchData(false)
            setShowDatatable(true)
            SearchParcelByFlagParcel()
        }



    }, []);
    const SearchParcelByFlagParcel = async () => {
        var div1 = document.getElementById('loadingprogress1');
        div1.style.left = "calc(50vw - 150px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('loadingprogress');
        div2.style.display = 'flex';
        var datacalc = [0];
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SearchParcelByFlagParcel", {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "START_DATE": queryParameters.get("sd"),
                "END_DATE": queryParameters.get("sd"),
                "FLAG_PARCEL": queryParameters.get("ss") + "",
                "CHANGWAT_CODE": queryParameters.get("p") + "",
                "AMPHUR_CODE": queryParameters.get("a") + "",
                "OPT_TYPE": queryParameters.get("tt") + "",
                "OPT_CODE": queryParameters.get("t") + ""
            })
        });
        let test = JSON.stringify({
            "START_DATE": queryParameters.get("sd"),
            "END_DATE": queryParameters.get("sd"),
            "FLAG_PARCEL": queryParameters.get("ss") + "",
            "CHANGWAT_CODE": queryParameters.get("p") + "",
            "AMPHUR_CODE": queryParameters.get("a") + "",
            "OPT_TYPE": queryParameters.get("tt") + "",
            "OPT_CODE": queryParameters.get("t") + ""
        })
        console.log(test, 'letuuuuu');
        const response = await res.json();
        const itemlist = response.result;
        var datagrid = [];
        var dataseq = [];
        // infoSeqimp(infoSeq)
        dataseq.push(0)
        itemlist.forEach((item, i) => {
            datacalc.push(item.PARCEL_S3_SEQ);
            dataseq.push(item.PARCEL_S3_SEQ);
            datagrid.push({
                id: i + 1,
                no: item.PARCEL_S3_SEQ,
                LAND_TYPE: item.LAND_TYPE,
                PARCEL_NO: item.PARCEL_ID,
                AMPHUR_CODE: item.AMPHUR_CODE,
                AMPHUR_NAME: item.AMPHUR_NAME_TH,
                OPT_CODE: item.OPT_CODE,
                OPT_NAME: item.OPT_NAME,
                TYPE_CODE: item.TYPE_CODE,
                TYPE_NAME: item.STREET_NAME,
                STREET_VALUE: item.ST_VALUE,
                STREET_VALUE_: item.STREET_VALUE_,
                STANDARD_DEPTH: item.STANDARD_DEPTH,
                DEPTH_R: item.DEPTH_R,
                LAND_TYPE_NAME: item.LAND_TYPE_NAME,
                AREA: item.NRAI + "-" + item.NNHAN + "-" + parseFloat(item.NWAH).toFixed(1),
                VAL_PER_WAH: ((item.VAL_PER_WAH === null) ? item.VAL_PER_WAH : numberWithCommas(item.VAL_PER_WAH)),
                AMT_VALUE: item.VALAREA,
                DATE_IMPORT: dateFormatTime(item.DATE_CREATED),
            })
        })
        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }

        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(rowsold);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + itemlist.length + ' รายการ'
        el.prepend(div);

        // setrowsold(datagrid);
        setrows1(
            datagrid
        )
        unclickImpdetail();
        console.log(itemlist);
        if (queryParameters.get("ss") === '1') {
            SelParcelSTS1ByParcelSeq(datacalc);
        } else if (queryParameters.get("ss") === '2') {
            SelPointSTS1ByParcelSeq(datacalc);
        }
        console.log(datacalc, 'datacalcdatacalc');
        setrowsold(datacalc);
        zoomtofeature(0);
        infoSeqimpcal(datacalc);



    }

    const handleChangeBoundary = (event) => {
        // setSelectedBoundary(event.target.value);
        setSelectedselType(event.target.value);
        var url = '';
        url = process.env.REACT_APP_HOST_API + "/MASTER/searchOpt";
        const getTumbol = async () => {

            // setShowLoad(true)
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "CHANGWAT_CODE": selectedProvince + "",
                    "AMPHUR_CODE": selectedAumpher + "",
                    "OPT_TYPE": event.target.value + "",
                    "ZONE": zone + ""
                })
            });
            const response = await res.json();
            // setTumbol(response);
            if (response.status == 200) {
                setTumbol(response.result);
                // setShowLoad(false)
            } else {
                alert(response.message);
                // setShowLoad(false)
            }
        };
        getTumbol();
        // setShowMenu(!showMenu)
    }
    const handleChangeProvince = (event) => {
        if (event.target.value == '') {
            setSelectedProvince('');
            setvSelectedProvince('')
            setAumpher([]);
            setSelectedAumpher('');
            setMunicipal([]);
        } else {
            var val = event.target.value.split('|')
            var value = val[0]
            var valzone = val[1]
            setZone(valzone)
            setAumpher([]);
            setSelectedAumpher('');
            setSelectedProvince(value);
            setvSelectedProvince(event.target.value)
            const getDistrict = async () => {
                // setShowLoad(true)
                const res = await fetch(process.env.REACT_APP_HOST_API + "/MASTER/SearchAmphur", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "USER_ID": userid,
                        "CHANGWAT_CODE": value + "",
                        "ZONE": valzone + ""
                    })
                });
                const response = await res.json();

                // console.log(response);
                if (response.status == 200) {
                    setAumpher(response.result);
                    // setShowLoad(false)
                } else {
                    alert(response.message);
                    // setShowLoad(false)
                }
            };
            getDistrict();
            // childToParent({ selectedProvince: event.target.value, selectedDistrict, selectedTumbol, zone, selType: selectedselType, name: '' })
        }

    };
    const handleChangeAumpher = (event) => {
        if (event.target.value == '') {
            setSelectedAumpher('');
            setSelectedselType('')
            setselType([])
        } else {
            setSelectedAumpher(event.target.value);
            const getSelType = async () => {
                // setShowLoad(true)
                const res = await fetch(process.env.REACT_APP_HOST_API + "/MASTER/selType", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "USER_ID": userid,
                        "CHANGWAT_CODE": selectedProvince + "",
                        "AMPHUR_CODE": event.target.value + "",
                        "ZONE": zone + ""
                    })
                });
                //console.log(res);
                const response = await res.json();
                if (response.status == 200) {
                    setselType(response.result);
                    setSelectedselType('')
                    // setShowLoad(false)
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
                    // setShowLoad(false)
                }
            };
            getSelType();
            // childToParent({ selectedProvince, selectedDistrict: event.target.value, selectedTumbol, zone, selType:selectedselType ,name:''})
        }
        setSelectedAumpher(event.target.value)
    }
    const handleChangeTumbol = (event) => {
        var name = '';
        selType.forEach((item, i) => {
            if (item.OPT_TYPE === selectedselType) {
                name += item.OPT_NAME_TYPE;
            }
        });
        tumbol.forEach((item, i) => {
            if (item.OPT_CODE === event.target.value) {
                name += item.OPT_NAME_ABBR;
            }
        });
        setTumbolname(name)
        setSelectedTumbol(event.target.value)
    }
    const handleChangeStatus = (event) => {

        setSelectedStatus(event.target.value)
    }
    const handleChangeDateStart = (newValue) => {
        setDateStart(dayjs(newValue))
    }
    const handleChangeDateEnd = (newValue) => {
        setDateEnd(newValue)
    }
    const handleChangeSubmitSearchReport = async () => {
        if (selectedStatus === '' || selectedProvince === '' || selectedAumpher === '' || selectedselType === '' || selectedTumbol === '') {
            document.getElementById('alertsearch').style.display = 'flex';
            var div = document.getElementById('alertsearch1');
            div.style.position = "absolute";
            div.style.left = "calc(50vw - 300px)";
            div.style.top = "calc(50vh - 200px)";
        } else {
            // setShowSearchData(false)
            // setShowDatatable(true)
            // SearchParcelByFlagParcel()
            window.location.href = '/Import?' + 'p=' + selectedProvince + '&a=' + selectedAumpher + '&tt=' + selectedselType + '&t=' + selectedTumbol + '&z=' + zone + '&n=' + Tumbolname + '&ss=' + selectedStatus +
                // '&sd=' + DateStart.$y + "-" + String((DateStart.$M + 1)).padStart(2, '0') + "-" + String((DateStart.$D)).padStart(2, '0') + 
                '&sd=' + DateEnd.$y + "-" + String((DateEnd.$M + 1)).padStart(2, '0') + "-" + String((DateEnd.$D)).padStart(2, '0')
        }
    }
    const handleChangeClearSearchReport = () => {
        setSelectedProvince('');
        setSelectedAumpher('');
        setSelectedTumbol('');
        setSelectedselType('');
        setSelectedStatus('');
        // document.getElementById('reportList').style.display = 'none'
    }
    if (tabletypeimport == 'polygon') {
        document.getElementById('reloadp').style.display = 'inline';
    }
    const selParcelroload = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const res = await fetch(process.env.REACT_APP_HOST_API + "/IMPORT/selParcel", {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "INFO_SEQ": infoSeqdel + ""
            })
        });
        //console.log(res);
        const response = await res.json();
        // console.log(infoSeqdel, response.result);
        const itemlist = response.result;
        var datagrid = [];
        // var itemrows = [];
        itemlist.forEach((item, i) => {
            // console.log(i,item);
            // itemrows.push(item.PARCEL_S3_SEQ);
            datagrid.push({
                id: i + 1,
                no: item.PARCEL_S3_SEQ,
                LAND_TYPE: item.LAND_TYPE,
                PARCEL_NO: item.PARCEL_ID,
                AMPHUR_CODE: item.AMPHUR_CODE,
                AMPHUR_NAME: item.AMPHUR_NAME_TH,
                OPT_CODE: item.OPT_CODE,
                OPT_NAME: item.OPT_NAME,
                TYPE_CODE: item.TYPE_CODE,
                TYPE_NAME: item.TYPE_NAME,
                STREET_VALUE: item.ST_VALUE,
                STREET_VALUE_: item.STREET_VALUE_,
                STANDARD_DEPTH: item.STANDARD_DEPTH,
                DEPTH_R: item.DEPTH_R,
                LAND_TYPE_NAME: item.LAND_TYPE_NAME,
                AREA: item.NRAI + "-" + item.NNHAN + "-" + parseFloat(item.NWAH).toFixed(1),
                VAL_PER_WAH: ((item.VAL_PER_WAH === null) ? item.VAL_PER_WAH : numberWithCommas(item.VAL_PER_WAH)),
                AMT_VALUE: item.AMT_VALUE,
                DATE_IMPORT: dateFormatTime(item.DATE_CREATED),
            })
        })
        // setrowsold(itemrows);
        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(datagrid);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + itemlist.length + ' รายการ'
        el.prepend(div);
        setrows1(
            datagrid
        )
        unclickImpdetail();
        document.getElementById('loadingprogress').style.display = 'none';
    }
    const handlereloadTable = () => {
        var div1 = document.getElementById('loadingprogress1');
        div1.style.left = "calc(50vw - 150px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('loadingprogress');
        div2.style.display = 'flex';

        if (tabletypeimport == 'polygon') {
            if (steppoint === 1) {
                selParcelroload();
            } else if (steppoint === 2) {
                // console.log(rowsold);
                SelParcelSTS2ByParcelSeqTable(rowsold);
            } else if (steppoint === 3) {
                SelParcelSTS3ByParcelSeqTable(rowsold);
            }
            document.getElementById('alertcompleatrel').style.display = 'none';

        }
    }
    const handlereload = () => {
        var div1 = document.getElementById('loadingprogress1');
        div1.style.left = "calc(50vw - 150px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('loadingprogress');
        div2.style.display = 'flex';

        if (tabletypeimport == 'polygon') {
            if (steppoint === 1) {
                selParcelroload();
            } else if (steppoint === 2) {
                // console.log(rowsold);
                SelParcelSTS2ByParcelSeq(rowsold);
            } else if (steppoint === 3) {
                SelParcelSTS3ByParcelSeq(rowsold);
            }
            document.getElementById('alertcompleatrel').style.display = 'none';

        }
    }
    const handleAlertClose = () => {
        document.getElementById('alertconfirm').style.display = 'none';
    }
    const approve = async () => {
        var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
        // console.log(obj);
        obj.scroll({ left: 0 })
        setTimeout(() => {
            steppoint2map(3)

            setcolumns(columns3)
            // console.log(selectionModel,selectionModel2,selectionModel3);
            var checkboxes = document.querySelectorAll('input[type=checkbox]')
            if (checkboxes[0].getAttribute('aria-label') === 'Select all rows') {
                var div1 = document.getElementById('alertconfirmlist1');
                div1.style.left = "calc(50vw - 150px)";
                div1.style.top = "calc(50vh - 100px)";
                var div2 = document.getElementById('alertconfirmlist');
                div2.style.display = 'flex';
                return false;
            } else {
                document.getElementById('impdetail').style = "";
                document.getElementById('caldetail').style = "";
                document.getElementById('approve').style = "border-bottom: 5px solid red;";
                var confirmcal = [];
                selectionModel.forEach((item, i) => {
                    if (rows1[item - 1] !== undefined) {
                        confirmcal.push(rows1[item - 1].no)
                    }
                })
                // console.log(confirmcal);
                setrowsold(confirmcal)
                if (tabletypeimport === 'polygon') {
                    UpdCalParcelConfirm(confirmcal)
                } else if (tabletypeimport === 'point') {
                    UpdCalPointConfirm(confirmcal)
                }
                var div1 = document.getElementById('alertconfirm1');
                div1.style.left = "calc(50vw - 150px)";
                div1.style.top = "calc(50vh - 100px)";
                var div2 = document.getElementById('alertconfirm');
                div2.style.display = 'flex';
                setTimeout(() => {
                    document.getElementById('alertconfirm').style.display = 'none';
                }, 1000);
            }
        }, 500);
        setsteppoint(3)
        document.getElementById('typetables').value = '3';
    }
    const checkdata = () => {
        // console.log(selectionModel,selectionModel2,selectionModel3);
        var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
        // console.log(obj);
        obj.scroll({ left: 0 })
        setTimeout(() => {
            // steppoint2map(3)
            // setcolumns(columns3)
            // console.log(selectionModel,selectionModel2,selectionModel3);
            var checkboxes = document.querySelectorAll('input[type=checkbox]')
            if (checkboxes[0].getAttribute('aria-label') === 'Select all rows') {
                var div1 = document.getElementById('alertconfirmlist1');
                div1.style.left = "calc(50vw - 150px)";
                div1.style.top = "calc(50vh - 100px)";
                var div2 = document.getElementById('alertconfirmlist');
                div2.style.display = 'flex';
                return false;
            } else {
                alertconfirmcheck1();
            }
        }, 500);

    }
    const alertconfirmcheck1 = () => {
        var div1 = document.getElementById('alertconfirmcheck1');
        div1.style.left = "calc(50vw - 150px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('alertconfirmcheck');
        div2.style.display = 'flex';

    }
    const lestgoconfirm = async () => {
        steppoint2map(3)
        setcolumns(columns3)

        document.getElementById('alertconfirmcheck').style.display = 'none';
        document.getElementById('impdetail').style = "";
        document.getElementById('caldetail').style = "";
        document.getElementById('approve').style = "border-bottom: 5px solid red;";
        document.getElementById('exportPostcard').hidden = true;
        var confirmcal = [];
        selectionModel.forEach((item, i) => {
            if (rows1[item - 1] !== undefined) {
                confirmcal.push(rows1[item - 1].no)
            }
        })
        // console.log(confirmcal);
        // setrowsold(confirmcal)
        if (tabletypeimport === 'polygon') {
            // UpdCalParcelConfirm(confirmcal)
            let del = await DeleteVal(confirmcal)
            console.log(del, 'del');
            if (del.length > 0) {

                UpdCalParcelConfirm(confirmcal)
            }

        } else if (tabletypeimport === 'point') {
            UpdCalPointConfirm(confirmcal)
        }
        var div1 = document.getElementById('alertconfirm1');
        div1.style.left = "calc(50vw - 150px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('alertconfirm');
        div2.style.display = 'flex';
        setsteppoint(3)
        document.getElementById('typetables').value = '3';
        // setTimeout(() => {
        //     document.getElementById('alertconfirm').style.display = 'none';

        // }, 1000);
    }
    const impdetailClick = () => {
        steppoint2map(1)
        setsteppoint(1)
        document.getElementById('typetables').value = '1';
        setcolumns(columns1);
        // console.log(rowsold);
        var div1 = document.getElementById('loadingprogress1');
        div1.style.left = "calc(50vw - 150px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('loadingprogress');
        div2.style.display = 'flex';
        document.getElementById('impdetail').style.borderBottom = '5px solid red';
        document.getElementById('caldetail').style = {};
        document.getElementById('approve').style = {};
        document.getElementById('report').style = {};
        const steppoint1 = document.getElementById('steppoint1');
        const steppoint2 = document.getElementById('steppoint2');
        const steppoint3 = document.getElementById('steppoint3');
        const steppoint4 = document.getElementById('steppoint4');
        const steppoint5 = document.getElementById('steppoint5');
        steppoint1.disabled = false
        steppoint1.classList.remove("Mui-disabled")
        steppoint2.disabled = false
        steppoint2.classList.remove("Mui-disabled")
        steppoint3.disabled = true
        steppoint3.classList.add("Mui-disabled")
        steppoint4.disabled = true
        steppoint4.classList.add("Mui-disabled")
        steppoint5.disabled = true
        steppoint5.classList.add("Mui-disabled")
        document.getElementById('exportPostcard').hidden = true;
        if (tabletypeimport === 'polygon') {
            SelParcelSTS1ByParcelSeq(rowsold);
        } else if (tabletypeimport === 'point') {
            SelPointSTS1ByParcelSeq(rowsold);
        }
    };
    const caldetailClick = () => {
        // console.log(rowsold);
        steppoint2map(2)
        setsteppoint(2)
        document.getElementById('typetables').value = '2';
        document.getElementById('alertcompleatrel2').style.display = 'none';
        var div1 = document.getElementById('loadingprogress1');
        div1.style.left = "calc(50vw - 150px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('loadingprogress');
        div2.style.display = 'flex';
        document.getElementById('caldetail').style.borderBottom = '5px solid red';
        document.getElementById('impdetail').style = {};
        document.getElementById('approve').style = {};
        document.getElementById('report').style = {};
        const steppoint1 = document.getElementById('steppoint1');
        const steppoint2 = document.getElementById('steppoint2');
        const steppoint3 = document.getElementById('steppoint3');
        const steppoint4 = document.getElementById('steppoint4');
        const steppoint5 = document.getElementById('steppoint5');
        steppoint1.disabled = false
        steppoint1.classList.remove("Mui-disabled")
        steppoint2.disabled = true
        steppoint2.classList.add("Mui-disabled")
        steppoint3.disabled = false
        steppoint3.classList.remove("Mui-disabled")
        steppoint3.style.display = 'none';
        steppoint4.disabled = false
        steppoint4.classList.remove("Mui-disabled")
        steppoint4.style.display = 'inline-flex';
        steppoint5.disabled = true
        steppoint5.classList.add("Mui-disabled")
        document.getElementById('exportPostcard').hidden = true;
        if (tabletypeimport === 'polygon') {
            SelParcelSTS2ByParcelSeq(rowsold);
        } else if (tabletypeimport === 'point') {
            SelPointSTS2ByParcelSeq(rowsold);
        }
    };
    const approveClick = () => {
        // console.log(rowsold);        
        setcolumns(columns3)
        var div1 = document.getElementById('loadingprogress1');
        div1.style.left = "calc(50vw - 150px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('loadingprogress');
        div2.style.display = 'flex';
        document.getElementById('exportPostcard').hidden = true;
        document.getElementById('approve').style.borderBottom = '5px solid red';
        document.getElementById('caldetail').style = {};
        document.getElementById('impdetail').style = {};
        document.getElementById('report').style = {};
        steppoint2map(3)
        setsteppoint(3)
        document.getElementById('typetables').value = '3';
        const steppoint1 = document.getElementById('steppoint1');
        const steppoint2 = document.getElementById('steppoint2');
        const steppoint3 = document.getElementById('steppoint3');
        const steppoint4 = document.getElementById('steppoint4');
        const steppoint5 = document.getElementById('steppoint5');
        steppoint1.disabled = false
        steppoint1.classList.remove("Mui-disabled")
        steppoint2.disabled = true
        steppoint2.classList.add("Mui-disabled")
        steppoint3.disabled = true
        steppoint3.classList.add("Mui-disabled")
        steppoint4.disabled = true
        steppoint4.classList.add("Mui-disabled")
        steppoint5.disabled = false
        steppoint5.classList.remove("Mui-disabled")
        if (tabletypeimport === 'polygon') {
            SelParcelSTS3ByParcelSeq(rowsold);
        } else if (tabletypeimport === 'point') {
            SelPointSTS3ByParcelSeq(rowsold);
        }
    };

    const report_click = () => {
        setcolumns(columns4)
        steppoint2map(4)
        setsteppoint(4)
        document.getElementById('typetables').value = '4';
        console.log(rowsold, tabletypeimport, transaction, dataReport);
        const steppoint1 = document.getElementById('steppoint1');
        const steppoint5 = document.getElementById('steppoint5');
        steppoint1.disabled = false
        steppoint1.classList.remove("Mui-disabled")
        steppoint5.disabled = false
        steppoint5.classList.remove("Mui-disabled")
        document.getElementById('exportPostcard').hidden = false;
        document.getElementById('report').style.borderBottom = '5px solid red';
        document.getElementById('approve').style = {};
        document.getElementById('caldetail').style = {};
        document.getElementById('impdetail').style = {};

        toPostcart()
    }

    const setDataTable4 = async () => {
        setcolumns(columns4)
        steppoint2map(4)
        setsteppoint(4)
        document.getElementById('typetables').value = '4';
        var div1 = document.getElementById('loadingprogress1');
        div1.style.left = "calc(50vw - 150px)";
        div1.style.top = "calc(50vh - 100px)";
        var div2 = document.getElementById('loadingprogress');
        div2.style.display = 'flex';
        console.log(rowsold, tabletypeimport, transaction, dataReport);
        const steppoint1 = document.getElementById('steppoint1');
        const steppoint5 = document.getElementById('steppoint5');
        steppoint1.disabled = false
        steppoint1.classList.remove("Mui-disabled")
        steppoint5.disabled = false
        steppoint5.classList.remove("Mui-disabled")
        document.getElementById('exportPostcard').hidden = false;
        document.getElementById('report').style.borderBottom = '5px solid red';
        document.getElementById('approve').style = {};
        document.getElementById('caldetail').style = {};
        document.getElementById('impdetail').style = {};
        let transactions = [];
        let url = process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelSTS4ByParcelSeq";
        try {
            for (let i = 0; i < rowsold.length; i++) {
                if (rowsold[i] !== {}) {
                    if (rowsold.indexOf(rowsold[i]) !== i) {
                    } else {
                        let datasend = {
                            "PARCEL_S3_SEQ": String(rowsold[i]),
                            "ZONE": queryParameters.get("z")
                        }
                        let res = await axios.post(url, datasend);
                        let data = res.data;
                        let result = data.result;
                        if (result.length > 0) {
                            for (let j = 0; j < result.length; j++) {
                                let dataItems = result[j]
                                transactions.push(dataItems)
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
        console.log(transactions, 'transaction');
        await settransaction(transactions)
        // return false;
        let newData = [];
        for (var i = 0; i < transactions.length; i++) {
            let datasend = {
                id: i + 1,
                no: transactions[i].PARCEL_S3_SEQ,
                LAND_TYPE: ((transactions[i].LAND_TYPE == 'อื่นๆ') ? transactions[i].REMARK : transactions[i].LAND_TYPE),
                PARCEL_NO: transactions[i].PARCEL_ID,
                AMPHUR_CODE: transactions[i].AMPHUR_CODE,
                AMPHUR_NAME: transactions[i].AMPHUR_NAME_TH,
                OPT_CODE: transactions[i].OPT_CODE,
                OPT_NAME: transactions[i].OPT_NAME,
                TYPE_CODE: transactions[i].TYPE_CODE,
                TYPE_NAME: transactions[i].STREET_NAME,
                STREET_VALUE: transactions[i].ST_VALUE,
                STREET_VALUE_: transactions[i].STREET_VALUE_,
                STANDARD_DEPTH: transactions[i].STANDARD_DEPTH,
                DEPTH_R: transactions[i].DEPTH_R,
                LAND_TYPE_NAME: transactions[i].LAND_TYPE_NAME,
                AREA: transactions[i].NRAI + "-" + transactions[i].NNHAN + "-" + parseFloat(transactions[i].NWAH).toFixed(1),
                VAL_PER_WAH: ((transactions[i].VAL_PER_WAH === null) ? transactions[i].VAL_PER_WAH : numberWithCommas(transactions[i].VAL_PER_WAH)),
                AMT_VALUE: transactions[i].VALAREA,
                DATE_IMPORT: dateFormatTime(transactions[i].DATE_CREATED)
            }

            newData.push(datasend)
        }
        var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
        // console.log(obj);
        obj.scroll({ left: 0 })
        if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(el);
        unclickImpdetail()
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + ((transactions.length === undefined) ? i - 1 : i - 1 + ' รายการ')
        el.prepend(div);

        setrows1(newData)

        document.getElementById('exportPostcard').hidden = false;
        document.getElementById('report').style.borderBottom = '5px solid red';
        document.getElementById('approve').style = {};
        document.getElementById('caldetail').style = {};
        document.getElementById('impdetail').style = {};
        if (transactions.length > 0) {
            let steppoint5 = document.getElementById('steppoint5');
            steppoint5.disabled = true
            steppoint5.classList.add("Mui-disabled")
            // settransaction(transaction)
        }
        setTimeout(async () => {
            document.getElementById('loadingprogress').style.display = 'none';
        }, 500);
    }

    const step4cal = () => {
        console.log(transaction, 'transaction');
        if (selectionModel.length == 0) {
            console.log('selectionModel');
            var div1 = document.getElementById('alertselectlist3');
            div1.style.left = "calc(50vw - 150px)";
            div1.style.top = "calc(50vh - 100px)";
            var div2 = document.getElementById('alertselectlist2');
            div2.style.display = 'flex';
            // return false;
        } else {
            report_click()
        }
    }

    const toPostcartPage = () => {
        if (selectionModel.length == 0) {
            var div1 = document.getElementById('alertselectlist3');
            div1.style.left = "calc(50vw - 150px)";
            div1.style.top = "calc(50vh - 100px)";
            var div2 = document.getElementById('alertselectlist2');
            div2.style.display = 'flex';
            return false;
        }
        handleFullscreen()
        setShowDatatable(false)
        console.log(transaction, 'transaction');
        window.sessionStorage.setItem("transactionpush", JSON.stringify(transaction));
        document.getElementById('postcard').style.display = 'flex';
    }

    // React.useEffect(() => {
    //     if (transaction.length > 0) {
    //         setDataTable4()
    //     }
    // }, [transaction]);
    const getCellClassName = (params) => {
        if (params.row.no === Number(activeCellId)) {
            return 'active-cell';
        }
        return '';

    };

    return (
        <ThemeProvider theme={theme}>
            <input id='typeImport' type='hidden' />
            <input id='typetables' type='hidden' />
            {/* <input id='activeCellIds' type='' /> */}
            <Grid container style={{ position: "relative", display: 'flex', overflow: 'auto', height: "80px", overflowX: 'hidden' }} sx={{ pt: 1 }} >
                <Grid item md={6} xs={6}>
                    <Menus />
                </Grid>
            </Grid>
            <Grid container style={{ position: "relative", display: 'flex', zIndex: 10, width: "100%", height: "calc(100vh - 147px)", overflow: 'auto' }} sx={{ p: 2, pt: 1 }} >

                <Grid item md={12} xs={12} sx={{ alignItems: 'right', display: 'flex', flexDirection: 'row-reverse', }}>
                    <Box sx={{ textAlign: 'center', display: 'flex', width: 'fit-content', height: '0px' }}>
                        <Box xs={{ height: '10px', my: 3, ml: 3 }}>
                            <Button id="reloadp" onClick={handlereloadTable} style={{ display: 'none' }} sx={{ minWidth: '0px !important', }}>
                                {/* reload */}
                            </Button>
                            <Button onClick={handleFullscreen} sx={{ minWidth: '0px !important', }}>{showfullscreen ? <FullscreenIcon /> : <FullscreenExitIcon />}</Button></Box>

                    </Box>
                </Grid>

                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={SearchStyle0}
                    sx={{ minHeight: 'calc(100vh - 230px)' }}
                >
                    <Grid item md={12} xs={12} sx={{ pt: 1 }} >
                        <Button variant="contained" color='primary' sx={{ m: 1 }} onClick={handleClick1}> <img src={"/Vector.svg"} width={30} height={30} alt='' /><Typography sx={{ mx: 1 }}> นำเข้าไฟล์ SHP,KML</Typography></Button><br />
                        <Button variant="contained" color='error' sx={{ m: 1 }} onClick={handleClick11}><AddLocationAltOutlinedIcon /><Typography sx={{ mx: 1 }}> การนำเข้าแบบจุด (Point) </Typography></Button><br />
                        {/* <Button variant="contained" color='warning' sx={{ m: 1 }} onClick={handleClick111}><ManageSearchIcon /><Typography sx={{ mx: 1 }}> ค้นหาข้อมูลแปลงนำเข้า</Typography></Button> */}
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={SearchStyle1} sx={{ minHeight: '40vh' }}
                >
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', }}>
                            <Grid item style={{ display: 'block', zIndex: 10, }} sx={{ p: 3, minWidth: '400px', maxWidth: '400px', backgroundColor: 'white', borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)", border: '1px solid #D1D3DA' }}>
                                <Typography variant="h6" sx={{ textDecoration: 'underline' }}>ข้อกำหนดในการนำเข้า</Typography>
                                <ul>
                                    <li>
                                        <ListItemText>พิกัดรูปแปลง <span style={{ color: 'red' }}><b>Indian 1975 (Zone 47/48)</b></span> เท่านั้น</ListItemText>
                                    </li>
                                    <li>
                                        <ListItemText>รูปแบบต้องเป็น Polygon และ Multipolygon เท่านั้น</ListItemText>
                                        <span style={{ fontSize: '10pt' }}>สามารถ Download Template จากหน้าหลัก</span>
                                    </li>
                                    {/* <li>
                                        <ListItemText>นำเข้าได้ <b><span style={{ color: 'red' }}>ไม่เกิน</span>  100</b> รูปแปลง</ListItemText>
                                    </li> */}
                                </ul>
                                <Grid item sx={{ textAlign: 'right', width: '100%' }}>
                                    <Button variant="contained" color='primary' onClick={handleClick2}>ต่อไป</Button>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={SearchStyle11} sx={{ minHeight: '40vh' }}
                >
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', }}>
                            <Grid item style={{ display: 'block', zIndex: 10, }} sx={{ p: 3, minWidth: '400px', maxWidth: '400px', backgroundColor: 'white', borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)", border: '1px solid #D1D3DA' }}>
                                <Typography variant="h6" sx={{ textDecoration: 'underline' }}>ข้อแนะนำ การนำเข้าแบบกำหนดเอง</Typography>
                                <ul>
                                    <li>
                                        <ListItemText>ระบุตำแหน่งในแผนที่ โดยใช้เครื่องมือ <AddLocationAltOutlinedIcon /></ListItemText>
                                    </li>
                                    <li>
                                        <ListItemText>กรุณากรอกข้อมูลให้ครบถ้วน</ListItemText>

                                    </li>
                                </ul>
                                <Grid item sx={{ textAlign: 'right', width: '100%' }}>
                                    <Button variant="contained" color='primary' onClick={handleClick12}>ต่อไป</Button>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={SearchStyle2} sx={{ minHeight: '40vh' }}
                >
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', }}>
                        <Grid item style={{ display: 'block', zIndex: 10, }} sx={{ minWidth: '400px', maxWidth: '400px', backgroundColor: 'white', borderRadius: '5px', }}>
                            <LoadShp resgeojson={resgeojson} />
                        </Grid>

                    </Grid>

                </Grid>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={SearchStyle3} sx={{ minHeight: '50vh' }}
                ><Grid item xs={12}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', }}>
                            <Grid item sx={{ textAlign: 'center', p: 2, width: '300px', backgroundColor: 'white', borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)", border: '1px solid #D1D3DA' }}>
                                {/* <CircularProgress /> */}
                                <Typography variant="body1" sx={{}}>รูปแปลงอยู่ในขอบเขต  {inboundary}  รายการ</Typography>
                                <Typography variant="body1" sx={{}}>รูปแปลงอยู่นอกขอบเขต  {outboundary}  รายการ</Typography>
                                <Typography variant="h6" sx={{ textDecoration: 'underline' }}>จำนวนรายการทั้งหมด  {inboundary + outboundary}  รายการ</Typography>
                                <Button id="totable" variant="contained" color='primary' onClick={handleClick4}>ตกลง</Button>
                                <Button variant="contained" color='warning' sx={{ m: '1px' }} onClick={deletePropertiesPolygon}>ลบ</Button>

                            </Grid>

                        </Grid>

                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={SearchStyle5}
                    sx={{ minHeight: 'calc(100vh - 230px)' }}
                >
                    <Grid item sx={{ textAlign: 'center', pr: 5, backgroundColor: 'white', }}>
                        <Typography sx={{ fontSize: '16pt' }}>ค้นหาข้อมูลแปลงนำเข้า</Typography>
                        <Grid item>
                            <Grid id="searchReport" container sx={{ width: '100%', backgroundColor: '#fff', borderRadius: '15px 15px 0px 0px', pb: '20px' }}>
                                <Grid item md={12} xs={12} sx={{ textAlign: 'left', backgroundColor: '#fff', }}>
                                    <Grid container sx={{ p: 1, pr: 3 }}>
                                        <Grid item md={12} xs={12} sx={{ p: 1 }}>
                                            <Grid id="selStatus">
                                                <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 2, }}>รูปแบบแปลงนำเข้า <span style={{ color: 'red' }}>*</span></Typography>
                                                <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                                    <InputLabel id="Status-label">รูปแบบแปลงนำเข้า <span style={{ color: 'red' }}>*</span></InputLabel>
                                                    <Select
                                                        labelId="Status-label"
                                                        id="Status"
                                                        value={selectedStatus}
                                                        label="เลือกสถานะดำเนินการ "
                                                        onChange={handleChangeStatus}
                                                    >
                                                        <MenuItem value="">
                                                            <em>-เลือกรูปแบบ-</em>
                                                        </MenuItem>
                                                        {status.map((status, i) => (
                                                            <MenuItem key={i} value={status.FLAG_PARCEL}>{status.FLAG_PARCEL_NAME}</MenuItem>
                                                        ))}
                                                        {/* <MenuItem value="1">
                                                            <em>รูปแปลง (ไฟล์ SHP,KMZ,KML)</em>
                                                        </MenuItem><MenuItem value="2">
                                                            <em>แบบกำหนดตำแหน่ง</em>
                                                        </MenuItem> */}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Grid item md={6} xs={6} sx={{ p: 1 }}>
                                            <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 2, }}>จังหวัด <span style={{ color: 'red' }}>*</span></Typography>
                                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                                <InputLabel id="Province-label">จังหวัด <span style={{ color: 'red' }}>*</span></InputLabel>
                                                <Select
                                                    labelId="Province-label"
                                                    id="Province"
                                                    value={vselectedProvince}
                                                    label="เลือกจังหวัด"
                                                    onChange={handleChangeProvince}
                                                >
                                                    <MenuItem value="">
                                                        <em>-เลือกจังหวัด-</em>
                                                    </MenuItem>
                                                    {province.map((province, i) => (
                                                        <MenuItem key={i} value={province.PRO_C + '|' + province.MAPZONE} >{province.ON_PRO_THA}</MenuItem>
                                                    ))}
                                                </Select>
                                                {/* <FormHelperText>With label + helper text</FormHelperText> */}
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={6} sx={{ p: 1 }}>
                                            <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 2, }}>อำเภอ <span style={{ color: 'red' }}>*</span></Typography>
                                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                                <InputLabel id="Aumpher-label">อำเภอ <span style={{ color: 'red' }}>*</span></InputLabel>
                                                <Select
                                                    labelId="Aumpher-label"
                                                    id="Aumpher"
                                                    value={selectedAumpher}
                                                    label="เลือกอำเภอ"
                                                    onChange={handleChangeAumpher}
                                                >
                                                    <MenuItem value="">
                                                        <em>-เลือกอำเภอ-</em>
                                                    </MenuItem>
                                                    {aumpher.map((district, i) => (
                                                        <MenuItem key={i} value={district.AMPHUR_CODE}>{district.AMPHUR_DESCRIPTION}</MenuItem>
                                                    ))}
                                                </Select>
                                                {/* <FormHelperText>With label + helper text</FormHelperText> */}
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={6} sx={{ p: 1 }}>
                                            <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 2, }}>ขอบเขต <span style={{ color: 'red' }}>*</span></Typography>
                                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                                <InputLabel id="Boundary-label">ขอบเขต <span style={{ color: 'red' }}>*</span></InputLabel>
                                                <Select
                                                    labelId="Boundary-label"
                                                    id="Boundary"
                                                    value={selectedselType}
                                                    label="เลือกเขตการปกครอง"
                                                    onChange={handleChangeBoundary}
                                                >
                                                    <MenuItem value="">
                                                        <em>-เลือกเขตการปกครอง-</em>
                                                    </MenuItem>
                                                    {selType.map((selType, i) => (
                                                        <MenuItem key={i} value={selType.OPT_TYPE}>{selType.OPT_NAME_TYPE}</MenuItem>
                                                    ))}
                                                </Select>
                                                {/* <FormHelperText>With label + helper text</FormHelperText> */}
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={6} sx={{ p: 1 }}>
                                            <Typography id="Tumbol-head" sx={{ color: '#2F4266', fontSize: '12pt', px: 2, }}>เทศบาล/ตำบล<span id="Tumbol-head-s" style={stateTumbol ? {} : { color: 'red' }}>*</span></Typography>
                                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                                <InputLabel id="Tumbol-label">{labelMunicipal}<span style={stateTumbol ? {} : { color: 'red' }}>*</span></InputLabel>
                                                <Select
                                                    labelId="Tumbol-label"
                                                    id="Tumbol"
                                                    value={selectedTumbol}
                                                    label={labelMunicipal}
                                                    onChange={handleChangeTumbol}
                                                >
                                                    <MenuItem value="">
                                                        <em>{labelMunicipal}</em>
                                                    </MenuItem>
                                                    {tumbol.map((tumbol, i) => (
                                                        <MenuItem key={i} value={tumbol.OPT_CODE}>{tumbol.OPT_NAME_ABBR}</MenuItem>
                                                    ))}
                                                </Select>
                                                {/* <FormHelperText>With label + helper text</FormHelperText> */}
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6} xs={6} sx={{ pl: 2, pt: 1, '& .MuiFormControl-root.MuiTextField-root': { width: '100%' }, display: 'none' }}>
                                            <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 1, height: 'fit-content', pb: 1 }}>วัน/เดือน/ปี <span style={{ color: 'red' }}>*</span></Typography>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                <DesktopDatePicker sx={{ m: 1, width: '100%', }}
                                                    // label="วัน/เดือน/ปี นำเข้า"
                                                    inputFormat="DD/MM/YYYY"
                                                    value={DateStart}
                                                    onChange={handleChangeDateStart}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item md={6} xs={6} sx={{ pl: 2, pt: 1, '& .MuiFormControl-root.MuiTextField-root': { width: '100%' }, }}>
                                            <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 1, height: 'fit-content', pb: 1 }}>วัน/เดือน/ปี <span style={{ color: 'red' }}>*</span></Typography>
                                            <LocalizationProvider dateAdapter={OverwriteAdapterDayjs} adapterLocale='th'>
                                                <DesktopDatePicker sx={{ m: 1, width: '100%' }}
                                                    // label="วัน/เดือน/ปี นำเข้า"
                                                    // inputFormat="DD/MM/YYYY"
                                                    format={'D MMM YYYY'}
                                                    value={DateEnd}
                                                    onChange={handleChangeDateEnd}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item md={12} xs={12} sx={{ p: 1, textAlign: 'center', }}>
                                            <Box id="selStatus1"><br /><br /></Box>
                                            <Button variant="contained" color="primary" sx={{ mx: 2 }} onClick={handleChangeSubmitSearchReport}>ค้นหา</Button>
                                            <Button variant="contained" color="warning" sx={{ mx: 2 }} onClick={handleChangeClearSearchReport} >ล้างค่า</Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid id="abc"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={SearchStyle4} sx={{ minHeight: '50vh', }}
                >
                    <Grid item sx={{ textAlign: 'center', pr: 5, backgroundColor: 'white', }}>
                        <Button id="steppoint1" sx={{ mx: 1, backgroundColor: 'rgba(198, 40, 40, 0.5)', color: 'white', ':hover': { backgroundColor: 'rgba(198, 40, 40, 0.8)' } }} onClick={impdetail}><img src={"/selectall.svg"} width={30} height={30} alt='' />เลือกทั้งหมด</Button>
                        <Button id="steppoint2" sx={{ mx: 1, backgroundColor: 'rgba(255, 139, 2, 0.5)', color: 'white', ':hover': { backgroundColor: 'rgba(255, 139, 2, 0.8)' } }} onClick={step1cal} ><img src={"/calculate.svg"} width={30} height={30} alt='' />คำนวณราคา</Button>
                        <Button id="steppoint3" sx={{ mx: 1, backgroundColor: 'rgba(12, 213, 117, 0.5)', color: 'white', ':hover': { backgroundColor: 'rgba(12, 213, 117, 0.8)' } }} onClick={checkdata} disabled><img src={"/confirmcal.svg"} width={30} height={30} alt='' />ยืนยัน</Button>
                        <Button id="steppoint4" sx={{ mx: 1, backgroundColor: 'rgba(12, 213, 117, 0.5)', color: 'white', ':hover': { backgroundColor: 'rgba(12, 213, 117, 0.8)' } }} style={{ display: 'none' }} onClick={checkdata} ><img src={"/confirmcal.svg"} width={30} height={30} alt='' />ยืนยัน</Button>
                        <Button id="steppoint5" sx={{ mx: 1, backgroundColor: 'rgba(66,103,178, 0.5)', color: 'white', ':hover': { backgroundColor: 'rgba(66,103,178, 0.8)' } }} onClick={step4cal}><img src={"/export.svg"} width={30} height={30} alt='' />รายงาน</Button>
                    </Grid>
                    {/* <Grid item sx={{ textAlign: 'right', pr: 5, backgroundColor: 'white', }}>
                        <Button onClick={gendata}><FullscreenIcon />gendata</Button>
                        <Button onClick={deldata}><FullscreenIcon />deldata</Button>
                    </Grid> */}
                    <Grid item sx={{ textAlign: 'center', pr: 5, backgroundColor: 'white', }}>
                        <Box id="impdetail" style={{ borderBottom: '5px solid red' }} sx={{ display: 'inline-block', width: '25%', cursor: 'pointer' }} onClick={impdetailClick}>รายละเอียดการนำเข้า</Box>
                        <Box id="caldetail" sx={{ display: 'inline-block', width: '25%', cursor: 'pointer' }} onClick={caldetailClick}>คำนวณ</Box>
                        <Box id="approve" sx={{ display: 'inline-block', width: '25%', cursor: 'pointer' }} onClick={approveClick}>ราคาที่ยืนยันแล้ว</Box>
                        <Box id="report" sx={{ display: 'inline-block', width: '25%', cursor: 'pointer' }} onClick={setDataTable4}>รายงาน</Box>
                    </Grid>
                    <Grid item sx={{ textAlign: 'center', p: 0, backgroundColor: 'white', }}>
                        <div style={{
                            height: 'calc(100vh - 243px)',
                            width: '100%'
                        }}>
                            <DataGrid
                                autoHeight
                                rows={rows1}
                                columns={columns}
                                pageSize={pageSize}
                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                rowsPerPageOptions={[10, 25, 50, 75, 100]}
                                checkboxSelection
                                hideFooterSelectedRowCount
                                components={{
                                    Pagination: CustomPagination,
                                }}
                                onSelectionModelChange={(aaa) => {
                                    // console.log(steppoint);
                                    setSelectionModel(aaa);
                                    setSelectionModel2(aaa);
                                    setTimeout(() => {
                                        // console.log('a' + aaa, selectionModel);
                                    }, 500);
                                }}
                                getCellClassName={(params) => {
                                    if (params.field === 'VAL_PER_WAH') {
                                        return 'price';
                                    } else if (params.field === 'AMT_VALUE') {
                                        return 'priceAll';
                                    }
                                }}

                                getRowClassName={getCellClassName}
                                // getRowClassName={(params) => {
                                //     console.log(params.row.no , 'params.row.no');
                                // }}

                                sx={{
                                    boxShadow: 2,
                                    border: 2,
                                    borderColor: 'primary.light',
                                    '& .MuiDataGrid-cell:hover': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: '#E6E8EE',
                                    },
                                    '& .price': {
                                        '& .MuiDataGrid-cellContent': {
                                            backgroundColor: '#00D97A',
                                            p: '5px', minWidth: '80px', textAlign: 'center'
                                        },
                                    },
                                    '& .priceAll': {
                                        '& .MuiDataGrid-cellContent': {
                                            backgroundColor: '#FC5A5A',
                                            p: '5px', minWidth: '80px', textAlign: 'center'
                                        },
                                    },
                                    "& .MuiDataGrid-columnHeaderTitle": {
                                        whiteSpace: "normal",
                                        lineHeight: "normal"
                                    },
                                    '& .active-cell': {
                                        // color: '#aae8e6',
                                        backgroundColor: '#aae8e6',
                                        p: '1px', minWidth: '80px', textAlign: 'center'
                                    }
                                }}
                                initialState={{
                                    pinnedColumns: {
                                        left: [GRID_CHECKBOX_SELECTION_COL_DEF.field],
                                    },
                                }}
                            // getRowClassName={(params) => `super-app-theme--${params.row.status}`}
                            />
                            <Grid id="exportPostcard" item sx={{ textAlign: 'right', pr: 5, backgroundColor: 'white', }} hidden>
                                <Button variant="contained" color='primary' sx={{ m: 1 }} onClick={toPostcartPage}>รายงาน <img src={"/export.svg"} width={25} height={25} style={{ marginLeft: '10px' }} alt='' /></Button>
                            </Grid>


                        </div>
                    </Grid>
                </Grid>
                <Grid id="alertcal"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" textAlign="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="alertcal1" item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelcal}><CloseIcon color="white" /></Button>
                        </Grid><br />
                        ฐานในการประเมินราคาที่ดิน<br />
                        คำนวณจากบัญชีประเมินรายเขตปกครอง<br /><br />
                        <Button variant="contained" color='primary' sx={{ mr: '15px' }} onClick={lestgocal}>ตกลง</Button>
                        <Button variant="contained" id="closeProperties" color='error' sx={{ ml: '15px' }} onClick={cancelcal}>ยกเลิก</Button>
                    </Grid>
                </Grid>
                <Grid id="alertconfirm"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" textAlign="center" style={{ zIndex: 99, position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="alertconfirm1" item sx={{ width: '300px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            {/* <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelconfirm}><CloseIcon color="white" /></Button> */}
                        </Grid><br />
                        <img src={"/check-mark.png"} width={100} height={100} alt='' /><br />
                        ยืนยันราคา สำเร็จ
                        <br />
                        <Button variant="contained" color='primary' sx={{ mr: '15px', mb: 2, marginTop: 3 }} onClick={handleAlertClose}>ตกลง</Button><br />
                    </Grid>
                </Grid>
                <Grid id="alertcompleatrel"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" textAlign="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="alertcompleatrel1" item sx={{ width: '300px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            {/* <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelconfirm}><CloseIcon color="white" /></Button> */}
                        </Grid><br />
                        <img src={"/check-mark.png"} width={100} height={100} alt='' /><br />
                        ระบบทำการขีดเส้นอัตโนมัติสำเร็จ
                        <br />
                        <Button variant="contained" color='primary' sx={{ mr: '15px', mb: 2, marginTop: 3 }} onClick={handlereload}>ตกลง</Button><br />
                    </Grid>
                </Grid>
                <Grid id="alertcompleatrel2"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" textAlign="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="alertcompleatrel3" item sx={{ width: '300px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            {/* <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelconfirm}><CloseIcon color="white" /></Button> */}
                        </Grid><br />
                        <img src={"/check-mark.png"} width={100} height={100} alt='' /><br />
                        ระบบทำการขีดเส้นอัตโนมัติสำเร็จ
                        <br />
                        <Button variant="contained" color='primary' sx={{ mr: '15px', mb: 2, marginTop: 3 }} onClick={caldetailClick}>ตกลง</Button><br />
                    </Grid>
                </Grid>
                <Grid id="alertcompleatrel"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" textAlign="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="alertcompleatrel1" item sx={{ width: '300px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            {/* <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelconfirm}><CloseIcon color="white" /></Button> */}
                        </Grid><br />
                        <img src={"/check-mark.png"} width={100} height={100} alt='' /><br />
                        ระบบทำการขีดเส้นอัตโนมัติสำเร็จ
                        <br />
                        <Button variant="contained" color='primary' sx={{ mr: '15px', mb: 2, marginTop: 3 }} onClick={handlereload}>ตกลง</Button><br />
                    </Grid>
                </Grid>
                <Grid id="alertselectlist"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" textAlign="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="alertselectlist1" item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelselectlist}><CloseIcon color="white" /></Button>
                        </Grid><br />
                        <CrisisAlertIcon sx={{ fontSize: 100, color: '#FF8B02' }} /><br />
                        กรุณาเลือกแปลงที่ต้องการส่งคำนวณ
                    </Grid>

                </Grid>
                <Grid id="alertselectlist2"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" textAlign="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="alertselectlist3" item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelselectlist2}><CloseIcon color="white" /></Button>
                        </Grid><br />
                        <CrisisAlertIcon sx={{ fontSize: 100, color: '#FF8B02' }} /><br />
                        กรุณาเลือกแปลงที่ต้องการออกรายงาน
                    </Grid>

                </Grid>
                <Grid id="alertconfirmlist"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" textAlign="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="alertconfirmlist1" item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelconfirm2}><CloseIcon color="white" /></Button>
                        </Grid><br />
                        <CrisisAlertIcon sx={{ fontSize: 100, color: '#FF8B02' }} /><br />
                        กรุณาเลือกแปลงที่ต้องการยืนยัน
                    </Grid>
                </Grid>
                <Grid id="alertconfirmlist4"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" textAlign="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="alertconfirmlist5" item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelconfirm2}><CloseIcon color="white" /></Button>
                        </Grid><br />
                        <CrisisAlertIcon sx={{ fontSize: 100, color: '#FF8B02' }} /><br />
                        กรุณาเลือกแปลงที่ต้องการออกรายงาน
                    </Grid>
                </Grid>
                <Grid id="alertconfirmcheck"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" textAlign="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="alertconfirmcheck1" item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelconfirm3}><CloseIcon color="white" /></Button>
                        </Grid><br />
                        ยืนยันข้อมูล<br />(ถ้ากดยืนยันแล้ว ไม่สามารถแก้ไขได้)<br /><br />
                        <Button variant="contained" color='primary' sx={{ mr: '15px' }} onClick={lestgoconfirm}>ยืนยัน</Button>
                        <Button variant="contained" id="closeProperties" color='error' sx={{ ml: '15px' }} onClick={cancelconfirm3}>ยกเลิก</Button>
                    </Grid>
                </Grid>
                <Grid id="alertsearch"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="alertsearch1" item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelalertsearch}><CloseIcon color="white" /></Button>
                        </Grid><br />
                        <CrisisAlertIcon sx={{ fontSize: 100, color: '#FF8B02' }} /><br />
                        กรุณากรอกข้อมูลให้ครบถ้วน
                    </Grid>
                </Grid>
                <Grid id="postcard"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100%', height: 'calc(100vh - 230px)', display: 'none' }}>
                    <Grid item sx={{ width: '100%', height: 'calc(100vh - 230px)', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            <Button id="backpostcard" size="small" variant="contained" color='primary' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '50px', height: '50px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={backpostcard}><ArrowBackIcon color="white" /></Button>
                            {/* <Button id="exportpostcard" size="small" variant="contained" color='primary' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '50px', height: '50px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={exportpostcard}><TextSnippetOutlinedIcon color="white" /></Button> */}
                            <Button id="printpostcard" size="small" variant="contained" color='primary' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '50px', height: '50px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={printpostcard}><PrintOutlinedIcon color="white" /></Button>
                        </Grid><br />
                        <Grid id="postcard01"
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center" sx={{ pb: '50px' }}>
                            {transaction.map((items, i) =>
                                items.STREET_VALUE_ ?
                                    selectionModel.includes((i + 1)) &&
                                    <Grid id={"postcard" + (i + 1)} className='postcard' item sx={{ width: '1100px', height: '860px', border: '1px solid gray', pl: 5, pt: 1, pr: 2, pb: 1, mb: 2, backgroundImage: 'url(/168182119131023762.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', backgroundSize: 'contain', }}>
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
                                                        <td colSpan={2}><b><span style={{ color: '#084291' }}>ประเภทเอกสาร</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{((items.LAND_TYPE == 'อื่นๆ') ? items.REMARK : items.LAND_TYPE)}</td><td><b><span style={{ color: '#084291' }}>เลขที่</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.PARCEL_ID}</td>
                                                    </tr>
                                                    <tr style={{ height: '50px' }}>
                                                        <td colSpan={2}><b><span style={{ color: '#084291' }}>จังหวัด</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.CHANGWAT_NAME}</td><td><b><span style={{ color: '#084291' }}>อำเภอ</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.AMPHUR_NAME_TH}</td>
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
                                                        <td><span style={{ color: '#084291' }}><b></b></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td colSpan={2}><span style={{ color: '#084291' }}><b>ราคาหน่อยที่ดินนอกหนือ </b>(บาท)</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{numberWithCommas(items.STREET_VALUE_)}</td>
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
                                                        <td style={{ width: '220px' }}><span style={{ color: '#084291' }}><b>ราคาทั้งแปลง</b> (บาท)</span></td><td><Box sx={{ padding: '10px', backgroundColor: 'rgba(252, 90, 90, 0.7)', width: '150px', textAlign: 'center' }}>{((items.VALAREA === null) ? 0 : items.VALAREA.toLocaleString('en-US'))}</Box></td>
                                                    </tr>
                                                    <tr style={{ height: '50px' }}>

                                                    </tr>
                                                    <tr style={{ height: '50px', textAlign: 'right', fontSize: '15pt' }}>
                                                        <td colSpan={3}><br></br><b>วันที่พิมพ์  {dateFormatTime(items.DATE_CREATED)}</b></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Grid>
                                    :
                                    selectionModel.includes((i + 1)) &&
                                    <Grid id={"postcard" + (i + 1)} className='postcard' item sx={{ width: '1100px', height: '820px', border: '1px solid gray', pl: 5, pt: 1, pr: 2, pb: 1, mb: 2, backgroundImage: 'url(/168182119131023762.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', backgroundSize: 'contain', }}>
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
                                                        <td colSpan={2}><b><span style={{ color: '#084291' }}>ประเภทเอกสาร</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{((items.LAND_TYPE == 'อื่นๆ') ? items.REMARK : items.LAND_TYPE)}</td><td><b><span style={{ color: '#084291' }}>เลขที่</span></b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{items.PARCEL_ID}</td>
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
                                                        <td style={{ width: '220px' }}><span style={{ color: '#084291' }}><b>ราคาทั้งแปลง</b> (บาท)</span></td><td><Box sx={{ padding: '10px', backgroundColor: 'rgba(252, 90, 90, 0.7)', width: '150px', textAlign: 'center' }}>{((items.VALAREA === null) ? 0 : items.VALAREA.toLocaleString('en-US'))}</Box></td>
                                                    </tr>
                                                    <tr style={{ height: '50px' }}>

                                                    </tr>
                                                    <tr style={{ height: '50px', textAlign: 'right', fontSize: '15pt' }}>
                                                        <td colSpan={3}><br></br><b>วันที่พิมพ์  {dateFormatTime(items.CREATE_DATE) + ' น.'}</b></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Grid>
                            )}

                        </Grid>
                    </Grid>
                </Grid>
                <Grid id="loadingpopup"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="loadingpopup1" item sx={{ width: '400px', borderRadius: '5px', backgroundColor: 'white', p: '30px', textAlign: 'center' }}>
                        <CircularProgress sx={{ fontSize: 100, }} /><br />{(totalcalc > 0) ? "( " + numcalc + " / " + totalcalc + " )" : ''} Loading.... <br />ระบบอยู่ระหว่างการประมวลผล<br /><Typography variant='h6' color={'red'}>กรุณาอย่าปิดหน้าจอ</Typography>
                    </Grid>
                </Grid>
                <Grid id="loadingprogress"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                    <Grid id="loadingprogress1" item sx={{ width: '300px', borderRadius: '5px', backgroundColor: 'white', p: '30px', textAlign: 'center' }}>
                        <CircularProgress sx={{ fontSize: 100, }} /><br /> Loading....
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}