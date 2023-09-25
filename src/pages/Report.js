import * as React from 'react';
import * as FileSaver from 'file-saver';
import { useEffect, useState } from 'react'
import XLSX from 'sheetjs-style';
import {
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  WidthType,
  TextRun,
  PageOrientation,
  SectionType, Header, Footer, PageNumberFormat, columnTitles
} from "docx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import AppHeader from './components/home/Header';
import Menus from './components/home/Menus';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, FormControl, InputLabel, Select, MenuItem, Typography, Box, Link, Button, Input } from "@mui/material";
import TextField from '@mui/material/TextField';
import SearchReport from './components/report/SearchReport';
import * as fs from "fs";
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { th } from 'date-fns/locale';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import LocalizedFormat from 'dayjs/plugin/buddhistEra';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import JsPDF from 'jspdf';
import pdfMake from "pdfmake/build/pdfmake";
import html2canvas from "html2canvas";
import pdfFonts from "./font/vfs_fonts";
import OverwriteAdapterDayjs from './components/date_adapter/OverwriteLibs';
import { dateFormatTime } from '../libs/dataOutputImport';
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

dayjs.locale('th');
dayjs.extend(LocalizedFormat);

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
// const ExportExcel = ({excelData,fileName})=>{

// }

export default function ToggleButtons() {

  const { palette } = createTheme();
  const { augmentColor } = palette;
  const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
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
    palette: {
      anger: createColor('#F40B27'),
      apple: createColor('#5DBA40'),
      steelBlue: createColor('#5C76B7'),
      violet: createColor('#fcc2c2'),
    },
  });
  function calcScreenWidthByPercent(percent, pixel) {
    const table = document.getElementsByTagName('body');
    const screenWidth = table[0].scrollWidth - 160;
    const width = (percent / 100) * screenWidth;
    if (width < pixel) {
      return pixel;
    } else {
      return width;
    }
    // console.log(document.getElementsByTagName('body'));
  }
  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    };

    const wbout = XLSX.write(workbook, wopts);

    // The application/octet-stream MIME type is used for unknown binary files.
    // It preserves the file contents, but requires the receiver to determine file type,
    // for example, from the filename extension.
    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });

    return blob;
  };
  const s2ab = (s) => {
    // The ArrayBuffer() constructor is used to create ArrayBuffer objects.
    // create an ArrayBuffer with a size in bytes
    const buf = new ArrayBuffer(s.length);

    // console.log(buf);

    //create a 8 bit integer array
    const view = new Uint8Array(buf);

    // console.log(view);
    //charCodeAt The charCodeAt() method returns an integer between 0 and 65535 representing the UTF-16 code
    for (let i = 0; i !== s.length; ++i) {
      // console.log(s.charCodeAt(i));
      view[i] = s.charCodeAt(i);
    }

    return buf;
  };
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  // const datawxcel = rows
  const dateThai = () => {
    const datestart = new Date(DateStart == null ? null : DateStart.$y, DateStart == null ? null : DateStart.$M, DateStart == null ? null : DateStart.$D)
    const dateend = new Date(DateEnd.$y, DateEnd.$M, DateEnd.$D)

    var result = datestart.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    result += ' ถึงวันที่ ';
    result += dateend.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    return result;
  }
  const exportToExcel = (fileName, fileExtension) => {
    handleExport(fileName, fileExtension).then((url) => {
      // console.log(url);
      if (url !== false) {
        if (selectedReportType === 1) {
          if (selectedStatus === 1) {
            fileName = 'รายงานนำเข้าข้อมูลรูปแปลงที่ดิน';
          } else {
            fileName = 'รายงานคำนวณมูลค่าที่ดินจากบัญชีรายเขตปกครอง';
          }
        } else {
          fileName = 'รายงานบัญชีราคาประเมินที่ดินตามบัญชีรายเขตปกครอง';
        }
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", fileName + "." + fileExtension);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }

    });
  };
  const handleExport = async (fileName, fileExtension) => {
    var name = '';
    selType.forEach((item, i) => {
      if (item.OPT_TYPE === selectedselType) {
        name += item.OPT_NAME_TYPE;
      }
    });
    tumbol.forEach((item, i) => {
      if (item.OPT_CODE === selectedTumbol) {
        name += " " + item.OPT_NAME_ABBR;
      }
    });
    if (selectedReportType === 1) {
      if (selectedStatus === 1) {
        fileName = 'รายงานนำเข้าข้อมูลรูปแปลงที่ดิน';
        var finalData = [
          { A: 'รายงานนำเข้าข้อมูลรูปแปลงที่ดิน' },
          { A: name },
          { A: 'ระหว่างวันที่ ' + dateThai() },
          { A: 'ลำดับที่', B: 'ประเภทเอกสารสิทธิ', C: 'เลขที่เอกสารสิทธิ', D: 'ชื่ออำเภอ', E: 'ชื่อเทศบาล/ตำบล', F: 'วันที่นำเข้าข้อมูล' },
          {
            A: '', B: '', C: '', D: '', E: '', F: '',
            // G: 'นำเข้าข้อมูล'
          },
        ]
        await rows.forEach((item, i) => {
          finalData.push({
            A: i + 1,
            B: item.LAND_TYPE + "",
            C: item.CHANODE_NO + "",
            D: item.AMPHUR_NAME + "",
            E: item.OPT_NAME + "",
            F: dateFormatTime(item.DATE_CREATED) + "",
          })
        })
      } else {
        fileName = 'รายงานคำนวณมูลค่าที่ดินจากบัญชีรายเขตปกครอง';
        var finalData = [
          { A: 'รายงานคำนวณมูลค่าที่ดินจากบัญชีรายเขตปกครอง' },
          { A: name },
          { A: 'ระหว่างวันที่ ' + dateThai() },
          {
            A: 'ลำดับที่', B: 'ประเภทเอกสารสิทธิ', C: 'เลขที่เอกสารสิทธิ', D: 'ชื่ออำเภอ', E: 'ชื่อเทศบาล/ตำบล', F: 'ราคา (บาท/ตร.ว.)',
            // G: 'วัน/เดือน/ปี' 
          },
          {
            A: '', B: '', C: '', D: '', E: '', F: '',
            // G: 'นำเข้าข้อมูล'
          },
        ]

        await rows.forEach((item, i) => {
          finalData.push({
            A: i + 1,
            B: item.LAND_TYPE + "",
            C: item.CHANODE_NO + "",
            D: item.AMPHUR_NAME + "",
            E: item.OPT_NAME + "",
            F: (item.VAL_PER_WAH !== null) ? item.VAL_PER_WAH.toLocaleString('en-US') + "" : 0,
            // G: item.PROCESS_2STS_DATE + "",
          })
        })
      }

    } else if (selectedReportType === 2) {
      fileName = 'รายงานบัญชีราคาประเมินที่ดินตามบัญชีรายเขตปกครอง';
      var finalData = [
        { A: 'รายงานบัญชีราคาประเมินที่ดินตามบัญชีรายเขตปกครอง' },
        { A: name },
        { A: 'ระหว่างวันที่ ' + dateThai() },
        { A: 'ลำดับที่', B: 'ประเภทเอกสารสิทธิ', C: 'เลขที่เอกสารสิทธิ', D: 'รหัสอำเภอ', E: 'ชื่ออำเภอ', F: 'รหัสเทศบาล', G: 'ชื่อเทศบาล/ตำบล', H: 'ประเภทหน่วยที่ดิน', I: 'ชื่อหน่วย', J: 'ราคาหน่วยที่ดิน', K: 'ความลึกมาตรฐาน', L: 'ความลึกแปลง', M: 'ประเภทรูปแปลงที่ดิน', N: 'เนื้อที่', O: 'ราคา', P: 'ราคาแปลงทั้งหมด', Q: 'วัน/เดือน/ปี' },
        { A: '', B: '', C: '', D: '', E: '', F: '', G: '', H: '', I: '', J: '', K: '', L: '', M: '', N: '(ไร่-งาน-ตร.ว.)', O: '(บาท/ตร.ว.)', P: '(บาท)', Q: 'ที่ยืนยันราคา' }
      ]
      await rows.forEach((item, i) => {
        finalData.push({
          A: i + 1,
          B: item.LAND_TYPE + "",
          C: item.CHANODE_NO + "",
          D: item.AMPHUR_CODE + "",
          E: item.AMPHUR_NAME + "",
          F: item.OPT_CODE + "",
          G: item.OPT_NAME + "",
          H: item.TYPE_CODE + "",
          I: item.STREET_NAME + "",
          J: item.ST_VALUE + "",
          K: item.STANDARD_DEPTH + "",
          L: item.DEPTH_R + "",
          M: item.LAND_TYPE_NAME + "",
          N: item.AREA + "",
          O: (item.VAL_PER_WAH !== null) ? item.VAL_PER_WAH.toLocaleString('en-US') + "" : 0,
          P: (item.VAL_AREA !== null) ? item.VAL_AREA.toLocaleString('en-US') + "" : 0,
          Q: dateFormatTime(item.DATE_CREATED) + ""
        })
      })

    }


    if (fileExtension === 'csv') {
      // console.log('csv');
      const ws = XLSX.utils.json_to_sheet(finalData, { skipHeader: true, });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const workbookBlob = workbook2blob(wb);
      const excelBuffer = XLSX.write(wb, { bookType: fileExtension, type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + '.' + fileExtension);
      return false;
    } else {
      const ws = XLSX.utils.json_to_sheet(finalData, { skipHeader: true, });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const workbookBlob = workbook2blob(wb);
      var headerIndexes = [];
      finalData.forEach((data, index) =>
        data["A"] === "Enrolment No." ? headerIndexes.push(index) : null
      );
      const totalRecords = rows.length;
      const dataInfo = {
        titleCell: "A2",
        titleRange: (selectedReportType === 2) ? "A1:Q1" : ((selectedStatus === 1) ? "A1:F1" : "A1:F1"),
        title2Range: (selectedReportType === 2) ? "A2:Q2" : ((selectedStatus === 1) ? "A2:F2" : "A2:F2"),
        title3Range: (selectedReportType === 2) ? "A3:Q3" : ((selectedStatus === 1) ? "A3:F3" : "A3:F3"),
        tbodyRange: (selectedReportType === 2) ? `A4:Q${finalData.length}` : ((selectedStatus === 1) ? `A4:F${finalData.length}` : `A4:F${finalData.length}`),
        theadRange:
          headerIndexes?.length >= 1
            ? `A${headerIndexes[0] + 1}:G${headerIndexes[0] + 1}`
            : null,
        theadRange1:
          headerIndexes?.length >= 2
            ? `A${headerIndexes[1] + 1}:H${headerIndexes[1] + 1}`
            : null,
        tFirstColumnRange:
          headerIndexes?.length >= 1
            ? `A${headerIndexes[0] + 1}:A${totalRecords + headerIndexes[0] + 1}`
            : null,
        tLastColumnRange:
          headerIndexes?.length >= 1
            ? `F${headerIndexes[0] + 1}:F${totalRecords + headerIndexes[0] + 1}`
            : null,

        tFirstColumnRange1:
          headerIndexes?.length >= 1
            ? `A${headerIndexes[1] + 1}:A${totalRecords + headerIndexes[1] + 1}`
            : null,
        tLastColumnRange1:
          headerIndexes?.length >= 1
            ? `F${headerIndexes[0] + 1}:F${totalRecords + headerIndexes[1] + 1}`
            : null,
      };
      return addStyle(workbookBlob, dataInfo);
    }
    // FileSaver.saveAs(data, fileName + '.' + fileExtension);
  }
  const addStyle = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        sheet.usedRange().style({
          fontFamily: "Arial",
          verticalAlignment: "center",
        });
        if (selectedReportType === 2) {
          sheet.column("A").width(7);
          sheet.column("B").width(20);
          sheet.column("C").width(15);
          sheet.column("D").width(10);
          sheet.column("E").width(20);
          sheet.column("F").width(10);
          sheet.column("G").width(25);
          sheet.column("H").width(15);
          sheet.column("I").width(25);
          sheet.column("J").width(15);
          sheet.column("K").width(15);
          sheet.column("L").width(15);
          sheet.column("M").width(15);
          sheet.column("N").width(15);
          sheet.column("O").width(15);
          sheet.column("P").width(15);
          sheet.column("Q").width(15);
        } else {
          sheet.column("A").width(7);
          sheet.column("B").width(20);
          sheet.column("C").width(15);
          sheet.column("D").width(20);
          sheet.column("E").width(25);
          sheet.column("F").width(15);
          sheet.column("G").width(15);
        }


        sheet.range(dataInfo.titleRange).merged(true).style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.title2Range).merged(true).style({
          // bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });
        sheet.range(dataInfo.title3Range).merged(true).style({
          // bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });
        if (selectedStatus === 2) {
          const cellarray = ['A', 'B', 'C', 'D', 'E', 'F']
          cellarray.forEach((item) => {
            sheet.range(item + "4:" + item + "5").merged(true).style({
            });
          })
          sheet.range("G4:G5").style({
            // bold: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
          });
        } else if (selectedStatus === 1) {
          const cellarray = ['A', 'B', 'C', 'D', 'E', 'F']
          cellarray.forEach((item) => {
            sheet.range(item + "4:" + item + "5").merged(true).style({
            });
          })
          sheet.range("A4:G5").style({
            // bold: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
          });
        } else {
          const cellarray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
          cellarray.forEach((item) => {
            sheet.range(item + "4:" + item + "5").merged(true).style({
            });
          })
          sheet.range("A4:Q5").style({
            // bold: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
          });
        }

        if (dataInfo.tbodyRange) {
          sheet.range(dataInfo.tbodyRange).style({
            border: true,
            horizontalAlignment: "center",
            verticalAlignment: "center",
          });
        }

        // sheet.range(dataInfo.theadRange).style({
        //   fill: "FFFD04",
        //   bold: true,
        //   horizontalAlignment: "center",
        // });

        if (dataInfo.theadRange1) {
          sheet.range(dataInfo.theadRange1).style({
            fill: "808080",
            bold: true,
            horizontalAlignment: "center",
            fontColor: "ffffff",
          });
        }

        if (dataInfo.tFirstColumnRange) {
          sheet.range(dataInfo.tFirstColumnRange).style({
            bold: true,
          });
        }

        if (dataInfo.tLastColumnRange) {
          sheet.range(dataInfo.tLastColumnRange).style({
            bold: true,
          });
        }

        if (dataInfo.tFirstColumnRange1) {
          sheet.range(dataInfo.tFirstColumnRange1).style({
            bold: true,
          });
        }

        if (dataInfo.tLastColumnRange1) {
          sheet.range(dataInfo.tLastColumnRange1).style({
            bold: true,
          });
        }
      });

      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };


  const generatePDF = () => {
    var name = '';
    selType.forEach((item, i) => {
      if (item.OPT_TYPE === selectedselType) {
        name += item.OPT_NAME_TYPE;
      }
    });
    tumbol.forEach((item, i) => {
      if (item.OPT_CODE === selectedTumbol) {
        name += " " + item.OPT_NAME_ABBR;
      }
    });
    var pdfbody = [];
    pdfbody.push([
      { text: 'ลำดับที่', style: 'tableHeader1', alignment: 'center', verticalAlign: 'middle' },
      { text: 'ประเภท เอกสารสิทธิ', style: 'tableHeader2', alignment: 'center' },
      { text: 'เลขที่ เอกสารสิทธิ', style: 'tableHeader2', alignment: 'center' },
      { text: 'รหัส อำเภอ', style: 'tableHeader2', alignment: 'center' },
      { text: 'ชื่ออำเภอ', style: 'tableHeader1', alignment: 'center' },
      { text: 'รหัส เทศบาล', style: 'tableHeader2', alignment: 'center' },
      { text: 'ชื่อเทศบาล/ตำบล', style: 'tableHeader1', alignment: 'center' },
      { text: 'ประเภท หน่วย ที่ดิน', style: 'tableHeader', alignment: 'center' },
      { text: 'ชื่อหน่วย', style: 'tableHeader1', alignment: 'center' },
      { text: 'ราคาหน่วย ที่ดิน', style: 'tableHeader2', alignment: 'center' },
      { text: 'ความลึก มาตรฐาน', style: 'tableHeader2', alignment: 'center' },
      { text: 'ความลึกแปลง', style: 'tableHeader2', alignment: 'center' },
      { text: 'ประเภท รูปแปลง ที่ดิน', style: 'tableHeader', alignment: 'center' },
      { text: 'เนื้อที่              (ไร่-งาน-ตร.ว.)', style: 'tableHeader2', alignment: 'center' },
      { text: 'ราคา     (บาท/ตร.ว.)', style: 'tableHeader2', alignment: 'center' },
      { text: 'ราคาแปลงทั้งหมด (บาท)', style: 'tableHeader2', alignment: 'center' },
      { text: 'วัน/เดือน/ปี ที่ยืนยันราคา', style: 'tableHeader2', alignment: 'center' }])
    rows.forEach((item, i) => {
      pdfbody.push([
        { text: i + 1, alignment: 'center' },
        { text: item.LAND_TYPE, alignment: 'center' },
        { text: item.CHANODE_NO, alignment: 'center' },
        { text: item.AMPHUR_CODE, alignment: 'center' },
        { text: item.AMPHUR_NAME, alignment: 'center' },
        { text: item.OPT_CODE, alignment: 'center' },
        { text: item.OPT_NAME, alignment: 'center' },
        { text: item.TYPE_CODE, alignment: 'center' },
        { text: item.STREET_NAME, alignment: 'center' },
        { text: item.ST_VALUE, alignment: 'right' },
        { text: item.STANDARD_DEPTH, alignment: 'center' },
        { text: item.DEPTH_R, alignment: 'center' },
        { text: item.LAND_TYPE_NAME, alignment: 'center' },
        { text: item.AREA, alignment: 'right' },
        { text: item.VAL_PER_WAH, alignment: 'right' },
        { text: item.VAL_AREA, alignment: 'right' },
        { text: item.PROCESS_2STS_DATE, alignment: 'center' },])
    })
    var docDefinition = {
      // header: [
      // [{ text: 'รายงานบัญชีราคาประเมินที่ดินตามบัญชีรายเขตปกครอง', alignment: 'center' }],
      // [{ text: name, alignment: 'center' }],
      // [{ text: "ระหว่างวันที่ " + dateThai(), alignment: 'center' }],
      // [{ text: "", alignment: 'center' }]
      // ],
      header: {
        margin: 4,
        columns: [{
          table: {
            widths: ['100%'],
            body: [

              [{ text: " ", alignment: 'center' }],
              [{ text: 'รายงานบัญชีราคาประเมินที่ดินตามบัญชีรายเขตปกครอง', style: 'headerh', alignment: 'center' }],
              [{ text: name, style: 'header', alignment: 'center' }],
              [{ text: "ระหว่างวันที่ " + dateThai(), style: 'header', alignment: 'center' }],
              [{ text: "", style: 'header', alignment: 'center' }],
              // [{
              //   text: 'รายงานบัญชีราคาประเมินที่ดินตามบัญชีรายเขตปกครอง',
              //   width: 80,
              //   height: 26,
              //   alignment: 'center'
              // }]
            ]
          },
          layout: 'noBorders'
        }]
      },
      content: [
        {
          fontSize: 9,

          // layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [21, 55, 34, 25, 60, 25, 60, 25, 60, 30, 30, 25, 25, 50, 40, 50, 40],
            body: pdfbody,
            alignment: "center"
          }
        }
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 10,
        },

        tableHeader1: {
          bold: true,
          fontSize: 10,
          marginTop: 14
        },

        tableHeader2: {
          bold: true,
          fontSize: 10,
          marginTop: 8
        },
        headerh: {
          fontSize: 14,
          bold: true
        },
        header: {
          fontSize: 14,
        },
      },
      defaultStyle: {
        font: "THSarabunNew"
      },
      pageSize: "A4",
      pageOrientation: "landscape",
      pageMargins: [15, 100, 15, 15],
    };
    pdfMake.tableLayouts = {
      exampleLayout: {
        hLineWidth: function (i, node) {
          if (i === 0 || i === node.table.body.length) {
            return 0;
          }
          return (i === node.table.headerRows) ? 2 : 1;
        },
        vLineWidth: function (i) {
          return 0;
        },
        hLineColor: function (i) {
          return i === 1 ? 'black' : '#aaa';
        },
        paddingLeft: function (i) {
          return i === 0 ? 0 : 8;
        },
        paddingRight: function (i, node) {
          return (i === node.table.widths.length - 1) ? 0 : 8;
        }
      }
    };

    // download the PDF
    pdfMake.createPdf(docDefinition).download('รายงานบัญชีราคาประเมินที่ดินตามบัญชีรายเขตปกครอง');
    // const doc = new JsPDF('landscape', 'pt', 'a4');
    // doc.html(document.querySelector('#gridtable'), {
    //   html2canvas: {
    //     scale: .5
    //   },
    //   callback: function (doc) {
    //     doc.save('report.pdf');
    //   }
    // });
    // report.text(20, 30, 'This is client-side Javascript to generate a PDF.');

    // // Add new page
    // // report.addPage();
    // // report.text(20, 20, 'Visit CodexWorld.com');
    // report.save('report.pdf');
  }
  async function saveDocumentToFile(doc, fileName) {

    Packer.toBlob(doc).then(blob => {
      FileSaver.saveAs(blob, fileName);
    });
  }
  const generateWordDocument = async (event) => {
    event.preventDefault();
    var name = '';
    selType.forEach((item, i) => {
      if (item.OPT_TYPE === selectedselType) {
        name += item.OPT_NAME_TYPE;
      }
    });
    tumbol.forEach((item, i) => {
      if (item.OPT_CODE === selectedTumbol) {
        name += " " + item.OPT_NAME_ABBR;
      }
    });
    const thead = [];
    thead.push(new TableRow({
      children: [
        new TableCell({ width: { size: 2, type: 'cm' }, children: [new Paragraph({ children: [new TextRun({ text: "ลำดับที่", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ประเภทเอกสารสิทธิ", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "เลขที่เอกสารสิทธิ", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "รหัสอำเภอ", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ชื่ออำเภอ", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "รหัสเทศบาล", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ชื่อเทศบาล/ตำบล", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ประเภทหน่วยที่ดิน", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ชื่อหน่วย", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ราคาหน่วยที่ดิน", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ความลึกมาตรฐาน", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ความลึกแปลง", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ประเภทรูปแปลงที่ดิน", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "เนื้อที่", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ราคา", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ราคาแปลงทั้งหมด", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "วัน/เดือน/ปี", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
      ],
    }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "(ไร่-งาน-ตร.ว.)", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "(บาท/ตร.ว.)", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "(บาท)", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ที่ยืนยันราคา", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
        ],
      }),)
    await rows.forEach((item, i) => {
      thead.push(new TableRow({
        children: [
          new TableCell({ width: { size: 2, type: 'cm' }, children: [new Paragraph({ children: [new TextRun({ text: (i + 1) + "", size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.LAND_TYPE, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.CHANODE_NO, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.AMPHUR_CODE, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.AMPHUR_NAME, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.OPT_CODE, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.OPT_NAME, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.TYPE_CODE, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.STREET_NAME, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.ST_VALUE, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.STANDARD_DEPTH, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.DEPTH_R, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.LAND_TYPE_NAME, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.AREA, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.VAL_PER_WAH, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.VAL_AREA, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.PROCESS_2STS_DATE, size: 14 })], alignment: 'center', })], }),
        ],
      }))
    })
    const table = new Table({
      rows: thead,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    });
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "TH Sarabun New",
              size: 28,
              bold: false,
              color: "000000",
            },
          },
        },
        heading1: {
          run: {
            font: "TH Sarabun New",
            size: 32,
            bold: true,
            color: "000000",
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
          },
        },
        heading2: {
          run: {
            font: "TH Sarabun New",
            size: 30,
            bold: true,
            color: "000000",
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
          },
        },
        paragraphStyles: [
          {
            id: "normalPara",
            name: "Normal Para",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "TH Sarabun New",
              size: 28,
              bold: false,
            },
          },
          {
            id: "smallPara",
            name: "Small Para",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "TH Sarabun New",
              size: 24,
              bold: false,
            },
          },
          {
            id: "head1Para",
            name: "Head1 Para",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "TH Sarabun New",
              size: 32,
              bold: true,
            },
          },
          {
            id: "head2Para",
            name: "Head2 Para",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "TH Sarabun New",
              size: 28,
              bold: true,
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE,
              },
              margin: {
                top: 0,
                right: 500,
                bottom: 500,
                left: 500,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  text: "รายงานบัญชีราคาประเมินที่ดินตามบัญชีรายเขตปกครอง",
                  alignment: 'center',
                }),
                new Paragraph({
                  text: name,
                  alignment: 'center'
                }),
                new Paragraph({
                  text: "ระหว่างวันที่ " + dateThai(),
                  alignment: 'center'
                }),
              ],
            }),
          },
          children: [
            // new Paragraph({
            //   children: [
            //     new TextRun("Hello World"),
            //     new TextRun({
            //       text: "Foo Bar",
            //       bold: true,
            //     }),
            //     new TextRun({
            //       text: "\tGithub is the best",
            //       bold: true,
            //     }),
            //   ],
            // }),
            table,
          ],
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  text: "ผู้พิมพ์ " + window.sessionStorage.getItem("name") + " " + window.sessionStorage.getItem("lastname"),
                  style: "smallPara",
                  alignment: AlignmentType.RIGHT,
                }),
              ],
            }),
          },
        },
      ],
    });
    saveDocumentToFile(doc, "รายงานบัญชีราคาประเมินที่ดินตามบัญชีรายเขตปกครอง.docx");
  }
  const generateWordDocument1 = async (event) => {
    event.preventDefault();
    var name = '';
    selType.forEach((item, i) => {
      if (item.OPT_TYPE === selectedselType) {
        name += item.OPT_NAME_TYPE;
      }
    });
    tumbol.forEach((item, i) => {
      if (item.OPT_CODE === selectedTumbol) {
        name += " " + item.OPT_NAME_ABBR;
      }
    });
    const thead = [];
    thead.push(new TableRow({
      children: [
        new TableCell({ width: { size: 2, type: 'cm' }, children: [new Paragraph({ children: [new TextRun({ text: "ลำดับที่", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ประเภทเอกสารสิทธิ", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "เลขที่เอกสารสิทธิ", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "รหัสอำเภอ", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ชื่ออำเภอ", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "รหัสเทศบาล", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ชื่อเทศบาล/ตำบล", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ประเภทหน่วยที่ดิน", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ชื่อหน่วย", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ราคาหน่วยที่ดิน", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ความลึกมาตรฐาน", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ความลึกแปลง", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ประเภทรูปแปลงที่ดิน", size: 14 })], alignment: 'center', })], rowSpan: 2, verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "เนื้อที่", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ราคา", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ราคาแปลงทั้งหมด", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
        new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "วัน/เดือน/ปี", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
      ],
    }),
      new TableRow({
        children: [
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "(ไร่-งาน-ตร.ว.)", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "(บาท/ตร.ว.)", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "(บาท)", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: "ที่ยืนยันราคา", size: 14 })], alignment: 'center', })], verticalAlign: 'center', }),
        ],
      }),)

    await rows.forEach((item, i) => {
      thead.push(new TableRow({
        children: [
          new TableCell({ width: { size: 2, type: 'cm' }, children: [new Paragraph({ children: [new TextRun({ text: (i + 1) + "", size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.LAND_TYPE, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.CHANODE_NO, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.AMPHUR_CODE, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.AMPHUR_NAME, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.OPT_CODE, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.OPT_NAME, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.TYPE_CODE, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.STREET_NAME, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.ST_VALUE, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.STANDARD_DEPTH, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.DEPTH_R, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.LAND_TYPE_NAME, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.AREA, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.VAL_PER_WAH, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.VAL_AREA, size: 14 })], alignment: 'center', })], }),
          new TableCell({ width: { size: 5, type: WidthType.AUTO }, children: [new Paragraph({ children: [new TextRun({ text: item.PROCESS_2STS_DATE, size: 14 })], alignment: 'center', })], }),
        ],
      }))
    })
    const table = new Table({
      rows: thead,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    });
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "TH Sarabun New",
              size: 28,
              bold: false,
              color: "000000",
            },
          },
        },
        heading1: {
          run: {
            font: "TH Sarabun New",
            size: 32,
            bold: true,
            color: "000000",
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
          },
        },
        heading2: {
          run: {
            font: "TH Sarabun New",
            size: 30,
            bold: true,
            color: "000000",
          },
          paragraph: {
            alignment: AlignmentType.CENTER,
          },
        },
        paragraphStyles: [
          {
            id: "normalPara",
            name: "Normal Para",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "TH Sarabun New",
              size: 28,
              bold: false,
            },
          },
          {
            id: "smallPara",
            name: "Small Para",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "TH Sarabun New",
              size: 24,
              bold: false,
            },
          },
          {
            id: "head1Para",
            name: "Head1 Para",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "TH Sarabun New",
              size: 32,
              bold: true,
            },
          },
          {
            id: "head2Para",
            name: "Head2 Para",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "TH Sarabun New",
              size: 28,
              bold: true,
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE,
              },
              margin: {
                top: 0,
                right: 500,
                bottom: 500,
                left: 500,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  text: "รายงานบัญชีราคาประเมินที่ดินตามบัญชีรายเขตปกครอง",
                  alignment: 'center',
                }),
                new Paragraph({
                  text: name,
                  alignment: 'center'
                }),
                new Paragraph({
                  text: "ระหว่างวันที่ " + dateThai(),
                  alignment: 'center'
                }),
                new Paragraph({
                  text: "",
                  alignment: 'center'
                }),

              ],
            }),
          },
          children: [
            new TextRun({
              text: "Name:",
              bold: true,
              allCaps: true,
            }),
            table,

          ],
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  text: "ผู้พิมพ์ นายทดสอบ ทดสอบ",
                  style: "smallPara",
                  alignment: AlignmentType.RIGHT,
                }),
              ],
            }),
          },
        }
      ],
    });
    // doc.addSection({
    //   size: {
    //     orientation: PageOrientation.LANDSCAPE,
    // },
    // })

    saveDocumentToFile(doc, "New Document.docx");
  }
  String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length)
      str = padString + str;
    return str;
  }
  const d = new Date();
  var userid = window.sessionStorage.getItem("userid");
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedReportType, setSelectedReportType] = React.useState('');
  const [selectedBoundary, setSelectedBoundary] = React.useState('');
  const [selectedFlagParcel, setSelectedFlagParcel] = React.useState('');
  const [province, setProvince] = React.useState([]);
  const [selectedProvince, setSelectedProvince] = React.useState('');
  const [vselectedProvince, setvSelectedProvince] = React.useState('');
  const [aumpher, setAumpher] = React.useState([]);
  const [selectedAumpher, setSelectedAumpher] = React.useState('');
  const [labelMunicipal, setLabelMunicipal] = React.useState('-เลือกขอบเขตเทศบาล/อบต.-');
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
  // const [DateStart, setDateStart] = React.useState(dayjs(d.getFullYear() + '-' + (d.getMonth() + 1).toString().lpad('0', 2) + '-01'));
  const [DateStart, setDateStart] = React.useState(null);
  const [DateEnd, setDateEnd] = React.useState(dayjs(d.getFullYear() + '-' + (d.getMonth() + 1).toString().lpad('0', 2) + '-' + d.getDate()));
  const [columns, setColumns] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [headSearch, setHeadSearch] = React.useState('');
  const [zone, setZone] = React.useState('');
  useEffect(() => {
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

    const getstatus = async () => {
      // setShowLoad(true)
      const res = await fetch(process.env.REACT_APP_HOST_API + "/SETTING/SearchProcessSts");
      //console.log(res);
      const response = await res.json();
      setStatus(response.result);
      // setZone(response.result[0].MAPZONE);
      // setShowLoad(false)
      // console.log(response.result);
    };
    getstatus()
  }, []);
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
      setvSelectedProvince('');
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
      setvSelectedProvince(event.target.value);
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
        //console.log(res);
        const response = await res.json();
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
            "AMPHUR_CODE": event.target.value + ""
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

    setSelectedTumbol(event.target.value)
  }
  const handleChangeStatus = (event) => {

    setSelectedStatus(event.target.value)
  }
  const handleChangeFlagParcel = (event) => {

    setSelectedFlagParcel(event.target.value)
  }

  const handleChangeDateStart = (newValue) => {
    setDateStart(dayjs(newValue))
  }
  const handleChangeDateEnd = (newValue) => {
    setDateEnd(newValue)
  }
  const handleChangeMunicipal = (event) => {
    setSelectedMunicipal(event.target.value)
  }
  const handleChangeReportType = (event) => {
    setSelectedReportType(event.target.value);
  }
  const handleChangeClearTypeReport = () => {
    setSelectedReportType('');
  }
  // setTimeout(() => {
  //   const typereport1 = document.getElementById('typereport1');
  //   typereport1.addEventListener('click', handleChangeSubmitTypeReport(1));
  //   const typereport2 = document.getElementById('typereport2');
  //   typereport2.addEventListener('click', handleChangeSubmitTypeReport(2));
  // }, 1000);
  const handleChangeSubmitTypeReport1 = () => {
    handleChangeSubmitTypeReport(1)
  }
  const handleChangeSubmitTypeReport2 = () => {
    handleChangeSubmitTypeReport(2)
  }
  const handleChangeSubmitTypeReport = (x) => {
    if (x === '') {
      alert('กรุณาเลือก ประเภทของรายงาน');
    } else {
      if (x === 1) {
        setHeadSearch('รายงานการนำเข้าข้อมูลรูปแปลงที่ดิน')
        document.getElementById('selStatus').style.display = 'block'
        document.getElementById('selStatus1').style.display = 'block'
        document.getElementById('exportmore').style.display = 'none'
        setSelectedReportType(x);
      } else {
        setHeadSearch('รายงานราคาประเมินของแปลงที่ดินที่คำนวณราคา จากบัญชีราคาประเมิน ที่ดินสำหรับเอกสารสิทธิประเภทอื่น นอกเหนือจากโฉนดที่ดินและหนังสือรับรองการทำประโยชน์ (น.ส. 3ก.)')
        document.getElementById('selStatus').style.display = 'none'
        document.getElementById('selStatus1').style.display = 'block'
        document.getElementById('exportmore').style.display = 'flex'
        setSelectedReportType(x);
      }
      document.getElementById('searchReportType').style.display = 'none'
      document.getElementById('searchReport').style.display = 'block'
    }
  }
  const handleChangeSubmitSearchReport = async () => {
    if (selectedProvince === '' || selectedAumpher === '' || selectedselType === '' || selectedTumbol === '' || selectedFlagParcel === '') {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return false;
    }
    if (selectedReportType === 1) {
      if (selectedStatus === '') {
        alert('กรุณากรอกข้อมูลให้ครบ');
        return false;
      }
      if (selectedStatus === 1) {
        var column = [
          { field: 'id', headerName: 'ลำดับที่', width: calcScreenWidthByPercent(5, 0), headerAlign: 'center', align: 'center', },
          { field: 'LAND_TYPE', headerName: 'ประเภทเอกสาร', width: calcScreenWidthByPercent(15, 0), headerAlign: 'center', align: 'center', },
          { field: 'CHANODE_NO', headerName: 'เลขที่', width: calcScreenWidthByPercent(5, 0), headerAlign: 'center', align: 'center', },
          { field: 'AMPHUR_NAME', headerName: 'ชื่ออำเภอ', width: calcScreenWidthByPercent(20, 0), headerAlign: 'center', align: 'center', },
          { field: 'OPT_NAME', headerName: 'ชื่อเทศบาล/ตำบล', width: calcScreenWidthByPercent(20, 0), headerAlign: 'center', align: 'center', },
          { field: 'DATE_CREATED', headerName: 'วัน/เดือน/ปี ', width: calcScreenWidthByPercent(20, 0), headerAlign: 'center', align: 'center', },
        ];
        setColumns(column);
        var row = JSON.stringify({
          "START_DATE": DateStart == null ? ((Number(DateEnd.$y - 1)) + '-01-01') : DateStart.$y + "-" + String((DateStart.$M + 1)).padStart(2, '0') + "-" + String((DateStart.$D)).padStart(2, '0'),
          "END_DATE": DateEnd == null ? '' : DateEnd.$y + "-" + String((DateEnd.$M + 1)).padStart(2, '0') + "-" + String((DateEnd.$D)).padStart(2, '0'),
          "PROCESS_STS_SEQ": selectedStatus + "",
          "CHANGWAT_CODE": selectedProvince + "",
          "AMPHUR_CODE": selectedAumpher + "",
          "OPT_TYPE": selectedselType + "",
          "OPT_CODE": selectedTumbol + "",
          "FLAG_PARCEL": selectedFlagParcel + ""
        });
        const res = await fetch(process.env.REACT_APP_HOST_API + "/REPORT/SearchReportdata", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: row,
        });
        //console.log(res);
        const response = await res.json();
        console.log(response);
        var result = response.result;
        var datarow1 = [];
        if (response.status === "200") {
          await result.forEach((item, i) => {
            datarow1.push({
              id: i + 1,
              LAND_TYPE: item.LAND_TYPE + "",
              CHANODE_NO: item.PARCEL_ID + "",
              AMPHUR_NAME: item.AMPHUR_NAME_TH + "",
              OPT_NAME: item.OPT_NAME + "",
              DATE_CREATED: dateFormatTime(item.DATE_CREATED) + ""
            })
          });
          if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
          }
          const el = document.querySelector('.MuiDataGrid-footerContainer');
          // console.log(el);
          let div = document.createElement("div");
          div.id = "alllist"
          div.style.width = 'fit-content'
          div.style.paddingLeft = '16px';
          div.innerText = 'รายการทั้งหมด ' + result.length + ' รายการ'
          el.prepend(div);
          setTimeout(() => {
            setRows(datarow1);
            unclickImpdetail();
          }, 200);
        }
      } else {
        var column = [
          { field: 'id', headerName: 'ลำดับที่', width: calcScreenWidthByPercent(5, 0), headerAlign: 'center', align: 'center', },
          { field: 'LAND_TYPE', headerName: 'ประเภทเอกสาร', width: calcScreenWidthByPercent(15, 0), headerAlign: 'center', align: 'center', },
          { field: 'CHANODE_NO', headerName: 'เลขที่', width: calcScreenWidthByPercent(5, 0), headerAlign: 'center', align: 'center', },
          { field: 'AMPHUR_NAME', headerName: 'ชื่ออำเภอ', width: calcScreenWidthByPercent(20, 0), headerAlign: 'center', align: 'center', },
          { field: 'OPT_NAME', headerName: 'ชื่อเทศบาล/ตำบล', width: calcScreenWidthByPercent(20, 0), headerAlign: 'center', align: 'center', },
          { field: 'VAL_PER_WAH', headerName: 'ราคา บาท/ตร.ว.', width: calcScreenWidthByPercent(15, 0), headerAlign: 'center', align: 'center', },
          { field: 'DATE_CREATED', headerName: 'วัน/เดือน/ปี ', width: calcScreenWidthByPercent(15, 0), headerAlign: 'center', align: 'center', },
        ];
        setColumns(column);
        var row = JSON.stringify({
          "START_DATE": DateStart == null ? ((Number(DateEnd.$y - 1)) + '-01-01') : DateStart.$y + "-" + String((DateStart.$M + 1)).padStart(2, '0') + "-" + String((DateStart.$D)).padStart(2, '0'),
          "END_DATE": DateEnd == null ? '' : DateEnd.$y + "-" + String((DateEnd.$M + 1)).padStart(2, '0') + "-" + String((DateEnd.$D)).padStart(2, '0'),
          "PROCESS_STS_SEQ": selectedStatus + "",
          "CHANGWAT_CODE": selectedProvince + "",
          "AMPHUR_CODE": selectedAumpher + "",
          "OPT_TYPE": selectedselType + "",
          "OPT_CODE": selectedTumbol + "",
          "FLAG_PARCEL": selectedFlagParcel + ""
        });

        const res = await fetch(process.env.REACT_APP_HOST_API + "/REPORT/SearchReportdata", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: row,
        });
        //console.log(res);
        const response = await res.json();

        // console.log(response);
        var result = response.result;
        var datarow1 = [];
        if (response.status === "200") {
          await result.forEach((item, i) => {
            datarow1.push({
              id: i + 1,
              LAND_TYPE: item.LAND_TYPE + "",
              CHANODE_NO: item.PARCEL_ID + "",
              AMPHUR_NAME: item.AMPHUR_NAME_TH + "",
              OPT_NAME: item.OPT_NAME + "",
              VAL_PER_WAH: (item.VAL_PER_WAH !== null) ? item.VAL_PER_WAH.toLocaleString('en-US') + "" : 0,
              DATE_CREATED: dateFormatTime(item.DATE_CREATED) + ""
            })
          });
          if (document.getElementById('alllist') !== null) {
            document.getElementById('alllist').remove()
          }
          const el = document.querySelector('.MuiDataGrid-footerContainer');
          // console.log(el);
          let div = document.createElement("div");
          div.id = "alllist"
          div.style.width = 'fit-content'
          div.style.paddingLeft = '16px';
          div.innerText = 'รายการทั้งหมด ' + result.length + ' รายการ'
          el.prepend(div);
          setTimeout(() => {
            setRows(datarow1);
            unclickImpdetail();
          }, 200);
        }
      }
    } else if (selectedReportType === 2) {

      var column = [
        { field: 'id', headerName: 'ลำดับที่', width: calcScreenWidthByPercent(2, 70), headerAlign: 'center', align: 'center', },
        { field: 'LAND_TYPE', headerName: 'ประเภทเอกสาร', width: calcScreenWidthByPercent(6, 50), headerAlign: 'center', align: 'center', },
        { field: 'CHANODE_NO', headerName: 'เลขที่', width: calcScreenWidthByPercent(3, 70), headerAlign: 'center', align: 'center', },
        // { field: 'AMPHUR_CODE', headerName: 'รหัสอำเภอ', width: calcScreenWidthByPercent(5, 100), headerAlign: 'center', align: 'center', },
        { field: 'AMPHUR_NAME', headerName: 'ชื่ออำเภอ', width: calcScreenWidthByPercent(6, 100), headerAlign: 'center', align: 'center', },
        // { field: 'OPT_CODE', headerName: 'รหัสเทศบาล', width: calcScreenWidthByPercent(5, 100), headerAlign: 'center', align: 'center', },
        { field: 'OPT_NAME', headerName: 'ชื่อเทศบาล/ตำบล', width: calcScreenWidthByPercent(15, 200), headerAlign: 'center', align: 'center' },
        // { field: 'TYPE_CODE', headerName: 'ประเภทหน่วยที่ดิน', width: calcScreenWidthByPercent(5, 150), headerAlign: 'center', align: 'center', },
        { field: 'STREET_NAME', headerName: 'ชื่อหน่วย', width: calcScreenWidthByPercent(15, 100), headerAlign: 'center', align: 'center', },
        { field: 'ST_VALUE', headerName: 'ราคาหน่วยที่ดิน (บาท/ตร.ว.)', width: calcScreenWidthByPercent(7, 70), headerAlign: 'center', align: 'right', textAlign: 'center' },
        { field: 'STANDARD_DEPTH', headerName: 'ความลึกมาตรฐาน (ม.)', width: calcScreenWidthByPercent(5, 100), headerAlign: 'center', align: 'center', },
        { field: 'DEPTH_R', headerName: 'ความลึกแปลง  (ม.)', width: calcScreenWidthByPercent(5, 80), headerAlign: 'center', align: 'center', },
        { field: 'PARCEL_SHAPE', headerName: 'ประเภทรูปแปลงที่ดิน', width: calcScreenWidthByPercent(5, 150), headerAlign: 'center', align: 'center', },
        { field: 'AREA', headerName: 'เนื้อที่ (ไร่-งาน-ตร.ว.)', width: calcScreenWidthByPercent(5, 150), headerAlign: 'center', align: 'right', },
        { field: 'VAL_PER_WAH', headerName: 'ราคา (บาท/ตร.ว.)', width: calcScreenWidthByPercent(5, 150), headerAlign: 'center', align: 'center', },
        { field: 'VAL_AREA', headerName: 'ราคาทั้งแปลง (บาท)', width: calcScreenWidthByPercent(5, 130), headerAlign: 'center', align: 'center', },
        {
          field: 'PARCEL_S3_SEQ', headerName: 'ส่งออกข้อมูล ', width: calcScreenWidthByPercent(10, 150), headerAlign: 'center', align: 'center',
          renderCell: (params) => <Box><Button size="small" variant="contained" color="violet" id={'xml' + params.value} style={{ cursor: 'pointer', minWidth: '25px', color: 'white' }} data={params.value} onClick={exportXml}>XML</Button> | <Button size="small" variant="contained" color="primary" id={'xml' + params.value} style={{ cursor: 'pointer', minWidth: '25px' }} data={params.value} onClick={exportLayout}>PDF</Button></Box>
          // 

        },
        { field: 'DATE_CREATED', headerName: 'วัน/เดือน/ปี ที่ยืนยันราคา ', width: calcScreenWidthByPercent(10, 100), headerAlign: 'center', align: 'center', },
      ];
      setColumns(column);
      var row = JSON.stringify({
        "START_DATE": DateStart == null ? ((Number(DateEnd.$y - 1)) + '-01-01') : DateStart.$y + "-" + String((DateStart.$M + 1)).padStart(2, '0') + "-" + String((DateStart.$D)).padStart(2, '0'),
        "END_DATE": DateEnd == null ? '' : DateEnd.$y + "-" + String((DateEnd.$M + 1)).padStart(2, '0') + "-" + String((DateEnd.$D)).padStart(2, '0'),
        "CHANGWAT_CODE": selectedProvince + "",
        "AMPHUR_CODE": selectedAumpher + "",
        "OPT_TYPE": selectedselType + "",
        "OPT_CODE": selectedTumbol + "",
        "FLAG_PARCEL": selectedFlagParcel + ""
      });
      const res = await fetch(process.env.REACT_APP_HOST_API + "/REPORT/SelReportPrice", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: row,
      });
      //console.log(res);
      const response = await res.json();
      var result = response.result;
      var datarow1 = [];

      console.log(response, 'response');
      if (response.status === "200") {
        await result.forEach((item, i) => {
          datarow1.push({
            id: i + 1,
            LAND_TYPE: item.LAND_TYPE + "",
            CHANODE_NO: item.CHANODE_NO + "",
            AMPHUR_CODE: item.AMPHUR_CODE + "",
            AMPHUR_NAME: item.AMPHUR_NAME + "",
            OPT_CODE: item.OPT_CODE + "",
            OPT_NAME: item.OPT_NAME + "",
            TYPE_CODE: item.TYPE_CODE + "",
            LAND_TYPE_NAME: item.LAND_TYPE_NAME + "",
            STREET_NAME: (item.STREET_NAME !== null) ? item.STREET_NAME + "" : '-',
            ST_VALUE: (item.ST_VALUE !== null) ? item.ST_VALUE.toLocaleString('en-US') + "" : 0,
            STANDARD_DEPTH: (item.STANDARD_DEPTH !== null || item.STANDARD_DEPTH === '0') ? item.STANDARD_DEPTH + "" : '-',
            DEPTH_R: (item.DEPTH_R !== null || item.DEPTH_R === '0') ? item.DEPTH_R + "" : '-',
            PARCEL_SHAPE: item.LAND_TYPE_NAME + "",
            AREA: item.NRAI + "-" + item.NNHAN + "-" + item.NWAH.toFixed(1) + "",
            VAL_PER_WAH: (item.VAL_PER_WAH !== null) ? item.VAL_PER_WAH.toLocaleString('en-US') + "" : 0,
            VAL_AREA: (item.VAL_AREA !== null) ? item.VAL_AREA.toLocaleString('en-US') + "" : 0,
            DATE_CREATED: dateFormatTime(item.DATE_CREATED) + "",
            PARCEL_S3_SEQ: item.PARCEL_S3_SEQ + "," + item.MAPZONE + "," + selectedProvince + "," + selectedAumpher + "," + selectedselType + "," + selectedTumbol + "," + item.PARCEL_S3VAL_SEQ,
          })
        });
        if (document.getElementById('alllist') !== null) {
          document.getElementById('alllist').remove()
        }
        const el = document.querySelector('.MuiDataGrid-footerContainer');
        // console.log(el);
        let div = document.createElement("div");
        div.id = "alllist"
        div.style.width = 'fit-content'
        div.style.paddingLeft = '16px';
        div.innerText = 'รายการทั้งหมด ' + result.length + ' รายการ'
        el.prepend(div);
        setTimeout(() => {
          setRows(datarow1);
          unclickImpdetail();


        }, 200);
      }
    }

    // el.appendChild('mdddddddd')
    document.getElementById('searchReportType').style.display = 'none'
    document.getElementById('searchReport').style.display = 'block'
    document.getElementById('reportList').style.display = 'block'
    // setTimeout(() => {
    //   document.getElementsByClassName('PrivateSwitchBase-input')[0].click();
    // }, 500);


  }
  function blobToFile(theBlob, fileName) {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }
  const exportXml = async (event) => {
    const s3seq = event.target.attributes['data'].value;
    const s3seqsprit = s3seq.split(',');
    // console.log(s3seq);
    event.stopPropagation()

    var dataxml = `<?xml version="1.0" standalone="yes"?>`;
    // setShowLoad(true)
    const res = await fetch(process.env.REACT_APP_HOST_API + "/REPORT/SelParcelValForXML", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "PARCEL_S3VAL_SEQ": s3seqsprit[6] + ""
      })
    });
    const response = await res.json();
    // console.log(response.result[0]["XML_F52E2B61-18A1-11d1-B105-00805F49916B"]);
    dataxml += response.result[0]["XML_F52E2B61-18A1-11d1-B105-00805F49916B"]
    var blob = new Blob([dataxml], { type: "application/xml" });
    FileSaver.saveAs(blob, "hello world.XML");
  }
  const exportLayout = (event) => {
    const s3seq = event.target.attributes['data'].value;
    console.log(s3seq);
    // return;
    event.stopPropagation()
    window.open('/Layout?seq=' + s3seq, '_blank');
  }
  const handleChangeClearSearchReportback = () => {
    setSelectedProvince('');
    setvSelectedProvince('');
    setSelectedAumpher('');
    setSelectedTumbol('');
    setSelectedselType('');
    setSelectedStatus('');
    setSelectedFlagParcel('');

    document.getElementById('searchReportType').style.display = 'block'
    document.getElementById('searchReport').style.display = 'none'
    document.getElementById('reportList').style.display = 'none'
    // document.getElementById('reportList').style.display = 'none'
  }
  const handleChangeClearSearchReport = () => {
    setSelectedProvince('');
    setvSelectedProvince('');
    setSelectedAumpher('');
    setSelectedTumbol('');
    setSelectedselType('');
    setSelectedStatus('');
    setSelectedFlagParcel('');
    setRows([])
    setDateStart(null)
    // document.getElementById('reportList').style.display = 'none'
  }
  const unclickImpdetail = () => {
    // document.getElementById('impdetail').style = "border-bottom: 5px solid red;";
    // document.getElementById('caldetail').style = "";
    // document.getElementById('approve').style = "";MuiDataGrid-virtualScroller
    var obj = document.getElementsByClassName('MuiDataGrid-virtualScroller')[0];
    // console.log(obj);
    obj.scroll({ left: 0 })
    // setTimeout(() => {
    //   var checkboxes = document.querySelectorAll('input[type=checkbox]')
    //   // console.log(checkboxes[0].ariaLabel);
    //   if (checkboxes) {
    //     if (checkboxes[0].ariaLabel !== 'Select all rows') {
    //       checkboxes[0].click();
    //     }
    //   }

    // }, 100);

  }
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Grid container style={{
          backgroundImage: 'url(/Rectangle5805.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
        }}>
          <Grid item md={12} sx={{ dispaly: 'flex', zIndex: 99 }}>
            <AppHeader sx={{ zIndex: 1 }} />
          </Grid>

          <Grid item md={12} xs={12} style={{ backgroundColor: 'transparent', }}>
            <Grid container style={{ position: "relative", display: 'flex', overflow: 'auto', height: "80px", overflowX: 'hidden' }} sx={{ pt: 1 }} >
              <Grid item md={12} xs={12}>
                <Menus />
              </Grid>
            </Grid>
            <Grid container style={{ position: "relative", display: 'flex', zIndex: 10, width: "100%", height: "calc(100vh - 147px)", overflow: 'auto', paddingTop: '0px !important', backgroundColor: 'transparent' }} sx={{ pt: '0px !important' }} >
              <Grid sx={{ backgroundColor: 'transparent', px: 4, minHeight: "calc(100vh - 177px)", width: '100%', pt: '0px !important' }}>
                <Grid item md={12} sx={{ backgroundColor: 'transparent', dispaly: 'flex', zIndex: 1, pt: '0px !important' }}>
                  <Grid container sx={{
                    borderRadius: '10px', width: '100%', display: 'flex', alignItems: 'center',
                    flexDirection: 'column', pt: '0px !important'
                  }}>
                    {/* <Grid id="searchReportType" container sx={{ width: '80%', backgroundColor: '#fff', borderRadius: '15px 15px 0px 0px', pb: '20px' }}>
                      <Grid item md={12} xs={12} sx={{ textAlign: 'left', backgroundColor: '#266AC5', borderRadius: '15px 15px 0px 0px', }}>
                        <Typography sx={{ color: '#2F4266', fontSize: '18pt', px: 2, color: 'white' }}>ค้นหารายงาน</Typography>
                      </Grid>
                      <Grid item md={12} xs={12} sx={{ textAlign: 'left', backgroundColor: '#fff', border: '1px solid #707992', px: 5 }}>
                        <Grid container sx={{ p: 1, pr: 3 }}>
                          <Grid item md={12} xs={12} sx={{ p: 1 }}>
                            <Typography sx={{ color: '#2F4266', fontSize: '18pt', px: 2, }}>ประเภทของรายงาน <span style={{ color: 'red' }}>*</span></Typography>
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                              <InputLabel id="ReportType-label">ประเภทของรายงาน <span style={{ color: 'red' }}>*</span></InputLabel>
                              <Select
                                labelId="ReportType-label"
                                id="ReportType"
                                value={selectedReportType}
                                label="เลือกเขตการปกครอง"
                                onChange={handleChangeReportType}
                              >
                                <MenuItem value="">
                                  <em>-เลือกประเภทของรายงาน-</em>
                                </MenuItem>
                                <MenuItem value={1}>รายงานการนำเข้าข้อมูลรูปแปลงที่ดิน</MenuItem>
                                <MenuItem value={2}>รายงานราคาประเมินของแปลงที่ดินที่คำนวณราคา จากบัญชีราคาประเมิน ที่ดินสำหรับเอกสารสิทธิประเภทอื่น นอกเหนือจากโฉนดที่ดินและหนังสือรับรองการทำประโยชน์ (น.ส. 3ก.)</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item md={12} xs={12} sx={{ p: 1, textAlign: 'right' }} >
                            <Button variant="contained" color="primary" sx={{ mx: 2 }} onClick={handleChangeSubmitTypeReport}>ค้นหา</Button>
                            <Button variant="contained" color="warning" sx={{ mx: 2 }} onClick={handleChangeClearTypeReport}>ล้างค่า</Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid> */}
                    <Grid id="searchReportType" container sx={{ width: '80%', backgroundColor: '#fff', borderRadius: '15px 15px 0px 0px', pb: '20px' }}>
                      <Grid item md={12} xs={12} sx={{ textAlign: 'left', backgroundColor: '#266AC5', borderRadius: '15px 15px 0px 0px', }}>
                        <Typography sx={{ color: '#2F4266', fontSize: '18pt', px: 2, color: 'white' }}>รายงานเผยแพร่</Typography>
                      </Grid>
                      <Grid item md={12} xs={12} sx={{ textAlign: 'left', backgroundColor: '#fff', border: '1px solid #707992', px: 5 }}>
                        <Grid container sx={{ p: 1, pr: 3 }}>
                          <Grid item md={12} xs={12} sx={{ p: 1 }} >
                            <Typography id="typereport1" style={{ color: '#2F4266', fontWeight: 400, fontSize: '26px', lineHeight: '31px', }} sx={{ my: '20px', ":hover": { cursor: 'pointer', textDecoration: 'underline', }, }} onClick={handleChangeSubmitTypeReport1}>1. รายงานการนำเข้าข้อมูลรูปแปลงที่ดิน</Typography>
                            <Typography id="typereport2" style={{ color: '#2F4266', fontWeight: 400, fontSize: '26px', lineHeight: '31px', }} sx={{ my: '20px', ":hover": { cursor: 'pointer', textDecoration: 'underline', }, }} onClick={handleChangeSubmitTypeReport2}>2. รายงานราคาประเมินของแปลงที่ดินที่คำนวณราคา จากบัญชีราคาประเมิน ที่ดินสำหรับเอกสารสิทธิประเภทอื่น  นอกเหนือจากโฉนดที่ดินและหนังสือรับรองการทำประโยชน์ (น.ส. 3ก.)</Typography>
                            {/* <Typography sx={{ color: '#2F4266', fontSize: '18pt', px: 2, }}>ประเภทของรายงาน <span style={{ color: 'red' }}>*</span></Typography>
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                              <InputLabel id="ReportType-label">ประเภทของรายงาน <span style={{ color: 'red' }}>*</span></InputLabel>
                              <Select
                                labelId="ReportType-label"
                                id="ReportType"
                                value={selectedReportType}
                                label="เลือกเขตการปกครอง"
                                onChange={handleChangeReportType}
                              >
                                <MenuItem value="">
                                  <em>-เลือกประเภทของรายงาน-</em>
                                </MenuItem>
                                <MenuItem value={1}>รายงานการนำเข้าข้อมูลรูปแปลงที่ดิน</MenuItem>
                                <MenuItem value={2}>รายงานราคาประเมินของแปลงที่ดินที่คำนวณราคา จากบัญชีราคาประเมิน ที่ดินสำหรับเอกสารสิทธิประเภทอื่น นอกเหนือจากโฉนดที่ดินและหนังสือรับรองการทำประโยชน์ (น.ส. 3ก.)</MenuItem>
                              </Select>
                            </FormControl> */}
                          </Grid>
                          {/* <Grid item md={12} xs={12} sx={{ p: 1, textAlign: 'right' }} >
                            <Button variant="contained" color="primary" sx={{ mx: 2 }} onClick={handleChangeSubmitTypeReport}>ค้นหา</Button>
                            <Button variant="contained" color="warning" sx={{ mx: 2 }} onClick={handleChangeClearTypeReport}>ล้างค่า</Button>
                          </Grid> */}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid id="searchReport" container style={{ backgroundColor: 'transparent', display: 'none' }} sx={{ width: '80%', backgroundColor: '#fff', borderRadius: '15px 15px 0px 0px', pb: '20px' }}>
                      <Grid item md={12} xs={12} sx={{ textAlign: 'left', backgroundColor: '#266AC5', borderRadius: '15px 15px 0px 0px', }}>
                        <Typography sx={{ color: '#2F4266', fontSize: '18pt', px: 2, color: 'white' }}>{headSearch}</Typography>
                      </Grid>
                      <Grid item md={12} xs={12} sx={{ textAlign: 'left', backgroundColor: '#fff', border: '1px solid #707992' }}>
                        <Grid container sx={{ p: 1, pr: 3 }}>
                          <Grid item md={4} xs={4} sx={{ p: 1 }}>
                            <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 2, }}>จังหวัด <span style={{ color: 'red' }}>*</span></Typography>
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                              <InputLabel id="Province-label">จังหวัด </InputLabel>
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
                                {province.map((province) => (
                                  <MenuItem key={province.PRO_C} value={province.PRO_C + '|' + province.MAPZONE} >{province.ON_PRO_THA}</MenuItem>
                                ))}
                              </Select>
                              {/* <FormHelperText>With label + helper text</FormHelperText> */}
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={4} sx={{ p: 1 }}>
                            <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 2, }}>อำเภอ <span style={{ color: 'red' }}>*</span></Typography>
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                              <InputLabel id="Aumpher-label">อำเภอ </InputLabel>
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
                                {aumpher.map((district) => (
                                  <MenuItem key={district.AMPHUR_CODE} value={district.AMPHUR_CODE}>{district.AMPHUR_DESCRIPTION}</MenuItem>
                                ))}
                              </Select>
                              {/* <FormHelperText>With label + helper text</FormHelperText> */}
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={4} sx={{ p: 1 }}>
                            <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 2, }}>ขอบเขต <span style={{ color: 'red' }}>*</span></Typography>
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                              <InputLabel id="Boundary-label">ขอบเขต</InputLabel>
                              <Select
                                labelId="Boundary-label"
                                id="Boundary"
                                value={selectedselType}
                                label="ขอบเขต"
                                onChange={handleChangeBoundary}
                              >
                                <MenuItem value="">
                                  <em>-ขอบเขต-</em>
                                </MenuItem>
                                {selType.map((selType) => (
                                  <MenuItem key={selType.OPT_TYPE} value={selType.OPT_TYPE}>{selType.OPT_NAME_TYPE}</MenuItem>
                                ))}
                              </Select>
                              {/* <FormHelperText>With label + helper text</FormHelperText> */}
                            </FormControl>
                          </Grid>
                          <Grid item md={4} xs={4} sx={{ p: 1 }}>
                            <Typography id="Tumbol-head" sx={{ color: '#2F4266', fontSize: '12pt', px: 2, }}>เทศบาล/ตำบล <span style={{ color: 'red' }}>*</span></Typography>
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                              <InputLabel id="Tumbol-label">{'เทศบาล/ตำบล'}</InputLabel>
                              <Select
                                labelId="Tumbol-label"
                                id="Tumbol"
                                value={selectedTumbol}
                                label={'เทศบาล/ตำบล'}
                                onChange={handleChangeTumbol}
                              >
                                <MenuItem value="">
                                  <em>{'เทศบาล/ตำบล'}</em>
                                </MenuItem>
                                {tumbol.map((tumbol) => (
                                  <MenuItem key={tumbol.OPT_CODE} value={tumbol.OPT_CODE}>{tumbol.OPT_NAME_ABBR}</MenuItem>
                                ))}
                              </Select>
                              {/* <FormHelperText>With label + helper text</FormHelperText> */}
                            </FormControl>
                          </Grid>
                          <Grid item md={2} xs={4} sx={{ pl: 2, pt: 1, '& .MuiFormControl-root.MuiTextField-root': { width: '100%' }, }}>
                            <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 1, height: 'fit-content', pb: 1 }}>ตั้งแต่วันที่ </Typography>
                            <LocalizationProvider dateAdapter={OverwriteAdapterDayjs} locale={th}>
                              <DesktopDatePicker sx={{ width: '100%', }}
                                // label="วัน/เดือน/ปี นำเข้า"
                                // inputFormat="DD/MM/YYYY"
                                label='ตั้งแต่วันที่'
                                format='D/MM/YYYY'
                                value={DateStart}
                                onChange={handleChangeDateStart}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item md={2} xs={4} sx={{ pl: 2, pt: 1, '& .MuiFormControl-root.MuiTextField-root': { width: '100%' }, }}>
                            <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 1, height: 'fit-content', pb: 1 }}>ถึงวันที่<span style={{ color: 'red' }}>*</span></Typography>
                            <LocalizationProvider dateAdapter={OverwriteAdapterDayjs} locale={th}>
                              <DesktopDatePicker sx={{ width: '100%' }}
                                // label="วัน/เดือน/ปี นำเข้า"
                                // inputFormat="DD/MM/YYYY"
                                label='ถึงวันที่'
                                format='D/MM/YYYY'
                                value={DateEnd}
                                onChange={handleChangeDateEnd}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </LocalizationProvider>
                          </Grid>
                          <Grid item md={4} xs={4} sx={{ p: 1 }}>
                            <Grid id="selFlagParcel">
                              <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 2, }}>ประเภทการนำเข้า <span style={{ color: 'red' }}>*</span></Typography>
                              <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                <InputLabel id="FlagParcel-label">ประเภทการนำเข้า </InputLabel>
                                <Select
                                  labelId="FlagParcel-label"
                                  id="FlagParcel"
                                  value={selectedFlagParcel}
                                  label="เลือกประเภทการนำเข้า "
                                  onChange={handleChangeFlagParcel}
                                >
                                  <MenuItem value="">
                                    <em>-เลือกประเภทการนำเข้า-</em>
                                  </MenuItem>
                                  <MenuItem value="1">
                                    <em>นำเข้าไฟล์ SHP,KML</em>
                                  </MenuItem>
                                  <MenuItem value="2">
                                    <em>นำเข้า แบบกำหนดตำแหน่ง</em>
                                  </MenuItem>
                                </Select>
                                {/* <FormHelperText>With label + helper text</FormHelperText> */}
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid item md={4} xs={4} sx={{ p: 1 }}>
                            <Grid id="selStatus">
                              <Typography sx={{ color: '#2F4266', fontSize: '12pt', px: 2, }}>สถานะดำเนินการ <span style={{ color: 'red' }}>*</span></Typography>
                              <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                <InputLabel id="Status-label">สถานะดำเนินการ </InputLabel>
                                <Select
                                  labelId="Status-label"
                                  id="Status"
                                  value={selectedStatus}
                                  label="เลือกสถานะดำเนินการ "
                                  onChange={handleChangeStatus}
                                >
                                  <MenuItem value="">
                                    <em>-เลือกสถานะดำเนินการ-</em>
                                  </MenuItem>
                                  {status.map((status) => (
                                    <MenuItem key={status.PROCESS_STS_SEQ} value={status.PROCESS_STS_SEQ}>{status.PROCESS_STS_NAME}</MenuItem>
                                  ))}
                                </Select>
                                {/* <FormHelperText>With label + helper text</FormHelperText> */}
                              </FormControl>
                            </Grid>
                          </Grid>
                          {/* <Grid item md={4} xs={4} sx={{ p: 1 }}></Grid> */}
                          <Grid item md={4} xs={4} sx={{ p: 1, textAlign: 'center', }} >
                          </Grid>
                          <Grid item md={4} xs={4} sx={{ p: 1, textAlign: 'center', }} >
                            <Box id="selStatus1"><br /><br /></Box>
                            <Button variant="contained" color="primary" sx={{ mx: 2 }} onClick={handleChangeSubmitSearchReport}>ค้นหา</Button>
                            <Button variant="contained" color="warning" sx={{ mx: 2 }} onClick={handleChangeClearSearchReport}>ล้างค่า</Button>
                          </Grid>
                        </Grid>
                      </Grid>
                      {/* <Typography id="typereport1" style={{ color: '#2F4266', fontSize: '20px', lineHeight: '31px',textAlign:'right' }} sx={{ my: '20px', ":hover": { cursor: 'pointer', textDecoration: 'underline', }, }} onClick={handleChangeClearSearchReportback}> {'<< ย้อนกลับ'}</Typography> */}
                      <Grid item md={12} xs={12} sx={{ p: 1, textAlign: 'right', }} >
                        <Button variant="contained" color="info" onClick={handleChangeClearSearchReportback}>{'<< ย้อนกลับ'}</Button>
                      </Grid>
                    </Grid>
                    <Grid id="reportList" container style={{ display: 'none' }} sx={{ width: '100%', backgroundColor: '#fff', }}>
                      {/* <Grid item md={12} xs={12} sx={{ height: 50, pt: 2 }}>
                      <Typography sx={{ fontSize: 20 }}>
                        รายการเทียบตำบล
                      </Typography>
                      </Grid> */}
                      <Grid item md={12} xs={12} >
                        <Box id="gridtable" sx={{ width: '100%' }}>
                          <DataGrid
                            id="tabledata"
                            autoHeight
                            rows={rows}
                            columns={columns}
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            rowsPerPageOptions={[10, 25, 50, 75, 100]}
                            checkboxSelection={false}
                            hideFooterSelectedRowCount
                            components={{
                              Pagination: CustomPagination,
                            }}
                            getCellClassName={(params) => {
                              if (params.field === 'VAL_PER_WAH') {
                                return 'price';
                              } else if (params.field === 'VAL_AREA') {
                                return 'priceAll';
                              }
                            }}
                            sx={{
                              "& .MuiDataGrid-columnHeaderTitleContainer": { color: 'white', }, '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#266AC5',
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

                              }, "& .MuiDataGrid-columnHeaderTitle": {
                                whiteSpace: "normal",
                                lineHeight: "normal"
                              },
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid container justifyContent="flex-end" sx={{ py: 1, }}>
                        {/* <Button variant="contained" color="success">
                        ยืนยัน
                      </Button> */}
                        ส่งออกข้อมูล
                        <Button sx={{ minWidth: "25px !important", minHeight: "25px !important" }} onClick={(e) => exportToExcel('testexcel', 'xlsx')}><img src={'/exp_excel.svg'} width={25} height={25} alt='' /></Button>
                        <div id="exportmore">
                          <img src={'/Line 343.svg'} width={25} height={30} alt='' /> <Button sx={{ minWidth: "25px !important", minHeight: "25px !important" }} onClick={(e) => exportToExcel('testexcel', 'csv')}><img src={'/exp_csv.svg'} width={25} height={25} alt='' /></Button>
                          <img src={'/Line 343.svg'} width={25} height={30} alt='' /> <Button sx={{ minWidth: "25px !important", minHeight: "25px !important" }} onClick={generateWordDocument}><img src={'/exp_word.svg'} width={25} height={25} alt='' /></Button>
                          <img src={'/Line 343.svg'} width={25} height={30} alt='' /> <Button sx={{ minWidth: "25px !important", minHeight: "25px !important" }} onClick={generatePDF}><img src={'/exp_pdf.svg'} width={25} height={25} alt='' /></Button>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <Footer /> */}
      </ThemeProvider>
    </React.Fragment>
  )
}