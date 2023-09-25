// react
import React, { useState, useEffect, useRef } from 'react';

// openlayers
import Map from 'ol/map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON'
import XYZ from 'ol/source/XYZ'
import { transform } from 'ol/proj'
import { toStringXY } from 'ol/coordinate';
import { OSM } from "ol/source";
import { Grid, Paper } from '@mui/material';
import Menus from '../Menus';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import { register } from 'ol/proj/proj4';
import { fromLonLat } from 'ol/proj';
import proj4 from 'proj4';
import { ScaleLine, defaults as defaultControls } from 'ol/control';
function MapWrapper(props) {
  proj4.defs("EPSG:24047", "+proj=utm +zone=47 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs");
  proj4.defs("EPSG:24048", "+proj=utm +zone=48 +a=6377276.345 +b=6356075.41314024 +towgs84=210,814,289,0,0,0,0 +units=m +no_defs");
  register(proj4);
  // set intial state
  const [map, setMap] = useState()
  const [featuresLayer, setFeaturesLayer] = useState()
  const [selectedCoord, setSelectedCoord] = useState()
  const [center, setCenter] = React.useState(props.center == undefined ? [100.523186, 13.736717] : props.center)
  var initialMap = '';
  const [selectedProvince, setSelectedProvince] = React.useState('');
  const [selectedDistrict, setSelectedDistrict] = React.useState('');
  const [selectedMunicipal, setSelectedMunicipal] = React.useState('');
  const [selectedTumbol, setSelectedTumbol] = React.useState('');
  var Provinceurl = "http://192.168.45.113:8080/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3APROVINCE_47&outputFormat=application%2Fjson&srsname=EPSG:4326&cql_filter=(PRO_C='00')"
  const childToParentmap = ({ selectedProvince, selectedDistrict, selectedTumbol }) => {
    console.log({ selectedProvince, selectedDistrict, selectedTumbol });
    setSelectedProvince(selectedProvince)
    setSelectedDistrict(selectedDistrict)
    setSelectedTumbol(selectedTumbol)
    if (selectedProvince != '') {
      if (selectedDistrict != '') {
        if (selectedTumbol != '') {
          Provinceurl = "http://192.168.45.113:8080/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3ATAMBOL_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:4326&cql_filter=(PRO_C='" + selectedProvince + "' AND DIS_C='" + selectedDistrict + "' AND SUB_C='" + selectedTumbol + "')"
           ProvinceLayer.current = new VectorLayer({
            // background: '#1a2b39',
            source: new VectorSource({
              url: Provinceurl,
              format: new GeoJSON(),
            }),
            style: new Style({
              fill: fill,
              stroke: stroke,
            }),
          });
        } else {
          Provinceurl = "http://192.168.45.113:8080/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3AAMPHOE_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:4326&cql_filter=(PRO_C='" + selectedProvince + "' AND DIS_C='" + selectedDistrict + "')"
           ProvinceLayer.current = new VectorLayer({
            // background: '#1a2b39',
            source: new VectorSource({
              url: Provinceurl,
              format: new GeoJSON(),
            }),
            style: new Style({
              fill: fill,
              stroke: stroke,
            }),
          });
        }

      } else {
        Provinceurl = "http://192.168.45.113:8080/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3APROVINCE_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:4326&cql_filter=(PRO_C='" + selectedProvince + "')"
         ProvinceLayer.current = new VectorLayer({
          // background: '#1a2b39',
          source: new VectorSource({
            url: Provinceurl,
            format: new GeoJSON(),
          }),
          style: new Style({
            fill: fill,
            stroke: stroke,
          }),
        });
      }
    }

    // console.log(ProvinceLayer);
    // initialMap.addLayer(ProvinceLayer)
    // setShowSearch(!showSearch);
  }

  // pull refs
  const mapElement = useRef()
  const ProvinceLayer = useRef()
  // create state ref that can be accessed in OpenLayers onclick callback function
  //  https://stackoverflow.com/a/60643670
  const mapRef = useRef()
  mapRef.current = map
  const fill = new Fill({
    color: 'rgba(29, 112, 208,0.2)',
  });
  const stroke = new Stroke({
    color: '#1d70d0',
    width: 3,
  });

  useEffect(() => {
    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:24047',
      // comment the following two lines to have the mouse position
      // be placed within the map.
      className: 'custom-mouse-position',
      // target: document.getElementById('mouse-position'),
    });
    const fill = new Fill({
      color: 'rgba(29, 112, 208,0.2)',
    });
    const stroke = new Stroke({
      color: '#1d70d0',
      width: 3,
    });
    const style = new Style({
      fill: new Fill({
        color: '#eeeeee',
      }),
    });

    // initialize map on first render - logic formerly put into componentDidMount
    // const initializeMapOn = async () => {
    // create and add vector source layer
    const initalFeaturesLayer = new VectorLayer({
      source: new VectorSource({
        url: Provinceurl,
        format: new GeoJSON(),
      }),
      style: new Style({
        fill: fill,
        stroke: stroke,
      }),
    })
    const raster = new TileLayer({
      source: new OSM(),
    });
    if (selectedProvince != '') {
      if (selectedDistrict != '') {
        if (selectedTumbol != '') {
          Provinceurl = "http://192.168.45.113:8080/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3ATAMBOL_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:4326&cql_filter=(PRO_C='" + selectedProvince + "' AND DIS_C='" + selectedDistrict + "' AND SUB_C='" + selectedTumbol + "')"
        } else {
          Provinceurl = "http://192.168.45.113:8080/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3AAMPHOE_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:4326&cql_filter=(PRO_C='" + selectedProvince + "' AND DIS_C='" + selectedDistrict + "')"
        }

      } else {
        Provinceurl = "http://192.168.45.113:8080/geoserver/TRD/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TRD%3APROVINCE_47&maxFeatures=1&outputFormat=application%2Fjson&srsname=EPSG:4326&cql_filter=(PRO_C='" + selectedProvince + "')"
        ProvinceLayer.current = new VectorLayer({
          // background: '#1a2b39',
          source: new VectorSource({
            url: Provinceurl,
            format: new GeoJSON(),
          }),
          style: new Style({
            fill: fill,
            stroke: stroke,
          }),
        });
        initialMap.addLayer(ProvinceLayer)
        console.log(ProvinceLayer);
      }
    }
    ProvinceLayer.current = new VectorLayer({
      // background: '#1a2b39',
      source: new VectorSource({
        url: Provinceurl,
        format: new GeoJSON(),
      }),
      style: new Style({
        fill: fill,
        stroke: stroke,
      }),
    });
    // create map
    initialMap = new Map({
      target: mapElement.current,
      layers: [

        // USGS Topo
        // new TileLayer({
        //   source: new XYZ({
        //     url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
        //   })
        // }),

        // Google Maps Terrain
        // new TileLayer({
        //   source: new XYZ({
        //     url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
        //   })
        // }),
        raster,
        // initalFeaturesLayer

      ],
      view: new View({
        projection: 'EPSG:3857',
        center: transform(center, 'EPSG:4326', 'EPSG:3857'),
        zoom: 11
      }),
      controls: defaultControls().extend([mousePositionControl, new ScaleLine({ bar: true, text: true, minWidth: 125 })])
    })
    initialMap.addLayer(initalFeaturesLayer);
    // // set map onclick handler
    // initialMap.on('click', handleMapClick)

    // // save map and vector layer references to state
    // if (map == undefined) {
    //   setMap(initialMap)
    //   try {

    //   } catch {
    //     null
    //   }
    // }
    // setMap(initialMap)
    // setFeaturesLayer(initalFeaturesLayer)
    // console.log(mapElement, 'mapElementmapElement');
    // }
    // useEffect(() => {
    //   initializeMapOn()
    // }, [])
    if (mapRef.current === true) {
      console.log('stop');
    }
    var s = document.getElementsByClassName("custom-mouse-position");
    var ss = document.getElementsByClassName("ol-scale-text");
    var t = document.getElementById("mouse-position");
    var tt = document.getElementById("scaleZoom");
    initialMap.on('pointermove', function (evt) {
      if (evt.dragging) {
        return;
      }
      // const pixel = initialMap.getEventPixel(evt.originalEvent);
      // highlightFeature(pixel);
      t.innerText = s[0].innerText
      tt.innerText = ss[0].innerText
      // console.log(s[0].innerHTML);
    });

    document.getElementById("mouse-position").innerHTML = "";
    // t.append(s);
    const precisionInput = document.getElementById('mouse-position');
    precisionInput.addEventListener('change', function (event) {
      const format = createStringXY(event.target.valueAsNumber);
      mousePositionControl.setCoordinateFormat(format);
    });

    initialMap.on('wheel', function (evt) {
      tt.innerText = ss[0].innerText
    });
    return () => {
      console.log(mapElement, 'mapElementmapElement');
      mapRef.current = true
    }

  }, [])

  // update map if features prop changes - logic formerly put into componentDidUpdate
  useEffect(() => {

    if (props.features.length) { // may be null on first render

      // set features to map
      featuresLayer.setSource(
        new VectorSource({
          features: props.features // make sure features is an array
        })
      )

      // fit map to feature extent (with 100px of padding)
      map.getView().fit(featuresLayer.getSource().getExtent(), {
        padding: [100, 100, 100, 100]
      })

    }

  }, [props.features])

  // map click handler
  const handleMapClick = (event) => {

    // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
    //  https://stackoverflow.com/a/60643670
    const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);

    // transform coord to EPSG 4326 standard Lat Long
    const transormedCoord = transform(clickedCoord, 'EPSG:3857', 'EPSG:4326')

    // set React state
    setSelectedCoord(transormedCoord)

  }

  // render component
  return (
    // <Paper>
    <React.StrictMode>
      <div style={{ position: "relative", display: 'flex', zIndex: 0 }}>
        <div ref={mapElement} style={{ height: `${props.height}`, width: "100%", position: "relative", position: "relative", overflow: "hidden" }} ></div>
        <div style={{ position: 'absolute', bottom: 5, right: 5, }}>
          <Grid sx={{ display: 'flex', borderRadius: 5, backgroundColor: '#FFFFFF', p: '2px', }}>
            <Grid sx={{ px: 1 }}>Coordinate </Grid><Grid sx={{ borderRadius: 5, backgroundColor: '#2F4266', px: 1, color: 'white', width: '250px', textAlign: 'center' }}><Grid id="mouse-position"></Grid> </Grid>
            <Grid sx={{ px: 1 }}>Scale </Grid><Grid sx={{ borderRadius: 5, backgroundColor: '#2F4266', px: 1, color: 'white', width: '100px', textAlign: 'center' }}><Grid id="scaleZoom"></Grid></Grid>
          </Grid>
        </div>
        {/* <SearchBtn/> */}
        <Menus childToParentmap={childToParentmap} />
      </div>
    </React.StrictMode >
    // </Paper>
  )

}

export default MapWrapper