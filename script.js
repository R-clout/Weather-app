const dropdown = document.querySelector('.dropdown');
const dropdownMenu = document.querySelector('.dropdown-menu');
const daysDropdown = document.querySelector('.days-dropdown');
const dropdownIcon = document.querySelector('.dropdown-icon');
const daysdropdownMenu = document.querySelector('.days-dropdown-menu');
const daysdropdownIcon = document.querySelector('.days-dropdown-icon');
const searchInput = document.querySelector('#search-bar');
const searchButton = document.querySelector('#search-btn');
const searchResultContainer = document.querySelector('.search-results-container');
const pFeelsLike = document.querySelector('#pFeelLike');
const pHumidity = document.querySelector('#pHumidity');
const pWind = document.querySelector('#pWind');
const loadingSpinner = document.querySelector('.loading-spinner');
const dvCityCountry = document.querySelector('#dvCityCountry');
const dvCurrDate = document.querySelector('#dvCurrDate');
const dvCurrTemp = document.querySelector('#dvCurrTemp');
const pPrecipitation = document.querySelector('#pPrecipitation');
const forecastWeather = document.querySelector('.forecast-container');
const radioButtons = document.querySelectorAll('input[name="hourly-forecast"]');


const searchArray = [];

let cityName, countryName;

// this is format for the weather code
function getIconName(code) {
    if (code === 0) return "sunny";

    if (code === 1 || code === 2) return "partly-cloudy";
    
    if (code === 3) return "overcast";
    
    if (code === 45 || code === 48) return "fog";
    
    if (code >= 51 && code <= 57) return "drizzle";
  
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
    
    if ((code >= 71 && code <= 77) || (code === 85 || code === 86)) return "snow";

    if (code >= 95) return "storm";

    return "partly-cloudy";
}

// configuring the settings of this.
const setting = {
  temperature: document.querySelector('input[name="temperature"]:checked')?.value,
  windSpeed: document.querySelector('input[name="windSpeed"]:checked')?.value,
  precipitation: document.querySelector('input[name="precipitation"]:checked')?.value
};

// looping through the array and changing the settings from on here
// i really need to figure out how to make it simpler for many settings data change but this is all i, sorry claude but i didnt just copy and paste lol, but i did my research could come up with for now.
["temperature", "windSpeed", "precipitation"].forEach(group => {
  document.querySelectorAll(`input[name="${group}"]`).forEach(radio => {
    console.log(radio.name)
    radio.addEventListener('change', (e) => {
      setting[e.target.name] = e.target.value;
      console.log(setting);
    })
  })
})

// this is a function for getting the latitude and longitude of a particular location and this is going to be infused into the search input box
async function getGeoCodeData() {
    let search = "New York";
  const url = `https://nominatim.openstreetmap.org/search?q=${search}&format=jsonv2&addressdetails=1`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    searchArray.push(...result);
    console.log(searchArray);
    let lat = result[0].lat;
    let lon = result[0].lon;

    loadLocationData(result);
    getWeatherData(lat, lon);
  } catch (error) {
    console.error(error);
  }
}

// this is for loading the innetHTMl of the location data;
function loadLocationData(locationData){
  let location = locationData[0].address;
  cityName = location.city;
  countryName = location.country_code.toUpperCase();

  let dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  };

  let date = new Intl.DateTimeFormat("en-US", dateOptions).format(new Date());

  console.log(date);
  console.log(cityName, countryName);

  dvCityCountry.textContent = `${cityName}, ${countryName}`;
  dvCurrDate.textContent = date;
  
}

// this is a function to get the weather data;
async function getWeatherData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature,precipitation&wind_speed_unit=${setting.windSpeed}&temperature_unit=${setting.temperature}&precipitation_unit=${setting.precipitation}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    loadWeatherData(result);
  } catch (error) {
    console.error(error.message);
  }
}



// this function works to populate the weather data.
function loadWeatherData(weather){
  dvCurrTemp.innerHTML = `${Math.round(weather.current.temperature_2m)}${weather.current_units.temperature_2m}`;

  pFeelsLike.textContent = `${Math.round(weather.current.apparent_temperature)} ${weather.current_units.apparent_temperature}`;

  pHumidity.textContent = `${Math.round(weather.current.
relative_humidity_2m)} ${weather.current_units.relative_humidity_2m}`;

pWind.textContent = `${weather.current.wind_speed_10m
}${weather.current_units.wind_speed_10m}`;

pPrecipitation.textContent = `${weather.current.precipitation} ${weather.current_units.precipitation}`;

const containerHTML = weather.daily.time.map((date, i) => {
  const formattedDate = new Date(date).toLocaleDateString([], {
    weekday: 'short',
  })
  const code = weather.daily.weather_code[i];
  const icon = getIconName(code);
  return `
    <div class="bg-neutral800 border border-neutral600 rounded-xl flex flex-col items-center p-4">
      <p class="text-preset8">${formattedDate}</p>
      <img src="./assets/images/icon-${icon}.webp" alt="rain-icon" loading="lazy" />
      <div class="text-preset7 flex justify-between w-full">
        <p class="">${Math.round(weather.daily.temperature_2m_max[i])}&deg</p>
        <p>${Math.round(weather.daily.temperature_2m_min[i])}&deg</p>
      </div>
    </div>
  `
}).join('');

// this is for the day-dropdown
radioButtons.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (e.target.checked) {
      //  replace the innerHTML of the display
      document.querySelector("#hourly__forecast-day").textContent = e.target.value;
       // 1. Close your dropdown here
       daysdropdownMenu.classList.add('opacity-0');
        daysdropdownMenu.classList.add('-translate-y-2');
        daysdropdownIcon.classList.remove('rotate-180');


        // using the function, we can grab the whole thing
        
    }
  });
});

forecastWeather.innerHTML = containerHTML;
}


// a function for closing and opening the dropdown menu
function itemsDropdown(){
    // this is just to make the dropdown menu visibles
    dropdownMenu.classList.toggle('opacity-0');
    dropdownMenu.classList.toggle('-translate-y-2');
    dropdownIcon.classList.toggle('rotate-180');
}

// this is to close the dropdown when its clicked outside of it.
function closeitemsDropdown(e){
    if(!dropdown.contains(e.target) && !dropdownMenu.contains(e.target)){
        dropdownMenu.classList.add('opacity-0');
        dropdownMenu.classList.add('-translate-y-2');
        dropdownIcon.classList.remove('rotate-180');
    };

    //close the day-drop if statement because why not.
    if(!daysDropdown.contains(e.target) && !daysdropdownMenu.contains(e.target)){
        daysdropdownMenu.classList.add('opacity-0');
        daysdropdownMenu.classList.add('-translate-y-2');
        daysdropdownIcon.classList.remove('rotate-180');
    };
}

// this is a function for the days-dropdown element, this is just a temporary solution for this.
function toggleDayDropdown(){
    daysdropdownMenu.classList.toggle('opacity-0');
    daysdropdownMenu.classList.toggle('-translate-y-2');
    daysdropdownIcon.classList.toggle('rotate-180');
}

getGeoCodeData();

document.addEventListener('click', closeitemsDropdown);
dropdown.addEventListener('click', itemsDropdown);
daysDropdown.addEventListener('click', toggleDayDropdown);
searchInput.addEventListener('keyup', getGeoCodeData);