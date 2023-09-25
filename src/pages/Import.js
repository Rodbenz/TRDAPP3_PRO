import * as React from 'react';
import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Box, Link, Button } from "@mui/material";
// import Image from 'next/image';
import Header from './components/home/Header';
import MapImport from './components/myMap/MapImport';
import Import1 from './components/import/Import1';
// import { useRouter } from 'next/router'
// var CryptoJS = require("crypto-js");
// import MapWrapper from './components/myMap/MapWrapper'

// showSearchs()

export default function Import() {
    // const routerparams = useRouter()
    const [leftresponsive, setLeftresponsive] = useState(6);
    const [mapresponsive, setMapresponsive] = useState(true);
    const [openmapresponsive, setopenMapresponsive] = useState(false);

    const [selectedProvince, setSelectedProvince] = React.useState('');
    const [selectedDistrict, setSelectedDistrict] = React.useState('');
    const [selectedMunicipal, setSelectedMunicipal] = React.useState('');
    const [selectedTumbol, setSelectedTumbol] = React.useState('');
    const [selectedZone, setSelectedZone] = React.useState('');
    const [data, setdata] = React.useState('');
    const [datainfo, setdatainfo] = React.useState(0);
    const [datainfocal, setdatainfocal] = React.useState(0);
    const [step2point, setstep2point] = React.useState(1);
    
    const [data2table, setdata2table] = React.useState({});
    const [featureseq, setfeatureseq] = React.useState(0);
    const [reloadTb, setreloadTb] = React.useState(true);
    const [obj, setObj] = React.useState([]);
    const [point2mapdata, setpoint2mapdata] = React.useState([]);
    const [activeCellId, setActiveCellId] = React.useState(null);
    const importStyle = {
        display: (openmapresponsive) ? 'none' : 'block'
    }
    const datatomap = () => {

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
    const fullscreen = (data1) => {
        if (data1.showfullscreen) {
            setLeftresponsive(12)
            document.getElementById("mapshow").hidden = true;

        } else {
            setLeftresponsive(6)
            document.getElementById("mapshow").hidden = false;
        }
    }
    
    const typeimport =(typeimport)=>{
        // console.log(typeimport);
        setdata(typeimport);
    }
    var data2table1={};
    const datapoint2table = (result)=>{
        // console.log(PARCELTYPE,ECT,PARCELNO,UTM_1,UTM_2,UTM_3,UTM_4,UTM_SCALE,UTM_LANDNO,RAI,NGAN,VA,NODENAME,DEPTH_STD,DEPTH,TRANSFORMTYPE,geometry);
        // data2table1 = {PARCELTYPE,ECT,PARCELNO,UTM_1,UTM_2,UTM_3,UTM_4,UTM_SCALE,UTM_LANDNO,RAI,NGAN,VA,NODENAME,DEPTH_STD,DEPTH,TRANSFORMTYPE,geometry};
        setdata2table(result);
    }
    const reloadTable=()=>{
        setreloadTb(!reloadTb)
    }
    const infoSeqimp = (infoSeqimp)=>{
        setdatainfo(infoSeqimp);
    }
    const infoSeqimpcal = (infoSeqimpcal)=>{
        setdatainfocal(infoSeqimpcal);
    }
    const steppoint2map = (step2point)=>{
        setstep2point(step2point)
    }
    const point2map =(point2mapdata)=>{
        setpoint2mapdata(point2mapdata)
    }
    
    const zoomtofeature =(featureseq)=>{
        setfeatureseq(featureseq)
        setActiveCellId(Number(featureseq))
        console.log(featureseq, 'featureseq');
    }
    // useEffect(() => {
    //     setdata2table(data2table1);
    // })
    // const showSearchs = () => {
    // useEffect(() => {
    //     var urlSplit = (window.location.href).split('?');
    //     var encrypted = urlSplit[1];
    //     if (encrypted !== '' && encrypted !== undefined) {
    //         var decrypted = CryptoJS.Rabbit.decrypt(encrypted, "TRD3my-secrete@123");
    //         var param = decrypted.toString(CryptoJS.enc.Utf8);
    //     }
    //     setdata(param);
    //     // setdata(myObj)
    // })

    // var params = data.split('&')
    // var myJSON = '{';
    // var i = 1;
    // params.forEach(element => {
    //     if (i < params.length) {
    //         myJSON += '"' + element.split('=')[0] + '":"' + element.split('=')[1] + '",'
    //     } else {
    //         myJSON += '"' + element.split('=')[0] + '":"' + element.split('=')[1] + '"'
    //     }
    //     i++
    // });
    // myJSON += '}';
    // const myObj = JSON.parse(myJSON);
    // // setObj(myObj)
    // // setSelectedProvince(myObj.p) 
    // // setSelectedProvince(myObj.p)
    // // setSelectedDistrict(myObj.a)
    // // setSelectedMunicipal(myObj.tt)
    // // setSelectedTumbol(myObj.t)
    // // setSelectedZone(myObj.z)
    // // console.log(data, myJSON, myObj.tt);
    // const setSelect = (myObj) => {
    //     // setSelectedProvince(myObj.p)
    //     // setSelectedDistrict(myObj.a)
    //     // setSelectedMunicipal(myObj.tt)
    //     // setSelectedTumbol(myObj.t)
    //     // setSelectedZone(myObj.z)
    // }
    // setSelect(myObj)
    // setdata(myObj)
    React.useEffect(() => {
        console.log(activeCellId, 'activeCellId');
    }, [activeCellId]);
    return (
        <ThemeProvider theme={theme}>
            <Grid container>
                <Grid item md={12} sx={{ dispaly: 'flex', zIndex: 1 }}>
                    <Header sx={{ zIndex: 1 }} />
                </Grid>
                <Grid item md={leftresponsive} xs={12}>
                    <Import1 fullscreen={fullscreen} typeimport={typeimport} infoSeqimp={infoSeqimp} infoSeqimpcal={infoSeqimpcal} data2table={data2table} reloadTb={reloadTb} steppoint2map={steppoint2map} point2map={point2map} zoomtofeature={zoomtofeature} activeCellId={activeCellId} setActiveCellId={setActiveCellId}/>
                </Grid>
                <Grid item id="mapshow" md={6} xs={12} >
                    {/* <MapWrapper features height={'calc(100vh - 60px)'} /> */}
                    <MapImport typeimport2map={data} datapoint2table={datapoint2table} infoSeq2map={datainfo} infocalSeq2map={datainfocal} reloadTable={reloadTable} steppoint2map={step2point} point2mapdata={point2mapdata} zoomtofeature={featureseq} setActiveCellId={setActiveCellId} />
                </Grid>

            </Grid>
        </ThemeProvider>
    )
}