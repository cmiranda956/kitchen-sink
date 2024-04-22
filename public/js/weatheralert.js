const APIROOT= 'http://api.weather.gov/';
const TEXASID = 'TX';

let arrCities = [];
let texasAlerts;

function getWeatherAlerts() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', APIROOT + 'alerts/active/area/' + TEXASID);
    // xhr.setRequestHeader('User-Agent', '(TyphonNWSAlertApp, cm7152@nationalemr.us)');
    xhr.send();
    xhr.addEventListener('load', () => {
        texasAlerts = JSON.parse(xhr.responseText);
        main();
    });
}

// Required:    elementType (string)
// Optional:    text        (string)
//              intro       (string)
//              attribute   (object {string, string})
function generateElement(params) {
    let element = document.createElement(params.elementType);
    element.innerHTML = params.intro ? '<b>' + params.intro + '</b> ' + params.text : params.text;
    if(params.setAttributes) {
        for(const [attribute, value] of Object.entries(params.setAttributes)) {
            element.setAttribute(attribute, value)
        }
    }
    return element;
}

function uniqueArrayValues(value, index, array) {
    return array.indexOf(value) === index;
}

function buildArrayCities(cities) {
    cities.split(';').forEach(element => {
        arrCities.push(element.trim());
    });
}

function handleFilterChange() {
    let value = document.getElementById('cityList').value;
    let arrAreasAffected = document.getElementsByClassName('areasAffected');
    console.log('Filter changed to: ' + value);
    for(let i = 0; i < arrAreasAffected.Length; i++) {
        arrAreasAffected[i].parentElement.style.display = '';
    }

    if(!(value == 'Default')) {
        console.log('Value is not set to "Default"');
        for(let i = 0; i < arrAreasAffected.Length; i++) {
            if(arrAreasAffected[i].innerText.includes(value)) {
                arrAreasAffected[i].parentElement.style.display = 'none';
            }
        }
    }
    return
}

function buildCityFilterList() {
    let cityList = document.getElementById('cityList');
    arrCities = arrCities.filter(uniqueArrayValues);
    arrCities.sort().forEach(city => {
        cityList.appendChild(generateElement({
            elementType: 'option',
            text: city
        }));
    });
    cityList.addEventListener('change', () => {
        handleFilterChange();
    });
}

function populateData() {
    let data = texasAlerts.features;
    let container = generateElement({
        elementType: 'div',
        text: '',
        setAttributes: {
            id: 'container'
        }
    });
    for(let i = 0; i < data.length; i++) {
        let cities = data[i].properties.areaDesc;
        let wrapper = generateElement({
            elementType: 'div',
            text: '',
            setAttributes: {
                id: `wrapper${i}`
            }     
        });
        let headline = generateElement({
            elementType: 'h2',
            text: data[i].properties.headline,
            setAttributes: {
                'class': 'headline'
            }
        });
        let divAreasAffected = generateElement({
            elementType: 'div',
            text: cities,
            intro: 'Areas affected: ',
            setAttributes: {
                'class': 'areasAffected'
            }
        });
        let divDescription = generateElement({
            elementType: 'div',
            text: data[i].properties.description,
            intro: 'Description: ',
            setAttributes: {
                'class': 'description'
            }
        });
        let divDuration = generateElement({
            elementType: 'div',
            text: data[i].properties.effecting + ' ' + data[i].properties.expires,
            intro: 'Duration: ',
            setAttributes: {
                'class': 'duration'
            }
        });

        // cities is currently a string of cities/counties ';' delimited.
        buildArrayCities(cities);
        wrapper.appendChild(headline);
        wrapper.appendChild(divAreasAffected);
        wrapper.appendChild(divDescription);
        wrapper.appendChild(divDuration);
        container.appendChild(wrapper);
        document.getElementById('body').appendChild(container);
    }
}

function main() {
    populateData();
    buildCityFilterList();
    console.log(texasAlerts.features);
    console.log(arrCities);
}

getWeatherAlerts();
