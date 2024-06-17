// eslint-disable-next-line import/no-extraneous-dependencies
import Gauge from 'svg-gauge';

// Create a new Gauge
export default function pressureGauge(value) {
    Gauge(document.getElementById('gauge3'), {
        min: 975,
        max: 1050,
        label(_value) {
            return `${Math.round(_value)}`;
        },
        value,
        viewBox: '0 0 100 100',
    });
}
