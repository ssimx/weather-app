export default function createTempBarElement(_minTemp, _maxTemp) {
    const root = document.querySelector(':root');
    const vars = getComputedStyle(root);

    const slider = document.createElement('div');
    slider.classList.add('js-temp-bar');
    const progress = document.createElement('div');
    progress.classList.add('js-bar');

    let minTemp;
    let maxTemp;
    if (_minTemp >= 29) {
        minTemp = 29;
        maxTemp = 40;
        progress.style.background = `linear-gradient(90deg, ${vars.getPropertyValue('--90-perc')}, ${vars.getPropertyValue('--100-perc')}`;
    } else if (_minTemp >= 21) {
        minTemp = 21;
        if (_maxTemp > 33) {
            maxTemp = 39;
            progress.style.background = `linear-gradient(90deg, ${vars.getPropertyValue('--70-perc')}, ${vars.getPropertyValue('--80-perc')}, ${vars.getPropertyValue('--90-perc')}, ${vars.getPropertyValue('--100-perc')}`;
        } else {
            maxTemp = 33;
            progress.style.background = `linear-gradient(90deg, ${vars.getPropertyValue('--70-perc')}, ${vars.getPropertyValue('--80-perc')}, ${vars.getPropertyValue('--90-perc')}`;
        }
    } else if (_minTemp >= 10) {
        minTemp = 10;
        if (_maxTemp > 28) {
            maxTemp = 32;
            progress.style.background = `linear-gradient(90deg, ${vars.getPropertyValue('--50-perc')}, ${vars.getPropertyValue('--60-perc')}, ${vars.getPropertyValue('--70-perc')}, ${vars.getPropertyValue('--80-perc')}, ${vars.getPropertyValue('--90-perc')}`;
        } else {
            maxTemp = 28;
            progress.style.background = `linear-gradient(90deg, ${vars.getPropertyValue('--50-perc')}, ${vars.getPropertyValue('--60-perc')}, ${vars.getPropertyValue('--70-perc')}, ${vars.getPropertyValue('--80-perc')}`;
        }
    } else if (_minTemp <= 9) {
        minTemp = 0;
        if (_maxTemp > 15) {
            maxTemp = 27;
            progress.style.background = `linear-gradient(90deg, ${vars.getPropertyValue('--20-perc')}, ${vars.getPropertyValue('--30-perc')}, ${vars.getPropertyValue('--40-perc')}, ${vars.getPropertyValue('--50-perc')}, ${vars.getPropertyValue('--60-perc')}`;
        } else {
            maxTemp = 15;
            progress.style.background = `linear-gradient(90deg, ${vars.getPropertyValue('--20-perc')}, ${vars.getPropertyValue('--30-perc')}, ${vars.getPropertyValue('--40-perc')}, ${vars.getPropertyValue('--50-perc')}`;
        }
    } else if (_minTemp <= -1) {
        minTemp = -15;
        if (_maxTemp > 0) {
            maxTemp = 0;
            progress.style.background = `linear-gradient(90deg, ${vars.getPropertyValue('--0-perc')}, ${vars.getPropertyValue('--10-perc')}, ${vars.getPropertyValue('--20-perc')}, ${vars.getPropertyValue('--30-perc')}`;
        } else {
            maxTemp = -5;
            progress.style.background = `linear-gradient(90deg, ${vars.getPropertyValue('--0-perc')}, ${vars.getPropertyValue('--10-perc')}, ${vars.getPropertyValue('--20-perc')}`;
        }
    }

    const calculateLeftPercent = _minTemp <= minTemp
        ? 0
        : Math.round(((_minTemp - minTemp) * 100) / (maxTemp - minTemp));
    const calculateRightPercent = _maxTemp >= maxTemp
        ? 0
        : Math.round(100 - ((_maxTemp - minTemp) * 100) / (maxTemp - minTemp));

    progress.style.left = `${calculateLeftPercent}%`;
    progress.style.right = `${calculateRightPercent}%`;

    slider.append(progress);
    return slider;
}
