const APIROOT= 'http://api.weather.gov/';
const TEXASID = 'TX';

let CONTAINER = document.getElementById('container'); 
let arrCities = [];
let texasAlerts;


// Received an object with the below parameters and parses them
// to create an element of desired type.
// Required:    
//              elementType (string)
//              text        (string)
//                  - pass an empty string if none is required for element at creation time.
// Optional:    
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

// Used in conjunction with Array.prototype.filter() method to create an
// array of unique values.
function uniqueArrayValues(value, index, array) {
    return array.indexOf(value) === index;
}

function handleFilterChange() {
    let value = document.getElementById('cityList').value;
    let totalAlerts = CONTAINER.childElementCount;
    for(let i = 0; i < totalAlerts; i++) {
        let wrapper = document.getElementById(`wrapper${i}`);
        wrapper.style.display = '';
    }

    if(!(value == 'Default')) {
        for(let i = 0; i < totalAlerts; i++) {
            let wrapper = document.getElementById(`wrapper${i}`);
            if(!(wrapper.children[1].innerText.includes(value))) {
                wrapper.style.display = 'none';
            }
        }
    }
}

function buildArrayCities(cities) {
    cities.split(';').forEach(element => {
        arrCities.push(element.trim());
    });
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

        buildArrayCities(cities);
        wrapper.appendChild(headline);
        wrapper.appendChild(divAreasAffected);
        wrapper.appendChild(divDescription);
        wrapper.appendChild(divDuration);
        CONTAINER.appendChild(wrapper);
    }
    buildCityFilterList();
}

function getWeatherAlerts() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', APIROOT + 'alerts/active/area/' + TEXASID);
    // xhr.setRequestHeader('User-Agent', '(TyphonNWSAlertApp, cm7152@nationalemr.us)');
    xhr.send();
    xhr.addEventListener('load', () => {
        texasAlerts = JSON.parse(xhr.responseText);
        populateData();
    });
}
function cleanup() {
    if(CONTAINER.childElementCount == 0) {
        return;
    }
    let count = CONTAINER.childElementCount;
    for(let i = 0; i < count; i++) {
        CONTAINER.children[i].remove();
    }
}

function main() {
    console.log('Main called');
    cleanup();
    getWeatherAlerts();
}

setInterval(main, 5000);
