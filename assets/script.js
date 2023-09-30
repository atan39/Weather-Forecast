const apiKey = "bc93c8c21c3f53980eab1fad1d379249";

document.getElementById("search-form").addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();
  const city = document.getElementById("city").value.trim();
  if (city === "") return;

  getCityLocation(city)
    .then(({ lat, lon, name }) => {
      updateHistory(name, lat, lon);
      fetchWeatherData(lat, lon);
    })
    .catch(() => {
      console.log("No results found.");
    });

  document.getElementById("city").value = "";
}

async function getCityLocation(city) {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
  const [location] = await response.json();
  if (!location) throw new Error("No results found.");
  return location;
}

async function fetchWeatherData(lat, lon) {
  const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
  const weatherData = await weatherResponse.json();
  const temperature = ((weatherData.main.temp - 273.15) * 9 / 5) + 32;
  document.getElementById("current-weather-data").textContent = `Temperature: ${temperature.toFixed(2)}°F`;

  const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
  const forecastStructure = await forecastResponse.json();

  displayForecast(forecastStructure.list);
}

function displayForecast(forecastList) {
  const forecastInfo = document.getElementById("forecast-data");
  forecastInfo.innerHTML = "";

  forecastList
    .filter((_, index) => index % 8 === 0)
    .forEach(forecastItem => {
      const date = new Date(forecastItem.dt_txt);
      const temperature = ((forecastItem.main.temp - 273.15) * 9 / 5) + 32;

      const forecastElement = createForecastElement(date.toLocaleDateString(), temperature.toFixed(2));
      forecastInfo.appendChild(forecastElement);
    });
}

function createForecastElement(date, temperature) {
  const forecastElement = document.createElement("div");
  forecastElement.innerHTML = `
    <p>Date: ${date}</p>
    <p>Temperature: ${temperature}°F</p>
  `;
  return forecastElement;
}

function updateHistory(cityName, lat, lon) {
  const history = document.getElementById("history-data");
  const listedData = document.createElement("li");
  listedData.textContent = cityName;
  listedData.addEventListener("click", () => {
    fetchWeatherData(lat, lon);
  });
  history.appendChild(listedData);
}