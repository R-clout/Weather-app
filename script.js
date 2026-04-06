const dropdown = document.querySelector(".dropdown");
const dropdownMenu = document.querySelector(".dropdown-menu");
const daysDropdown = document.querySelector(".days-dropdown");
const dropdownIcon = document.querySelector(".dropdown-icon");
const daysdropdownMenu = document.querySelector(".days-dropdown-menu");
const daysdropdownIcon = document.querySelector(".days-dropdown-icon");
const searchInput = document.querySelector("#search-bar");
const searchButton = document.querySelector("#search-btn");
const searchResultContainer = document.querySelector(
  ".search-results-container",
);
const pFeelsLike = document.querySelector("#pFeelLike");
const pHumidity = document.querySelector("#pHumidity");
const pWind = document.querySelector("#pWind");
const loadingSpinner = document.querySelector(".loading-spinner");
const dvCityCountry = document.querySelector("#dvCityCountry");
const dvCurrDate = document.querySelector("#dvCurrDate");
const dvCurrTemp = document.querySelector("#dvCurrTemp");
const pPrecipitation = document.querySelector("#pPrecipitation");
const forecastWeather = document.querySelector(".forecast-container");
const weathercontainer = document.querySelector(".weather-temp-and-image");
const wrongDisplay = document.querySelector(".wrong-display");
const radioButtons = document.querySelectorAll('input[name="hourly-forecast"]');
const weatherImage = document.querySelector(".weather-image");
const countryStateandDate = document.querySelector(".country-state-and-date");
const climateElement = document.querySelector("#climate__element");
const loaders = document.querySelectorAll(".loader");

let searchArray = [];
let lat, lon;
let wasOpen = false;
let cityName, countryName;
let dateOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  weekday: "long",
};

let date = new Intl.DateTimeFormat("en-US", dateOptions).format(new Date());

// this is format for the weather code
function getIconName(code) {
  if (code === 0) return "sunny";

  if (code === 1 || code === 2) return "partly-cloudy";

  if (code === 3) return "overcast";

  if (code === 45 || code === 48) return "fog";

  if (code >= 51 && code <= 57) return "drizzle";

  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";

  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";

  if (code >= 95) return "storm";

  return "partly-cloudy";
}

// configuring the settings of this.
const setting = {
  temperature: document.querySelector('input[name="temperature"]:checked')
    ?.value,
  windSpeed: document.querySelector('input[name="windSpeed"]:checked')?.value,
  precipitation: document.querySelector('input[name="precipitation"]:checked')
    ?.value,
};

// looping through the array and changing the settings from on here
// i really need to figure out how to make it simpler for many settings data change but this is all i, sorry claude but i didnt just copy and paste lol, but i did my research could come up with for now.
["temperature", "windSpeed", "precipitation"].forEach((group) => {
  document.querySelectorAll(`input[name="${group}"]`).forEach((radio) => {
    console.log(radio.name);
    radio.addEventListener("change", (e) => {
      setting[e.target.name] = e.target.value;
    });
  });
});

// this is a function for getting the latitude and longitude of a particular location and this is going to be infused into the search input box
async function getGeoCodeData() {
  let search = encodeURIComponent(searchInput.value.trim());
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${search}&format=jsonv2&addressdetails=1`;
  const isLocal =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost";
  const url = isLocal ? `https://corsproxy.io/?${nominatimUrl}` : nominatimUrl;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "MyWeatherApp/1.0",
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);

    searchArray.push(...result);
    console.log(searchArray);
    if (searchArray.length > 0) {
      lat = result[0].lat;
      lon = result[0].lon;
      getWeatherData(lat, lon);
      loadLocationData(searchArray);
      searchArray = [];
    } else {
      console.warn("No relevant results found for:", search);
    }
  } catch (error) {
    console.error(error);
  }
}

// this is for loading the innetHTMl of the location data;
function loadLocationData(locationData) {
  let location = locationData[0].address;
  cityName = location.city;
  countryName = location.country_code.toUpperCase();

  countryStateandDate.innerHTML = `
    <h2 id="dvCityCountry" class="text-preset4 font-DMSans">${cityName}, ${countryName}</h2>
    <p id="dvCurrDate" class="text-preset6 font-DMSans">${date}</p>
  `;
}

// this is a function to get the weather data;
async function getWeatherData(lat, lon) {
  const weatherDisplay = document.getElementById(
    "weather__information-display",
  );

  weatherDisplay.classList.add(
    "md:bg-[url('/assets/images/bg-today-large.svg')]",
  );
  weatherDisplay.classList.add(
    "max-md:bg-[url('/assets/images/bg-today-small.svg')]",
  );
  weatherDisplay.classList.add("bg-no-repeat");
  weatherDisplay.classList.add("bg-cover");
  countryStateandDate.classList.remove("hidden");
  weathercontainer.classList.remove("hidden");
  document.getElementById("loader").classList.add("hidden");

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
    wrongDisplay.classList.add(
      "flex",
      "flex-col",
      "items-center",
      "gap-4",
      "my-4",
    );
    wrongDisplay.innerHTML = `
    <div class="">
        <img src="./assets/images/icon-error.svg" loading="lazy" alt="search-icon" class="mx-auto max-h-7">
        <h1 class="md:text-preset2 text-preset4 text-white ">Something went wrong</h1>
        </div>
        <p class="md:text-preset5 text-center text-neutral200">We couldn’t connect to the server (API error). Please try again in a few moments.</p>
        <button id="retryButton" class="py-4 px-3 bg-neutral800 flex mx-auto gap-2.5 rounded-lg">
          <img src="./assets/images/icon-retry.svg" loading="lazy" alt="search-icon" class=" max-h-7">
          <p class="text-preset7 text-white">Retry</p>
        </button>
    `;
  }
}

// this function works to populate the weather data.
function loadWeatherData(weather) {
  weathercontainer.innerHTML = `
    <div class="max-w-30 max-h-30">
      <img class="weather-image" src="./assets/images/icon-${getIconName(weather.current.weather_code)}.webp" loading="lazy" alt="sun-icon" class="" />
    </div>
    <p class="text-preset1 font-DMSans italic" id="dvCurrTemp">${
      weather.current.apparent_temperature
    }&deg</p>
  `;

  console.log(weather);

  pFeelsLike.innerHTML = `
    <p class="text-preset6">Feels Like</p>
            <p class="text-preset3">${Math.round(
              weather.current.temperature_2m,
            )} ${weather.current_units.temperature_2m}</p>
  `;

  pHumidity.innerHTML = `
            <p class="text-preset6">Humidity</p>
            <p class="text-preset3">${Math.round(
              weather.current.relative_humidity_2m,
            )} ${weather.current_units.relative_humidity_2m}</p>
  `;

  pWind.innerHTML = `
            <p class="text-preset6">Wind</p>
            <p class="text-preset3" >${
              weather.current.wind_speed_10m
            }${weather.current_units.wind_speed_10m}</p>
  `;

  pPrecipitation.innerHTML = `
            <p class="text-preset6">Precipitation</p>
            <p class="text-preset3">${weather.current.precipitation} ${weather.current_units.precipitation}</p>
  `;

  const containerHTML = weather.daily.time
    .map((date, i) => {
      const formattedDate = new Date(date).toLocaleDateString([], {
        weekday: "short",
      });
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
  `;
    })
    .join("");

  const days = {};
  // this is to extract the daysdropdown
  weather.hourly.time.forEach((timeStamp, i) => {
    const date = new Date(timeStamp);
    const day = date.toLocaleDateString(undefined, { weekday: "long" });
    const hour = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      hour12: true,
    });

    if (!days[day]) {
      days[day] = [];
    }

    days[day].push({
      hour,
      temperature: weather.hourly.temperature_2m[i],
      weatherCode: weather.hourly.weather_code[i],
    });
  });

  const ul = document.querySelector(".days-dropdown-menu");
  ul.innerHTML = "";
  Object.keys(days).forEach((day, index) => {
    ul.innerHTML += `
    <li class="list-none p-2">
      <input type="radio" id="${day.toLowerCase()}" value="${day}" name="hourly-forecast" class="peer hidden"
        ${index === 0 ? "checked" : ""} />
      <label for="${day.toLowerCase()}"
        class="block p-2 cursor-pointer transition-colors peer-checked:bg-neutral600 rounded-md hover:bg-neutral700">
        ${day}
      </label>
    </li>
  `;
  });

  const firstDay = Object.keys(days)[0];
  document.querySelector("#hourly__forecast-day").textContent = firstDay;
  renderHourlyForeCast(days[firstDay]);

  document
    .querySelectorAll('input[name="hourly-forecast"]')
    .forEach((input) => {
      input.addEventListener("change", () => {
        document.querySelector("#hourly__forecast-day").textContent =
          input.value;
        renderHourlyForeCast(days[input.value]);
        closeDropdown();
      });
    });

  // this is for the day-dropdown
  forecastWeather.innerHTML = containerHTML;
}

function renderHourlyForeCast(hours) {
  const hourlyContainer = document.querySelector("#hourly__forecast-container");
  hourlyContainer.innerHTML = hours
    .map(({ hour, temperature, weatherCode }) => {
      const icon = getIconName(weatherCode);
      return `
      <div class="flex items-center justify-between bg-neutral700 border border-neutral600 my-3 p-2 rounded-md ">
            <div class="flex items-center">
              <img src="./assets/images/icon-${icon}.webp" loading="lazy" alt="sunny-icon" class="w-10 h-10" />
              <p class="text-preset5">${hour}</p>
            </div>
            <p class="text-preset7">${Math.round(temperature)}&deg</p>
          </div>
    `;
    })
    .join("");
}

// a function for closing and opening the dropdown menu
function itemsDropdown() {
  // this is just to make the dropdown menu visible and close it back by clicking
  dropdownMenu.classList.toggle("opacity-0");
  dropdownMenu.classList.toggle("-translate-y-2");
  dropdownIcon.classList.toggle("rotate-180");
  dropdownMenu.classList.toggle("z-10");
}

// this is to close the dropdown when its clicked outside of it.
function closeitemsDropdown(e) {
  if (!dropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.add("opacity-0");
    dropdownMenu.classList.add("-translate-y-2");
    dropdownIcon.classList.remove("rotate-180");
    dropdownMenu.classList.remove("z-10");
  }

  //close the day-drop if statement because why not.
  if (
    !daysDropdown.contains(e.target) &&
    !daysdropdownMenu.contains(e.target)
  ) {
    daysdropdownMenu.classList.add("opacity-0");
    daysdropdownMenu.classList.add("-translate-y-2");
    daysdropdownIcon.classList.remove("rotate-180");
  }
}

// this is function to open the days-dropdown
function openDropdown() {
  daysdropdownMenu.classList.remove(
    "opacity-0",
    "-translate-y-2",
    "pointer-events-none",
  );
  daysdropdownMenu.classList.add("opacity-100", "translate-y-0");
  daysdropdownIcon.classList.add("rotate-180");
}

// this is a function to close the days-dropdown
function closeDropdown() {
  daysdropdownMenu.classList.add(
    "opacity-0",
    "-translate-y-2",
    "pointer-events-none",
  );
  daysdropdownMenu.classList.remove("opacity-100", "translate-y-0");
  daysdropdownIcon.classList.remove("rotate-180");
}

function toggleDayDropdown(e) {
  e.stopPropagation();
  const isOpen = !daysdropdownMenu.classList.contains("opacity-0");

  if (isOpen) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

// I'm going to using Mutationobserver to reload the getWeatherAPI to listen to whenever the dropdown closes.
// i noticed it keeps firing anytime i clicked and the dropdownMenu is closed.
const obersever = new MutationObserver(() => {
  const isClosed = dropdownMenu.classList.contains("opacity-0");

  if (!isClosed) {
    wasOpen = true;
  }

  if (isClosed && wasOpen) {
    wasOpen = false;
    getWeatherData(lat, lon);
  }
});

// this is a function reverse geoCode for the latitude and longtitude gotten from the user;
async function reverseGeoCode(lat, lon) {
  const isLocal =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost";
  const baseUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`;
  const url = isLocal ? `https://corsproxy.io/?${baseUrl}` : baseUrl;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "MyWeatherApp/1.0",
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);

    countryStateandDate.innerHTML = `
    <h2 id="dvCityCountry" class="text-preset4 font-DMSans">${result.address.city == undefined ? result.address.county : result.address.city}, ${result.address.country}</h2>
    <p id="dvCurrDate" class="text-preset6 font-DMSans">${date}</p>
  `;
  } catch (error) {
    console.error(error.message);
  }
}

// this is listen to the dropdownMenu and attributes and attributes filter works together to check which of the attributes, in the case "class" is being watched;
obersever.observe(dropdownMenu, {
  attributes: true,
  attributeFilter: ["class"],
});

document.addEventListener("click", closeitemsDropdown);
dropdown.addEventListener("click", itemsDropdown);
daysDropdown.addEventListener("click", toggleDayDropdown);
searchButton.addEventListener("click", getGeoCodeData);
window.addEventListener("load", () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      reverseGeoCode(lat, lon);
      getWeatherData(lat, lon);
    },
    () => {
      lat = 40.7128;
      lon = -74.006;
      getWeatherData(lat, lon);
    },
  );
});
window.addEventListener("click", (e) => {
  console.log(e);
  if (e.target.id === "retryButton") {
    console.log('true');
    window.location.reload()
  }
});
