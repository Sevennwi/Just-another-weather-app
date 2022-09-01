const APIKey = "b366b05925de7824d3b982efb8253510";
const article = document.querySelector(".main-weather-container");
const weatherForecast = document.getElementById("weatherForecast");

const currentDate = document.getElementById("currentDate");

// Get user location

if (window.navigator.geolocation) {
  window.navigator.geolocation.getCurrentPosition(getPosition, showError);
}

function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  localStorage.setItem("user-lat", latitude);
  localStorage.setItem("user-long", longitude);
  getCurrentWeather();
  getForecastWeather();
}

function showError(error) {
  if (error.PERMISSION_DENIED) {
    const p = document.createElement("p");
    p.className = "geolocation-denied";
    p.innerText =
      "You have declined the geolocation service, please enter your city to see the weather forecast";
    article.before(p);
  }
}

// Get Current Date

let date = new Date();
date = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "full",
})
  .format(date)
  .replace(",", " ");
currentDate.innerText = date;

// get date 1rst day

let forecastDateArray = [];

for (let i = 1; i < 6; i++) {
  forecastDate = new Date();
  forecastDate.setDate(forecastDate.getDate() + i);
  forecastDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
    .format(forecastDate)
    .replace(",", " ");
  forecastDateArray.push(forecastDate);
}

console.log(forecastDateArray);
//  firstDayDate.innerText = firstDay;

// Get Current Weather

function getCurrentWeather() {
  let userLat = localStorage.getItem("user-lat");
  let userLong = localStorage.getItem("user-long");
  fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${userLat}&lon=${userLong}&exclude=minutely&appid=${APIKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const userTemp = document.getElementById("userTemp");
      const userWindchillTemp = document.getElementById("userWindchillTemp");
      const userLocation = document.getElementById("userLocation");
      const userWeatherIcon = document.getElementById("userWeatherIcon");
      const userWeatherDesc = document.getElementById("userWeatherDesc");
      const userHumidity = document.getElementById("userHumidity");
      const userWindSpeed = document.getElementById("userWindSpeed");
      const userRainUv = document.getElementById("userRainUv");
      const userRainUvValue = document.getElementById("userRainUvValue");

      function getUserPosition() {
        fetch(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${userLat}&lon=${userLong}&limit=1&appid=${APIKey}`
        )
          .then((response) => response.json())
          .then((location) => {
            console.log(location);
            userLocation.innerText = location[0].name;
          })
          .catch((error) => {
            console.log(error);
          });
      }

      getUserPosition();

      userTemp.innerText = Math.trunc(data.current.temp) + "°C";
      userWindchillTemp.innerText =
        "Feels Like:" + " " + Math.trunc(data.current.feels_like) + "°C";
      let mainIcon = data.current.weather[0].icon;
      userWeatherIcon.src = `http://openweathermap.org/img/wn/${mainIcon}@2x.png`;
      userWeatherDesc.innerText = data.current.weather[0].description;
      userHumidity.innerText = data.current.humidity + "%";
      userWindSpeed.innerText =
        Math.trunc(data.current.wind_speed * 3.6) + " " + "km/h";
      if (data.current.rain) {
        userRainUv.innerHTML =
          '<span><i class="fa-solid fa-umbrella"></i></span>Rain';
        if (data.current.rain < 1) {
          userRainUvValue.innerText = data.current.rain.toFixed(2) + " " + "mm";
        } else {
          userRainUvValue.innerText =
            Math.trunc(data.current.rain) + " " + "mm";
        }
      } else {
        userRainUv.innerHTML =
          '<span><i class="fa-solid fa-umbrella-beach"></i></span>UV index';
        userRainUvValue.innerText = data.current.uvi;
      }

      // 5 days forecast

      weatherForecast.innerHTML = data.daily
        .map((day, idx) => {
          let rainUv = "";
          let rainUvVal = "";
          if (day.rain) {
            rainUv = "Rain";
            if (day.rain < 1) {
              rainUvVal = day.rain.toFixed(2) + " " + "mm";
            } else {
              rainUvVal = Math.trunc(day.rain) + " " + "mm";
            }
          } else {
            rainUv = "UV";
            rainUvVal = day.uvi;
          }
          if (idx > 0 && idx < 6) {
            return `
          <div class="forecast-multiple-day-container">
            <div class="forecast-multiple-day-main">
              <h3>${forecastDateArray[0 + idx - 1]}</h3>
              <div class="forecast-multiple-day-main-info">
                <div class="forecast-multiple-day-main-info_temp">
                  <p>${Math.trunc(day.temp.day)}°C</p>
                  <p>Feels: ${Math.trunc(day.feels_like.day)}°C</p>
                </div>
                <div class="forecast-multiple-day-main-info_weather">
                  <p><img alt="Weather-icon" src="http://openweathermap.org/img/wn/${
                    day.weather[0].icon
                  }@2x.png" /></p>
                  <p>${day.weather[0].description}</p>
                </div>
                <div>
                  <div class="forecast-multiple-day-conditions">
                    <p>Humidity</p>
                    <p>${day.humidity}%</p>
                  </div>
                  <div class="forecast-multiple-day-conditions">
                    <p>Wind</p>
                    <p>${Math.trunc(day.wind_speed)} km/h</p>
                  </div>
                  <div class="forecast-multiple-day-conditions">
                    <p>${rainUv}</p>
                    <p>${rainUvVal}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="forecast-multiple-day-second">
              <div class="forecast-multiple-day-second_div">
                <p>Morning</p>
                <p>16°</p>
                <p class"morningIcon">
                  <span><i class="fa-solid fa-cloud"></i></span>
                </p>
              </div>
              <div class="forecast-multiple-day-second_div">
                <p>Afternoon</p>
                <p>16°</p>
                <p>
                  <span><i class="fa-solid fa-cloud"></i></span>
                </p>
              </div>
              <div class="forecast-multiple-day-second_div">
                <p>Evening</p>
                <p>16°</p>
                <p>
                  <span><i class="fa-solid fa-cloud"></i></span>
                </p>
              </div>
              <div class="forecast-multiple-day-second_div">
                <p>Night</p>
                <p>16°</p>
                <p>
                  <span><i class="fa-solid fa-cloud"></i></span>
                </p>
              </div>
            </div>
          </div>
        </div>`;
          }
        })
        .join(" ");
    })
    .catch((error) => {
      console.log(error);
    });
}

// Get forecast weather

function getForecastWeather() {
  let userLat = localStorage.getItem("user-lat");
  let userLong = localStorage.getItem("user-long");
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${userLat}&lon=${userLong}&appid=${APIKey}&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      // Forecasts Same Day

      const userTempMorning = document.getElementById("userTempMorning");
      const userTempAfternoon = document.getElementById("userTempAfternoon");
      const userTempEvening = document.getElementById("userTempEvening");
      const userTempNight = document.getElementById("userTempNight");

      const userWeatherIconMorning = document.getElementById(
        "userWeatherIconMorning"
      );
      const userWeatherIconAfternoon = document.getElementById(
        "userWeatherIconAfternoon"
      );
      const userWeatherIconEvening = document.getElementById(
        "userWeatherIconEvening"
      );
      const userWeatherIconNight = document.getElementById(
        "userWeatherIconNight"
      );

      userTempMorning.innerText = Math.trunc(data.list[0].main.temp) + "°C";
      userTempAfternoon.innerText = Math.trunc(data.list[2].main.temp) + "°C";
      userTempEvening.innerText = Math.trunc(data.list[3].main.temp) + "°C";
      userTempNight.innerText = Math.trunc(data.list[4].main.temp) + "°C";

      let IconMorning = data.list[0].weather[0].icon.replace("n", "d");
      userWeatherIconMorning.src = `http://openweathermap.org/img/wn/${IconMorning}.png`;
      let IconAfternoon = data.list[2].weather[0].icon.replace("n", "d");
      userWeatherIconAfternoon.src = `http://openweathermap.org/img/wn/${IconAfternoon}.png`;
      let IconEvening = data.list[3].weather[0].icon.replace("d", "n");
      userWeatherIconEvening.src = `http://openweathermap.org/img/wn/${IconEvening}.png`;
      let IconNight = data.list[4].weather[0].icon.replace("d", "n");
      userWeatherIconNight.src = `http://openweathermap.org/img/wn/${IconNight}.png`;

      // 5 day forecast test
      let test = document.querySelector("morningIcon");
      console.log(test);
      test.forEach((e) => {
        test.innerHTML = "test";
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
