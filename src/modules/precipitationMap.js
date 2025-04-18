// eslint-disable-next-line import/no-extraneous-dependencies
import '@maptiler/sdk/dist/maptiler-sdk.css';
import '../styles/precipitation-map-style.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as maptilersdk from '@maptiler/sdk';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import { PrecipitationLayer } from '@maptiler/weather';

export default function renderPrecipitationMap(locationData) {
    maptilersdk.config.apiKey = process.env.MAPTILER_API_KEY;

    const map = new maptilersdk.Map({
        container: 'map', // container's id or the HTML element to render the map
        style: '4ec33188-7fc3-45eb-96a1-914ded5e32c9', // stylesheet location
        zoom: 5,
        center: [locationData.location.longitude, locationData.location.latitude],
        navigationControl: false,
    });

    const weatherLayer = new PrecipitationLayer();

    map.on('load', () => {
        map.setPaintProperty('Water', 'fill-color', 'rgba(0, 0, 0, 0.4)');
        map.addLayer(weatherLayer, 'Water');
        weatherLayer.animateByFactor(3600);
    });
}
