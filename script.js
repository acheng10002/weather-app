/* api endpoints - specific urls that I use to access a particular function or data within the API 

once the DOM is loaded, attaches the event listeners */
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});

function setupEventListeners() {
  // attaches event listener to the input element
  const input = document.querySelector("input");
  input.addEventListener("keyup", handleKeyUp);

  // attaches event listener to the lookup-location button
  const lookUpLocation = document.getElementById("lookup-location");
  lookUpLocation.addEventListener("click", toggleStylesheet);
}

// handles event when user provides input then hits enter key
function handleKeyUp(event) {
  if (event.key === "Enter") {
    processInput();
  }
}

function processInput() {
  let inputtedLocation = document.querySelector("input").value.trim();

  // if user input is blank, show alert pop box
  if (inputtedLocation === "") {
    alert("Enter a valid town or city name and its state.");

    // otherwise, get weather info for the user inputted location
  } else {
    getWeather(inputtedLocation);

    // clear the input element
    document.querySelector("input").value = "";
  }
}

function toggleStylesheet() {
  let stylesheet = document.getElementById("stylesheet");
  stylesheet.href = stylesheet.href.includes("style2.css")
    ? "style1.css"
    : "style2.css";
}

// attaches event listener to convert-units button
function setUnitToggleButton(forecast) {
  const convertUnits = document.getElementById("convert-units");
  convertUnits.onclick = () => toggleUnits(forecast);
}

function toggleUnits(forecast) {
  // isFarenheit is boolean
  let isFahrenheit = document
    .getElementById("day-one-temp")
    .textContent.includes("°F");

  // iterates through the array, and for each array element,
  ["day-one-temp", "day-two-temp", "day-three-temp"].forEach((id, index) => {
    // get the element with id attribute matching it
    let tempElement = document.getElementById(id);

    // if isFahrenheit is true, toggle to Celsius units
    if (isFahrenheit) {
      tempElement.textContent = `${forecast.days[index].C}°C`;

      // if not true, toggle to Fahrenheit units
    } else {
      tempElement.textContent = `${forecast.days[index].F}°F`;
    }
  });

  // toggles isFarenheit boolean
  isFahrenheit = !isFahrenheit;
}

async function fetchForecast(urlWithParams) {
  try {
    // use await to pause execution until fetch completes
    const response = await fetch(urlWithParams, { mode: "cors" });

    // check if the HTTP request was successful
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }

    // await the parsing of the JSON response
    const responseBody = await response.json();

    // extracts specific data from the JSON response
    const forecastData = processForecastData(responseBody);

    displayForecast(forecastData);
    setUnitToggleButton(forecastData);
  } catch (error) {
    console.error("Error fetching the data:", error);
  }
}

function processForecastData(data) {
  // extracts location from the data object
  const forecastLocation = data.location.name;
  const forecastDays = data.forecast.forecastday

    // extracts the first three elements from the forecastday array
    .slice(0, 3)

    // transforms each element of the sliced array into a new format
    .map((day, index) => ({
      /* callback function restructures each day's forecast data 
      assigns a day number to each forecast starting from 1*/
      day: index + 1,

      // extracts the avg temp in C
      C: day.day.avgtemp_c,

      // extracts the avg temp in F
      F: day.day.avgtemp_f,
    }));

  // creates a new object with specific data
  const threeDayForecast = {
    location: forecastLocation,
    days: forecastDays,
  };

  // returns the new objects
  return threeDayForecast;
}

function displayForecast(forecast) {
  // changes the stylesheet from weather-check to forecast-info
  document.getElementById("stylesheet").href = "style2.css";

  // assigns location property value of the forecast object to forecast-info page title
  document.getElementById("location").textContent = forecast.location;

  // iterates through the array and for each array element,
  ["day-one-temp", "day-two-temp", "day-three-temp"].forEach((id, index) => {
    // assign the F property value to the textContent of the element with id attribute matching the array element
    document.getElementById(id).textContent = `${forecast.days[index].F}°F`;
  });
}

function getWeather(location) {
  const params = new URLSearchParams({
    key: "64847af69e3a4138a6902350240905",
    q: location,
    days: "3",
    aqi: "no",
    alerts: "no",
  });
  const baseUrl = "https://api.weatherapi.com/v1/forecast.json";
  fetchForecast(`${baseUrl}?${params.toString()}`);
}
