import React, { useEffect, useState } from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import { transform } from 'ol/proj'
import { Fill, Stroke, Style, Icon, Text } from 'ol/style';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Typography, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import { ScaleLine, defaults as defaultControls } from 'ol/control';
import { register } from 'ol/proj/proj4';
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import proj4 from 'proj4';
import Menus from '../home/Menus';
import WriteFilter from 'ol/format/WFS';
import { equalTo, and } from 'ol/format/filter';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

import Overlay from 'ol/Overlay.js'
import { toLonLat } from 'ol/proj.js';
import { toStringHDMS } from 'ol/coordinate.js';
export default function Rendera() {
    proj4.defs("EPSG:24047", "+proj=utm +zone=47 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs");
    proj4.defs("EPSG:24048", "+proj=utm +zone=48 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs");
    register(proj4);
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: 'rgba(3, 78, 177, 0.4)',
            color: theme.palette.common.black,
            fontSize: 18,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 16,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));
    const [showaddtype, setshowaddtype] = useState(true)
    const [showMenu] = useState(false)
    const [zone] = useState('47')
    const [REL, setREL] = useState(false)
    const [ROAD, setROAD] = useState(false)
    const [center] = React.useState([100.523186, 13.736717])
    const [mapzoom] = useState(10)
    const [selectedProvince, setSelectedProvince] = React.useState('');
    const [selectedDistrict, setSelectedDistrict] = React.useState('');
    const [selectedTumbol, setSelectedTumbol] = React.useState('');
    const [selectedselType, setselectedselType] = React.useState('');
    const [selectedZone, setSelectedZone] = React.useState('EPSG:24047');
    const [SelLandType, setSelLandType] = useState([]);

    const childToParentmap = ({ selectedProvince, selectedDistrict, selectedTumbol, zone, selType, name }) => {
        // console.log({ selectedProvince, selectedDistrict, selectedTumbol, zone, selType, name });
        setSelectedProvince(selectedProvince)
        setSelectedDistrict(selectedDistrict)
        setSelectedTumbol(selectedTumbol)
        setselectedselType(selType)
        if (zone === '') {
            setSelectedZone('EPSG:24047')
        } else {
            setSelectedZone('EPSG:240' + zone)
        }
    }
    useEffect((map, rel, parcelname, parceltype) => {


        const mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: selectedZone,
            // comment the following two lines to have the mouse position
            // be placed within the map.
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
        });
        document.getElementById("map").innerHTML = "";
        const fill = new Fill({
            color: 'rgba(29, 112, 208,0.2)',
        });
        const stroke = new Stroke({
            color: '#1d70d0',
            width: 3,
        });
        // const style = new Style({
        //     fill: new Fill({
        //         color: '#eeeeee',
        //     }),
        // });
        var labelStyleotp = new Style({
            text: new Text({
                font: '16px Calibri,sans-serif',
                overflow: true,
                fill: new Fill({
                    color: '#0050ff'
                }),
                stroke: new Stroke({
                    color: '#FFFFFF'
                }),
            })
        });
        var vectorSource = new VectorSource();
        // var Provinceurl = process.env.REACT_APP_HOST_MAP+"/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3APROVINCE_47&outputFormat=application%2Fjson&srsname=EPSG:3857&cql_filter=(PRO_C='')"
        if (selectedProvince !== '') {
            if (selectedDistrict !== '') {
                if (selectedTumbol !== '') {
                    if (selectedselType === 2 || selectedselType === '2') {
                        // Provinceurl = process.env.REACT_APP_HOST_MAP+"/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3ATAMBOL_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:3857&cql_filter=(PRO_C='" + selectedProvince + "' AND DIS_C='" +selectedProvince+ selectedDistrict + "' AND SUB_C='" + selectedTumbol + "')"
                        var featureRequestTAMBOL = new WriteFilter().writeGetFeature({
                            srsName: 'EPSG:3857',
                            featureNS: process.env.REACT_APP_HOST_MAP + '',
                            //featurePrefix: 'osm',
                            featureTypes: ['TAMBOL_47', 'TAMBOL_48'],
                            outputFormat: 'application/json',
                            filter: and(equalTo('PRO_C', selectedProvince), equalTo('DIS_C', selectedDistrict), equalTo('SUB_C', selectedTumbol))
                        });
                        fetch(process.env.REACT_APP_HOST_MAP + '/geoserver/TRD/ows', {
                            method: 'POST',
                            body: new XMLSerializer().serializeToString(featureRequestTAMBOL)
                        }).then(function (response) {
                            return response.json();
                        }).then(function (json) {
                            var features = new GeoJSON().readFeatures(json);
                            vectorSource.clear(features);
                            vectorSource.addFeatures(features);
                            // setTimeout(() => {
                            if (features.length) {
                                map.getView().fit(vectorSource.getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                    padding: [100, 100, 100, 100]
                                })
                            } else {
                                alert("ไม่พบชั้นข้อมูล")
                            }
                            // setmapzoom(map.getView().getZoom())
                            // setCenter(map.getView().getCenter())
                            // }, 100);
                            // setTimeout(() => {
                            //     setmapzoom(map.getView().getZoom())
                            //     setCenter(map.getView().getCenter())
                            // }, 3000);
                        })
                    } else {
                        // Provinceurl = process.env.REACT_APP_HOST_MAP+"/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3ATAMBOL_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:3857&cql_filter=(PRO_C='" + selectedProvince + "' AND DIS_C='" +selectedProvince+ selectedDistrict + "' AND SUB_C='" + selectedTumbol + "')"
                        var featureRequestTAMBOL = new WriteFilter().writeGetFeature({
                            srsName: 'EPSG:3857',
                            featureNS: process.env.REACT_APP_HOST_MAP + '',
                            //featurePrefix: 'osm',
                            featureTypes: ['MUNISAN_47', 'MUNISAN_48'],
                            outputFormat: 'application/json',
                            filter: and(equalTo('AD_CHANGWA', selectedProvince), equalTo('AD_AMPHOE', selectedDistrict), equalTo('MUNI_CODE', selectedTumbol))
                        });
                        fetch(process.env.REACT_APP_HOST_MAP + '/geoserver/TRD/ows', {
                            method: 'POST',
                            body: new XMLSerializer().serializeToString(featureRequestTAMBOL)
                        }).then(function (response) {
                            return response.json();
                        }).then(function (json) {
                            var features = new GeoJSON().readFeatures(json);
                            vectorSource.clear(features);
                            vectorSource.addFeatures(features);
                            // setTimeout(() => {
                            if (features.length) {
                                map.getView().fit(vectorSource.getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                    padding: [100, 100, 100, 100]
                                })
                            } else {
                                alert("ไม่พบชั้นข้อมูล")
                            }
                            // setmapzoom(map.getView().getZoom())
                            // setCenter(map.getView().getCenter())
                            // }, 100);
                            // setTimeout(() => {
                            //     setmapzoom(map.getView().getZoom())
                            //     setCenter(map.getView().getCenter())
                            // }, 3000);
                        })
                    }

                } else {
                    // Provinceurl = process.env.REACT_APP_HOST_MAP+"/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3AAMPHOE_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:3857&cql_filter=(PRO_C='" + selectedProvince + "' AND DIS_C='" +selectedProvince+ selectedDistrict + "')"
                    var featureRequestAMPHOE = new WriteFilter().writeGetFeature({
                        srsName: 'EPSG:3857',
                        featureNS: process.env.REACT_APP_HOST_MAP + '',
                        //featurePrefix: 'osm',
                        featureTypes: ['AMPHOE_47', 'AMPHOE_48'],
                        outputFormat: 'application/json',
                        filter: and(equalTo('PRO_C', selectedProvince), equalTo('DIS_C', selectedProvince + "" + selectedDistrict))
                    });
                    fetch(process.env.REACT_APP_HOST_MAP + '/geoserver/TRD/ows', {
                        method: 'POST',
                        body: new XMLSerializer().serializeToString(featureRequestAMPHOE)
                    }).then(function (response) {
                        return response.json();
                    }).then(function (json) {
                        var features = new GeoJSON().readFeatures(json);
                        vectorSource.clear(features);
                        vectorSource.addFeatures(features);
                        // setTimeout(() => {
                        if (features.length) {
                            map.getView().fit(vectorSource.getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                padding: [100, 100, 100, 100]
                            })
                        } else {
                            alert("ไม่พบชั้นข้อมูล")
                        }
                        // setmapzoom(map.getView().getZoom())
                        // setCenter(map.getView().getCenter())
                        // }, 100);
                        // setTimeout(() => {
                        //     setmapzoom(map.getView().getZoom())
                        //     setCenter(transform(map.getView().getCenter(), 'EPSG:4326', 'EPSG:3857'))
                        // }, 3000);
                    })
                }

            } else {
                // Provinceurl = process.env.REACT_APP_HOST_MAP+"/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3APROVINCE_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:3857&cql_filter=(PRO_C='" + selectedProvince + "')"
                var featureRequest = new WriteFilter().writeGetFeature({
                    srsName: 'EPSG:3857',
                    featureNS: process.env.REACT_APP_HOST_MAP + '',
                    //featurePrefix: 'osm',
                    featureTypes: ['PROVINCE_47', 'PROVINCE_48'],
                    outputFormat: 'application/json',
                    filter: equalTo('PRO_C', selectedProvince)
                });
                fetch(process.env.REACT_APP_HOST_MAP + '/geoserver/TRD/ows', {
                    method: 'POST',
                    body: new XMLSerializer().serializeToString(featureRequest)
                }).then(function (response) {
                    return response.json();
                }).then(function (json) {
                    var features = new GeoJSON().readFeatures(json);
                    vectorSource.clear(features);
                    vectorSource.addFeatures(features);
                    // setTimeout(() => {
                    if (features.length) {
                        map.getView().fit(vectorSource.getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                            padding: [100, 100, 100, 100]
                        })
                    } else {
                        alert("ไม่พบชั้นข้อมูล")
                    }
                    // setmapzoom(map.getView().getZoom())
                    // setCenter(map.getView().getCenter())
                    // }, 100);
                    // setTimeout(() => {
                    //     setmapzoom(map.getView().getZoom())
                    //     setCenter(map.getView().getCenter())
                    // }, 3000);
                })
            }
        }
        const ProvinceLayer = new VectorLayer({
            // background: '#1a2b39',
            source: vectorSource,
            style: function (feature) {
                labelStyleotp.getText().setText((feature.values_.MS_NAME) ? feature.values_.MS_NAME : (feature.values_.ON_SUB_THA) ? feature.values_.ON_SUB_THA : (feature.values_.ON_DIS_THA) ? feature.values_.ON_DIS_THA : feature.values_.ON_PRO_THA);
                var style_Buiding = new Style({
                    fill: fill,
                    stroke: new Stroke({
                        color: '#3CDFE5',
                        lineDash: [8, 10],
                        width: 3,
                    }),
                })
                return [style_Buiding, labelStyleotp];
            },
        });
        // var Districturl = process.env.REACT_APP_HOST_MAP+"/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3AAMPHOE_47&maxFeatures=0&outputFormat=application%2Fjson&srsname=EPSG:4326"
        // if (selectedDistrict != '') {
        //     Districturl = process.env.REACT_APP_HOST_MAP+"/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3AAMPHOE_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:4326&cql_filter=(PRO_C='" + selectedProvince + "' AND DIS_C='" + selectedDistrict + "')"
        // }
        // const DistrictLayer = new VectorLayer({
        //     // background: '#1a2b39',
        //     source: new VectorSource({
        //         url: Districturl,
        //         format: new GeoJSON(),
        //     }),
        //     style: new Style({
        //         fill: fill,
        //         stroke: stroke,
        //     }),
        // });
        // var Tumbolurl = process.env.REACT_APP_HOST_MAP+'/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3ATAMBOL_47&maxFeatures=0&outputFormat=application%2Fjson&srsname=EPSG:4326'
        // if (selectedTumbol != '') {
        //     Tumbolurl = process.env.REACT_APP_HOST_MAP+"/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3ATAMBOL_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:4326&cql_filter=(PRO_C='" + selectedProvince + "' AND DIS_C='" + selectedDistrict + "' AND SUB_C='" + selectedTumbol + "')"
        // }
        // const TumbolLayer = new VectorLayer({
        //     // background: '#1a2b39',
        //     source: new VectorSource({
        //         url: Tumbolurl,
        //         format: new GeoJSON(),
        //     }),
        //     style: new Style({
        //         fill: fill,
        //         stroke: stroke,
        //     }),
        // });
        const osm = new OlLayerTile({
            source: new OlSourceOSM()
        })

        var satelliteLayer = new TileLayer({
            source: new XYZ({
                // url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                url: "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
            }),
        });
        // const view = new OlView({
        //     projection: 'EPSG:4326',
        //     center: [maplat, maplong],
        //     zoom: mapzoom
        // })
        const fetchToken = async () => {
            const tokenUrl = 'https://npvc.treasury.go.th/arcgis/tokens/generateToken';
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: 'scaleuser',
                    password: 'scale@Trd',
                    client: 'referer',
                    referer: window.location.origin,
                    expiration: 60, // Token expiration time in minutes
                    f: 'json',
                }),
            });

            const data = await response.json();
            return data.token;
        };
        
        map = new OlMap({
            controls: defaultControls().extend([mousePositionControl, new ScaleLine({ bar: true, text: true, minWidth: 125 })]),
            target: 'map',
            layers: [satelliteLayer, osm, ProvinceLayer
            ], view: new OlView({
                projection: 'EPSG:3857',
                center: transform(center, 'EPSG:4326', 'EPSG:3857'),
                zoom: mapzoom
            }),
        });
        var nostra = new TileLayer();
        const initMapNostra = async () => {
            const token = await fetchToken();
            nostra = new TileLayer({
                source: new XYZ({
                    url: `https://npvc.treasury.go.th/arcgis/rest/services/TD/NOSTRA_Cache/MapServer/tile/{z}/{y}/{x}?token=${token}`,
                    crossOrigin: 'anonymous',
                    transition: 0,
                }),
            });
            map.getLayers().insertAt(0, nostra);
            osm.setVisible(false);
        };
        initMapNostra();
        satelliteLayer.setVisible(false);

        var satellite = new TileLayer();
        const satelliteImagery = async () => {
            satellite = new TileLayer({
                source: new XYZ({
                    // url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', // Replace with your actual tile source URL
                    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', // Replace with your actual tile source URL
                    crossOrigin: 'anonymous',
                    transition: 0,
                }),
            });
            map.getLayers().insertAt(0, satellite);
            osm.setVisible(false);
        };
        satelliteImagery();
        satellite.setVisible(false);
        // map.getView().setCenter([maplat, maplong])
        // map.getView().setZoom(mapzoom);
        // console.log(ProvinceLayer.get());
        // map.getView().fit(ProvinceLayer.getExtent())
        const featureOverlay = new VectorLayer({
            source: new VectorSource(),
            map: map,
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.7)',
                    width: 2,
                }),
            }),
        });
        // setmapzoom(map.getView().getZoom())
        // setCenter(map.getView().getCenter())
        let highlight;
        const highlightFeature = function (pixel) {
            const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });
            if (feature !== highlight) {
                if (highlight) {
                    featureOverlay.getSource().removeFeature(highlight);
                }
                if (feature) {
                    featureOverlay.getSource().addFeature(feature);
                }
                highlight = feature;
            }
        }
        // const displayFeatureInfo = function (pixel, rel) {
        //     const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
        //         return feature;
        //     });
        //     var features = map.getFeaturesAtPixel(pixel);

        //     if (feature) {
        //         document.getElementById("content").style.display = 'none';
        //         document.getElementById("content").style.position = 'absolute';
        //         document.getElementById("content").style.left = pixel[0] + 'px';
        //         document.getElementById("content").style.top = pixel[1] + 'px';
        //         rel = '40';
        //         parcelname = 'ที่ดินติดทางหลวงแผ่นดิน';
        //         parceltype = 'รูปแปลงที่ดินสี่เหลี่ยม';
        //         document.getElementById("content").style.display = 'block';
        //     } else {
        //         return;
        //     }
        // };
        // map.on('moveend', function (evt) {
        //     var centerx = map.getView().getCenter();
        //     var zoom = map.getView().getZoom();
        //     setmaplat(centerx[0])
        //     setmaplong(centerx[1])
        //     setmapzoom(zoom.toFixed(2))
        //     setmapsize(zoom.toFixed(2));
        //     setlatlong(centerx[0].toFixed(2) + ',' + centerx[1].toFixed(2));
        // });

        // const viewx = map.getView();
        // const centerx = viewx.getCenter();
        // setlatlong(centerx[0].toFixed(2)+','+centerx[1].toFixed(2));
        var s = document.getElementsByClassName("custom-mouse-position");
        var ss = document.getElementsByClassName("ol-scale-text");
        var t = document.getElementById("precision");
        var tt = document.getElementById("scaleZoom");
        map.on('pointermove', function (evt) {
            if (evt.dragging) {
                return;
            }
            const pixel = map.getEventPixel(evt.originalEvent);
            highlightFeature(pixel);
            t.innerText = s[0].innerText
            tt.innerText = ss[0].innerText
            // console.log(s[0].innerHTML);
        });
        const nobasemap = document.getElementById("nobasemap");
        nobasemap.addEventListener('click', function () {
            osm.setVisible(false);
            nostra.setVisible(false);
            satellite.setVisible(false);
        })
        const olbasemap = document.getElementById("olbasemap");
        olbasemap.addEventListener('click', function () {
            osm.setVisible(true);
            nostra.setVisible(false);
            satellite.setVisible(false);
        })
        const googlemap = document.getElementById("googlemap");
        googlemap.addEventListener('click', function () {
            osm.setVisible(false);
            nostra.setVisible(true);
            satellite.setVisible(false);
        })
        const satellitemap = document.getElementById("satellitemap");
        satellitemap.addEventListener('click', function () {
            osm.setVisible(false);
            nostra.setVisible(false);
            satellite.setVisible(true);
        })
        const inputzoomin = document.getElementById("zoomin");
        inputzoomin.addEventListener('click', function () {
            map.getView().setZoom(map.getView().getZoom() + 0.5);
        })
        const inputzoomout = document.getElementById("zoomout");
        inputzoomout.addEventListener('click', function () {
            map.getView().setZoom(map.getView().getZoom() - 0.5);
        })
        document.getElementById("precision").innerHTML = "";
        t.append(s);
        const precisionInput = document.getElementById('precision');
        precisionInput.addEventListener('change', function (event) {
            const format = createStringXY(event.target.valueAsNumber);
            mousePositionControl.setCoordinateFormat(format);
        });

        map.on('wheel', function (evt) {
            tt.innerText = ss[0].innerText
        });
        // map.on('singleclick', function (evt) {
        //     displayFeatureInfo(evt.pixel);
        // });


        /**
         * Create an overlay to anchor the popup to the map.
         */

        // closer.onclick = function () {
        //     overlay.setPosition(undefined);
        //     closer.blur();
        //     return false;
        //   };
        
        const subMenuLayers = document.getElementById('subMenuLayers');
        subMenuLayers.addEventListener('mouseleave', function (event) {
            Layers = false;
            basemap = false;
            this.style.display = 'none';
        });
        const subMenu = document.getElementById('subMenu');
        subMenu.addEventListener('mouseleave', function (event) {
            Layers = false;
            basemap = false;
            this.style.display = 'none';
        });

    });
    useEffect(() => {
        const fSelLandType = async () => {
            const res = await fetch(process.env.REACT_APP_HOST_API + "/SETTING/SelLandType");
            const response = await res.json();
            // console.log(response);
            if (response.status === "200") {
                var result = response.result;
                const et = document.getElementById('tableEditLayer')
                // result.forEach((item, i) => {
                //     et.append('<tr><td>' + item.LAND_TYPE_ID + '<td/><td>' + item.LAND_TYPE_NAME + '<td/><td>' + item.LAND_TYPE_CAL + '<td/></tr>')

                // })
                setSelLandType(result)
                setTimeout(() => {
                    // console.log(SelLandType);
                }, 500);

            }
        }
        fSelLandType();
    }, []);
    // const zoomIn = () => {
    //     map.getView().setZoom(map.getView().getZoom() + 1);
    // }
    // const zoomOut = () => {
    //     map.getView().setZoom(map.getView().getZoom() - 1);
    // }
    var basemap = false;
    var Layers = false;
    const showBasemap = () => {
        if (basemap) {
            Layers = false;
            basemap = false;
            document.getElementById('subMenuLayers').style.display = 'none'
            document.getElementById('subMenu').style.display = 'none'
        } else {
            Layers = false;
            basemap = true;
            document.getElementById('subMenuLayers').style.display = 'none'
            document.getElementById('subMenu').style.display = 'block'
        }

    };
    const showLayers = () => {
        if (Layers) {
            basemap = false;
            Layers = false;
            document.getElementById('subMenu').style.display = 'none'
            document.getElementById('subMenuLayers').style.display = 'none'
        } else {
            basemap = false;
            Layers = true;
            document.getElementById('subMenu').style.display = 'none'
            document.getElementById('subMenuLayers').style.display = 'block'
        }

    }
    const menuStyle = {
        display: showMenu ? 'block' : 'none',
    };
    const RELClick = () => {
        setREL(!REL)
    }

    const ROADClick = () => {
        setROAD(!ROAD)
    }

    function edittypecal(e) {
        // console.log(e);
        document.getElementById('uinput1').value = e.target.dataset.id;
        document.getElementById('uinput2').value = e.target.dataset.name;
        document.getElementById('uinput3').value = e.target.dataset.cal;
        document.getElementById('openEdit1').style.display = 'flex'

    }
    function deltypecal1(e) {
        // console.log(e);
        document.getElementById('uinput1').value = e.target.parentElement.dataset.id;
        document.getElementById('uinput2').value = e.target.parentElement.dataset.name;
        document.getElementById('uinput3').value = e.target.parentElement.dataset.cal;
        document.getElementById('alertdeltypecal').style.display = 'flex'
    }
    function savetypecal(e) {

    }

    const openEditType = () => {
        if (showaddtype) {
            document.getElementById('openEdit').style.display = 'flex';
        } else {

            document.getElementById('openEdit').style.display = 'none';
        }
        setshowaddtype(!showaddtype)

    }

    const addtypecalstep1 = () => {
        document.getElementById('alertaddtypecal').style.display = 'flex';
    }
    const updatetypecalstep1 = () => {
        document.getElementById('alertupdatetypecal').style.display = 'flex';
    }

    const canceladdtypecal = () => {

        document.getElementById('openEdit1').style.display = 'none';
        document.getElementById('alertdeltypecal').style.display = 'none';
        document.getElementById('alertaddtypecal').style.display = 'none';
        document.getElementById('alertupdatetypecal').style.display = 'none';

    }

    const cancelconfirm = () => {
        document.getElementById('alertsuccess').style.display = 'none';
    }
    const opendivedittype = () => {
        document.getElementById('divedittype').style.display = 'flex';
    }
    const closedivedittype = () => {
        document.getElementById('divedittype').style.display = 'none';
    }
    const addtypecal = async () => {
        document.getElementById('alertaddtypecal').style.display = 'none';
        const input1 = document.getElementById('input1').value
        const input2 = document.getElementById('input2').value
        const input3 = document.getElementById('input3').value
        if (input1 === '' || input2 === '' || input3 === '') {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน')
        } else {
            var row = JSON.stringify({
                "LAND_TYPE_ID": input1
                , "LAND_TYPE_NAME": input2
                , "LAND_TYPE_CAL": input3
                , "FLAG_CAL": "1"
            });
            const res = await fetch(process.env.REACT_APP_HOST_API + "/SETTING/InsLandType", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: row
            });
            const response = await res.json();
            if (response.status === "200") {
                const res = await fetch(process.env.REACT_APP_HOST_API + "/SETTING/SelLandType");
                const response = await res.json();
                // console.log(response);
                if (response.status === "200") {
                    var result = response.result;
                    const et = document.getElementById('tableEditLayer')
                    setSelLandType(result)
                    document.getElementById('input1').value = '';
                    document.getElementById('input2').value = '';
                    document.getElementById('input3').value = '';
                    document.getElementById('alertsuccess').style.display = 'flex'
                    openEditType()
                }
            } else {
                alert(response.error)
            }
        }
    }
    const updatetypecal = async () => {
        document.getElementById('alertupdatetypecal').style.display = 'none'
        const input1 = document.getElementById('uinput1').value
        const input2 = document.getElementById('uinput2').value
        const input3 = document.getElementById('uinput3').value
        if (input1 === '' || input2 === '' || input3 === '') {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน')
        } else {
            var row = JSON.stringify({
                "LAND_TYPE_ID": input1 + ""
                , "LAND_TYPE_CAL": input3 + ""
                , "FLAG_CAL": "1"
            });
            // console.log(row);
            const res = await fetch(process.env.REACT_APP_HOST_API + "/SETTING/UpdLandType", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: row
            });
            const response = await res.json();
            if (response.status === "200") {
                const res = await fetch(process.env.REACT_APP_HOST_API + "/SETTING/SelLandType");
                const response = await res.json();
                // console.log(response);
                if (response.status === "200") {
                    var result = response.result;
                    const et = document.getElementById('tableEditLayer')
                    setSelLandType(result)
                    document.getElementById('uinput1').value = '';
                    document.getElementById('uinput2').value = '';
                    document.getElementById('uinput3').value = '';
                    document.getElementById('alertsuccess').style.display = 'flex'
                }
            } else {
                alert(response.error)
            }
            document.getElementById('openEdit1').style.display = 'none'

        }
    }
    const deltypecal = async () => {
        document.getElementById('alertdeltypecal').style.display = 'none'
        const input1 = document.getElementById('uinput1').value
        const input2 = document.getElementById('uinput2').value
        const input3 = document.getElementById('uinput3').value
        if (input1 === '' || input2 === '' || input3 === '') {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน')
        } else {
            var row = JSON.stringify({
                "LAND_TYPE_ID": input1 + ""
                , "LAND_TYPE_CAL": input3 + ""
                , "FLAG_CAL": "0"
            });
            // console.log(row);
            const res = await fetch(process.env.REACT_APP_HOST_API + "/SETTING/UpdLandType", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: row
            });
            const response = await res.json();
            if (response.status === "200") {
                const res = await fetch(process.env.REACT_APP_HOST_API + "/SETTING/SelLandType");
                const response = await res.json();
                // console.log(response);
                if (response.status === "200") {
                    var result = response.result;
                    const et = document.getElementById('tableEditLayer')
                    setSelLandType(result)
                    document.getElementById('uinput1').value = '';
                    document.getElementById('uinput2').value = '';
                    document.getElementById('uinput3').value = '';
                    document.getElementById('alertsuccess').style.display = 'flex'
                }
            } else {
                alert(response.error)
            }
            document.getElementById('openEdit1').style.display = 'none'

        }
    }
    return (
        <React.StrictMode>
            <Grid item xs={12} style={{ position: "relative", display: 'flex', zIndex: 0 }}>
                <Grid id="map" style={{ width: "100%", height: "calc(100vh - 66px)" }}>

                </Grid>
                <Grid style={{ position: 'absolute', bottom: 0, right: 0, }}>
                    <Grid sx={{ display: 'flex', borderRadius: '5px 5px 0px 0px', backgroundColor: 'rgba(255, 255, 255, 0.69)', p: '2px', color: '#415FB5', }}>
                        <Grid sx={{ px: 1 }}>Coordinate </Grid><Grid sx={{ border: '1px solid #415FB5', backgroundColor: 'rgba(255, 255, 255, 0.69)', px: 1, color: '#415FB5', width: '230px', textAlign: 'center' }}><Grid id="precision"></Grid> </Grid>
                        <Grid sx={{ px: 1 }} hidden>Scale </Grid><Grid sx={{ borderRadius: 5, backgroundColor: '#2F4266', px: 1, color: 'white', width: '100px', textAlign: 'center' }} hidden><Grid id="scaleZoom"></Grid></Grid>
                        <Grid sx={{ backgroundColor: 'rgba(255, 255, 255, 0.69)', px: 1, color: '#415FB5', width: '150px', textAlign: 'center' }}><Grid id="scaleZone">{selectedZone} (OTF)</Grid></Grid>
                    </Grid>
                </Grid><Grid style={{ position: 'absolute', top: 80, right: 5, lineHeight: '5px' }}>
                    <Button title="Edit type" id="edittype" sx={{ alignItems: 'center', backgroundColor: 'rgba(247, 213, 65, 1)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(221, 187, 48, 1)", }, p: 1, m: .5 }} onClick={opendivedittype}>
                        <img src={'/edittype.svg'} width={27} height={27} alt='' />
                    </Button><br />
                </Grid>
                <Grid style={{ position: 'absolute', bottom: 40, right: 5, lineHeight: '5px' }}>
                    <Button title="Zoomin" id="zoomin" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <AddIcon sx={{ color: '#FFF' }} />
                    </Button><br />
                    <Button title="Zoomout" id="zoomout" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <RemoveIcon sx={{ color: '#FFF' }} />
                    </Button><br />
                    <Button title="move" id="move" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <img src={'/moveicon.svg'} width={25} height={25} alt='' />
                    </Button><br />
                    <Button title="Base Map" id="mapicon" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }} onClick={showBasemap}>
                        <img src={'/basemap.svg'} width={25} height={25} alt='' />
                    </Button><br />
                    <Button title="Layers" id="layers" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }} onClick={showLayers}>
                        <img src={'/layer-svgrepo-com.svg'} width={25} height={25} alt='' />
                    </Button><br />
                </Grid>
                <Grid id="subMenu" item style={menuStyle} sx={{ width: '200px', backgroundColor: 'white', position: 'absolute', bottom: 100, right: 60, display: 'flex', p: 1, borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)" }}>
                    <Typography sx={{ pl: 1, textAlign: 'center' }}>
                        -เลือกแสดงแผนที่-
                    </Typography>
                    <Typography id="olbasemap" sx={{ pl: 1, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)', cursor: 'pointer' } }}>
                        <img src={'/Rectangle5365.png'} width={15} height={15} alt='' /> Open Street Map
                    </Typography>
                    <Typography id="googlemap" sx={{ pl: 1, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)', cursor: 'pointer' } }}>
                        <img src={'/nostra1.png'} width={15} height={15} alt='' /> Nostra Map
                    </Typography>
                    <Typography id="satellitemap" sx={{ pl: 1, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)', cursor: 'pointer' } }}>
                        <img src={'/satellite.jpg'} width={15} height={15} alt='' /> ภาพถ่ายดาวเทียม
                    </Typography>
                    <Typography id="nobasemap" sx={{ pl: 1, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)', cursor: 'pointer' } }}>
                        <CloseIcon fontSize='10px' sx={{ color: 'red' }} /> ไม่แสดง
                    </Typography>
                </Grid>
                <Grid id="subMenuLayers" item style={menuStyle} sx={{ width: '200px', backgroundColor: 'white', position: 'absolute', bottom: 60, right: 60, display: 'flex', p: 1, borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)" }}>
                    <Typography sx={{ pl: 1, textAlign: 'center' }}>
                        -แสดง/ซ่อนชั้นข้อมูล-
                    </Typography>
                    <Typography sx={{ pl: 1, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)' }, cursor: 'pointer' }} onClick={RELClick}>
                        {REL ? <VisibilityOffIcon fontSize='10px' sx={{ color: '#b2102f' }} /> : <VisibilityIcon fontSize='10px' sx={{ color: '#4caf50' }} />} REL_{zone}
                    </Typography>
                    <Typography sx={{ pl: 1, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)' }, cursor: 'pointer' }} onClick={ROADClick}>
                        {ROAD ? <VisibilityOffIcon fontSize='10px' sx={{ color: '#b2102f' }} /> : <VisibilityIcon fontSize='10px' sx={{ color: '#4caf50' }} />} ROAD_{zone}
                    </Typography>
                </Grid>

                <Menus childToParentmap={childToParentmap} />
                <Grid container id="divedittype" item
                    direction="column"
                    alignItems="center"
                    // justifyContent="center"  
                    style={{ display: 'none' }} sx={{ width: '100%', height: 'calc(100vh - 66px)', overflow: 'auto', backgroundColor: 'white', position: 'fixed', bottom: 0, right: 0, display: 'flex', p: 1, borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)", textAlign: 'center', }}>
                    <Grid container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ display: 'block', maxWidth: '1000px' }}>
                        <Grid item>
                            <Typography sx={{ pl: 1, textAlign: 'center', color: 'rgba(64, 107, 188, 0.8)', fontSize: '20pt' }}>
                                <img src={'/edittype.svg'} width={27} height={27} alt='' />สร้างและปรับปรุงแก้ไข สูตรคำนวณราคาประเมินที่ดิน
                            </Typography>
                        </Grid>
                        <Grid item sx={{ borderRadius: '5px', boxShadow: "7px 6px 4px rgba(0, 0, 0, 0.25)", textAlign: 'center', p: 8, border: '1px solid #eaeaea' }}>
                            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                                <Table sx={{ minWidth: 800 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">LAND_TYPE_ID</StyledTableCell>
                                            <StyledTableCell align="center">LAND_TYPE_NAME</StyledTableCell>
                                            <StyledTableCell align="center">LAND_TYPE_CAL</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {SelLandType.map((row, index) => (
                                            <StyledTableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <StyledTableCell component="th" scope="row" align="center">
                                                    {row.LAND_TYPE_ID}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{row.LAND_TYPE_NAME}</StyledTableCell>
                                                <StyledTableCell align="right">{row.LAND_TYPE_CAL} <img src={'/edittypecal.svg'} width={20} height={20} alt='' style={(row.EDIT_STATUS == 0) ? { cursor: 'pointer', marginLeft: 6 } : { display: 'none', }} data-id={row.LAND_TYPE_ID} data-name={row.LAND_TYPE_NAME} data-cal={row.LAND_TYPE_CAL} onClick={edittypecal} /> <DeleteIcon data-id={row.LAND_TYPE_ID} data-name={row.LAND_TYPE_NAME} data-cal={row.LAND_TYPE_CAL} onClick={deltypecal1} style={(row.EDIT_STATUS == 0) ? { cursor: 'pointer', marginLeft: 6, color: 'red' } : { display: 'none', }} /></StyledTableCell>
                                            </StyledTableRow >
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Button onClick={openEditType}>เพิ่ม Type {showaddtype ? <KeyboardDoubleArrowDownIcon /> : <KeyboardDoubleArrowUpIcon />}</Button>
                            <Grid id="openEdit1" container sx={{ display: 'none' }}>
                                <Grid item xs={11}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block' }}>LAND_TYPE_ID<span style={{ color: 'red' }}></span> </Typography><br />
                                            <TextField id="uinput1" type={'number'} size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} disabled />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block' }}>LAND_TYPE_NAME<span style={{ color: 'red' }}></span> </Typography><br />
                                            <TextField id="uinput2" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} disabled />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block' }}>LAND_TYPE_CAL<span style={{ color: 'red' }}></span> </Typography><br />
                                            <TextField id="uinput3" type={'number'} size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={1}>
                                    <br /><Button variant="contained" color="success" onClick={updatetypecalstep1}>บันทึก</Button>
                                </Grid>
                            </Grid>
                            <Grid id="openEdit" container sx={{ display: 'none' }} >
                                <Grid item xs={11}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block' }}>LAND_TYPE_ID<span style={{ color: 'red' }}></span> </Typography><br />
                                            <TextField id="input1" type={'number'} size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block' }}>LAND_TYPE_NAME<span style={{ color: 'red' }}></span> </Typography><br />
                                            <TextField id="input2" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block' }}>LAND_TYPE_CAL<span style={{ color: 'red' }}></span> </Typography><br />
                                            <TextField id="input3" type={'number'} size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={1}>
                                    <br /><Button variant="contained" color="success" onClick={addtypecalstep1}>เพิ่ม</Button>
                                </Grid>

                            </Grid>
                        </Grid>
                        <Grid item sx={{ alignContent: 'right', p: 2 }}>
                            <Button sx={{ backgroundColor: 'rgba(35, 104, 196, 0.63)', ":hover": { backgroundColor: "rgba(135, 104, 196, 0.63)", } }} onClick={closedivedittype}>กลับสู่หน้าหลัก</Button>
                        </Grid>
                    </Grid>
                    <Grid id="alertaddtypecal"
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                        <Grid item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px', textAlign: 'center' }}>
                            <Grid container alignItems="right" justifyContent="right">
                                <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={canceladdtypecal}><CloseIcon color="white" /></Button>
                            </Grid><br />
                            ต้องการบันทึก<br />
                            สูตรคำนวณราคาประเมินที่ดิน<br /><br />
                            <Button variant="contained" color='primary' sx={{ mr: '15px' }} onClick={addtypecal}>บันทึก</Button>
                            <Button variant="contained" id="closeProperties" color='error' sx={{ ml: '15px' }} onClick={canceladdtypecal}>ยกเลิก</Button>
                        </Grid>

                    </Grid>
                    <Grid id="alertupdatetypecal"
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                        <Grid item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px', textAlign: 'center' }}>
                            <Grid container alignItems="right" justifyContent="right">
                                <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={canceladdtypecal}><CloseIcon color="white" /></Button>
                            </Grid><br />
                            ต้องการบันทึก<br />
                            สูตรคำนวณราคาประเมินที่ดิน<br /><br />
                            <Button variant="contained" color='primary' sx={{ mr: '15px' }} onClick={updatetypecal}>บันทึก</Button>
                            <Button variant="contained" id="closeProperties" color='error' sx={{ ml: '15px' }} onClick={canceladdtypecal}>ยกเลิก</Button>
                        </Grid>

                    </Grid>
                    <Grid id="alertdeltypecal"
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                        <Grid item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px', textAlign: 'center' }}>
                            <Grid container alignItems="right" justifyContent="right">
                                <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={canceladdtypecal}><CloseIcon color="white" /></Button>
                            </Grid><br />
                            ต้องการลบ<br />
                            สูตรคำนวณราคาประเมินที่ดิน<br /><br />
                            <Button variant="contained" color='primary' sx={{ mr: '15px' }} onClick={deltypecal}>ตกลง</Button>
                            <Button variant="contained" id="closeProperties" color='error' sx={{ ml: '15px' }} onClick={canceladdtypecal}>ยกเลิก</Button>
                        </Grid>

                    </Grid>
                    <Grid id="alertsuccess"
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center" style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '100vw', height: '100vh', display: 'none' }}>
                        <Grid item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px', textAlign: 'center' }}>
                            <Grid container alignItems="right" justifyContent="right">
                                <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={cancelconfirm}><CloseIcon color="white" /></Button>
                            </Grid><br />
                            <img src={"/check.gif"} width={100} height={100} alt='' /><br />
                            บันทึกข้อมูล สำเร็จ
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </React.StrictMode >
    );
}
// }


