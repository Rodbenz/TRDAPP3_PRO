import React, { useEffect, useState } from "react";
import OlMap from "ol/Map";
import Point from 'ol/geom/Point';
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import * as olLoadingstrategy from 'ol/loadingstrategy';
import VectorSource from 'ol/source/Vector';
import Select from 'ol/interaction/Select.js'
import { Draw, Modify, Snap, defaults } from 'ol/interaction';
import { get } from 'ol/proj.js';
import { transform } from 'ol/proj'
import { fromLonLat } from 'ol/proj';
import { toLonLat } from 'ol/proj';
import { Fill, Stroke, Style, Icon, Text } from 'ol/style';
import * as olSphere from 'ol/sphere';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Box, Typography, TextField } from "@mui/material";
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import { ScaleLine, defaults as defaultControls } from 'ol/control';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import WriteFilter from 'ol/format/WFS';
import { equalTo, and } from 'ol/format/filter';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import SortIcon from '@mui/icons-material/Sort';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import reproject from "reproject";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { Diversity2Outlined } from "@mui/icons-material";
import Overlay from 'ol/Overlay.js';
import { toStringHDMS } from 'ol/coordinate.js';
import StraightenIcon from '@mui/icons-material/Straighten';
import { clearMeasureLayout, drawMeasure, removeMeasure, zoomMap } from "../../../libs/controlMeasure";
import './MapImport.css';
import { UpdCreateRel, UpdCreateRel2 } from "../../../libs/dataOutputImport";
import { Polygon } from "ol/geom";
import { colorRoad } from "../../../libs/colors";

export default function Rendera({ typeimport2map, datapoint2table, infoSeq2map, reloadTable, steppoint2map, point2mapdata, zoomtofeature, infocalSeq2map, setActiveCellId, setZoomtofeature }) {
    const queryParameters = new URLSearchParams(window.location.search)
    proj4.defs("EPSG:24047", "+proj=utm +zone=47 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs");
    proj4.defs("EPSG:24048", "+proj=utm +zone=48 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs");
    register(proj4);
    const selectstyle = {
        minHeight: '36px',
        border: '1px solid gray',
        borderRadius: '5px',
        width: '228px',
        fontFamily: 'kanit',
        fontSize: '1rem'
    }
    const selectstylepoint1 = {
        minHeight: '36px',
        border: '1px solid #00AEEF',
        borderRadius: '5px',
        width: '228px',
        fontFamily: 'kanit',
        fontSize: '1rem'
    }
    const selectstylepoint2 = {
        minHeight: '36px',
        border: '1px solid #00D97A',
        borderRadius: '5px',
        width: '200px',
        fontFamily: 'kanit',
        fontSize: '1rem', display: 'none'
    }
    const selectstylepoint3 = {
        minHeight: '36px',
        border: '1px solid #9747FF',
        borderRadius: '5px',
        width: '228px',
        fontFamily: 'kanit',
        fontSize: '1rem'
    }

    const iconStyle = new Style({
        image: new Icon({
            anchor: [0.45, 75],
            scale: 0.4,
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'iconpoint.png',
        }),
    });
    var labelStylepolygon = new Style({
        text: new Text({
            font: '16px Calibri,sans-serif',
            overflow: true,
            fill: new Fill({
                color: '#000000'
            }),
        })
    });
    var labelStyleprice = new Style({
        text: new Text({
            font: '16px Calibri,sans-serif',
            overflow: true,
            fill: new Fill({
                color: '#ff0000'
            }),
        })
    });

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
    const [zone] = useState(queryParameters.get("z"))
    var geometry;
    const [geometryp, setgeometryp] = useState('');
    const [center, setcenter] = React.useState([100.523186, 13.736717])
    const [mapzoom, setmapzoom] = useState(10)
    const [selectedProvince] = React.useState(queryParameters.get("p"));
    const [selectedDistrict] = React.useState(queryParameters.get("a"));
    const [selectedTumbol] = React.useState(queryParameters.get("t"));
    const [selectedTumbolName] = React.useState(queryParameters.get("n"));
    const [selectedselType, setselectedselType] = React.useState(queryParameters.get("tt"));
    const [selectedZone, setselectedZone] = React.useState('EPSG:240' + queryParameters.get("z"));
    const [typeimport, setTypeimport2map] = React.useState('');
    const [fi, setfi] = React.useState(0);
    const [sourcepoint, setsourcepoint] = React.useState(new VectorSource());
    var userid = window.sessionStorage.getItem("userid");
    const [showMenu] = useState(false);
    const [reloadmap, setreloadmap] = useState(false);
    // const [PARCEL1 ,sPARCEL1] = useState(false)
    // const [PARCEL2,sPARCEL2] = useState(true)
    // const [PARCEL3,sPARCEL3] = useState(true)
    const [valueslide1, setValueslide1] = React.useState(50);
    const [valueslide2, setValueslide2] = React.useState(50);
    // var [lineedit, setlineedit] = useState(true);
    const [verifyAuthNextMount, setVerifyAuthNextMount] = useState(false);
    var features;

    useEffect((map, rel, parcelname, parceltype) => {
        const container1 = document.createElement('div');
        container1.id = 'popupyes';
        container1.className = 'ol-popup';
        const container2 = document.createElement('div');
        container1.appendChild(container2);
        const btyes = document.createElement('button');
        const btno = document.createElement('button');

        function onclickyes() {
            container1.remove();
        }
        // const container = document.getElementById('popup');
        // const content = document.getElementById('popup-content');
        // const closer = document.getElementById('popup-closer');
        const overlay = new Overlay({
            element: container1,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });
        const editLine11 = document.getElementById("editLine1");
        editLine11.style.display = 'none';

        var vectorSourceImpPolygon = new VectorSource();
        var vectorSourceREL = new VectorSource();
        var vectorSourceRoad = new VectorSource();
        var roadLayerLabel;
        var REL = false;
        var ROAD = false;
        var PARCEL = false;
        var PARCEL1 = false;
        var PARCEL2 = true;
        var PARCEL3 = true;
        var POINT = false;
        setTypeimport2map(typeimport2map);
        if (typeimport === 'polygon') {
            document.getElementById('markcoord').style.display = 'none';
            document.getElementById('markpoint').style.display = 'none';
            document.getElementById('editLine').style.display = 'flex';
            if (steppoint2map === 3) {
                document.getElementById('editLine').style.display = 'none';
                document.getElementById('editLine1').style.display = 'none';
            }
            var mousePosition2;
            var offset2 = [0, 0];
            var div2 = document.getElementById('propertiespolygon');
            var isDown = false;

            div2.style.position = "absolute";
            div2.style.left = "10px";
            div2.style.top = "10px";
            div2.addEventListener('mousedown', function (e) {
                isDown = true;
                offset2 = [
                    div2.offsetLeft - e.clientX,
                    div2.offsetTop - e.clientY
                ];
            }, true);

            document.addEventListener('mouseup', function () {
                isDown = false;
            }, true);

            document.addEventListener('mousemove', function (event) {
                event.preventDefault();
                if (isDown) {
                    mousePosition2 = {

                        x: event.clientX,
                        y: event.clientY

                    };
                    div2.style.left = (((mousePosition2.x + offset2[0]) < 0) ? 0 + 'px' : (mousePosition2.x + offset2[0]) + 'px');
                    div2.style.top = (((mousePosition2.y + offset2[1]) < 0) ? 0 + 'px' : (mousePosition2.y + offset2[1]) + 'px');
                }
            }, true);
        } else if (typeimport === 'point') {
            // setTimeout(() => {
            if (steppoint2map != 1) {
                // console.log(sourcepoint.getFeatures());
                (sourcepoint.getFeatures()).forEach(async function (feature) {
                    // console.log(feature.getId());

                    var row = JSON.stringify({
                        "PARCEL_S3_SEQ": feature.getId() + "",
                        "ZONE": queryParameters.get("z") + ""
                    });
                    if (steppoint2map === 2) {
                        var res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/SelPointSTS2ByParcelSeq", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: row
                        });

                        document.getElementById('markcoord').style.display = 'none';
                        document.getElementById('markpoint').style.display = 'none';
                        document.getElementById('editLine').style.display = 'none';
                        // console.log(row);

                    } else if (steppoint2map === 3) {
                        var res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/SelPointSTS3ByParcelSeq", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: row
                        });
                        document.getElementById('markcoord').style.display = 'none';
                        document.getElementById('markpoint').style.display = 'none';
                        document.getElementById('editLine').style.display = 'none';
                        // console.log(row);
                    }
                    const response = await res.json();
                    if (response.status === "200") {
                        var result = response.result
                        // console.log(result);

                        if (result.length !== 0) {
                            feature.values_.VAL_PER_WAH = result[0].VAL_PER_WAH;
                            // console.log(feature,feature.values_.VAL_PER_WAH);
                        }
                    }
                });
            } else {

                document.getElementById('markcoord').style.display = 'flex';
                document.getElementById('markpoint').style.display = 'flex';
                document.getElementById('editLine').style.display = 'none';
            }
            // }, 1000);
            var mousePosition1;
            var offset1 = [0, 0];
            var div1 = document.getElementById('propertiespoint');
            var isDown = false;

            div1.style.position = "absolute";
            div1.style.left = "10px";
            div1.style.top = "10px";
            div1.addEventListener('mousedown', function (e) {
                isDown = true;
                offset1 = [
                    div1.offsetLeft - e.clientX,
                    div1.offsetTop - e.clientY
                ];
            }, true);
            var mousePosition3;
            var offset3 = [0, 0];
            var div3 = document.getElementById('propertiescoord');

            div3.style.position = "absolute";
            div3.style.left = "10px";
            div3.style.top = "10px";
            div3.addEventListener('mousedown', function (e) {
                isDown = true;
                offset3 = [
                    div3.offsetLeft - e.clientX,
                    div3.offsetTop - e.clientY
                ];
            }, true);
            document.addEventListener('mouseup', function () {
                isDown = false;
            }, true);

            document.addEventListener('mousemove', function (event) {
                event.preventDefault();
                if (isDown) {
                    if (div1.style.display != 'none' && div1.hidden != true) {
                        mousePosition1 = {

                            x: event.clientX,
                            y: event.clientY

                        };
                        div1.style.left = (((mousePosition1.x + offset1[0]) < 0) ? 0 + 'px' : (mousePosition1.x + offset1[0]) + 'px');
                        div1.style.top = (((mousePosition1.y + offset1[1]) < 0) ? 0 + 'px' : (mousePosition1.y + offset1[1]) + 'px');
                    } else if (div3.style.display != 'none' && div3.hidden != true) {
                        mousePosition3 = {

                            x: event.clientX,
                            y: event.clientY

                        };
                        div3.style.left = (((mousePosition3.x + offset3[0]) < 0) ? 0 + 'px' : (mousePosition3.x + offset3[0]) + 'px');
                        div3.style.top = (((mousePosition3.y + offset3[1]) < 0) ? 0 + 'px' : (mousePosition3.y + offset3[1]) + 'px');
                    }

                }
            }, true);


        } else {
            document.getElementById('markcoord').style.display = 'none'
            document.getElementById('markpoint').style.display = 'none'
            document.getElementById('editLine').style.display = 'none'
        }
        const mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: selectedZone,
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
        });
        document.getElementById("map").innerHTML = "";
        const fill = new Fill({
            color: 'rgba(29, 112, 208,0.0)',
        });
        const stroke = new Stroke({
            color: '#3CDFE5',
            lineDash: [8, 10],
            width: 3,
        });
        const fillimp = new Fill({
            color: 'rgba(29, 112, 208,0.0)',
        });
        const strokeimp = new Stroke({
            color: '#D17F41',
            // lineDash: [2, 10],
            width: 3,
        });
        const fillroad = new Fill({
            color: 'rgba(29, 112, 208,0.0)',
        });
        const strokeroad = new Stroke({
            color: '#2230B5',
            lineDash: [10, 5],
            width: 1,
        });
        var labelStyle = new Style({
            text: new Text({
                font: '12px Calibri,sans-serif',
                placement: 'line',
                textBaseline: 'top',
                maxangle: 360,
                overflow: true,
                fill: new Fill({
                    color: '#2230B5'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 0
                })
            })
        });
        const styleFunctionSelectLine = function (feature) {
            const geometry = feature.getGeometry();
            const styles = [
                // linestring
                new Style({
                    stroke: new Stroke({
                        color: '#FF0000',
                        width: 3,
                    }),
                }),
            ];
            var coords = geometry.getCoordinates();// Gets all the coordinates
            var start = coords[0];//First Coordinate
            var end = coords[1];//Second Coordinate

            // Rest of the code
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            // arrows 
            styles.push(new Style({
                geometry: new Point(end),
                image: new Icon({
                    src: '/smallarrow.png',
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation
                })
            }));

            return styles;
        };
        const styleFunction = function (feature) {
            const geometry = feature.getGeometry();
            const styles = [
                // linestring
                new Style({
                    stroke: new Stroke({
                        color: '#000000',
                        width: 3,
                    }),
                }),
            ];
            var coords = geometry.getCoordinates();// Gets all the coordinates
            var start = coords[0];//First Coordinate
            var end = coords[1];//Second Coordinate

            // Rest of the code
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            // arrows 
            styles.push(new Style({
                geometry: new Point(end),
                image: new Icon({
                    src: '/smallarrow.png',
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation
                })
            }));

            return styles;
        };
        if (typeimport === 'point') {
            vectorSourceRoad = new VectorSource({
                format: new GeoJSON(),
                url: function (extent) {
                    return process.env.REACT_APP_HOST_MAP + "/geoserver/TRD/ows?service=WFS&" +
                        "version=1.0.0&request=GetFeature&typeName=TRD%3AROAD_" + queryParameters.get("z") + "&outputFormat=application%2Fjson&srsname=EPSG:4326&" +
                        "bbox=" + extent.join(',') + ",EPSG:3857";
                },
                strategy: olLoadingstrategy.bbox
            })
        }
        if (infocalSeq2map !== 0 && infocalSeq2map !== '') {
            var seq3 = '';

            for (var i in infocalSeq2map) {
                // console.log((i * 1) + 1, infocalSeq2map.length);
                // console.log(infocalSeq2map[i]);
                if (typeof infocalSeq2map[i] !== "object") {
                    if ((i * 1) + 1 === infocalSeq2map.length) {
                        seq3 += "'" + infocalSeq2map[i] + "'"
                    } else {
                        seq3 += "'" + infocalSeq2map[i] + "',"
                    }
                }
            }
            // console.log(seq3);
            fetch(process.env.REACT_APP_HOST_MAP + "/geoserver/TRD/ows?service=WFS&" +
                "version=1.0.0&request=GetFeature&typeName=TRD%3APARCEL_S3_" + queryParameters.get("z") + "&outputFormat=application%2Fjson&srsname=EPSG:3857&" +
                "cql_filter=(PARCEL_S3_SEQ IN (" + seq3 + "))")
                .then(function (response) {
                    return response.json();
                }).then(function (json) {
                    var features = new GeoJSON().readFeatures(json);
                    vectorSourceImpPolygon.clear(features);
                    vectorSourceImpPolygon.addFeatures(features);
                    if (features.length) {
                        map.getView().fit(vectorSourceImpPolygon.getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                            padding: [100, 100, 100, 100]
                        })
                        if (zoomtofeature !== 0 && (seq3 != '0')) {
                            // console.log('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                            const sourcerzoom = vectorSourceImpPolygon;
                            var featureszoom = sourcerzoom.getFeatureById('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                            if (featureszoom) {
                                map.getView().fit(featureszoom.getGeometry().getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                    padding: [100, 100, 100, 100]
                                })
                            }

                        } else {

                            vectorpoint.setVisible(true);
                        }
                    } else {
                    }
                })
            fetch(process.env.REACT_APP_HOST_MAP + "/geoserver/TRD/ows?service=WFS&" +
                "version=1.0.0&request=GetFeature&typeName=TRD%3APARCEL_REL_S3_" + queryParameters.get("z") + "&outputFormat=application%2Fjson&srsname=EPSG:3857&" +
                "cql_filter=(PARCEL_S3_SEQ IN (" + seq3 + "))")
                .then(function (response) {
                    return response.json();
                }).then(function (json) {
                    var features = new GeoJSON().readFeatures(json);
                    vectorSourceREL.clear(features);
                    vectorSourceREL.addFeatures(features);
                })
            vectorSourceRoad = new VectorSource({
                format: new GeoJSON(),
                url: function (extent) {
                    return process.env.REACT_APP_HOST_MAP + "/geoserver/TRD/ows?service=WFS&" +
                        "version=1.0.0&request=GetFeature&typeName=TRD%3AROAD_" + queryParameters.get("z") + "&outputFormat=application%2Fjson&srsname=EPSG:4326&" +
                        "bbox=" + extent.join(',') + ",EPSG:3857";
                },
                strategy: olLoadingstrategy.bbox
            })
        } else
            if (infoSeq2map !== 0) {
                var featureRequestshp = new WriteFilter().writeGetFeature({
                    srsName: 'EPSG:3857',
                    featureNS: process.env.REACT_APP_HOST_MAP + '',
                    featureTypes: ['PARCEL_S3_' + queryParameters.get("z")],
                    outputFormat: 'application/json',
                    filter: equalTo('INFO_SEQ', infoSeq2map)
                });
                fetch(process.env.REACT_APP_HOST_MAP + '/geoserver/TRD/ows', {
                    method: 'POST',
                    body: new XMLSerializer().serializeToString(featureRequestshp)
                }).then(function (response) {
                    return response.json();
                }).then(function (json) {
                    var features = new GeoJSON().readFeatures(json);
                    // console.log(features);
                    vectorSourceImpPolygon.clear(features);
                    vectorSourceImpPolygon.addFeatures(features);
                    if (features.length) {
                        map.getView().fit(vectorSourceImpPolygon.getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                            padding: [100, 100, 100, 100]
                        })
                        if (zoomtofeature !== 0) {
                            // console.log('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                            const sourcerzoom = vectorSourceImpPolygon;
                            var featureszoom = sourcerzoom.getFeatureById('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                            if (featureszoom) {
                                map.getView().fit(featureszoom.getGeometry().getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                    padding: [100, 100, 100, 100]
                                })
                            }
                            // console.log(selectSingleClick.add(featureszoom));
                            // selectSingleClick.add(featureszoom)
                            featureszoom.setStyle(selectStyle);
                            // selectSingleClick.select(featureszoom);
                        } else {

                            vectorpoint.setVisible(true);
                        }
                    } else {
                    }
                })

                vectorSourceRoad = new VectorSource({
                    format: new GeoJSON(),
                    url: function (extent) {
                        return process.env.REACT_APP_HOST_MAP + "/geoserver/TRD/ows?service=WFS&" +
                            "version=1.0.0&request=GetFeature&typeName=TRD%3AROAD_" + queryParameters.get("z") + "&outputFormat=application%2Fjson&srsname=EPSG:4326&" +
                            "bbox=" + extent.join(',') + ",EPSG:3857";
                    },
                    strategy: olLoadingstrategy.bbox
                })
            }

        var vectorSource = new VectorSource();
        if (selectedProvince !== '') {
            if (selectedDistrict !== '') {
                if (selectedTumbol !== '') {
                    if (selectedselType === '2') {
                        var featureRequest = new WriteFilter().writeGetFeature({
                            srsName: 'EPSG:3857',
                            featureNS: process.env.REACT_APP_HOST_MAP + '',
                            //featurePrefix: 'osm',
                            featureTypes: ['TAMBOL_47', 'TAMBOL_48'],
                            outputFormat: 'application/json',
                            filter: and(equalTo('PRO_C', selectedProvince), equalTo('DIS_C', selectedDistrict), equalTo('SUB_C', selectedTumbol))
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
                            if (features.length && infoSeq2map === 0) {
                                map.getView().fit(vectorSource.getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                    padding: [100, 100, 100, 100]
                                })
                                // console.log(zoomtofeature);
                                if (zoomtofeature !== 0) {
                                    if (typeimport === 'point') {
                                        if (infocalSeq2map === 0) {
                                            const sourcerzoom = vectorpoint.getSource();
                                            var featureszoom = sourcerzoom.getFeatureById(zoomtofeature);
                                            if (featureszoom) {
                                                map.getView().fit(featureszoom.getGeometry().getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                                    padding: [1000000, 1000000, 1000000, 1000000]
                                                })
                                                vectorpoint.setVisible(true);
                                            }
                                        } else {
                                            // console.log('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                                            const sourcerzoom = vectorSourceImpPolygon;
                                            var featureszoom = sourcerzoom.getFeatureById('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                                            if (featureszoom) {
                                                map.getView().fit(featureszoom.getGeometry().getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                                    padding: [1000000, 1000000, 1000000, 1000000]
                                                })
                                                vectorpoint.setVisible(true);
                                            }
                                        }

                                    } else {
                                        // setTimeout(() => {
                                        // console.log('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                                        const sourcerzoom = vectorSourceImpPolygon;
                                        var featureszoom = sourcerzoom.getFeatureById('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                                        if (featureszoom) {
                                            map.getView().fit(featureszoom.getGeometry().getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                                padding: [100, 100, 100, 100]
                                            })
                                        }
                                        vectorpoint.setVisible(true);
                                        // }, 1000);

                                    }
                                    // console.log(featureszoom);
                                } else {

                                    vectorpoint.setVisible(true);
                                }
                            } else {
                            }
                        })
                    } else {
                        var featureRequest = new WriteFilter().writeGetFeature({
                            srsName: 'EPSG:3857',
                            featureNS: process.env.REACT_APP_HOST_MAP + '',
                            //featurePrefix: 'osm',
                            featureTypes: ['MUNISAN_47', 'MUNISAN_48'],
                            outputFormat: 'application/json',
                            filter: and(equalTo('AD_CHANGWA', selectedProvince), equalTo('AD_AMPHOE', selectedDistrict), equalTo('MUNI_CODE', selectedTumbol))
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
                            if (features.length && infoSeq2map === 0) {
                                map.getView().fit(vectorSource.getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                    padding: [100, 100, 100, 100]
                                })
                                // console.log(zoomtofeature);
                                if (zoomtofeature !== 0) {
                                    if (typeimport === 'point') {
                                        if (infocalSeq2map === 0) {
                                            const sourcerzoom = vectorpoint.getSource();
                                            var featureszoom = sourcerzoom.getFeatureById(zoomtofeature);
                                            if (featureszoom) {
                                                map.getView().fit(featureszoom.getGeometry().getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                                    padding: [1000000, 1000000, 1000000, 1000000]
                                                })
                                                vectorpoint.setVisible(true);
                                            }
                                        } else {
                                            // console.log('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                                            const sourcerzoom = vectorSourceImpPolygon;
                                            var featureszoom = sourcerzoom.getFeatureById('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                                            if (featureszoom) {
                                                map.getView().fit(featureszoom.getGeometry().getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                                    padding: [1000000, 1000000, 1000000, 1000000]
                                                })
                                                // console.log(featureszoom);
                                                vectorpoint.setVisible(true);
                                            }
                                        }

                                    } else {
                                        // setTimeout(() => {
                                        // console.log('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                                        const sourcerzoom = vectorSourceImpPolygon;
                                        var featureszoom = sourcerzoom.getFeatureById('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                                        if (featureszoom) {
                                            map.getView().fit(featureszoom.getGeometry().getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                                padding: [100, 100, 100, 100]
                                            })
                                        }
                                        // console.log(featureszoom);
                                        vectorpoint.setVisible(true);
                                        // }, 1000);

                                    }
                                } else {

                                    vectorpoint.setVisible(true);
                                }
                            } else {
                            }
                        })
                    }

                } else {
                    var featureRequestAmphoe = new WriteFilter().writeGetFeature({
                        srsName: 'EPSG:3857',
                        featureNS: process.env.REACT_APP_HOST_MAP + '',
                        //featurePrefix: 'osm',
                        featureTypes: ['AMPHOE_47', 'AMPHOE_48'],
                        outputFormat: 'application/json',
                        filter: and(equalTo('PRO_C', selectedProvince), equalTo('DIS_C', selectedDistrict))
                    });
                    fetch(process.env.REACT_APP_HOST_MAP + '/geoserver/TRD/ows', {
                        method: 'POST',
                        body: new XMLSerializer().serializeToString(featureRequestAmphoe)
                    }).then(function (response) {
                        return response.json();
                    }).then(function (json) {
                        var features = new GeoJSON().readFeatures(json);
                        vectorSource.clear(features);
                        vectorSource.addFeatures(features);
                        // setTimeout(() => {
                        if (features.length && infoSeq2map === 0) {
                            map.getView().fit(vectorSource.getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                                padding: [100, 100, 100, 100]
                            })
                        } else {
                        }
                    })
                }

            } else {
                var featureRequestProvince = new WriteFilter().writeGetFeature({
                    srsName: 'EPSG:3857',
                    featureNS: process.env.REACT_APP_HOST_MAP + '',
                    //featurePrefix: 'osm',
                    featureTypes: ['PROVINCE_47', 'PROVINCE_48'],
                    outputFormat: 'application/json',
                    filter: equalTo('PRO_C', selectedProvince)
                });
                fetch(process.env.REACT_APP_HOST_MAP + '/geoserver/TRD/ows', {
                    method: 'POST',
                    body: new XMLSerializer().serializeToString(featureRequestProvince)
                }).then(function (response) {
                    return response.json();
                }).then(function (json) {
                    var features = new GeoJSON().readFeatures(json);
                    vectorSource.clear(features);
                    vectorSource.addFeatures(features);
                    // setTimeout(() => {
                    if (features.length && infoSeq2map === 0) {
                        map.getView().fit(vectorSource.getExtent(), /** @type {ol.Size} (map.getSize(), { duration: 1000 }, { duration: 1000 }),*/{
                            padding: [100, 100, 100, 100]
                        })
                    } else {
                    }
                })
            }
        }
        const ProvinceLayer = new VectorLayer({
            source: vectorSource,
            style: function (feature) {
                labelStyleotp.getText().setText((feature.values_.ON_SUB_THA) ? feature.values_.ON_SUB_THA : feature.values_.MS_NAME);
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
        const polygonStyle = (feature) => {
            const parcelid = (val) => {
                if (val == "" || val == null) {
                    return "";
                } else {
                    return " เลขที่ " + val;
                }
            }
            const stokeColor = (val, a) => {
                if (!PARCEL1) {
                    return stokeColor1(val, a)
                } else if (!PARCEL2) {
                    return stokeColor2(val, a)
                } else {
                    return stokeColor3(val, a)
                }
            }
            const stokeColor1 = (val, a) => {
                if (val == '1') {
                    return 'rgba(0, 255, 0, ' + a + ')';
                } else if (val == '2') {
                    return 'rgba(255, 165, 0, ' + a + ')';
                } else if (val == '3') {
                    return 'rgb(255, 0, 255, ' + a + ')';
                } else if (val == '4') {
                    return 'rgba(0, 0, 255, ' + a + ')';
                } else if (val == '5') {
                    return 'rgba(143, 0, 255, ' + a + ')';
                } else if (val == '6') {
                    return 'rgba(255, 223, 0, ' + a + ')';
                } else if (val == '7') {
                    return 'rgba(255, 0, 0, ' + a + ')';
                } else {
                    return 'rgba(209, 127, 65, ' + a + ')';
                }
            }
            const stokeColor2 = (val, a) => {
                if (val == '1') {
                    return 'rgba(0, 175, 80, ' + a + ')';
                } else if (val == '2') {
                    return 'rgba(254, 0, 0, ' + a + ')';
                } else if (val == '3') {
                    return 'rgb(0, 255, 255, ' + a + ')';
                } else if (val == '5') {
                    return 'rgba(254, 153, 0, ' + a + ')';
                } else if (val == '6') {
                    return 'rgba(255, 0, 254, ' + a + ')';
                } else if (val == '7') {
                    return 'rgba(189, 189, 189, ' + a + ')';
                } else if (val == '41') {
                    return 'rgba(154, 0, 255, ' + a + ')';
                } else if (val == '42') {
                    return 'rgba(255, 255, 0, ' + a + ')';
                } else {
                    return 'rgba(209, 127, 65, ' + a + ')';
                }
            }
            const stokeColor3 = (val, a) => {
                if (val == '0') {
                    return 'rgba(0, 175, 80, ' + a + ')';
                } else if (val < '41') {
                    return 'rgba(63, 195, 60, ' + a + ')';
                } else if (val < '81') {
                    return 'rgba(127, 216, 40, ' + a + ')';
                } else if (val < '121') {
                    return 'rgb(190, 235, 20, ' + a + ')';
                } else if (val < '161') {
                    return 'rgba(255, 255, 0, ' + a + ')';
                } else if (val < '201') {
                    return 'rgba(255, 222, 0, ' + a + ')';
                } else if (val < '241') {
                    return 'rgba(255, 188, 1, ' + a + ')';
                } else if (val > '240') {
                    return 'rgba(254, 153, 0, ' + a + ')';
                } else {
                    return 'rgba(209, 127, 65, ' + a + ')';
                }
            }
            console.log(feature.values_, !PARCEL1, !PARCEL2);
            labelStylepolygon.getText().setText(((feature.values_.LAND_TYPE == 'อื่นๆ') ? feature.values_.REMARK : feature.values_.LAND_TYPE) + parcelid(feature.values_.PARCEL_ID));
            labelStyleprice.getText().setText('\n\n' + ((feature.values_.VAL_PER_WAH === null) ? 0 : feature.values_.VAL_PER_WAH.toLocaleString('en-US')) + " บ.");
            var style_Buiding = new Style({
                fill: new Fill({
                    color: stokeColor((!PARCEL1) ? feature.values_.PARCEL_SHAPE : (!PARCEL2) ? feature.values_.TABLE_NO : feature.values_.DEPTH_R, (document.getElementById('slide1').childNodes[2].children[0].valueAsNumber / 100)),
                }),
                stroke: new Stroke({
                    color: stokeColor((!PARCEL1) ? feature.values_.PARCEL_SHAPE : (!PARCEL2) ? feature.values_.TABLE_NO : feature.values_.DEPTH_R, (document.getElementById('slide1').childNodes[2].children[0].valueAsNumber / 50)),
                    width: 3,
                }),
            })
            if (typeimport === 'point') {
                return [iconStyle, labelStylepolygon, labelStyleprice];
            } else {
                var idd = feature.getId();
                var sid = idd.split('.');
                if (zoomtofeature == sid[1]) {
                    return [selected, labelStylepolygon, labelStyleprice];
                } else {
                    return [style_Buiding, labelStylepolygon, labelStyleprice];
                }
            }
        }
        const polygonStyleFilter = (feature) => {
            const parcelid = (val) => {
                if (val == "" || val == null) {
                    return "";
                } else {
                    return " เลขที่ " + val;
                }
            }
            const stokeColor = (val, a) => {
                console.log(val, a, !PARCEL1, !PARCEL2, '55555555555');
                if (!PARCEL1) {
                    return stokeColor1(val, a)
                } else if (!PARCEL2) {
                    return stokeColor2(val, a)
                } else {
                    return stokeColor3(val, a)
                }
            }
            const stokeColor1 = (val, a) => {
                if (val == '1') {
                    return 'rgba(255, 176, 0, ' + a + ')';
                } else if (val == '2') {
                    return 'rgba(253, 5, 179,  ' + a + ')';
                } else if (val == '3') {
                    return 'rgb(34, 102, 141, ' + a + ')';
                } else if (val == '4') {
                    return 'rgba(112, 145, 245,' + a + ')';
                } else if (val == '5') {
                    return 'rgba(167, 49, 33, ' + a + ')';
                } else if (val == '6') {
                    return 'rgba(196, 193, 164, ' + a + ')';
                } else if (val == '7') {
                    return 'rgba(254, 0, 0, ' + a + ')';
                } else {
                    return 'rgba(209, 127, 65, ' + a + ')';
                }
            }
            const stokeColor2 = (val, a) => {
                if (val == '1') {
                    return 'rgba(0, 175, 80, ' + a + ')';
                } else if (val == '2') {
                    return 'rgba(254, 0, 0, ' + a + ')';
                } else if (val == '3') {
                    return 'rgb(0, 255, 255, ' + a + ')';
                } else if (val == '5') {
                    return 'rgba(254, 153, 0, ' + a + ')';
                } else if (val == '6') {
                    return 'rgba(255, 0, 254, ' + a + ')';
                } else if (val == '7') {
                    return 'rgba(189, 189, 189, ' + a + ')';
                } else if (val == '41') {
                    return 'rgba(154, 0, 255, ' + a + ')';
                } else if (val == '42') {
                    return 'rgba(255, 255, 0, ' + a + ')';
                } else {
                    return 'rgba(209, 127, 65, ' + a + ')';
                }
            }
            const stokeColor3 = (val, a) => {
                if (val == '0') {
                    return 'rgba(0, 175, 80, ' + a + ')';
                } else if (val < '41') {
                    return 'rgba(63, 195, 60, ' + a + ')';
                } else if (val < '81') {
                    return 'rgba(127, 216, 40, ' + a + ')';
                } else if (val < '121') {
                    return 'rgb(190, 235, 20, ' + a + ')';
                } else if (val < '161') {
                    return 'rgba(255, 255, 0, ' + a + ')';
                } else if (val < '201') {
                    return 'rgba(255, 222, 0, ' + a + ')';
                } else if (val < '241') {
                    return 'rgba(255, 188, 1, ' + a + ')';
                } else if (val > '240') {
                    return 'rgba(254, 153, 0, ' + a + ')';
                } else {
                    return 'rgba(209, 127, 65, ' + a + ')';
                }
            }
            console.log(feature.values_, !PARCEL1, !PARCEL2);
            labelStylepolygon.getText().setText(((feature.values_.LAND_TYPE == 'อื่นๆ') ? feature.values_.REMARK : feature.values_.LAND_TYPE) + parcelid(feature.values_.PARCEL_ID));
            labelStyleprice.getText().setText('\n\n' + ((feature.values_.VAL_PER_WAH === null) ? 0 : feature.values_.VAL_PER_WAH.toLocaleString('en-US')) + " บ.");
            var style_Buiding = new Style({
                fill: new Fill({
                    color: stokeColor((!PARCEL1) ? feature.values_.TYPE_CODE: (!PARCEL2) ? feature.values_.TABLE_NO : feature.values_.DEPTH_R, (document.getElementById('slide1').childNodes[2].children[0].valueAsNumber / 100)),
                }),
                stroke: new Stroke({
                    color: stokeColor((!PARCEL1) ? feature.values_.TYPE_CODE : (!PARCEL2) ? feature.values_.TABLE_NO : feature.values_.DEPTH_R, (document.getElementById('slide1').childNodes[2].children[0].valueAsNumber / 50)),
                    width: 3,
                }),
            })
            if (typeimport === 'point') {
                return [iconStyle, labelStylepolygon, labelStyleprice];
            } else {
                var idd = feature.getId();
                var sid = idd.split('.');
                if (zoomtofeature == sid[1]) {
                    return [selected, labelStylepolygon, labelStyleprice];
                } else {
                    return [style_Buiding, labelStylepolygon, labelStyleprice];
                }
            }
        }
        const impPolygonLayer = new VectorLayer({
            source: vectorSourceImpPolygon,
            // style: new Style({
            //     fill: fillimp,
            //     stroke: strokeimp,
            // }),
            style: polygonStyleFilter,
        });
        const RELPolygonLayer = new VectorLayer({
            source: vectorSourceREL,
            style: styleFunction,
        });
        roadLayerLabel = new VectorLayer({
            source: vectorSourceRoad,
            minZoom: 17,
            style: function (feature) {
                const stokeColor = (val, a) => {
                    if (val == "" || val == null) {
                        return 'rgba(209, 127, 65, ' + a + ')';
                    } else if (val == '1') {
                        return 'rgba(0, 255, 0, ' + a + ')';
                    } else if (val == '2') {
                        return 'rgba(255, 165, 0, ' + a + ')';
                    } else if (val == '3') {
                        return 'rgb(255, 0, 255, ' + a + ')';
                    } else if (val == '4') {
                        return 'rgba(0, 0, 255, ' + a + ')';
                    } else if (val == '5') {
                        return 'rgba(143, 0, 255, ' + a + ')';
                    } else if (val == '6') {
                        return 'rgba(255, 223, 0, ' + a + ')';
                    } else if (val == '7') {
                        return 'rgba(255, 0, 0, 0)';
                    }
                }
                labelStyle.getText().setText(feature.get('TYPE_CODE_NAME'));
                var style_Buiding = new Style({
                    fill: new Fill({
                        color: colorRoad(feature.values_.TD_RP3_TYPE_CODE),
                    }),
                    stroke: new Stroke({
                        color: stokeColor(feature.values_.TD_RP3_TYPE_CODE, 1),
                        lineDash: [10, 5],
                        width: 1.5,
                    }),
                    padding: [100, 100, 100, 100]
                });
                return [style_Buiding, labelStyle];
            },
        });
        const roadLayer = new VectorLayer({
            source: vectorSourceRoad,
            minZoom: 15,
            maxZoom: 17,
            style: new Style({
                fill: fillroad,
                stroke: strokeroad,
            }),
        });
        const osm = new OlLayerTile({
            source: new OlSourceOSM()
        });
        var satelliteLayer = new TileLayer({
            source: new XYZ({
                // url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                url: "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
            }),
        });
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
        const vectorpoint = new VectorLayer({
            source: sourcepoint,
            style: function (feature) {
                const parcelid = (val, a) => {
                    if (val == "" || val == null) {
                        return "";
                    } else {
                        if (a == 1) {
                            // return " (" + val + ") ";
                        } else {
                            // return " เลขที่ " + val + " ";
                        }
                    }
                }
                labelStylepolygon.getText().setText(((feature.values_.LAND_TYPE == 'อื่นๆ') ? feature.values_.ECT : feature.values_.LAND_TYPE) + parcelid(feature.values_.PARCEL_ID, 2) + parcelid(feature.values_.PARCELNO, 1));
                labelStyleprice.getText().setText('\n\n' + ((feature.values_.VAL_PER_WAH === null) ? 0 : feature.values_.VAL_PER_WAH.toLocaleString('en-US')) + " บ.");
                return [iconStyle, labelStylepolygon, labelStyleprice];
            },
        });


        let draw, snap;
        const extent = get('EPSG:3857').getExtent().slice();
        extent[0] += extent[0];
        extent[2] += extent[2];
        const modify = new Modify({ source: sourcepoint });
        const modifyLine = new Modify({ source: vectorSourceREL, snapToPointer: true });
        function addInteractions() {
            if (typeimport === 'point') {
                draw = new Draw({
                    source: sourcepoint,
                    type: 'Point',
                });
                map.addInteraction(draw);
                draw.on('drawend', function (evt) {
                    var feature = evt.feature;
                    feature.setId(feature.ol_uid);
                    feature.setProperties({
                        PARCELTYPE: '',
                        LAND_TYPE: '',
                        PARCEL_ID: '',
                        ECT: '',
                        PARCELNO: '',
                        UTM_1: '',
                        UTM_2: '',
                        UTM_3: '',
                        UTM_4: '',
                        UTM_SCALE: '',
                        UTM_LANDNO: '',
                        UTM_7: '',
                        RAI: '0',
                        NGAN: '0',
                        VA: '0',
                        NODENAME: '',
                        DEPTH_STD: '',
                        DEPTH: '',
                        TRANSFORMTYPE: '',
                        status: '0',
                        PARCEL_S3_SEQ: '',
                        VAL_PER_WAH: null
                    });
                    geometry = document.getElementById('precision').innerText;

                });
            } else {
                snap = new Snap({ source: vectorSourceImpPolygon });
                map.addInteraction(snap);
                modifyLine.on('modifyend', async function (evt) {
                    const coordinate = evt.mapBrowserEvent.coordinate_;
                    const hdms = toStringHDMS(toLonLat(coordinate));

                    // container2.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
                    container1.innerHTML = "<div style='justify-content: center; text-align: center; margin-bottom:2px;'><span>ข้อมูลจะถูกเปลียนแปลง ไม่สามารถแก้ไขได้</span></div>" +
                        "<button id='ntyes' class='MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium ' tabindex='0' type='button' style='display: inline-flex;-webkit-box-align: center;    align-items: center;    -webkit-box-pack: center;justify-content: center;position: relative;box-sizing: border-box;background-coloroutline: 0;border: 0;margin: 0;cursor: pointer;user-select: none;    vertical-align: middle;-webkit-appearance: none;text-decoration: none;font-weight: 500;font-size: 0.875rem;line-height: 1.75;text-transform: uppercase;min-width: 64px;padding: 6px 8px;border-radius: 4px;transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;    color: #1976d2;    margin-left: 8px;margin-right: 8px;background-color:#1565c0;color: white;pointer-events: auto;'>บันทึก</button>" +
                        "<button id='ntno' class='MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium ' tabindex='0' type='button' style='display: inline-flex;-webkit-box-align: center;    align-items: center;    -webkit-box-pack: center;justify-content: center;position: relative;box-sizing: border-box;background-coloroutline: 0;border: 0;margin: 0;cursor: pointer;user-select: none;    vertical-align: middle;-webkit-appearance: none;text-decoration: none;font-weight: 500;font-size: 0.875rem;line-height: 1.75;text-transform: uppercase;min-width: 64px;padding: 6px 8px;border-radius: 4px;transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;    color: #1976d2;    margin-left: 8px;margin-right: 8px;background-color:#D32F2F;color: white;pointer-events: auto;'>ยกเลิก</button>";

                    overlay.setPosition(coordinate);

                    const ntyes = document.getElementById('ntyes');
                    ntyes.addEventListener('click', function (event) {
                        saveline(evt)
                        overlay.setPosition(undefined);
                        return false;
                    });
                    const ntno = document.getElementById('ntno');
                    ntno.addEventListener('click', function (event) {
                        overlay.setPosition(undefined);
                        setreloadmap(!reloadmap)
                        return false;
                    });


                })
            }

        }

        map = new OlMap({
            interactions: defaults({ doubleClickZoom: false }),
            controls: defaultControls().extend([mousePositionControl, new ScaleLine({ bar: true, text: true, minWidth: 125 })]),
            target: 'map',
            overlays: [overlay],
            layers: [
                satelliteLayer,
                osm,
                ProvinceLayer,
                vectorpoint,
                impPolygonLayer,
                roadLayerLabel,
                RELPolygonLayer
            ],
            view: new OlView({
                projection: 'EPSG:3857',
                center: transform(center, 'EPSG:4326', 'EPSG:3857'),
                zoom: mapzoom,
                // minZoom: 9,
                // maxZoom: 11,
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
        //     // var features = map.getFeaturesAtPixel(pixel);

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
        if (point2mapdata.length !== 0) {
            const sourceremove = vectorpoint.getSource();
            sourceremove.getFeatures().forEach(function (f) {
                // console.log(f.getId());
                // if (!point2mapdata.includes(f.getId() * 1)) {
                //     vectorpoint.getSource().removeFeature(f)
                //     // console.log(f.getId());
                // }
            });
        }

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
        });

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
        let select = null;
        const selected = new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 0, 0.7)',
            }),
            stroke: new Stroke({
                color: '#489df2',
                // lineDash: [2, 10],
                width: 2,
            }),
        });

        const savePropertiescoord = document.getElementById('savePropertiescoord');
        savePropertiescoord.addEventListener('click', function () {
            const type = document.getElementById("inputctype").value;
            const lat = Number(document.getElementById("inputlat").value);
            const long = Number(document.getElementById("inputlong").value);
            // document.getElementById("inputlat").value = '';
            // document.getElementById("inputlong").value = '';
            // console.log(lat, long);
            if (lat != 0 || long != 0) {
                if (type == '1') {
                    const featurellt = new Feature({
                        geometry: new Point(fromLonLat([
                            long, lat
                        ]))
                    })
                    featurellt.setId(featurellt.ol_uid);
                    featurellt.setProperties({
                        PARCELTYPE: '',
                        LAND_TYPE: '',
                        PARCEL_ID: '',
                        ECT: '',
                        PARCELNO: '',
                        UTM_1: '',
                        UTM_2: '',
                        UTM_3: '',
                        UTM_4: '',
                        UTM_SCALE: '',
                        UTM_LANDNO: '',
                        UTM_7: '',
                        RAI: '0',
                        NGAN: '0',
                        VA: '0',
                        NODENAME: '',
                        DEPTH_STD: '',
                        DEPTH: '',
                        TRANSFORMTYPE: '',
                        status: '0',
                        PARCEL_S3_SEQ: '',
                        VAL_PER_WAH: null
                    });
                    const geometryarray = transform([long, lat], 'EPSG:4326', 'EPSG:240' + queryParameters.get("z"));
                    setgeometryp(geometryarray[0] + ", " + geometryarray[1]);
                    // console.log(geometryp);
                    // console.log(featurellt);
                    sourcepoint.addFeature(featurellt);
                    sourcepoint.getFeatures().forEach(function (f) {
                        // console.log(f);
                    })
                } else {
                    const geoarray = toLonLat([lat, long], 'EPSG:240' + queryParameters.get("z"))
                    const featurellt = new Feature({
                        geometry: new Point(fromLonLat(geoarray))
                    })
                    featurellt.setId(featurellt.ol_uid);
                    featurellt.setProperties({
                        PARCELTYPE: '',
                        LAND_TYPE: '',
                        PARCEL_ID: '',
                        ECT: '',
                        PARCELNO: '',
                        UTM_1: '',
                        UTM_2: '',
                        UTM_3: '',
                        UTM_4: '',
                        UTM_SCALE: '',
                        UTM_LANDNO: '',
                        UTM_7: '',
                        RAI: '0',
                        NGAN: '0',
                        VA: '0',
                        NODENAME: '',
                        DEPTH_STD: '',
                        DEPTH: '',
                        TRANSFORMTYPE: '',
                        status: '0',
                        PARCEL_S3_SEQ: '',
                        VAL_PER_WAH: null
                    });
                    const geometryarray = transform(geoarray, 'EPSG:4326', 'EPSG:240' + queryParameters.get("z"));
                    setgeometryp(geometryarray[0] + ", " + geometryarray[1]);
                    // console.log(geometryp);
                    // console.log(featurellt);
                    sourcepoint.addFeature(featurellt);
                    sourcepoint.getFeatures().forEach(function (f) {
                        // console.log(f);
                    })
                }

            }
            // var geometry = feature.getGeometry();
            // var coordinate = geometry.getCoordinates();
            // var pixel = map.getPixelFromCoordinate(coordinate);
            // console.log(pixel);                
            setsourcepoint(new VectorSource())
            document.getElementById('propertiescoord').hidden = true;
            document.getElementById("inputlat").value = '';
            document.getElementById("inputlong").value = '';
        })

        function selectStyle(feature) {
            try {
                var layerSelect = feature.getId();
                if (layerSelect.includes("PARCEL_REL_S3_")) {
                    return styleFunctionSelectLine(feature)
                } else if (!layerSelect.includes("MUNISAN_") && !layerSelect.includes("TAMBOL_") && !layerSelect.includes("ROAD_")) {
                    // if (layerSelect.includes("PARCEL_S3_")) {                
                    const color = feature.get('COLOR') || 'rgba(255, 255, 0, 0.7)';
                    selected.getFill().setColor(color);
                    const parcelid = (val) => {
                        if (val == "" || val == null) {
                            return "";
                        } else {
                            return " เลขที่ " + val;
                        }
                    }
                    labelStylepolygon.getText().setText(feature.values_.LAND_TYPE + parcelid(feature.values_.PARCEL_ID));
                    labelStyleprice.getText().setText('\n\n' + ((feature.values_.VAL_PER_WAH === null) ? 0 : feature.values_.VAL_PER_WAH.toLocaleString('en-US')) + " บ.");
                    var style_Buiding = new Style({
                        fill: fillimp,
                        stroke: strokeimp,
                    })
                    return [selected, labelStylepolygon, labelStyleprice];
                    // return false;
                } else {
                    return iconStyle;
                }
            } catch (error) {
                return false;
            }


        }
        async function saveline(evt) {
            var featuresModify = new VectorSource();
            const geojsonObject = {
                'type': 'FeatureCollection',
                'crs': {
                    'type': 'name',
                    'properties': {
                        'name': 'EPSG:3857',
                    },
                },
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [evt.features.getArray()[0].getGeometry().getCoordinates()],
                        },
                    }
                ]
            }
            // console.log(evt.features.getArray()[0].values_.PARCEL_REL_S3_SEQ);
            var data = reproject.reproject(geojsonObject, "EPSG:3857", (queryParameters.get("z") == '') ? "EPSG:240" + '47' : "EPSG:240" + queryParameters.get("z"));
            var depth_r = olSphere.getLength(evt.features.getArray()[0].getGeometry()).toFixed(0).toString();
            var rels3req = evt.features.getArray()[0].values_.PARCEL_REL_S3_SEQ;
            var coordinate = data.features[0].geometry.coordinates[0];
            var shape = data.features[0].geometry.type.toUpperCase() + " ";
            shape += "(";
            // const coor1 = coordinate[0][0] - 1.7056;
            // const coor2 = coordinate[0][1] + 0.4494;
            // const coor3 = coordinate[1][0] - 1.7056;
            // const coor4 = coordinate[1][1] + 0.4494;
            const coor1 = coordinate[0][0];
            const coor2 = coordinate[0][1];
            const coor3 = coordinate[1][0];
            const coor4 = coordinate[1][1];
            shape += coor1 + " " + coor2 + ", " + coor3 + " " + coor4;
            shape += ")";
            var row = JSON.stringify({
                "PARCEL_REL_S3_SEQ": rels3req + "",
                "SHAPE": shape,
                "DEPTH_R": depth_r + "",
                "ZONE": queryParameters.get("z") + ""
            })
            // console.log(evt.features.getArray()[0].getGeometry().getCoordinates());
            var cc = evt.features.getArray()[0].getGeometry().getCoordinates();

            evt.features.getArray()[0].getGeometry().setCoordinates([cc[0], cc[1]])
            // console.log(evt.features.getArray()[0].getGeometry().extent_);
            // console.log(row);
            // console.log(data.features[0].getGeometry().getCoordinates())
            const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/UpdateEditDepthREL", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: row
            });
            const response = await res.json();
            console.log(response, 'response');
            if (response) {
                response.result.length > 0 && reloadTable()
                // setTimeout(()=>{
                //     console.log(response,'666666666666');
                //     if (response.message === 'success') {
                //         const sourcerzoom = vectorSourceImpPolygon;
                //         var featureszoom = sourcerzoom.getFeatureById('PARCEL_S3_' + queryParameters.get("z") + '.' + response.result[0].PARCEL_S3_SEQ);
                //         // console.log(sourcerzoom, 'rels3req', 'PARCEL_S3_' + queryParameters.get("z") + '.' + response.result[0].PARCEL_S3_SEQ);
                //         if (featureszoom) {
                //             console.log(featureszoom, 'featurez');
                //             var extent = featureszoom.getGeometry().getExtent();
                //             console.log(extent,'extent55555', map.getView());
                //             map.getView().fit(extent, {
                //                 duration: 1000,
                //             });
                //         }
                //     }
                // },50000)
            }
            // setTimeout(()=>{
            //     // 
            // },500)
            // vectorSourceimp.refresh();
            // map.updateSize();
            // vectorSourceREL.refresh();
            // map.updateSize();

            var selectedLayerSource = impPolygonLayer.getSource();
            if (selectedLayerSource instanceof VectorSource) {
                //do vector reload
                var seq3edit = [];
                for (var i in infocalSeq2map) {
                    // console.log((i * 1) + 1, infocalSeq2map.length);
                    if ((i * 1) + 1 === infocalSeq2map.length) {
                        seq3edit += "'" + infocalSeq2map[i] + "'"
                    } else {
                        seq3edit += "'" + infocalSeq2map[i] + "',"
                    }
                }
                fetch(process.env.REACT_APP_HOST_MAP + "/geoserver/TRD/ows?service=WFS&" +
                    "version=1.0.0&request=GetFeature&typeName=TRD%3APARCEL_S3_" + queryParameters.get("z") + "&outputFormat=application%2Fjson&srsname=EPSG:3857&" +
                    "cql_filter=(PARCEL_S3_SEQ IN (" + seq3edit + "))")
                    .then(function (response) {
                        return response.json();
                    }).then(function (json) {
                        var features = new GeoJSON().readFeatures(json);
                        vectorSourceImpPolygon.clear(features);
                        vectorSourceImpPolygon.addFeatures(features);
                    })

                // fetch(process.env.REACT_APP_HOST_MAP + "/geoserver/TRD/ows?service=WFS&" +
                //     "version=1.0.0&request=GetFeature&typeName=TRD%3APARCEL_REL_S3_" + queryParameters.get("z") + "&outputFormat=application%2Fjson&srsname=EPSG:3857&" +
                //     "cql_filter=(PARCEL_S3_SEQ IN (" + seq3edit + "))")
                //     .then(function (response) {
                //         return response.json();
                //     }).then(function (json) {
                //         var features = new GeoJSON().readFeatures(json);
                //         vectorSourceREL.clear();
                //         vectorSourceREL.addFeatures(features);
                //     })
            }
            else {
                //reload the entire page
                // window.location.reload();
            }

        }
        // const selectSingleClick = new Select({ style: selectStyle });
        // select = selectSingleClick;
        // if (typeimport !== 'point') {
        //     map.addInteraction(select);
        // }
        map.on('pointermove', (evt) => {
            // if (i != 0) {
            const pixel = map.getEventPixel(evt.originalEvent);
            const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });
            // console.log(feature);
            if (feature !== undefined) {
                var textlayer = feature.getId();
                if (textlayer === undefined) {
                    textlayer = "POINT";
                }
                // = map.hasFeatureAtPixel(pixel);
                if (!textlayer.includes("TAMBOL_") && !textlayer.includes("ROAD_")) {
                    document.getElementById('map').style.cursor = 'pointer';
                } else {
                    document.getElementById('map').style.cursor = '';
                }
                // }

            }

        });
        map.on('singleclick', async function (evt) {
            const layers = map.getLayers().getArray();
            const vectorLayer = layers.find(
                (layer) => layer.get("name") === "MEASURE"
            );

            if (vectorLayer) {
                return false;
            }

            const featureCallid = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature.get('PARCEL_S3_SEQ');
            });

            document.getElementById('input3n').value = '';

            if (zoomtofeature != 0) {
                const sourcerzoom = vectorSourceImpPolygon;
                var featureszoom = sourcerzoom.getFeatureById('PARCEL_S3_' + queryParameters.get("z") + '.' + zoomtofeature);
                featureszoom.setStyle(function (feature) {
                    console.log(feature);
                    const parcelid = (val) => {
                        if (val == "" || val == null) {
                            return "";
                        } else {
                            return " เลขที่ " + val;
                        }
                    }
                    labelStylepolygon.getText().setText(feature.values_.LAND_TYPE + parcelid(feature.values_.PARCEL_ID));
                    labelStyleprice.getText().setText('\n\n' + ((feature.values_.VAL_PER_WAH === null) ? 0 : feature.values_.VAL_PER_WAH.toLocaleString('en-US')) + " บ.");

                    var style_Buiding = new Style({
                        fill: fillimp,
                        stroke: strokeimp,
                    })
                    if (typeimport === 'point') {
                        return [iconStyle, labelStylepolygon, labelStyleprice];
                    } else {
                        return [style_Buiding, labelStylepolygon, labelStyleprice];
                    }



                });
            }

            map.removeInteraction(draw);
            map.removeInteraction(snap);
            map.removeInteraction(modify);
            const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });

            if (feature) {
                setTimeout(async () => {
                    var textlayer = feature.getId();
                    // console.log(textlayer);
                    if (textlayer === undefined) {
                        textlayer = "POINT";
                    }
                    if (!textlayer.includes("TAMBOL_") && !textlayer.includes("MUNISAN_")) {
                        if (!textlayer.includes("PARCEL_S3_") && !textlayer.includes("ROAD_")) {
                            features = map.getFeaturesAtPixel(evt.pixel);
                            // console.log(features);
                            if (features.length > 1) {
                                // if (features[0].values_.status === undefined) {
                                if (features[0].values_.status === '0') {
                                    document.getElementById('inputpointhidden').value = features[0].ol_uid;
                                    document.getElementById('input1').value = features[0].values_.PARCELTYPE;
                                    document.getElementById('input2').value = features[0].values_.ECT;
                                    document.getElementById('input3').value = features[0].values_.PARCELNO;
                                    document.getElementById('input4').value = features[0].values_.UTM_1;
                                    document.getElementById('input5').value = features[0].values_.UTM_2;
                                    document.getElementById('input6').value = features[0].values_.UTM_3;
                                    document.getElementById('input7').value = features[0].values_.UTM_4;
                                    document.getElementById('input8').value = features[0].values_.UTM_SCALE;
                                    document.getElementById('input9').value = features[0].values_.UTM_LANDNO;
                                    document.getElementById('input10').value = features[0].values_.RAI;
                                    document.getElementById('input11').value = features[0].values_.NGAN;
                                    document.getElementById('input12').value = features[0].values_.VA;
                                    document.getElementById('input13').value = features[0].values_.NODENAME;
                                    document.getElementById('input14').value = features[0].values_.DEPTH_STD;
                                    document.getElementById('input15').value = features[0].values_.DEPTH;
                                    document.getElementById('input16').value = features[0].values_.TRANSFORMTYPE;
                                    document.getElementById('propertiespoint').hidden = false;
                                    var source = vectorpoint.getSource();
                                    // setmapzoom(map.getZoom());
                                    // console.log(source);
                                } else {
                                    if (steppoint2map === 2) {
                                        var row = JSON.stringify({
                                            "PARCEL_S3_SEQ": textlayer + "",
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
                                            document.getElementById('inputpointhidden').value = features[0].values_.PARCEL_S3_SEQ;
                                            document.getElementById('input1').value = features[0].values_.PARCELTYPE;
                                            document.getElementById('input2').value = features[0].values_.ECT;
                                            document.getElementById('input3').value = features[0].values_.PARCELNO;
                                            document.getElementById('input4').value = features[0].values_.UTM_1;
                                            document.getElementById('input5').value = features[0].values_.UTM_2;
                                            document.getElementById('input6').value = features[0].values_.UTM_3;
                                            document.getElementById('input7').value = features[0].values_.UTM_4;
                                            document.getElementById('input8').value = features[0].values_.UTM_SCALE;
                                            document.getElementById('input9').value = features[0].values_.UTM_LANDNO;
                                            document.getElementById('input10').value = features[0].values_.RAI;
                                            document.getElementById('input11').value = features[0].values_.NGAN;
                                            document.getElementById('input12').value = features[0].values_.VA;
                                            document.getElementById('input13').value = features[0].values_.NODENAME;
                                            document.getElementById('input14').value = features[0].values_.DEPTH_STD;
                                            document.getElementById('input15').value = features[0].values_.DEPTH;
                                            document.getElementById('input16').value = features[0].values_.TRANSFORMTYPE;
                                            document.getElementById('input17').value = numberWithCommas(result[0].VAL_PER_WAH);
                                            document.getElementById('input18').value = numberWithCommas(result[0].VALAREA);
                                            document.getElementById('propertiespoint').hidden = false;
                                            var source = vectorpoint.getSource();
                                            // setmapzoom(map.getZoom());
                                            // console.log(source);

                                        }

                                    }

                                }
                                // }
                            } else {
                                var sourceremove = vectorpoint.getSource();
                                var featuresremove = sourceremove.getFeatureById(features[0].ol_uid);
                                vectorpoint.getSource().removeFeature(featuresremove)
                                // alert('กรุณาระบุตำแหน่งในขอบเขตเท่านั้น');
                                document.getElementById('alertnotumbol').style.display = 'flex'
                            }

                        } else {
                        }
                    }
                }, 200);


            }
            if (featureCallid) {
                // setActiveCellId(featureCallid);
                // setTimeout(async () => {
                zoomMap(map, evt, queryParameters, vectorSourceImpPolygon, vectorpoint);
                // }, 1000);
            }
        });
        // var doubleClickZoom = new DoubleClickZoom();
        // doubleClickZoom.setActive(false)
        map.on('dblclick', async function (evt) {
            const layers = map.getLayers().getArray();
            const vectorLayer = layers.find(
                (layer) => layer.get("name") === "MEASURE"
            );
            if (vectorLayer) {
                return false;
            }
            if (document.getElementById('propertiespoint').hidden === true) {
                map.removeInteraction(draw);
                map.removeInteraction(snap);
                map.removeInteraction(modify);
                const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    return feature;
                });

                if (feature) {
                    setTimeout(async () => {
                        var textlayer = feature.getId();
                        // console.log(feature);
                        // setActiveCellId(feature.values_.PARCEL_S3_SEQ)
                        if (textlayer === undefined) {
                            textlayer = "POINT";
                        }
                        if (!textlayer.includes("TAMBOL_") && !textlayer.includes("ROAD_")) {
                            if (typeimport === 'polygon') {
                                var seq = textlayer.split('.')
                                document.getElementById('hlabel').innerHTML = 'รายละเอียดแปลงที่ดิน';
                                if (textlayer.includes("PARCEL_REL_S3")) {
                                    seq[1] = feature.values_.PARCEL_S3_SEQ;
                                    // console.log(feature.values_.PARCEL_S3_SEQ);
                                    document.getElementById('hlabel').innerHTML = 'รายละเอียดเส้นความลึก';
                                }
                                // console.log(seq);
                                if (steppoint2map === 2) {
                                    document.getElementById('label1_1').style.color = 'black';
                                    document.getElementById('label2_1').style.color = 'black';
                                    document.getElementById('label3_1').style.color = 'gray';
                                    document.getElementById('label4_1').style.color = 'gray';
                                    document.getElementById('label5_1').style.color = 'black';
                                    document.getElementById('label6_1').style.color = 'black';
                                    document.getElementById('label7_1').style.color = 'gray';
                                    document.getElementById('label8_1').style.color = 'gray';
                                    document.getElementById('label9_1').style.color = 'gray';
                                    document.getElementById('label10_1').style.color = 'gray';
                                    document.getElementById('label11_1').style.color = 'gray';
                                    document.getElementById('input4_1').disabled = true;
                                    document.getElementById('input4_1').classList.add("Mui-disabled");
                                    document.getElementById("input4_1").parentNode.classList.add("Mui-disabled");
                                    document.getElementById('input5_1').disabled = false;
                                    document.getElementById('input5_1').classList.remove("Mui-disabled");
                                    document.getElementById("input5_1").parentNode.classList.remove("Mui-disabled");
                                    document.getElementById('input6_1').disabled = false;
                                    document.getElementById('input6_1').classList.remove("Mui-disabled");
                                    document.getElementById("input6_1").parentNode.classList.remove("Mui-disabled");
                                    document.getElementById('input7_1').disabled = true;
                                    document.getElementById('input7_1').classList.add("Mui-disabled");
                                    document.getElementById("input7_1").parentNode.classList.add("Mui-disabled");
                                    document.getElementById('input8_1').disabled = true;
                                    document.getElementById('input8_1').classList.add("Mui-disabled");
                                    document.getElementById("input8_1").parentNode.classList.add("Mui-disabled");
                                    document.getElementById('input9_1').disabled = true;
                                    document.getElementById('input9_1').classList.add("Mui-disabled");
                                    document.getElementById("input9_1").parentNode.classList.add("Mui-disabled");
                                    document.getElementById('savepolygon').hidden = false;
                                } else if (steppoint2map === 3) {
                                    document.getElementById('label1_1').style.color = 'gray';
                                    document.getElementById('label2_1').style.color = 'gray';
                                    document.getElementById('input2_1').disabled = true;
                                    document.getElementById('input2_1').classList.add("Mui-disabled");
                                    document.getElementById("input2_1").parentNode.classList.add("Mui-disabled");
                                    document.getElementById('input5_1').disabled = true;
                                    document.getElementById('input5_1').classList.add("Mui-disabled");
                                    document.getElementById("input5_1").parentNode.classList.add("Mui-disabled");
                                    document.getElementById('input6_1').disabled = true;
                                    document.getElementById('input6_1').classList.add("Mui-disabled");
                                    document.getElementById("input6_1").parentNode.classList.add("Mui-disabled");
                                    document.getElementById('label3_1').style.color = 'gray';
                                    document.getElementById('label4_1').style.color = 'gray';
                                    document.getElementById('label5_1').style.color = 'gray';
                                    document.getElementById('label6_1').style.color = 'gray';
                                    document.getElementById('label7_1').style.color = 'gray';
                                    document.getElementById('label8_1').style.color = 'gray';
                                    document.getElementById('label9_1').style.color = 'gray';
                                    document.getElementById('label10_1').style.color = 'gray';
                                    document.getElementById('label11_1').style.color = 'gray';
                                    document.getElementById('savepolygon').style.display = 'none';
                                } else {
                                    document.getElementById('savepolygon').hidden = false;
                                }
                                selParcelByParcelSeq(seq[1] + "")
                                // selParcelByParcelSeq(feature.Properties[0].PARCEL_S3_SEQ+"")
                                document.getElementById('propertiespolygon').hidden = false;
                            } else if (typeimport === 'point') {
                                if (steppoint2map === 1) {
                                    document.getElementById('savepolygon').hidden = false;
                                    features = map.getFeaturesAtPixel(evt.pixel);
                                    console.log(features);
                                    // console.log(feature);
                                    // alert(features[0].values_.PARCEL_S3_SEQ)
                                    if (features[0].values_.status === '0') {
                                        document.getElementById('inputpointhidden').value = features[0].ol_uid;
                                    } else {
                                        document.getElementById('inputpointhidden').value = features[0].values_.PARCEL_S3_SEQ;
                                    }
                                    // if (queryParameters.get("ss") != null) {
                                    // console.log(feature);
                                    document.getElementById('input1').value = features[0].values_.PARCEL_TYPE;
                                    document.getElementById('input2').value = features[0].values_.REMARK;
                                    document.getElementById('input3n').value = features[0].values_.PARCEL_ID;
                                    document.getElementById('input3').value = features[0].values_.PARCELNO;
                                    document.getElementById('input4').value = features[0].values_.UTMMAP1;
                                    document.getElementById('input5').value = features[0].values_.UTMMAP2;
                                    document.getElementById('input6').value = features[0].values_.UTMMAP3;
                                    document.getElementById('input7').value = features[0].values_.UTMMAP4;
                                    document.getElementById('input8').value = features[0].values_.UTMSCALE;
                                    document.getElementById('input9').value = features[0].values_.LAND_NO;
                                    document.getElementById('input10').value = features[0].values_.NRAI;
                                    document.getElementById('input11').value = features[0].values_.NNHAN;
                                    document.getElementById('input12').value = features[0].values_.NWAH;
                                    document.getElementById('input13').value = features[0].values_.TYPE_CODE;
                                    document.getElementById('input14').value = features[0].values_.STANDARD_DEPTH;
                                    document.getElementById('input15').value = features[0].values_.DEPTH_R;
                                    document.getElementById('input16').value = features[0].values_.PARCEL_SHAPE;
                                    document.getElementById('propertiespoint').hidden = false;
                                    // } else {
                                    //     document.getElementById('input1').value = feature.values_.PARCELTYPE;
                                    //     document.getElementById('input2').value = feature.values_.ECT;
                                    //     document.getElementById('input3n').value = features[0].values_.PARCEL_ID;
                                    //     document.getElementById('input3').value = features[0].values_.PARCELNO;
                                    //     document.getElementById('input4').value = features[0].values_.UTM_1;
                                    //     document.getElementById('input5').value = features[0].values_.UTM_2;
                                    //     document.getElementById('input6').value = features[0].values_.UTM_3;
                                    //     document.getElementById('input7').value = features[0].values_.UTM_4;
                                    //     document.getElementById('input8').value = features[0].values_.UTM_SCALE;
                                    //     document.getElementById('input9').value = features[0].values_.UTM_LANDNO;
                                    //     document.getElementById('input10').value = features[0].values_.RAI;
                                    //     document.getElementById('input11').value = features[0].values_.NGAN;
                                    //     document.getElementById('input12').value = features[0].values_.VA;
                                    //     document.getElementById('input13').value = features[0].values_.NODENAME;
                                    //     document.getElementById('input14').value = features[0].values_.DEPTH_STD;
                                    //     document.getElementById('input15').value = features[0].values_.DEPTH;
                                    //     document.getElementById('input16').value = features[0].values_.TRANSFORMTYPE;
                                    //     document.getElementById('propertiespoint').hidden = false;
                                    // }
                                } else {
                                    features = map.getFeaturesAtPixel(evt.pixel);
                                    // console.log(features);
                                    var row = JSON.stringify({
                                        "PARCEL_S3_SEQ": features[0].values_.PARCEL_S3_SEQ + "",
                                        "ZONE": queryParameters.get("z") + ""
                                    });
                                    if (steppoint2map === 2) {
                                        var res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/SelPointSTS2ByParcelSeq", {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: row
                                        });
                                        document.getElementById('savepoint').hidden = false;

                                    } else if (steppoint2map === 3) {
                                        var res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/SelPointSTS3ByParcelSeq", {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: row
                                        });
                                        document.getElementById('savepoint').style.display = 'none';
                                        document.getElementById('input3n').disabled = true;
                                        document.getElementById('input3n').classList.add("Mui-disabled");
                                        document.getElementById("input3n").parentNode.classList.add("Mui-disabled");
                                        document.getElementById('input10').disabled = true;
                                        document.getElementById('input10').classList.add("Mui-disabled");
                                        document.getElementById("input10").parentNode.classList.add("Mui-disabled");
                                        document.getElementById('input11').disabled = true;
                                        document.getElementById('input11').classList.add("Mui-disabled");
                                        document.getElementById("input11").parentNode.classList.add("Mui-disabled");
                                        document.getElementById('input12').disabled = true;
                                        document.getElementById('input12').classList.add("Mui-disabled");
                                        document.getElementById("input12").parentNode.classList.add("Mui-disabled");
                                        document.getElementById('input13').disabled = true;
                                        document.getElementById('input13').classList.add("Mui-disabled");
                                        document.getElementById("input13").parentNode.classList.add("Mui-disabled");
                                        document.getElementById('input15').disabled = true;
                                        document.getElementById('input15').classList.add("Mui-disabled");
                                        document.getElementById("input15").parentNode.classList.add("Mui-disabled");
                                        document.getElementById('input16').disabled = true;
                                        document.getElementById('input16').classList.add("Mui-disabled");
                                        document.getElementById("input16").parentNode.classList.add("Mui-disabled");
                                        document.getElementById('savepolygon').hidden = true;
                                        document.getElementById('savepolygon').classList.add("Mui-disabled");
                                        document.getElementById("savepolygon").parentNode.classList.add("Mui-disabled");

                                    }
                                    const response = await res.json();

                                    // console.log(response);
                                    if (response.status === "200") {
                                        var result = response.result
                                        // console.log(result);
                                        // console.log(features);
                                        // console.log(feature);
                                        // console.log(result[0].VAL_PER_WAH);
                                        // console.log(result[0].VALAREA);

                                        document.getElementById('inputpointhidden').value = features[0].values_.PARCEL_S3_SEQ;
                                        document.getElementById('input1').value = result[0].ID;
                                        document.getElementById('input2').value = result[0].REMARK;
                                        document.getElementById('input3').value = result[0].REFERENCE_NO;
                                        document.getElementById('input3n').value = result[0].PARCEL_ID;
                                        document.getElementById('input4').value = features[0].values_.UTM_1;
                                        document.getElementById('input5').value = features[0].values_.UTM_2;
                                        document.getElementById('input6').value = features[0].values_.UTM_3;
                                        document.getElementById('input7').value = features[0].values_.UTM_4;
                                        document.getElementById('input8').value = features[0].values_.UTM_SCALE;
                                        document.getElementById('input9').value = features[0].values_.UTM_LANDNO;
                                        document.getElementById('input10').value = result[0].NRAI;
                                        document.getElementById('input11').value = result[0].NNHAN;
                                        document.getElementById('input12').value = result[0].NWAH;
                                        document.getElementById('input13').value = features[0].values_.TYPE_CODE;
                                        document.getElementById('input14').value = features[0].values_.STANDARD_DEPTH;
                                        document.getElementById('input15').value = features[0].values_.DEPTH_R;
                                        document.getElementById('input16').value = features[0].values_.PARCEL_SHAPE;
                                        document.getElementById('input17').value = numberWithCommas(result[0].VAL_PER_WAH);
                                        document.getElementById('input18').value = numberWithCommas(result[0].VALAREA);
                                    }
                                    var source = vectorpoint.getSource();
                                    // setmapzoom(map.getZoom());
                                    // console.log(source);
                                    for (var i = 1; i <= 9; i++) {
                                        document.getElementById('input' + i).disabled = true;
                                        // document.getElementById('input2').value = "";
                                        document.getElementById('input' + i).classList.add("Mui-disabled");
                                        document.getElementById('input' + i).parentNode.classList.add("Mui-disabled");
                                    }




                                    document.getElementById('propertiespoint').hidden = false;
                                }
                            }
                            // if (!textlayer.includes("PARCEL_S3_")) {
                            //     // console.log(steppoint2map);

                            // } else {

                            // }

                        }
                    }, 100);


                }
            }

        });
        const editLine = document.getElementById("editLine");
        const editLine1 = document.getElementById("editLine1");
        editLine.addEventListener('click', function () {
            editLine.style.display = 'none';
            editLine1.style.display = 'flex';
            map.removeInteraction(select);
            map.addInteraction(modifyLine);
            map.removeInteraction(modify);
            addInteractions();
        })
        editLine1.addEventListener('click', function () {
            editLine1.style.display = 'none';
            editLine.style.display = 'flex';
            map.removeInteraction(modifyLine);
        })





        const markpoint = document.getElementById("markpoint");
        markpoint.addEventListener('click', function () {
            map.removeInteraction(select);
            map.addInteraction(modify);
            addInteractions();
        })
        const markcoord = document.getElementById("markcoord");
        const getRandomNumber = function (min, ref) {
            return Math.random() * ref + min;
        }
        markcoord.addEventListener('click', function () {
            // alert('add coordinate');
            document.getElementById("inputlat").value = '';
            document.getElementById("inputlong").value = '';
            document.getElementById("propertiescoord").hidden = false;
        })
        const ROADClick = document.getElementById("ROADClick");
        ROADClick.addEventListener('click', function () {
            if (!ROAD) {
                roadLayerLabel.setVisible(false);
                roadLayer.setVisible(false);
                document.getElementById("ROAD1").style.display = "none";
                document.getElementById("ROAD2").style.display = "inline-flex";
            } else {
                roadLayerLabel.setVisible(true);
                roadLayer.setVisible(true);
                document.getElementById("ROAD1").style.display = "inline-flex";
                document.getElementById("ROAD2").style.display = "none";
            }
            ROAD = !ROAD;
        })
        const RELClick = document.getElementById("RELClick");
        RELClick.addEventListener('click', function () {
            if (!REL) {
                RELPolygonLayer.setVisible(false);
                document.getElementById("REL1").style.display = "none";
                document.getElementById("REL2").style.display = "inline-flex";
            } else {
                RELPolygonLayer.setVisible(true);
                document.getElementById("REL1").style.display = "inline-flex";
                document.getElementById("REL2").style.display = "none";
            }
            REL = !REL;
        })
        const PARCELClick = document.getElementById("PARCELClick");
        PARCELClick.addEventListener('click', function () {
            if (!PARCEL) {
                if (queryParameters.get("ss") == '2') {
                } else {
                    impPolygonLayer.setVisible(false);
                }
                document.getElementById("PARCEL1").style.display = "none";
                document.getElementById("PARCEL2").style.display = "inline-flex";
            } else {
                if (queryParameters.get("ss") == '2') {
                } else {
                    impPolygonLayer.setVisible(true);
                }
                document.getElementById("PARCEL1").style.display = "inline-flex";
                document.getElementById("PARCEL2").style.display = "none";
            }
            PARCEL = !PARCEL;
        })
        const PARCEL1Click = document.getElementById("PARCEL1Click");
        PARCEL1Click.addEventListener('click', function () {
            // impPolygonLayer.setVisible(true);
            document.getElementById("PARCEL1_1").style.display = "inline-flex";
            document.getElementById("PARCEL2_1").style.display = "none";
            document.getElementById("PARCEL1_2").style.display = "none";
            document.getElementById("PARCEL2_2").style.display = "inline-flex";
            document.getElementById("PARCEL1_3").style.display = "none";
            document.getElementById("PARCEL2_3").style.display = "inline-flex";
            PARCEL1 = false;
            PARCEL2 = !PARCEL1;
            PARCEL3 = !PARCEL1;
            // sPARCEL1(false);
            // sPARCEL2(!PARCEL1);
            // sPARCEL3(!PARCEL1);
            impPolygonLayer.setStyle(polygonStyleFilter);
        })
        const PARCEL2Click = document.getElementById("PARCEL2Click");
        PARCEL2Click.addEventListener('click', function () {
            // impPolygonLayer.setVisible(true);
            document.getElementById("PARCEL1_2").style.display = "inline-flex";
            document.getElementById("PARCEL2_2").style.display = "none";
            document.getElementById("PARCEL1_1").style.display = "none";
            document.getElementById("PARCEL2_1").style.display = "inline-flex";
            document.getElementById("PARCEL1_3").style.display = "none";
            document.getElementById("PARCEL2_3").style.display = "inline-flex";
            PARCEL2 = false;
            PARCEL1 = !PARCEL2;
            PARCEL3 = !PARCEL2;
            // sPARCEL2(false);
            // sPARCEL1(!PARCEL2);
            // sPARCEL3(!PARCEL2);
            impPolygonLayer.setStyle(polygonStyle);
        })
        const PARCEL3Click = document.getElementById("PARCEL3Click");
        PARCEL3Click.addEventListener('click', function () {
            // impPolygonLayer.setVisible(true);
            document.getElementById("PARCEL1_3").style.display = "inline-flex";
            document.getElementById("PARCEL2_3").style.display = "none";
            document.getElementById("PARCEL1_2").style.display = "none";
            document.getElementById("PARCEL2_2").style.display = "inline-flex";
            document.getElementById("PARCEL1_1").style.display = "none";
            document.getElementById("PARCEL2_1").style.display = "inline-flex";
            PARCEL3 = false;
            PARCEL2 = !PARCEL3;
            PARCEL1 = !PARCEL3;
            // sPARCEL3(false);
            // sPARCEL2(!PARCEL3);
            // sPARCEL1(!PARCEL3);
            impPolygonLayer.setStyle(polygonStyle);
        })
        const POINTClick = document.getElementById("POINTClick");
        POINTClick.addEventListener('click', function () {
            if (!POINT) {
                if (queryParameters.get("ss") == '2') {
                    impPolygonLayer.setVisible(false);
                } else {
                    vectorpoint.setVisible(false);
                }
                document.getElementById("POINT1").style.display = "none";
                document.getElementById("POINT2").style.display = "inline-flex";
            } else {
                if (queryParameters.get("ss") == '2') {
                    impPolygonLayer.setVisible(true);
                } else {
                    vectorpoint.setVisible(true);
                }
                document.getElementById("POINT1").style.display = "inline-flex";
                document.getElementById("POINT2").style.display = "none";
            }
            POINT = !POINT;
        })
        const nobasemap = document.getElementById("nobasemap");
        nobasemap.addEventListener('click', function () {
            osm.setVisible(false);
            // satelliteLayer.setVisible(false);            
            nostra.setVisible(false);
            satellite.setVisible(false);
        })
        const olbasemap = document.getElementById("olbasemap");
        olbasemap.addEventListener('click', function () {
            osm.setVisible(true);
            // satelliteLayer.setVisible(false);       
            nostra.setVisible(false);
            satellite.setVisible(false);
        })
        const googlemap = document.getElementById("googlemap");
        googlemap.addEventListener('click', function () {
            osm.setVisible(false);
            // satelliteLayer.setVisible(true);
            nostra.setVisible(true);
            satellite.setVisible(false);
        })
        const satellitemap = document.getElementById("satellitemap");
        satellitemap.addEventListener('click', function () {
            osm.setVisible(false);
            nostra.setVisible(false);
            satellite.setVisible(true);
        })
        // console.log(document.getElementById('slide1').childNodes[2].children[0]);

        const polygonrefresh = document.getElementById('slide1');
        let drag = false;
        polygonrefresh.addEventListener(
            'mousedown', () => drag = true);

        polygonrefresh.addEventListener(
            'mousemove', () => {
                if (drag) {
                    impPolygonLayer.setStyle(polygonStyle);
                }
            });
        polygonrefresh.addEventListener(
            'mouseup', () => drag = false);
        const closePoint = document.getElementById("closebProperties");
        const closexPoint = document.getElementById("closexProperties");
        closePoint.addEventListener('click', function () {
            var source = vectorpoint.getSource();
            // console.log(document.getElementById('inputpointhidden').value);
            // console.log(document.getElementById('inputpointhidden').value);
            var features = source.getFeatureById(document.getElementById('inputpointhidden').value * 1);
            // console.log(features);
            // console.log(features.values_.status);
            if (features !== null) {
                if (features.values_.status === '0') {
                    vectorpoint.getSource().removeFeature(features)
                }
            }


        })
        closexPoint.addEventListener('click', function () {
            var source = vectorpoint.getSource();
            var features = source.getFeatureById(document.getElementById('inputpointhidden').value * 1);
            // console.log(features);
            // console.log(features.values_.status);
            if (features !== null) {
                if (features.values_.status === '0') {
                    vectorpoint.getSource().removeFeature(features)
                }
            }
        })
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
        // const closePointc = document.getElementById("closebPropertiesc");
        // const closexPointc = document.getElementById("closexPropertiesc");
        // closePointc.addEventListener('click', function () {
        //     var source = vectorpoint.getSource();
        //     // console.log(document.getElementById('inputpointhidden').value);
        //     var features = source.getFeatureById(document.getElementById('inputpointhidden').value * 1);
        //     // console.log(features);
        // console.log(features.values_.status);
        //     if (features !== null) {
        //         if (features.values_.status === '0') {
        //             vectorpoint.getSource().removeFeature(features)
        //         }
        //     }

        // })
        // closexPointc.addEventListener('click', function () {
        //     var source = vectorpoint.getSource();
        //     var features = source.getFeatureById(document.getElementById('inputpointhidden').value * 1);
        //     // console.log(features);

        // console.log(features.values_.status);
        //     if (features !== null) {
        //         if (features.values_.status === '0') {
        //             vectorpoint.getSource().removeFeature(features)
        //         }
        //     }
        // })
        const measure = document.getElementById("measure");
        const measureClose = document.getElementById("measureClose");
        measure.style.display = "flex";
        measureClose.style.display = "none";

        measure.addEventListener('click', function () {
            drawMeasure(map)
            measure.style.display = "none";
            measureClose.style.display = "";
        });

        measureClose.addEventListener(
            "click",
            (e) => {
                removeMeasure(map)
                measure.style.display = "";
                measureClose.style.display = "none";
            },
            false
        );
    });
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

    const pointclick = {};
    const lineclick = {};
    const closeProperties = () => {
        // setActiveCellId(null)
        // document.getElementsByClassName('properties_input').value = '';
        for (var i = 1; i <= 16; i++) {
            document.getElementById('input' + i).value = '';
        }
        document.getElementById('propertiespoint').hidden = true;
        setsourcepoint(new VectorSource())
    }
    const closePropertiesPolygon = () => {
        // setActiveCellId(null)
        document.getElementsByClassName('properties_input_polygon').value = '';
        for (var i = 1; i <= 9; i++) {
            document.getElementById('input' + i + "_1").value = '';
        }
        document.getElementById('propertiespolygon').hidden = true;
    }
    const closecoord = () => {
        document.getElementById('propertiescoord').hidden = true;
    }

    const saveProperties = async () => {
        // console.log(features);
        if (document.getElementById('input1').value === '99' && (document.getElementById('input2').value).trim() === '') {
            document.getElementById('alertreqfield').style.display = 'flex'
            return false;
        }
        for (var i = 1; i <= 16; i++) {
            if ((document.getElementById('input' + i).value).trim() === '') {
                if (i !== 2 && i !== 3 && i !== 4 && i !== 5 && i !== 6 && i !== 7 && i !== 8 && i !== 9 && i !== 14) {
                    // alert('alertreqfield');
                    document.getElementById('alertreqfield').style.display = 'flex'
                    return false;
                }
            }

        }

        if (features == undefined) {
            console.log('features undefined');
            let zone = queryParameters.get("z");
            if (steppoint2map === 1) {
                console.log('steppoint2map 1');
                let result = UpdCreateRel(zone);
                if (result) {
                    reloadTable()
                    // setActiveCellId(null)
                }
            } else if (steppoint2map === 2) {
                console.log('steppoint2map 2');
                let result = await UpdCreateRel2(zone);
                console.log('steppoint2map', result);
                if (result) {
                    reloadTable()
                    // setActiveCellId(null)
                }
            }
            return false;
        }

        if (features[0] !== undefined) {
            if (features[0].values_.status === '0') {
                var landtype = '';
                var opt1 = document.getElementById('input1').children;
                for (var i = 0; i < opt1.length; i++) {
                    // console.log(opt1[i]);
                    if (opt1[i].value == document.getElementById('input1').value) {
                        // console.log(opt1[i].innerText);
                        landtype = opt1[i].innerText;
                    } else {
                        // console.log(opt1[i].innerText);
                    }
                }
                features[0].values_.PARCELTYPE = document.getElementById('input1').value;
                features[0].values_.ECT = document.getElementById('input2').value;
                features[0].values_.PARCELNO = document.getElementById('input3').value;
                features[0].values_.LAND_TYPE = landtype;
                features[0].values_.PARCEL_ID = document.getElementById('input3n').value;
                features[0].values_.UTM_1 = document.getElementById('input4').value;
                features[0].values_.UTM_2 = document.getElementById('input5').value;
                features[0].values_.UTM_3 = document.getElementById('input6').value;
                features[0].values_.UTM_4 = document.getElementById('input7').value;
                features[0].values_.UTM_SCALE = document.getElementById('input8').value;
                features[0].values_.UTM_LANDNO = document.getElementById('input9').value;
                features[0].values_.RAI = document.getElementById('input10').value;
                features[0].values_.NGAN = document.getElementById('input11').value;
                features[0].values_.VA = document.getElementById('input12').value;
                features[0].values_.NODENAME = document.getElementById('input13').value;
                features[0].values_.DEPTH_STD = document.getElementById('input14').value;
                features[0].values_.DEPTH = document.getElementById('input15').value;
                features[0].values_.TRANSFORMTYPE = document.getElementById('input16').value;
                features[0].values_.status = '1';
                var PARCELTYPE = document.getElementById('input1').value;
                var ECT = document.getElementById('input2').value;
                var PARCEL_ID = document.getElementById('input3n').value;
                var PARCEL_REF = document.getElementById('input3').value;
                var UTM_1 = document.getElementById('input4').value;
                var UTM_2 = document.getElementById('input5').value;
                var UTM_3 = document.getElementById('input6').value;
                var UTM_4 = document.getElementById('input7').value;
                var UTM_SCALE = document.getElementById('input8').value;
                var UTM_LANDNO = document.getElementById('input9').value;
                var RAI = document.getElementById('input10').value;
                var NGAN = document.getElementById('input11').value;
                var VA = document.getElementById('input12').value;
                // var STREET_NAME = document.getElementById('input13').value;
                var DEPTH_STD = document.getElementById('input14').value;
                var DEPTH = document.getElementById('input15').value;
                var TRANSFORMTYPE = document.getElementById('input16').value;
                // datapoint2table({ PARCELTYPE, ECT, PARCEL_ID, UTM_1, UTM_2, UTM_3, UTM_4, UTM_SCALE, UTM_LANDNO, RAI, NGAN, VA, STREET_NAME, DEPTH_STD, DEPTH, TRANSFORMTYPE, geometry });

                // var sourceremove = vectorpoint.getSource();
                // console.log(sourceremove.getFeatureById(features[0].ol_uid));
                // var data = reproject.reproject(features[0], "EPSG:4326", (queryParameters.get("z") == '') ? "EPSG:240" + '47' : "EPSG:240" + queryParameters.get("z"));
                // console.log(data);
                // console.log('aaa', geometry);
                if (geometry === undefined) {
                    var geometrysp = geometryp.split(', ')
                } else {
                    var geometrysp = geometry.split(', ')
                }

                var geo1 = geometrysp[0];
                var geo2 = geometrysp[1];
                // console.log("POINT (" + (geo1 * 1) + 120 + " " + (geo2 * 1) + 100 + ")")
                // console.log(document.getElementById('input13').value);
                var c = document.getElementById('input13').childElementCount
                var sss = document.getElementById('input13').children
                var row;
                for (var u = 0; u < c; u++) {
                    // console.log(document.getElementById('input13').value);
                    if (sss[u].value === document.getElementById('input13').value) {
                        var STREET_RN = sss[u].getAttribute('data-strn')
                        var ST_VALUE = sss[u].getAttribute('data-stval')
                        var STREET_NAME = sss[u].innerText
                        row = JSON.stringify({
                            "PARCEL_TYPE": PARCELTYPE + "",
                            "UTMMAP1": UTM_1 + "",
                            "UTMMAP2": UTM_2 + "",
                            "UTMMAP3": UTM_3 + "",
                            "UTMMAP4": UTM_4 + "",
                            "UTMSCALE": UTM_SCALE + "",
                            "LAND_NO": UTM_LANDNO + "",
                            "CHANGWAT_CODE": queryParameters.get("p") + "",
                            "AMPHUR_CODE": queryParameters.get("a") + "",
                            "OPT_CODE": queryParameters.get("t") + "",
                            "OPT_NAME": queryParameters.get("n"),
                            "OPT_TYPE": queryParameters.get("tt") + "",
                            "STREET_RN": STREET_RN + "",
                            "USER_ID": userid,
                            "TABLE_NO": TRANSFORMTYPE + "",
                            "SHAPE": "POINT (" + geo1 + " " + geo2 + ")",
                            "STANDARD_DEPTH": DEPTH_STD + "",
                            "ST_VALUE": ST_VALUE + "",
                            "DEPTH_R": DEPTH + "",
                            "STREET_NAME": STREET_NAME + "",
                            "PARCEL_ID": PARCEL_ID + "",
                            "TYPE_CODE": document.getElementById('input13').value + "",
                            "NRAI": RAI + "",
                            "NNHAN": NGAN + "",
                            "NWAH": VA + "",
                            "PARCEL_S3_SEQ": "",
                            "REMARK": ECT + "",
                            "REFERENCE_NO": PARCEL_REF + "",
                            "ZONE": queryParameters.get("z") + ""
                        });
                        // console.log(row);
                    }
                }
                setsourcepoint(new VectorSource())

                const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/InsPointData", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: row
                });
                const response = await res.json();
                if (response.status === "200") {
                    var result = response.result
                    features[0].values_.PARCEL_S3_SEQ = result[0].PARCEL_S3_SEQ;
                    features[0].setId(result[0].PARCEL_S3_SEQ + "");
                    datapoint2table(result[0].PARCEL_S3_SEQ);
                    // console.log(result);
                }



            } else {
                var landtype = '';
                var opt1 = document.getElementById('input1').children;
                for (var i = 0; i < opt1.length; i++) {
                    // console.log(opt1[i]);
                    if (opt1[i].value == document.getElementById('input1').value) {
                        // console.log(opt1[i].innerText);
                        landtype = opt1[i].innerText;
                    } else {
                        // console.log(opt1[i].innerText);
                    }
                }
                features[0].values_.PARCELTYPE = document.getElementById('input1').value;
                features[0].values_.ECT = document.getElementById('input2').value;
                features[0].values_.PARCELNO = document.getElementById('input3').value;
                features[0].values_.LAND_TYPE = landtype;
                features[0].values_.PARCEL_ID = document.getElementById('input3n').value;
                features[0].values_.UTM_1 = document.getElementById('input4').value;
                features[0].values_.UTM_2 = document.getElementById('input5').value;
                features[0].values_.UTM_3 = document.getElementById('input6').value;
                features[0].values_.UTM_4 = document.getElementById('input7').value;
                features[0].values_.UTM_SCALE = document.getElementById('input8').value;
                features[0].values_.UTM_LANDNO = document.getElementById('input9').value;
                features[0].values_.RAI = document.getElementById('input10').value;
                features[0].values_.NGAN = document.getElementById('input11').value;
                features[0].values_.VA = document.getElementById('input12').value;
                features[0].values_.NODENAME = document.getElementById('input13').value;
                features[0].values_.DEPTH_STD = document.getElementById('input14').value;
                features[0].values_.DEPTH = document.getElementById('input15').value;
                features[0].values_.TRANSFORMTYPE = document.getElementById('input16').value;
                var PARCELTYPE = document.getElementById('input1').value;
                var ECT = document.getElementById('input2').value;
                var PARCEL_ID = document.getElementById('input3n').value;
                var PARCEL_REF = document.getElementById('input3').value;
                var UTM_1 = document.getElementById('input4').value;
                var UTM_2 = document.getElementById('input5').value;
                var UTM_3 = document.getElementById('input6').value;
                var UTM_4 = document.getElementById('input7').value;
                var UTM_SCALE = document.getElementById('input8').value;
                var UTM_LANDNO = document.getElementById('input9').value;
                var RAI = document.getElementById('input10').value;
                var NGAN = document.getElementById('input11').value;
                var VA = document.getElementById('input12').value;
                var DEPTH_STD = document.getElementById('input14').value;
                var DEPTH = document.getElementById('input15').value;
                var TRANSFORMTYPE = document.getElementById('input16').value;
                var c = document.getElementById('input13').childElementCount
                var sss = document.getElementById('input13').children
                var row;
                for (var u = 0; u < c; u++) {
                    // console.log(document.getElementById('input13').value);
                    if (sss[u].value === document.getElementById('input13').value) {
                        var STREET_RN = sss[u].getAttribute('data-strn')
                        var ST_VALUE = sss[u].getAttribute('data-stval')
                        var STREET_NAME = sss[u].innerText
                        if (steppoint2map === 1) {
                            row = JSON.stringify({
                                "PARCEL_TYPE": PARCELTYPE + "",
                                "PARCEL_ID": PARCEL_ID + "",
                                "UTMMAP1": UTM_1 + "",
                                "UTMMAP2": UTM_2 + "",
                                "UTMMAP3": UTM_3 + "",
                                "UTMMAP4": UTM_4 + "",
                                "UTMSCALE": UTM_SCALE + "",
                                "LAND_NO": UTM_LANDNO + "",
                                "STREET_RN": STREET_RN + "",
                                "USER_ID": userid,
                                "TABLE_NO": TRANSFORMTYPE + "",
                                "STANDARD_DEPT": DEPTH_STD + "",
                                "ST_VALUE": ST_VALUE + "",
                                "DEPTH_R": DEPTH + "",
                                "STREET_NAME": STREET_NAME + "",
                                "TYPE_CODE": document.getElementById('input13').value + "",
                                "NRAI": RAI + "",
                                "NNHAN": NGAN + "",
                                "NWAH": VA + "",
                                "PARCEL_S3_SEQ": features[0].values_.PARCEL_S3_SEQ + "",
                                "REMARK": ECT + "",
                                "REFERENCE_NO": PARCEL_REF + "",
                                "ZONE": queryParameters.get("z") + ""
                            });
                            // console.log(row);
                            const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/UpdPointEditSTS1", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: row
                            });
                            const response = await res.json();
                            if (response.status === "200") {
                                var result = response.result
                                reloadTable()
                                // datapoint2table(result[0].PARCEL_S3_SEQ);
                                // console.log(result);
                            }
                        } else if (steppoint2map === 2) {
                            row = JSON.stringify({
                                "PARCEL_S3_SEQ": features[0].values_.PARCEL_S3_SEQ + "",
                                "DEPTH_R": DEPTH + "",
                                "ZONE": queryParameters.get("z") + "",
                                "USER_ID": userid,
                                "NRAI": RAI + "",
                                "NNHAN": NGAN + "",
                                "NWAH": VA + "",
                                "ID": STREET_RN + "",
                                "TYPE_CODE": document.getElementById('input13').value + "",
                                "TYPE_NAME": STREET_NAME + "",
                                "STREET_DEPTH": DEPTH_STD + "",
                                "STREET_VALUE": ST_VALUE + "",
                                "LAND_TYPE_ID": TRANSFORMTYPE + ""
                            });
                            // console.log(row);
                            const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/UpdPointEditValue", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: row
                            });
                            const response = await res.json();
                            if (response.status === "200") {
                                var result = response.result
                                reloadTable()
                                // datapoint2table(result[0].PARCEL_S3_SEQ);
                                // console.log(result);
                            }

                        } else {

                        }


                    }
                }

            }
            document.getElementById('propertiespoint').hidden = true;
        } else {
            document.getElementById('propertiespoint').hidden = true;
        }
        for (var i = 1; i <= 16; i++) {
            document.getElementById('input' + i).value = '';
        }
        // setActiveCellId(null)
    }
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const selParcelByParcelSeq = async (seq) => {
        const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/selParcelByParcelSeq", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "PARCEL_S3_SEQ": seq + "",
                "MAPZONE": queryParameters.get("z") + ""
            })
        });
        const response = await res.json();
        if (response.status === "200") {
            var result = response.result[0]
            // console.log(result);
            document.getElementById('input1_1').value = result.LAND_TYPE;
            document.getElementById('input2_1').value = result.PARCEL_ID;
            document.getElementById('input3_1').value = result.AMPHUR_NAME_TH;
            // document.getElementById('input4_1').value = result.OPT_CODE;
            // document.getElementById('input5_1').value = result.OPT_NAME;
            document.getElementById('input6_1').value = result.TYPE_CODE;
            document.getElementById('input7_1').value = result.NRAI;
            document.getElementById('input8_1').value = result.NNHAN;
            document.getElementById('input9_1').value = result.NWAH;
            document.getElementById('input10_1').value = result.STANDARD_DEPTH;
            document.getElementById('input11_1').value = (result.ST_VALUE == undefined || result.ST_VALUE == null) ? 0 : numberWithCommas(result.ST_VALUE);
            document.getElementById('input12_1').value = (result.VAL_PER_WAH == undefined || result.VAL_PER_WAH == null) ? 0.00 : numberWithCommas(result.VAL_PER_WAH);
            document.getElementById('input13_1').value = (result.VALAREA == undefined || result.VALAREA == null) ? 0.00 : numberWithCommas(result.VALAREA);
        }
        SelOptTambol(seq, result.OPT_CODE)
        SelAttach(seq, result.TYPE_CODE)
        SelParcelShp(seq, result.PARCEL_SHAPE)

    }
    const SelOptTambol = async (seq, val) => {
        document.getElementById('inpseq').value = seq;
        const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelOptTambol", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "PARCEL_S3_SEQ": seq + "",
                "MAPZONE": queryParameters.get("z") + ""
            })
        });
        const response = await res.json();
        // console.log(response);
        if (response.status === "200") {
            var result = response.result
            var html = '<option value="">เลือกเทศบาล / ตำบล</option>';
            result.forEach((item, i) => {
                html += '<option value="' + item.OPT_CODE + '">' + item.OPT_NAME_TH + '</option>'
            })
            document.getElementById('input4_1').innerHTML = html;
            document.getElementById('input4_1').value = val
        }

    }
    const SelAttach = async (seq, val) => {
        const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelAttach", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "PARCEL_S3_SEQ": seq + "",
                "MAPZONE": queryParameters.get("z") + "",
                "OPT_TYPE": queryParameters.get("tt") + ""
            })
        });
        const response = await res.json();
        if (response.status === "200") {
            var result = response.result
            var html = '<option value="" data-stdepth="" data-stval="" data-stid="">เลือกหน่วยที่ดิน</option>';
            result.forEach((item, i) => {
                html += '<option value="' + item.TYPE_CODE + '" data-stdepth="' + item.STREET_DEPTH + '" data-stval="' + item.STREET_VALUE + '" data-stid="' + item.ID + '">' + item.TYPE_NAME + '</option>'
            })
            document.getElementById('input5_1').innerHTML = html;
            document.getElementById('input5_1').value = (val == null) ? '' : val;
        }


    }
    const SelParcelShp = async (seq, val) => {
        const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelShp");
        const response = await res.json();
        // console.log(response);
        if (response.status === "200") {
            var result = response.result
            var html = '<option value="">เลือกหน่วยที่ดิน</option>';
            result.forEach((item, i) => {
                html += '<option value="' + item.LAND_TYPE_ID + '" >' + item.LAND_TYPE_NAME + '</option>'
            })
            document.getElementById('input6_1').innerHTML = html;
            document.getElementById('input6_1').value = (val == null) ? '' : val;
        }


    }
    const SelParcelTypePoint = async (val) => {
        const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/SelParcelTypePoint");
        const response = await res.json();
        if (response.status === "200") {
            var result = response.result
            // console.log(response.result);
            var html = '<option value="">เลือกประเภทเอกสาร</option>';
            result.forEach((item, i) => {
                html += '<option value="' + item.PARCEL_TYPE + '" >' + item.LAND_TYPE + '</option>'
            })
            document.getElementById('input1').innerHTML = html;
            document.getElementById('input1').value = val
        }


    }
    SelParcelTypePoint("")
    const SelAttachPoint = async (val) => {

        const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/SelAttachPoint", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "CHANGWAT_CODE": queryParameters.get("p") + "",
                "AMPHUR_CODE": queryParameters.get("a") + "",
                "OPT_CODE": queryParameters.get("t") + "",
                "OPT_TYPE": queryParameters.get("tt") + ""
            })
        });
        const response = await res.json();
        if (response.status === "200") {
            var result = response.result
            // console.log(response.result);
            var html = '<option value="" data-strn="" data-stdepth="" data-stval="" data-otp="">เลือกหน่วยที่ดิน</option>';
            if (result)
                result.forEach((item, i) => {
                    html += '<option value="' + item.TYPE_CODE + '" data-strn="' + item.ID + '" data-stdepth="' + item.STREET_DEPTH + '" data-stval="' + item.STREET_VALUE + '" data-stval_="' + item.STREET_VALUE_ + '" data-otp="' + item.TYPE_OPT + '">' + item.TYPE_NAME + '</option>'
                })
            document.getElementById('input13').innerHTML = html;
            document.getElementById('input13').value = val
        }

    }
    SelAttachPoint("")
    const SelParcelShpPoint = async (val) => {
        const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelShp");
        const response = await res.json();
        if (response.status === "200") {
            // console.log(response.result);
            var result = response.result
            var html = '<option value="">เลือกประเภทรูปแปลง</option>';
            result.forEach((item, i) => {
                html += '<option value="' + item.LAND_TYPE_ID + '" >' + item.LAND_TYPE_NAME + '</option>'
            })
            document.getElementById('input16').innerHTML = html;
            document.getElementById('input16').value = val
        }


    }
    SelParcelShpPoint("")
    const InsPointData = async () => {
        const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/InsPointData", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "PARCEL_TYPE": "4",
                "UTMMAP1": "5624",
                "UTMMAP2": "4040",
                "UTMMAP3": "06",
                "UTMMAP4": "1000",
                "UTMSCALE": "58",
                "CHANGWAT_CODE": "03",
                "AMPHUR_CODE": "99",
                "OPT_CODE": "1",
                "OPT_NAME": "เทศบาลตำบลปาย",
                "OPT_TYPE": "1",
                "STREET_RN": "9143",
                "USER_ID": "1605",
                "TABLE_NO": "1",
                "SHAPE": "POINT (441906.16879355651 2140196.6645789067)",
                "STANDARD_DEPTH": "40",
                "ST_VALUE": "10000",
                "DEPTH_R": "25",
                "STREET_NAME": "ที่ดินติดทางหลวงแผ่นดิน",
                "PARCEL_ID": "99999",
                "TYPE_CODE": "1",
                "NRAI": "1",
                "NNHAN": "1",
                "NWAH": "1",
                "PARCEL_S3_SEQ": "",
                "ZONE": "47"
            })
        });
        const response = await res.json();
    }
    // selParcelByParcelSeq(525)
    const UpdOptTambol = async () => {
        var c = document.getElementById('input4_1').childElementCount
        var sss = document.getElementById('input4_1').children
        var OPT_NAME_TH = '';
        for (var u = 0; u < c; u++) {
            if (sss[u].value === document.getElementById('input4_1').value) {
                // console.log(sss[u]);
                OPT_NAME_TH = sss[u].innerText
            }
        }
        var row = JSON.stringify({
            "PARCEL_S3_SEQ": document.getElementById('inpseq').value + "",
            "MAPZONE": queryParameters.get("z") + "",
            "OPT_TYPE": queryParameters.get("tt"),
            "OPT_CODE": document.getElementById('input4_1').value + "",
            "PARCEL_ID": document.getElementById('input2_1').value + "",
            "OPT_NAME_TH": OPT_NAME_TH,
            "USER_ID": userid,
            "NRAI": document.getElementById('input7_1').value + "",
            "NNHAN": document.getElementById('input8_1').value + "",
            "NWAH": document.getElementById('input9_1').value + ""
        });
        console.log();
        const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/UpdOptTambol", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: row,
            redirect: 'follow'
        })
        const response = await res.json();
        console.log(response, 'UpdOptTambol');
        reloadTable()
        // console.log({ "UpdOptTambol": row });

    }
    const deletePropertiesPolygon = async () => {
        var row = JSON.stringify({
            "INFO_SEQ": document.getElementById('inpseq').value + "",
            "ZONE": queryParameters.get("z") + ""
        });
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
            reloadTable()
        } else {

        }
    }
    const savePropertiesPolygon = async () => {
        if (steppoint2map === 2) {
            // console.log(`2`);
            // return;
            var c = document.getElementById('input5_1').childElementCount
            var sss = document.getElementById('input5_1').children
            var ID = '';
            var TYPE_NAME = '';
            var STREET_DEPTH = '';
            var STREET_VALUE = '';
            for (var u = 0; u < c; u++) {
                if (sss[u].value === document.getElementById('input5_1').value) {
                    // console.log(sss[u]);
                    TYPE_NAME = sss[u].innerText
                    ID = sss[u].getAttribute('data-stid')
                    STREET_DEPTH = sss[u].getAttribute('data-stdepth')
                    STREET_VALUE = sss[u].getAttribute('data-stval')
                }
            }
            var row = JSON.stringify({
                "PARCEL_S3_SEQ": document.getElementById('inpseq').value + "",
                "MAPZONE": queryParameters.get("z") + "",
                "USER_ID": userid,
                "NRAI": document.getElementById('input7_1').value + "",
                "NNHAN": document.getElementById('input8_1').value + "",
                "NWAH": document.getElementById('input9_1').value + "",
                "PARCEL_ID": document.getElementById('input2_1').value + "",
                "ID": ID + "",
                "TYPE_CODE": document.getElementById('input5_1').value + "",
                "TYPE_NAME": TYPE_NAME + "",
                "STREET_DEPTH": STREET_DEPTH + "",
                "STREET_VALUE": STREET_VALUE + "",
                "LAND_TYPE_ID": document.getElementById('input6_1').value + ""
            });
            // console.log(row,'rrrrrrrrrrrr');
            const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/UpdCreateRel", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: row,
                redirect: 'follow'
            })
            const response = await res.json();
            console.log(response, 'UpdCreateRel');
            if (response) {
                response.result.length > 0 && reloadTable()
            }
            // console.log(response);
            // console.log({ "UpdCreateRel": row });
        } else if (steppoint2map === 1) {
            UpdOptTambol()
        }

        document.getElementById('propertiespolygon').hidden = true;
        document.getElementById('inpseq').value = '';
        // setActiveCellId(null)
    }
    const latLongOnChange = () => {
        if (document.getElementById('inputctype').value === '2') {
            document.getElementById('xlat').innerHTML = "X";
            document.getElementById('ylong').innerHTML = "Y";
        } else {
            document.getElementById('xlat').innerHTML = "Lat";
            document.getElementById('ylong').innerHTML = "Long";
        }
    }
    const inp1OnChange = () => {

        var inpval = document.getElementById('input1').value;
        if (inpval === '99') {
            document.getElementById('input2').disabled = false;
            document.getElementById('labelinput2').style.color = "black";
            document.getElementById('input2').classList.remove("Mui-disabled");
            document.getElementById('input2').style.color = "black";
            document.getElementById("input2").parentNode.classList.remove("Mui-disabled");
            document.getElementById('label1input2').style.color = "red";
        } else {
            document.getElementById('input2').disabled = true;
            document.getElementById('input2').value = "";
            document.getElementById('input2').classList.add("Mui-disabled");
            document.getElementById("input2").parentNode.classList.add("Mui-disabled");
            document.getElementById('labelinput2').style.color = "gray";
            document.getElementById('label1input2').style.color = "gray";
        }
    }
    const inp13OnChange = () => {
        document.getElementById('input16').value = '';
        var c = document.getElementById('input13').childElementCount
        var sss = document.getElementById('input13').children
        if (document.getElementById('input13').value != 7) {

        }
        for (var u = 0; u < c; u++) {

            if (sss[u].value === document.getElementById('input13').value) {

                // console.log(document.getElementById('input13').value);
                // console.log(sss[u].getAttribute('data-strn'), sss[u].getAttribute('data-stdepth'), sss[u].getAttribute('data-stval'));
                document.getElementById('input14').value = sss[u].getAttribute('data-stdepth')
                document.getElementById('input_stval').value = sss[u].getAttribute('data-stval')
                document.getElementById('input_stval1').value = sss[u].getAttribute('data-stval_')
            }
        }
        if (document.getElementById('input13').value == 7) {
            document.getElementById('input16').value = 2;
            document.getElementById('input16').disabled = true;
            document.getElementById('input15').value = 0;
            document.getElementById('input15').disabled = true;
            document.getElementById('input15').classList.add("Mui-disabled");
            document.getElementById("input15").parentNode.classList.add("Mui-disabled");
        } else {

            document.getElementById('input15').disabled = false;
            document.getElementById('input15').classList.remove("Mui-disabled");
            document.getElementById("input15").parentNode.classList.remove("Mui-disabled");
            // document.getElementById('input16').value = "";
            // console.log(document.getElementById('input16').children);
            var forEachC = document.getElementById('input16').children;
            for (var i = 0; i < forEachC.length; i++) {
                if (forEachC[i].value == 2) {
                    forEachC[i].removeAttribute('hidden');
                }
            }
            document.getElementById('input16').disabled = false;
        }
        if (document.getElementById('input13').value != 7) {
            var forEachC = document.getElementById('input16').children;
            for (var i = 0; i < forEachC.length; i++) {
                if (forEachC[i].value == 2) {
                    forEachC[i].setAttribute('hidden', true);
                }
            }
        }

        // if (document.getElementById('input14').value == '') {
        //     document.getElementById('input14').disabled = true;
        //     document.getElementById('input14').classList.add("Mui-disabled");
        //     document.getElementById("input14").parentNode.classList.add("Mui-disabled");
        // } else {
        //     document.getElementById('input14').disabled = false;
        //     document.getElementById('input14').classList.remove("Mui-disabled");
        //     document.getElementById("input14").parentNode.classList.remove("Mui-disabled");
        // }
        if (document.getElementById('input14').value == '0') {

            document.getElementById('input14').value = '0';
        }
    }
    const closealertnotumbol = () => {
        document.getElementById('alertnotumbol').style.display = 'none'
    }

    const closealertreqfield = () => {
        document.getElementById('alertreqfield').style.display = 'none'
    }
    const inputnumkeyup = () => {
        document.getElementById("input10").addEventListener('keyup', (event) => {
            const inp = document.getElementById("input10").value;
            if (inp < 0) {
                document.getElementById("input10").value = 0
            } else {
                document.getElementById("input10").value = inp * 1
            }
            // do something
        })
        document.getElementById("input11").addEventListener('keyup', (event) => {
            const inp = document.getElementById("input11").value;
            if (!(inp >= 0 && inp <= 3)) {
                document.getElementById("input11").value = 0
            } else {
                document.getElementById("input11").value = inp * 1
            }
            // do something
        })
        document.getElementById("input12").addEventListener('keyup', (event) => {
            const inp = parseFloat(document.getElementById("input12").value);
            if (event.key == ".") {

            } else {
                if (!(inp >= 0.00 && inp <= 99.99)) {
                    document.getElementById("input12").value = 0
                } else {
                    document.getElementById("input12").value = inp.toFixed(1) * 1
                }
                // do something
            }

        })
        document.getElementById("input15").addEventListener('keyup', (event) => {
            const inp = document.getElementById("input15").value;
            if (inp < 0) {
                document.getElementById("input15").value = 0
            } else {
                document.getElementById("input15").value = inp * 1
            }
            // do something
        })

    }
    setTimeout(() => {

        inputnumkeyup()
    }, 1000);
    const handleChangeSlide1 = (event, newValue) => {
        setValueslide1(newValue);
    };
    const handleChangeSlide2 = (event, newValue) => {
        setValueslide2(newValue);
    };

    // React.useEffect(() => {
    //     let seq = document.getElementById('activeCellIds').value;
    //     setActiveCellId(seq)
    // });

    return (
        <React.StrictMode>
            <div style={{ position: "relative", display: 'flex', zIndex: 0 }}>
                <div id="map" style={{ width: "100%", height: "calc(100vh - 66px)", display: 'flex', }}>

                </div>
                <Grid style={{ position: 'absolute', bottom: 0, right: 0, }}>
                    <Grid sx={{ display: 'flex', borderRadius: '5px 5px 0px 0px', backgroundColor: 'rgba(255, 255, 255, 0.69)', p: '2px', color: '#415FB5', }}>
                        <Grid sx={{ px: 1 }}>Coordinate </Grid><Grid sx={{ border: '1px solid #415FB5', backgroundColor: 'rgba(255, 255, 255, 0.69)', px: 1, color: '#415FB5', width: '230px', textAlign: 'center' }}><Grid id="precision"></Grid> </Grid>
                        <Grid sx={{ px: 1 }} hidden>Scale </Grid><Grid sx={{ borderRadius: 5, backgroundColor: '#2F4266', px: 1, color: 'white', width: '100px', textAlign: 'center' }} hidden><Grid id="scaleZoom"></Grid></Grid>
                        <Grid sx={{ backgroundColor: 'rgba(255, 255, 255, 0.69)', px: 1, color: '#415FB5', width: '150px', textAlign: 'center' }}><Grid id="scaleZone">{selectedZone} (OTF)</Grid></Grid>
                    </Grid>
                </Grid>
                <Grid style={{ position: 'absolute', bottom: 40, right: 5, lineHeight: '5px' }}>
                    <Button title="เพิ่มตำแหน่ง" id="markpoint" style={pointclick} sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <AddLocationAltOutlinedIcon sx={{ color: '#FFF' }} />
                    </Button>
                    <Button title="เพิ่มตำแหน่ง" id="markcoord" style={pointclick} sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <PostAddIcon sx={{ color: '#FFF' }} />
                    </Button>
                    <Button title="แก้ไขเส้นความลึก" id="editLine" style={lineclick} sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <DriveFileRenameOutlineOutlinedIcon sx={{ color: '#FFF' }} />
                    </Button>
                    <Button title="แก้ไขเส้นความลึก" id="editLine1" style={{ display: 'none' }} sx={{ backgroundColor: 'rgba(5, 111, 252, 0.5)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <DriveFileRenameOutlineOutlinedIcon sx={{ color: '#FFF' }} />
                    </Button>
                    <Button title="เลือก" id="selectpoint" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5, pl: 1 }}>
                        <img src={'/selectpoint.svg'} width={25} height={25} alt='' />
                    </Button><br />
                    <Button title="เครื่งมือวัด" id="measure" className="btn-measure" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <StraightenIcon sx={{ color: '#FFF' }} />
                    </Button><br />
                    <Button title="ปิดเครื่งมือวัด" id="measureClose" className="btn-measureClose" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <CloseIcon sx={{ color: '#FFF' }} />
                    </Button><br />
                    <Button title="เสาไฟฟ้า" id="electricpole" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <img src={'/electricpole.svg'} width={25} height={25} alt='' />
                    </Button><br />
                    <Button title="บ่อน้ำ" id="walterpool" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <img src={'/waterfloof.svg'} width={25} height={25} alt='' />
                    </Button><br />
                    <Button title="Zoomin" id="zoomin" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <AddIcon sx={{ color: '#FFF' }} />
                    </Button><br />
                    <Button title="Zoomout" id="zoomout" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <RemoveIcon sx={{ color: '#FFF' }} />
                    </Button><br />
                    <Button title="Move" id="move" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }}>
                        <img src={'/moveicon.svg'} width={25} height={25} alt='' />
                    </Button><br />
                    <Button title="Base Map" id="mapicon" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }} onClick={showBasemap}>
                        <img src={'/basemap.svg'} width={25} height={25} alt='' />
                    </Button><br />
                    <Button title="Layers" id="layers" sx={{ backgroundColor: 'rgba(62, 62, 62, 0.87)', minWidth: "30px !important", borderRadius: 5, ":hover": { backgroundColor: "rgba(5, 111, 252, 0.5)", }, p: 1, m: .5 }} onClick={showLayers}>
                        <img src={'/layer-svgrepo-com.svg'} width={25} height={25} alt='' />
                    </Button><br />
                </Grid>
                <Grid id="propertiespoint" style={{ position: 'absolute', top: 5, left: 5, lineHeight: '5px', width: "530px", maxHeight: '80vh', backgroundColor: 'white', textAlign: 'right', zIndex: '15' }} sx={{ p: 1, borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)", }} hidden>
                    <input id="inpseq1" hidden></input>
                    <Button id="closexProperties" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={closeProperties}><CloseIcon color="white" /></Button>
                    <Box sx={{ textAlign: 'left', }} ><Typography sx={{ pl: 1, textAlign: 'left', display: 'inline-block', m: 1, }}><SortIcon color='error' />รายละเอียดแปลงที่ดิน</Typography></Box><br />
                    <Grid sx={{ overflowY: "scroll", maxHeight: '50vh' }}>
                        <TextField id="inputpointhidden" className="properties_input" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } }, display: 'none' }} />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ประเภทเอกสาร <span style={{ color: 'red' }}>*</span> </Typography>
                        <select id="input1" style={selectstylepoint1} onChange={inp1OnChange}>
                            <option value="">ประเภทเอกสาร</option>
                        </select><br />
                        <Typography id="labelinput2" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1, color: 'gray' }}>อื่นๆ ระบุ <span id="label1input2" style={{ color: 'gray' }}>*</span>  </Typography><TextField id="input2" className="properties_input" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} disabled /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>เลขที่ </Typography><TextField id="input3n" className="properties_input" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'none', m: 1 }}>เลขที่อ้างอิง (หมายเหตุ) <span style={{ color: 'red' }}>*</span></Typography><TextField id="input3" className="properties_input" size="small" sx={{ display: 'none', my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} value={0} /><br />
                        {/* <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ชื่อเจ้าของที่ดิน </Typography><TextField id="input3name" className="properties_input" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} /><br /> */}
                        <Typography sx={{ pl: 1, textAlign: 'right', m: 1, display: 'none' }}>ระวางภูมิประเทศ (UTMMAP1) </Typography><TextField id="input4" className="properties_input" size="small" sx={{ my: '1px', width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00D97A', } }, display: 'none' }} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />{/* <br /> */}
                        <Typography sx={{ pl: 1, textAlign: 'right', m: 1, display: 'none' }}>แผ่นที่ระวางภูมิประเทศ (UTMMAP2) </Typography>
                        <select id="input5" style={selectstylepoint2}>
                            <option value="">แผ่นที่ระวางภูมิประเทศ</option><option value="1">I</option><option value="2">II</option><option value="3">III</option><option value="4">IV</option>
                        </select>
                        {/* <br /> */}
                        <Typography sx={{ pl: 1, textAlign: 'right', m: 1, display: 'none' }}>ระวางUTM (UTMMAP3) </Typography><TextField id="input6" className="properties_input" size="small" sx={{ my: '1px', width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00D97A', } }, display: 'none' }} />{/* <br /> */}
                        <Typography sx={{ pl: 1, textAlign: 'right', m: 1, display: 'none' }}>แผ่นที่ระวาง UTM (UTMMAP4) </Typography><TextField id="input7" className="properties_input" size="small" sx={{ my: '1px', width: '200px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00D97A', } }, display: 'none' }} />{/* <br /> */}
                        <Typography sx={{ pl: 1, textAlign: 'right', m: 1, display: 'none' }}>มาตราส่วน </Typography><TextField id="input8" className="properties_input" size="small" sx={{ my: '1px', width: '120px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00D97A', } }, display: 'none' }} />
                        <Typography sx={{ pl: 1, textAlign: 'right', m: 1, display: 'none' }}>เลขที่ดิน </Typography><TextField id="input9" className="properties_input" size="small" sx={{ my: '1px', width: '120px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00D97A', } }, display: 'none' }} />{/* <br /> */}
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ไร่ <span style={{ color: 'red' }}>*</span> </Typography><TextField type="number" InputProps={{ inputProps: { min: 0 } }} id="input10" className="properties_input" size="small" sx={{ my: '1px', width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>งาน <span style={{ color: 'red' }}>*</span> </Typography><TextField type="number" InputProps={{ inputProps: { min: 0, max: 3 } }} id="input11" className="properties_input" size="small" sx={{ my: '1px', width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ตร.ว. <span style={{ color: 'red' }}>*</span> </Typography><TextField type="number" InputProps={{ inputProps: { min: 0.00, max: 99.99 } }} id="input12" className="properties_input" size="small" sx={{ my: '1px', width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ชื่อหน่วย <span style={{ color: 'red' }}>*</span> </Typography>
                        <select id="input13" style={selectstylepoint3} onChange={inp13OnChange}>
                            <option value="">ชื่อหน่วย</option>
                        </select><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ราคาประเมินหน่วยที่ดิน (บาท/ตร.ว.)  </Typography><TextField type={"text"} id="input_stval" className="properties_input" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9747FF', } } }} disabled /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ราคาหน่วยที่ดินนอกเหนือ (บาท/ตร.ว.)  </Typography><TextField type={"text"} id="input_stval1" className="properties_input" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9747FF', } } }} disabled /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ความลึกมาตรฐาน (ม.) </Typography><TextField type={"number"} id="input14" className="properties_input" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9747FF', } } }} disabled /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ความลึกแปลงที่ดิน (ม.) <span style={{ color: 'red' }}>*</span></Typography><TextField type={"number"} InputProps={{ inputProps: { min: 0 } }} id="input15" className="properties_input" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9747FF', } } }} /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ประเภทรูปแปลง <span style={{ color: 'red' }}>*</span> </Typography>
                        <select id="input16" style={selectstylepoint3}>
                            <option value="">ประเภทรูปแปลง</option>
                        </select><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ราคาประเมิน (บาท/ตร.ว.)  </Typography><TextField id="input17" className="properties_input" size="small" sx={{ my: '1px', width: '200px', backgroundColor: '#0FEB8A', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9747FF', } } }} disabled /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ราคาประเมินทั้งแปลง (บาท)  </Typography><TextField id="input18" className="properties_input" size="small" sx={{ my: '1px', width: '200px', backgroundColor: '#FC5A5A', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9747FF', } } }} disabled /><br />

                    </Grid><br /><br />
                    <Button id="savepoint" variant="contained" color='primary' sx={{ m: '1px' }} onClick={saveProperties}>บันทึก</Button>
                    <Button variant="contained" id="closebProperties" color='error' sx={{ m: '1px' }} onClick={closeProperties}>ยกเลิก</Button>
                </Grid>
                <Grid id="propertiescoord" style={{ position: 'absolute', top: 5, left: 5, lineHeight: '5px', width: "500px", maxHeight: '80vh', backgroundColor: 'white', textAlign: 'right', zIndex: '15' }} sx={{ p: 1, borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)", }} hidden>
                    <Button id="closexPropertiesc" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={closecoord}><CloseIcon color="white" /></Button>
                    <Box sx={{ textAlign: 'left', }} ><Typography sx={{ pl: 1, textAlign: 'left', display: 'inline-block', m: 1, }}><SortIcon color='error' />ระบุตำแหน่งที่ดิน</Typography></Box><br />
                    <Grid sx={{ overflowY: "scroll", maxHeight: '50vh' }}>
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>พิกัดตำแหน่ง <span style={{ color: 'red' }}>*</span> </Typography>
                        <select id="inputctype" style={selectstylepoint3} onChange={latLongOnChange}>
                            <option value="1">WGS 84 EPSG:4326 </option>
                            <option value="2">Indian 1975 / UTM zone {queryParameters.get("z")}N EPSG:240{queryParameters.get("z")}</option>
                        </select><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}><span id="xlat">Lat</span> <span style={{ color: 'red' }}>*</span></Typography><TextField id="inputlat" className="properties_input" size="small" sx={{ my: '1px', width: '300px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}><span id="ylong">Long</span> <span style={{ color: 'red' }}>*</span></Typography><TextField id="inputlong" className="properties_input" size="small" sx={{ my: '1px', width: '300px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1, color: 'red' }}><span style={{ color: 'red' }}>*</span>เมื่อกดตกลง กรุณา Click ที่หมุดตามตำแหน่ง </Typography>
                    </Grid><br /><br />
                    <Button variant="contained" id="savePropertiescoord" color='primary' sx={{ m: '1px' }} >ตกลง</Button>
                    <Button variant="contained" id="closebPropertiesc" color='error' sx={{ m: '1px' }} onClick={closecoord}>ยกเลิก</Button>
                </Grid>
                <Grid id="propertiespolygon" style={{ position: 'absolute', top: 5, left: 5, lineHeight: '5px', width: "500px", maxHeight: '80vh', backgroundColor: 'white', textAlign: 'right', zIndex: '15' }} sx={{ p: 1, borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)", }} hidden>
                    <Button size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={closePropertiesPolygon}><CloseIcon color="white" /></Button>
                    <Box sx={{ textAlign: 'left', }} ><Typography sx={{ pl: 1, textAlign: 'left', display: 'inline-block', m: 1, }}><SortIcon color='error' /><span id="hlabel">รายละเอียดแปลงที่ดิน</span></Typography></Box><br />
                    <Grid sx={{ overflowY: "scroll", maxHeight: '50vh' }}>
                        <input id="inpseq" hidden></input>
                        <Typography id="label1_1" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ประเภทเอกสาร </Typography>
                        <TextField id="input1_1" className="properties_inpu_polygont" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} disabled /><br />
                        <Typography id="label2_1" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>เลขที่   </Typography>
                        <TextField id="input2_1" className="properties_input_polygon" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} /><br />
                        <Typography id="label3_1" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1, color: 'gray', }}>อำเภอ <span style={{ color: 'red' }}>*</span></Typography>
                        <TextField id="input3_1" className="properties_input_polygon" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} disabled /><br />
                        <Typography id="label4_1" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>เทศบาล / ตำบล <span style={{ color: 'red' }}>*</span></Typography>
                        <select id="input4_1" style={selectstyle}>
                            <option>เลือกเทศบาล / ตำบล</option>
                        </select><br />
                        <Typography id="label5_1" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1, color: 'gray', }}>หน่วยที่ดิน </Typography>
                        <select id="input5_1" style={selectstyle} disabled>
                            <option>เลือกหน่วยที่ดิน</option>
                        </select><br />
                        <Typography id="label6_1" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1, color: 'gray', }}>ประเภทรูปแปลง </Typography>
                        <select id="input6_1" style={selectstyle} disabled>
                            <option>เลือกประเภทรูปแปลง</option>
                        </select><br /><br />
                        <Typography id="label10_1" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1, color: 'gray', }}>ความลึกมาตรฐาน (ม.) </Typography>
                        <TextField id="input10_1" className="properties_input_polygon" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} disabled /><br />
                        {/* <Typography id="label10_2" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1, color: 'gray', }}>ความลึกมาตรฐาน (ม.) <span style={{ color: 'red' }}>*</span></Typography>
                        <TextField id="input10_2" className="properties_input_polygon" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} /><br /> */}
                        <Typography id="label11_1" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1, color: 'gray', }}>ราคาหน่วยที่ดิน <span style={{ color: 'red' }}>*</span></Typography>
                        <TextField id="input11_1" className="properties_input_polygon" size="small" sx={{ my: '1px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#00AEEF', } } }} disabled /><br />
                        <Typography id="label7_1" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>เนื้อที่ ไร่  <span style={{ color: 'red' }}>*</span></Typography>
                        <TextField id="input7_1" className="properties_input_polygon" size="small" sx={{ my: '1px', width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} />
                        <Typography id="label8_1" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>งาน <span style={{ color: 'red' }}>*</span> </Typography>
                        <TextField id="input8_1" className="properties_input_polygon" size="small" sx={{ my: '1px', width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} />
                        <Typography id="label9_1" sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ตร.ว. <span style={{ color: 'red' }}>*</span> </Typography>
                        <TextField id="input9_1" className="properties_input_polygon" size="small" sx={{ my: '1px', width: '80px', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#FF8B02', } } }} /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ราคาประเมิน (บาท/ตร.ว.)  </Typography><TextField id="input12_1" className="properties_input" size="small" sx={{ my: '1px', width: '200px', backgroundColor: '#0FEB8A', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9747FF', } } }} disabled /><br />
                        <Typography sx={{ pl: 1, textAlign: 'right', display: 'inline-block', m: 1 }}>ราคาประเมินทั้งแปลง (บาท)  </Typography><TextField id="input13_1" className="properties_input" size="small" sx={{ my: '1px', width: '200px', backgroundColor: '#FC5A5A', '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#9747FF', } } }} disabled /><br />

                    </Grid><br /><br />
                    <Button id="savepolygon" variant="contained" color='primary' sx={{ m: '1px' }} onClick={savePropertiesPolygon}>บันทึก</Button>
                    <Button variant="contained" color='error' sx={{ m: '1px' }} onClick={closePropertiesPolygon}>ยกเลิก</Button>
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
                <Grid id="subMenuLayers" item style={menuStyle} sx={{ width: '300px', backgroundColor: 'white', position: 'absolute', bottom: 60, right: 60, display: 'flex', p: 1, borderRadius: '5px', boxShadow: "7px 7px 4px rgba(0, 0, 0, 0.25)" }}>
                    <Typography sx={{ pl: 1, textAlign: 'center' }}>
                        -แสดง/ซ่อนชั้นข้อมูล-
                    </Typography>
                    <Typography id="PARCELClick" sx={{ pl: 1, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)' }, cursor: 'pointer' }} >
                        <VisibilityIcon id="PARCEL1" fontSize='10px' style={{ color: '#4caf50' }} /><VisibilityOffIcon id="PARCEL2" fontSize='10px' style={{ color: 'red', display: 'none' }} /> รูปแปลง Polygon
                    </Typography>
                    <Typography id="PARCEL1Click" sx={{ pl: 5, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)' }, cursor: 'pointer' }} >
                        <VisibilityIcon id="PARCEL1_1" fontSize='10px' style={{ color: '#4caf50' }} /><VisibilityOffIcon id="PARCEL2_1" fontSize='10px' style={{ color: 'red', display: 'none' }} /> หน่วยที่ดิน
                    </Typography>
                    <Typography id="PARCEL2Click" sx={{ pl: 5, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)' }, cursor: 'pointer' }} >
                        <VisibilityIcon id="PARCEL1_2" fontSize='10px' style={{ color: '#4caf50', display: 'none' }} /><VisibilityOffIcon id="PARCEL2_2" fontSize='10px' style={{ color: 'red' }} /> รูปร่างแปลง
                    </Typography>
                    <Typography id="PARCEL3Click" sx={{ pl: 5, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)' }, cursor: 'pointer' }} >
                        <VisibilityIcon id="PARCEL1_3" fontSize='10px' style={{ color: '#4caf50', display: 'none' }} /><VisibilityOffIcon id="PARCEL2_3" fontSize='10px' style={{ color: 'red' }} /> ระยะความลึก
                    </Typography>
                    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <WbSunnyOutlinedIcon />
                        <Slider defaultValue={50} id="slide1" aria-label="Default" valueLabelDisplay="auto" />
                        <WbSunnyIcon />
                    </Stack>
                    <hr />
                    <Typography id="POINTClick" sx={{ pl: 1, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)' }, cursor: 'pointer' }} >
                        <VisibilityIcon id="POINT1" fontSize='10px' style={{ color: '#4caf50' }} /><VisibilityOffIcon id="POINT2" fontSize='10px' style={{ color: 'red', display: 'none' }} /> Point
                        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        </Stack>
                    </Typography>
                    <hr />
                    <Typography id="RELClick" sx={{ pl: 1, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)' }, cursor: 'pointer' }} >
                        <VisibilityIcon id="REL1" fontSize='10px' style={{ color: '#4caf50' }} /><VisibilityOffIcon id="REL2" fontSize='10px' style={{ color: 'red', display: 'none' }} /> เส้นความลึก
                        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        </Stack>
                    </Typography>
                    <hr />
                    <Typography id="ROADClick" sx={{ pl: 1, ':hover': { backgroundColor: 'rgba(0, 217, 122, 0.29)' }, cursor: 'pointer' }} >
                        <VisibilityIcon id="ROAD1" fontSize='10px' style={{ color: '#4caf50' }} /><VisibilityOffIcon id="ROAD2" fontSize='10px' style={{ color: 'red', display: 'none' }} /> ROAD
                    </Typography>
                    {/* <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                        <WbSunnyOutlinedIcon />
                        <Slider defaultValue={100} id="slide2" aria-label="Default" valueLabelDisplay="auto" />
                        <WbSunnyIcon />
                    </Stack>
                    <hr /> */}

                </Grid>
                <Grid id="alertnotumbol"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" style={{ position: 'fixed', top: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '50vw', height: '100vh', display: 'none' }}>
                    <Grid item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={closealertnotumbol}><CloseIcon color="white" /></Button>
                        </Grid><br />
                        <Grid sx={{ textAlign: 'center', mb: 5 }}>
                            <CrisisAlertIcon sx={{ fontSize: 100, color: '#FF8B02' }} /><br />
                            กรุณาระบุตำแหน่งในขอบเขตเท่านั้น
                        </Grid>

                    </Grid>
                </Grid>
                <Grid id="alertreqfield"
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center" style={{ position: 'fixed', top: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', width: '50vw', height: '100vh', display: 'none' }}>
                    <Grid item sx={{ width: '300px', height: '200px', borderRadius: '5px', backgroundColor: 'white', p: '8px' }}>
                        <Grid container alignItems="right" justifyContent="right">
                            <Button id="closexcal" size="small" variant="contained" color='error' sx={{ textAlign: 'right', m: '1px', minWidth: '10px !important', width: '12px', height: '20px' }} style={{ position: 'relative', top: 5, right: 5 }} onClick={closealertreqfield}><CloseIcon color="white" /></Button>
                        </Grid><br />
                        <Grid sx={{ textAlign: 'center', mb: 5 }}>
                            <CrisisAlertIcon sx={{ fontSize: 100, color: '#FF8B02' }} /><br />
                            กรุณากรอกข้อมูลให้ครบถ้วน
                        </Grid>

                    </Grid>
                </Grid>

            </div>
        </React.StrictMode >
    );
}
// }


