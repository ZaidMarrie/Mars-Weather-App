const toggleBtn = document.querySelector('.show-previous-weather');
const prevWeather = document.querySelector('.previous-weather');

const API_KEY = `hcD3w2Z2YDLIlFV5wlRBVh6Qz6BIpD1voW6RZJK5`
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`

toggleBtn.addEventListener('click', () => {
    prevWeather.classList.toggle('show-weather');
})

const currentSolEl = document.querySelector('[data-current-sol]');
const currentSolDateEl = document.querySelector('[data-current-date]');
const currentTempHighEl = document.querySelector('[data-current-temp-high]');
const currentTempLowEl = document.querySelector('[data-current-temp-low]');
const windSpeedEl = document.querySelector('[data-wind-speed]');
const windDirectionText = document.querySelector('[data-wind-direction-text]');
const windDirectionArrow = document.querySelector('[data-wind-direction-arrow]');

const metricRadio = document.getElementById('celsius');
const imperialRadio = document.getElementById('fahrenheit');
const unitToggle = document.querySelector('[data-unit-toggle]');

let selectedSolIndex;
async function getWeather() {
    const res = await fetch(API_URL);
    const data = await res.json();
    const { sol_keys, validity_checks, ...solData } = data;
    const temp = Object.entries(solData).map(([sol, data]) => {
        return {
            sol: sol,
            maxTemp: data.AT.mx,
            minTemp: data.AT.mn,
            windSpeed: data.HWS.av,
            windDirection: data.WD.most_common.compass_degrees,
            windDirectionCardinal: data.WD.most_common.compass_point,
            date: new Date(data.First_UTC)
        }
    })
    return temp
}

getWeather().then(sols => {
    selectedSolIndex = sols.length - 1;
    displaySelectedSol(sols);
    displayPreviousSols(sols);
    updateUnits();

    unitToggle.addEventListener('click', () => {
        let metricUnits = !isMetric();
        metricRadio.checked = metricUnits;
        imperialRadio.checked = !metricUnits;
        updateUnits();
        displaySelectedSol(sols);
        displayPreviousSols(sols);
    });

    metricRadio.addEventListener('change', () => {
        updateUnits();
        displaySelectedSol(sols);
        displayPreviousSols(sols);
    });

    imperialRadio.addEventListener('change', () => {
        updateUnits();
        displaySelectedSol(sols);
        displayPreviousSols(sols);
    });
});

function displaySelectedSol(solsArr) {
    const selectedSol = solsArr[selectedSolIndex]
    currentSolEl.textContent = selectedSol.sol
    currentSolDateEl.textContent = displayDate(selectedSol.date);
    currentTempHighEl.textContent = displayTemp(selectedSol.maxTemp);
    currentTempLowEl.textContent = displayTemp(selectedSol.minTemp);
    windSpeedEl.textContent = displaySpeed(selectedSol.windSpeed);
    windDirectionArrow.style.setProperty('--direction', `${Math.round(selectedSol.windDirection)}deg`);
    windDirectionText.textContent = selectedSol.windDirectionCardinal; 

    console.log(selectedSol)
}

function displayDate(date) {
    return date.toLocaleDateString(
        undefined,
        { day: 'numeric', month: 'long' }
    );
}

function displayTemp(temperature) {
    let returnTemp = temperature;
    if(!isMetric()) {
        returnTemp = (temperature - 32) * (5 / 9);
        console.log(!isMetric());
    }
    return Math.round(returnTemp);
}

function displaySpeed(speed) {
    let returnSpeed = speed;
    if(!isMetric()) {
        returnSpeed = speed / 1.609;
    }
    return Math.round(returnSpeed);
}

const prevSolTemplate = document.querySelector('[data-previous-sol-template]');
const prevSolContainer = document.querySelector('[data-previous-sols]');
function displayPreviousSols(sols) {
    prevSolContainer.innerHTML = '';
    sols.forEach((solData, i) => {
        const solContainer = prevSolTemplate.content.cloneNode(true);
        solContainer.querySelector('[data-sol]').textContent = solData.sol;
        solContainer.querySelector('[data-date]').textContent = displayDate(solData.date);
        solContainer.querySelector('[data-temp-high]').textContent = displayTemp(solData.maxTemp);
        solContainer.querySelector('[data-temp-low]').textContent = displayTemp(solData.minTemp);
        solContainer.querySelector('[data-select-button]').addEventListener('click', () => {
            selectedSolIndex = i;
            displaySelectedSol(sols);
        })
        prevSolContainer.appendChild(solContainer);
    });
}


function updateUnits() {
    const speedUnits = document.querySelector('[data-speed-unit]');
    const tempUnits = document.querySelectorAll('[data-temp-unit]');

    speedUnits.textContent = isMetric() ? 'kph' : 'mph';

    tempUnits.forEach(unit => {
        unit.textContent = isMetric() ? 'C' : 'F';
    });
}

function isMetric() {
    return metricRadio.checked;
}