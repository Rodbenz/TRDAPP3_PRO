import * as React from 'react';
import * as shapefile from "shapefile";
import { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Typography, Box, Link, Button, ListItemText, FormControl, InputLabel, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { GPX, GeoJSON, IGC, KML, TopoJSON } from 'ol/format.js';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import reproject from "reproject";
// import KML from 'ol/format/KML.js';
import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
var Buffer = require('buffer/').Buffer;
class KMZ extends KML {
    getType() {
        return 'arraybuffer';
    }
}
function getExtension(filename) {
    return filename.split(".").pop();
}
export default function LoadShp({ resgeojson }) {
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
    ///////////////////////Loadshp////////////////////////////////
    proj4.defs("EPSG:24047", "+proj=utm +zone=47 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs");
    proj4.defs("EPSG:24048", "+proj=utm +zone=48 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs");
    register(proj4);
    var geojsonData = {};
    var SHP = {
        NULL: 0,
        POINT: 1,
        POLYLINE: 3,
        POLYGON: 5
    };

    SHP.getShapeName = function (id) {
        for (var name in this) {
            if (id === this[name]) {
                return name;
            }
        }
    };
    var inputData = {},
        geoData = {},
        EPSGUser, url, encoding, EPSG,
        EPSG4326 = proj4('EPSG:4326');

    async function loadshp(config, returnData) {
        url = config.url;
        encoding = typeof config.encoding != 'utf-8' ? config.encoding : 'utf-8';
        EPSG = typeof config.EPSG != 'undefined' ? config.EPSG : 4326;

        // loadEPSG('//epsg.io/' + EPSG + '.js', function () {
        if (EPSG == 3821) {
            proj4.defs([
                ['EPSG:3821', '+proj=tmerc +ellps=GRS67 +towgs84=-752,-358,-179,-.0000011698,.0000018398,.0000009822,.00002329 +lat_0=0 +lon_0=121 +x_0=250000 +y_0=0 +k=0.9999 +units=m +no_defs']
            ]);
        } else if (EPSG == 24047) {
            proj4.defs("EPSG:24047", "+proj=utm +zone=47 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs");
        } else if (EPSG == 24048) {
            proj4.defs("EPSG:24048", "+proj=utm +zone=48 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs");
        }


        EPSGUser = proj4('EPSG:' + EPSG);

        if (typeof url != 'string') {
            var reader = new FileReader();
            reader.onload = async function (e) {
                var URL = window.URL || window.webkitURL || window.mozURL || window.msURL,
                    zip = new JSZip(e.target.result),

                    shpString = zip.file(/.shp$/i)[0].name,
                    dbfString = zip.file(/.dbf$/i)[0].name,

                    prjString = zip.file(/.prj$/i)[0];
                if (prjString) {
                    proj4.defs('EPSGUSER', zip.file(prjString.name).asText());
                    try {
                        EPSGUser = proj4('EPSGUSER');
                    } catch (e) {
                        console.error('Unsuported Projection: ' + e);
                    }
                }
                returnData = await shapefile.read(zip.file(shpString).asArrayBuffer(), zip.file(dbfString).asArrayBuffer());
                var checkeror = 0;
                // if (returnData.features.length > 100) {
                //     setalertmax({ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', zIndex: 1000 })
                // } else {
                    for (var y in returnData.features) {
                        if ((returnData.features[y].properties.BRANCH_COD === null || returnData.features[y].properties.BRANCH_COD === '' || returnData.features[y].properties.BRANCH_COD === '0') || (returnData.features[y].properties.CHANGWAT_C === null || returnData.features[y].properties.CHANGWAT_C === '' || returnData.features[y].properties.CHANGWAT_C === '0')) {
                            checkeror++;
                            break;
                        }
                    }
                    if (checkeror === 0) {
                        resgeojson(returnData, file.name)
                    } else {
                        setalertfalse({ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', zIndex: 1000 })
                    }
                // }
            }

            reader.readAsArrayBuffer(url);
        } else {
            JSZipUtils.getBinaryContent(url, async function (err, data) {
                if (err) throw err;

                var URL = window.URL || window.webkitURL,
                    zip = new JSZip(data),
                    shpString = zip.file(/.shp$/i)[0].name,
                    dbfString = zip.file(/.dbf$/i)[0].name,
                    prjString = zip.file(/.prj$/i)[0];
                if (prjString) {
                    proj4.defs('EPSGUSER', zip.file(prjString.name).asText());
                    try {
                        EPSGUser = proj4('EPSGUSER');
                    } catch (e) {
                        console.error('Unsuported Projection: ' + e);
                    }
                }
                returnData = await shapefile.read(zip.file(shpString).asArrayBuffer(), zip.file(dbfString).asArrayBuffer());

            });
        }
        return returnData;
        // });
    }

    // function loadEPSG(url, callback) {
    //     var script = document.createElement('script');
    //     script.src = url;
    //     script.onreadystatechange = callback;
    //     script.onload = callback;
    //     document.getElementsByTagName('head')[0].appendChild(script);
    // }
    async function loadkmz(config, returnData) {
        url = config.url;
        if (typeof url != 'string') {
            var reader = new FileReader();
            reader.onload = async function (e) {
                // console.log(e.target.result);
                var URL = window.URL || window.webkitURL || window.mozURL || window.msURL,

                    zip = new JSZip(e.target.result),

                    kmzString = zip.file(/.kml$/i)[0].name;
                console.log(zip.file(kmzString).asArrayBuffer());
                var uint8View = new Uint8Array(zip.file(kmzString).asArrayBuffer());
                // console.log(uint8View);
                var returnData1 = new TextDecoder().decode(uint8View);
                
                returnData = returnData1.replaceAll(",0", " ");
                console.log(returnData);
                // var div = document.createElement("div");
                // div.innerHTML = returnData;
                // alert(div.innerText);
                // console.log('0 || '+returnData);
                var features = new KML().readFeatures(returnData, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:4326'
                });
                // console.log(features);
                const geojsonObject = {
                    'type': 'FeatureCollection',
                    'crs': {
                        'type': 'name',
                        'properties': {
                            'name': 'EPSG:4326',
                        },
                    },
                    'features': []
                };
                // console.log(features);
                features.forEach(function (feature) {
                    // var coordinate = feature.getGeometry().getCoordinates()[0][0];                    
                console.log(feature.getGeometry().getCoordinates());
                    geojsonObject.features.push({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [feature.getGeometry().getCoordinates()[0]],
                        },
                        'properties': {
                            ACTION_DAT:"2018-10-29",
                            ACTION_NOT:"0",
                            BLOCK_PRIC:"45002912",
                            BRANCH_COD:"45000000",
                            CHANGWAT_C:"45",
                            DEPTH_VALU:"0",
                            DEPTH_VA_1:"100",
                            LAND_NAME:"..3",
                            LOWEST_PRI:"100",
                            NNHAN:"2",
                            NRAI:"1",
                            NWAH:"45",
                            PARCEL_TYP:"2",
                            STREET_COD:"IS001.1",
                            UTMMAP1:"5741",
                            UTMMAP2:"3",
                            UTMMAP3:"5088",
                            UTMMAP4:"00",
                            UTMSCALE:"4000"
                        },
                    })
                })
                console.log(geojsonObject);
                const queryParameters = new URLSearchParams(window.location.search)
                var data = reproject.reproject(geojsonObject, "EPSG:4326", (queryParameters.get("z") == '') ? "EPSG:240" + '47' : "EPSG:240" + queryParameters.get("z"));
                console.log(data);
                resgeojson(data)
                // return returnData;

            }

            reader.readAsArrayBuffer(url);
        } else {
            JSZipUtils.getBinaryContent(url, async function (err, data) {
                if (err) throw err;

                var URL = window.URL || window.webkitURL,
                    zip = new JSZip(data),
                    kmzString = zip.file(/.kml$/i)[0].name;
                var uint8View = new Uint8Array(zip.file(kmzString).asArrayBuffer());
                // console.log(uint8View);
                returnData = new TextDecoder().decode(uint8View);
                // console.log('1 || '+returnData);
                var features = new KML().readFeatures(returnData, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:4326'
                });
                // console.log(features);
                const geojsonObject = {
                    'type': 'FeatureCollection',
                    'crs': {
                        'type': 'name',
                        'properties': {
                            'name': 'EPSG:4326',
                        },
                    },
                    'features': []
                };
                features.forEach(function (feature) {
                    geojsonObject.features.push({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [feature.getGeometry().getCoordinates()[0][0]],
                        },
                        'properties': feature.values_,
                    })
                })
                console.log(geojsonObject);
                const queryParameters = new URLSearchParams(window.location.search)
                var data = reproject.reproject(geojsonObject, "EPSG:4326", (queryParameters.get("z") == '') ? "EPSG:240" + '47' : "EPSG:240" + queryParameters.get("z"));
                resgeojson(data)
                // return returnData;

            });
        }

        // });
    }
    function TransCoord(x, y) {
        if (proj4)
            var p = proj4(EPSGUser, EPSG4326, [parseFloat(x), parseFloat(y)]);
        return { x: p[0], y: p[1] };
    }

    function shpLoader(data, returnData) {
        inputData['shp'] = data;
        if (inputData['shp'] && inputData['dbf'])
            if (returnData) returnData(toGeojson(inputData));
    }

    function dbfLoader(data, returnData) {
        inputData['dbf'] = data;
        if (inputData['shp'] && inputData['dbf'])
            if (returnData) returnData(toGeojson(inputData));
    }

    function toGeojson(geojsonData) {
        var geojson = {},
            features = [],
            feature, geometry, points;

        var shpRecords = geojsonData.shp.records;
        var dbfRecords = geojsonData.dbf.records;

        geojson.type = "FeatureCollection";
        var min = TransCoord(geojsonData.shp.minX, geojsonData.shp.minY);
        var max = TransCoord(geojsonData.shp.maxX, geojsonData.shp.maxY);
        geojson.bbox = [
            min.x,
            min.y,
            max.x,
            max.y
        ];

        geojson.features = features;

        for (var i = 0; i < shpRecords.length; i++) {
            feature = {};
            feature.type = 'Feature';
            geometry = feature.geometry = {};
            var properties = feature.properties = dbfRecords[i];
            switch (shpRecords[i].shape.type) {
                case 1:
                    geometry.type = "Point";
                    var reprj = TransCoord(shpRecords[i].shape.content.x, shpRecords[i].shape.content.y);
                    geometry.coordinates = [
                        reprj.x, reprj.y
                    ];
                    break;
                case 3:
                case 8:
                    geometry.type = (shpRecords[i].shape.type == 3 ? "LineString" : "MultiPoint");
                    geometry.coordinates = [];
                    for (var j = 0; j < shpRecords[i].shape.content.points.length; j += 2) {
                        var reprj = TransCoord(shpRecords[i].shape.content.points[j], shpRecords[i].shape.content.points[j + 1]);
                        geometry.coordinates.push([reprj.x, reprj.y]);
                    };
                    break;
                case 5:
                    geometry.type = "Polygon";
                    geometry.coordinates = [];

                    for (var pts = 0; pts < shpRecords[i].shape.content.parts.length; pts++) {
                        var partsIndex = shpRecords[i].shape.content.parts[pts],
                            part = [],
                            dataset;

                        for (var j = partsIndex * 2; j < (shpRecords[i].shape.content.parts[pts + 1] * 2 || shpRecords[i].shape.content.points.length); j += 2) {
                            var point = shpRecords[i].shape.content.points;
                            var reprj = TransCoord(point[j], point[j + 1]);
                            part.push([reprj.x, reprj.y]);
                        };
                        geometry.coordinates.push(part);

                    };
                    break;
                default:
            }
            if ("coordinates" in feature.geometry) features.push(feature);
        };
        return geojson;
    }
    ////////////////////////////// laodshp /////////
    var file;
    const [alertmax, setalertmax] = useState({ display: 'none', zIndex: 10 });
    const [alertfalse, setalertfalse] = useState({ display: 'none', zIndex: 10 });
    const [alertfile, setalertfile] = useState({ display: 'none', zIndex: 10 });
    const [choocefile, setchoocefile] = useState({});

    const handleChose = () => {
        document.getElementById('fileChoseinput').click()
    }
    const handleChange = (evt) => {
        file = evt.target.files[0];
        // console.log(file);
    }
    const handleSubmit = async () => {
        if (file === undefined) {
            setalertfile({ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', zIndex: 1000 })
        } else {
            if (file.name.split('.')[1] == 'zip') {
                loadshp({
                    url: file, // path or your upload file
                    encoding: 'UTF-8',
                    EPSG: 24047
                }, function (geojson) {
                    // if (geojson.features.length > 10) {
                    //     setalertmax({ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', zIndex: 1000 })
                    // } else {
                    const queryParameters = new URLSearchParams(window.location.search)
                    var data = reproject.reproject(geojson, "EPSG:4326", (queryParameters.get("z") == '') ? "EPSG:240" + '47' : "EPSG:240" + queryParameters.get("z"));
                    var checkeror = 0;
                    for (var y in data) {
                        if ((data[y].properties.BRANCH_COD === null || data[y].properties.BRANCH_COD === '' || data[y].properties.BRANCH_COD === '0') || (data[y].properties.CHANGWAT_C === null || data[y].properties.CHANGWAT_C === '' || data[y].properties.CHANGWAT_C === '0')) {
                            checkeror++;
                        }
                    }
                    if (checkeror === 0) {
                        resgeojson(data)
                    } else {
                        setalertfalse({ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', zIndex: 1000 })
                    }

                    // }
                });
            }
            else if (file.name.split('.')[1] == 'kmz') {
                // alert("ไม่พร้อมใช้งาน อยู่ระหว่างปรับปรุง");

                loadkmz({
                    url: file, // path or your upload file
                    encoding: 'UTF-8',
                    EPSG: 24047
                });

            }
            else if (file.name.split('.')[1] == 'kml') {
                // alert("ไม่พร้อมใช้งาน");


                var reader = new FileReader();
                reader.onload = function () {
                    let aaa = reader.result
                    let aaas = aaa.split('base64,');
                    let str = aaas[1];
                    let buff = new Buffer(str, 'base64');
                    let base64ToStringNew = buff.toString('utf8');
                    // console.log(base64ToStringNew);
                    // console.log(reader.result);
                    var features = new KML().readFeatures(base64ToStringNew, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:4326'
                    });
                    // console.log(features);
                    const geojsonObject = {
                        'type': 'FeatureCollection',
                        'crs': {
                            'type': 'name',
                            'properties': {
                                'name': 'EPSG:4326',
                            },
                        },
                        'features': []
                    };
                    features.forEach(function (feature) {
                        geojsonObject.features.push({
                            'type': 'Feature',
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': [feature.getGeometry().getCoordinates()[0][0]],
                            },
                            'properties': feature.values_,
                        })
                    })
                    console.log(geojsonObject);
                    const queryParameters = new URLSearchParams(window.location.search)
                    var data = reproject.reproject(geojsonObject, "EPSG:4326", (queryParameters.get("z") == '') ? "EPSG:240" + '47' : "EPSG:240" + queryParameters.get("z"));
                    resgeojson(data)

                }
                reader.readAsDataURL(file);

                // }
                // const vector = new VectorLayer({
                //     source: new VectorSource({
                //         url: file,
                //         format: new KML(),
                //     }),
                // });
                // console.log(vector.getSource());
                // console.log(vector.getSource().getFeatures());
                // var geojson = require('kml-placemarks-to-geojson')
                // var fs = require('fs')
                // fs.createReadStream('./helsinki.kml')
                //     .pipe(geojson())
                //     .on('data', function (feature) {
                //         console.log(feature)
                //     })
            } else {
                alert("ไม่สามารถนำเข้าได้ เนื่องจากรูปแบบไฟล์ไม่ถูกต้อง\n(รูปแบบไฟล์ .SHP(.zip) .kml .kmz เท่านั้น)");
            }

        }
    }
    const handlecancel = () => {
        window.location.reload();
    }
    const handleCloseAlert = () => {
        setalertmax({ display: 'none' });
        setalertfalse({ display: 'none' });
        setalertfile({ display: 'none' });
    }
    return (
        <ThemeProvider theme={theme}>

            <script src="https://cdn.jsdelivr.net/npm/elm-pep@1.0.6/dist/elm-pep.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/2.6.1/jszip.min.js"></script>
            <Grid item xs={12}>
                <Grid container justifyContent="center" style={choocefile}>
                    <Grid item style={{ position: "relative", display: 'block', zIndex: 10, }} sx={{ p: 0, width: '600px', backgroundColor: 'white', borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)", border: '1px solid #D1D3DA' }}>
                        <Grid item sx={{ backgroundColor: '#266AC5', display: 'flex', p: 1, borderRadius: '5px 5px 0px 0px' }}><img src={"/Vector.svg"} width={30} height={30} alt='' /><Typography variant="h6" sx={{ mx: 1, color: 'white' }}> นำเข้าไฟล์</Typography></Grid>
                        <Grid item sx={{ p: 3, }}>
                            <FormControl variant="standard" size='small' sx={{ m: 1, minWidth: '85% !important', p: 1, border: '1px solid rgba(0, 0, 0, 0.6)', borderRadius: '5px', '& .Mui-focused': { backgroundColor: 'white', mt: '-8px !important', ml: '5px', color: 'rgba(0, 0, 0, 0.6)', px: '4px' } }} focused>
                                <InputLabel id="district-label" sx={{}}>ที่อยู่ไฟล์</InputLabel>
                                <Box id="fileChose" >
                                    <input id="fileChoseinput" type="file" style={{ fontSize: '12pt', minWidth: '80% !important' }} onChange={handleChange} accept=".zip,.kml,.kmz" />
                                </Box>
                            </FormControl>
                            <Button sx={{ minWidth: '20px !important', p: '0px !important', mt: 2 }} onClick={handleChose} >
                                <img src={"/folder.svg"} width={30} height={30} alt='' />
                            </Button>
                            <Grid item sx={{ textAlign: 'right', width: '100%' }} >
                                <Button variant="contained" color='primary' onClick={handleSubmit} sx={{ mx: 1 }}>ตกลง</Button>
                                <Button variant="contained" color='error' onClick={handlecancel} sx={{ mx: 1 }}>ยกเลิก</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" style={alertmax}>
                    <Grid item sx={{ width: '400px', borderRadius: '5px', backgroundColor: 'white', p: '30px', textAlign: 'center' }}>
                        <WarningAmberOutlinedIcon fontSize='large' color='error' />
                        <Typography>
                            ไม่สามารถนำเข้าได้<br />
                            ไฟล์ข้อมูลเกิน 100 รูปแปลง/ไฟล์
                        </Typography>
                        <Button variant="contained" color='error' sx={{ mt: 2 }} onClick={handleCloseAlert}>ปิด</Button>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" style={alertfalse}>
                    <Grid item sx={{ width: '400px', borderRadius: '5px', backgroundColor: 'white', p: '30px', textAlign: 'center' }}>
                        <WarningAmberOutlinedIcon fontSize='large' color='error' />
                        <Typography>
                            ไม่สามารถนำเข้าได้<br />
                            shapefile ไม่ถูกต้อง
                        </Typography>
                        <Button variant="contained" color='error' sx={{ mt: 2 }} onClick={handleCloseAlert}>ปิด</Button>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" style={alertfile}>
                    <Grid item sx={{ width: '400px', borderRadius: '5px', backgroundColor: 'white', p: '30px', textAlign: 'center' }}>
                        <WarningAmberOutlinedIcon fontSize='large' color='error' />
                        <Typography>
                            กรุณาเลือกไฟล์ใหม่อีกครั้ง
                        </Typography>
                        <Button variant="contained" color='error' sx={{ mt: 2 }} onClick={handleCloseAlert}>ปิด</Button>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}