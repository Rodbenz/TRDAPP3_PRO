import Draw from 'ol/interaction/Draw.js';
import Map from 'ol/Map.js';
import Overlay from 'ol/Overlay.js';
import View from 'ol/View.js';
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from 'ol/style.js';
import { LineString, Point, Polygon } from 'ol/geom.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { getArea, getLength } from 'ol/sphere.js';
import { unByKey } from 'ol/Observable.js';

/**
 * Currently drawn feature.
 * @type {import("../src/ol/Feature.js").default}
 */

let draw; // global so we can remove it later
let sketch;

/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
let helpTooltipElement;

/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
let helpTooltip;

/**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
let measureTooltipElement;

/**
 * Overlay to show the measurement.
 * @type {Overlay}
 */
let measureTooltip;
let funcPointerMove;
/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
const continuePolygonMsg = 'Click to continue drawing the polygon';

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
const continueLineMsg = 'Click to continue drawing the line';

/**
 * Handle pointer move.
 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
 */

const source = new VectorSource();

const measureLayer = new VectorLayer({
    source: source,
    style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
    },
});
measureLayer.set("name", "MEASURE");


export function drawMeasure(map) {
    map.addLayer(measureLayer);
    const view = map.getView();
    const layers = map.getLayers().getArray();
    const vectorLayer = layers.find(
        (layer) => layer.get("name") === "MEASURE"
    );
    const source = vectorLayer.getSource();

    clearMeasureLayout(map, vectorLayer);

    console.log(vectorLayer, 'source');
    const pointerMoveHandler = function (evt) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        let helpMsg = 'Click to start drawing';

        if (sketch) {
            const geom = sketch.getGeometry();
            if (geom instanceof Polygon) {
                helpMsg = continuePolygonMsg;
            } else if (geom instanceof LineString) {
                helpMsg = continueLineMsg;
            }
        }

        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        helpTooltipElement.classList.remove('hidden');
    };

    funcPointerMove = pointerMoveHandler;
    map.on('pointermove', pointerMoveHandler);

    map.getViewport().addEventListener('mouseout', function () {
        helpTooltipElement.classList.add('hidden');
    });

    const typeSelect = document.getElementById('type');

    /**
     * Format length output.
     * @param {LineString} line The line.
     * @return {string} The formatted length.
     */

    const calLength = function (line) {
        const length = getLength(line);
        let output;
        // if (length > 100) {
        //   output = Math.round((length / 1000) * 100) / 100 + " " + "km";
        // } else {
        output = Math.round(length * 100) / 100;
        // }
        return output;
    };

    const formatLength = function (line) {
        let output;
        output = calLength(line) + " m";
        return output;
    };

    /**
     * Format area output.
     * @param {Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
    const formatArea = function (polygon) {
        const area = getArea(polygon);
        let output;
        if (area > 10000) {
            output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
        } else {
            output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
        }
        return output;
    };

    function addInteraction() {
        const type = 'LineString';
        draw = new Draw({
            source: source,
            type: type,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.5)',
                    lineDash: [10, 10],
                    width: 2,
                }),
                image: new CircleStyle({
                    radius: 5,
                    stroke: new Stroke({
                        color: 'rgba(0, 0, 0, 0.7)',
                    }),
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.2)',
                    }),
                }),
            }),
        });
        map.addInteraction(draw);

        createMeasureTooltip();
        createHelpTooltip();

        let listener;
        let distance = 0;
        draw.on('drawstart', function (evt) {
            // set sketch
            sketch = evt.feature;

            /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
            let tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function (evt) {
                const geom = evt.target;
                let output;
                if (geom instanceof Polygon) {
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof LineString) {
                    distance = calLength(geom);
                    output = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        });

        draw.on('drawend', function () {
            measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureTooltipElement = null;
            createMeasureTooltip();
            unByKey(listener);
        });
    }

    /**
     * Creates a new help tooltip
     */
    function createHelpTooltip() {
        if (helpTooltipElement) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'ol-tooltip hidden';
        helpTooltip = new Overlay({
            className: "ol-overlay-measure",
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });
        map.addOverlay(helpTooltip);
    }

    /**
     * Creates a new measure tooltip
     */
    function createMeasureTooltip() {
        if (measureTooltipElement) {
            measureTooltipElement.parentNode.removeChild(measureTooltipElement);
        }
        measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
        measureTooltip = new Overlay({
            className: "ol-overlay-measure",
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false,
            insertFirst: false,
        });
        map.addOverlay(measureTooltip);
    }

    /**
     * Let user change the geometry type.
     */
    // typeSelect.onchange = function () {
    //     map.removeInteraction(draw);
    //     addInteraction();
    // };

    addInteraction();
}

const clearMeasureLayout = (map, vectorLayer) => {
    const source = vectorLayer.getSource();
    source.clear();

    const measureOverlays = map
        .getOverlays()
        .getArray()
        .filter((o) => o.getOptions().className === "ol-overlay-measure");
    measureOverlays.forEach((o) => map.removeOverlay(o));
};

export const removeMeasure = (map) => {
    const view = map.getView();
    const layers = map.getLayers().getArray();
    const vectorLayer = layers.find(
        (layer) => layer.get("name") === "MEASURE"
    );
    clearMeasureLayout(map, vectorLayer);
    if (draw) {
        map.removeInteraction(draw);
    }
    if (funcPointerMove) {
        map.un("pointermove", funcPointerMove);
    }
    map.removeLayer(measureLayer);

};

var styleSelect = new Style({
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.5)' // Red fill color with 50% opacity
    }),
    stroke: new Stroke({
      color: 'blue', // Blue stroke color
      width: 3, // Stroke width of 2 pixels
      zIndex:0
    })
  });
export function zoomMap(map, evt, queryParameters, vectorSourceImpPolygon, vectorpoint,) {
    var clickedFeature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });

    if (clickedFeature) {
        var featureId = clickedFeature.get('PARCEL_S3_SEQ');
        var layer;
        var num = 0;
        if (clickedFeature.getGeometry() instanceof Point) {
            layer = vectorSourceImpPolygon;
            num = 2;
        } else {
            layer = vectorSourceImpPolygon;
            num = 1;
        }
        console.log(layer, 'featurez',num);
        if (layer) {
            var source = layer
            var featurez = source.getFeatureById('PARCEL_S3_' + queryParameters.get("z") + '.' + featureId);
            console.log(featurez, 'featurez', 'PARCEL_S3_' + queryParameters.get("z") + '.' + featureId);
            if (featurez) {
                console.log(featurez, 'featurez');
                var extent = featurez.getGeometry().getExtent();
                map.getView().fit(extent, {
                    duration: 1000
                });
            }
            if(num == 1){
                // featurez.setStyle(styleSelect);
            }
        }
    }
}

