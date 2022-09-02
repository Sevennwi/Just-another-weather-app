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

// get date 5 day

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

// Get Current Weather

function getCurrentWeather() {
  let userLat = localStorage.getItem("user-lat");
  let userLong = localStorage.getItem("user-long");
  fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${userLat}&lon=${userLong}&exclude=hourly,minutely&appid=${APIKey}&units=metric`
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
                  <p>Feels:<br>${Math.trunc(day.feels_like.day)}°C</p>
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
                <p>${Math.trunc(day.temp.morn)}°C</p>
                <p class="forecast-multiple-day-second_div_feels">Feels ${Math.trunc(
                  day.feels_like.morn
                )}°C</p>
                <p><img alt="Weather-icon" class="forecast-morning-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon.replace(
                  "n",
                  "d"
                )}@2x.png" /></p>
              </div>
              <div class="forecast-multiple-day-second_div">
                <p>Afternoon</p>
                <p>${Math.trunc(day.temp.day)}°C</p>
                <p class="forecast-multiple-day-second_div_feels">Feels ${Math.trunc(
                  day.feels_like.day
                )}°C</p>
                <p><img alt="Weather-icon" class="forecast-afternoon-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon.replace(
                  "n",
                  "d"
                )}@2x.png" /></p>
              </div>
              <div class="forecast-multiple-day-second_div">
                <p>Evening</p>
                <p>${Math.trunc(day.temp.eve)}°C</p>
                <p class="forecast-multiple-day-second_div_feels">Feels ${Math.trunc(
                  day.feels_like.eve
                )}°C</p>
                <p><img alt="Weather-icon" class="forecast-evening-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon.replace(
                  "d",
                  "n"
                )}@2x.png" /></p>
              </div>
              <div class="forecast-multiple-day-second_div">
                <p>Night</p>
                <p>${Math.trunc(day.temp.night)}°C</p>
                <p class="forecast-multiple-day-second_div_feels">Feels ${Math.trunc(
                  day.feels_like.night
                )}°C</p>
                <p><img alt="Weather-icon" class="forecast-night-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon.replace(
                  "d",
                  "n"
                )}@2x.png" /></p>
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

      function forecastSameDay() {
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
      }

      forecastSameDay();

      // 5 day forecast

      function forecast5days() {
        for (let i = 0; i < data.list.length; i++) {
          const test = data.list[i].dt_txt.includes("12:00:00");
          console.log(test);
        }

        let addNumber = 0;
        let forecastMorningIcon = document.querySelectorAll(
          "p > .forecast-morning-icon"
        );
        forecastMorningIcon.forEach((m) => {
          try {
            morningIcon = data.list[7 + addNumber].weather[0].icon.replace(
              "n",
              "d"
            );
            m.src = `http://openweathermap.org/img/wn/${morningIcon}@2x.png`;
            addNumber += 8;
          } catch (err) {
            return;
          }
        });

        addNumber = 0;
        let forecastAfternoonIcon = document.querySelectorAll(
          "p > .forecast-afternoon-icon"
        );
        forecastAfternoonIcon.forEach((a) => {
          try {
            afternoonIcon = data.list[10 + addNumber].weather[0].icon.replace(
              "n",
              "d"
            );
            a.src = `http://openweathermap.org/img/wn/${afternoonIcon}@2x.png`;
            addNumber += 8;
            console.log(a);
          } catch (err) {
            return;
          }
        });

        addNumber = 0;
        let forecastEveningIcon = document.querySelectorAll(
          "p > .forecast-evening-icon"
        );
        forecastEveningIcon.forEach((e) => {
          try {
            eveningIcon = data.list[11 + addNumber].weather[0].icon.replace(
              "d",
              "n"
            );
            e.src = `http://openweathermap.org/img/wn/${eveningIcon}@2x.png`;
            addNumber += 8;
          } catch (err) {
            return;
          }
        });

        addNumber = 0;
        let forecastNightIcon = document.querySelectorAll(
          "p > .forecast-night-icon"
        );
        forecastNightIcon.forEach((n) => {
          try {
            nightIcon = data.list[12 + addNumber].weather[0].icon.replace(
              "d",
              "n"
            );
            n.src = `http://openweathermap.org/img/wn/${nightIcon}@2x.png`;
            addNumber += 8;
          } catch (err) {
            return;
          }
        });
      }
      setTimeout(forecast5days, 300);
    })
    .catch((error) => {
      console.log(error);
    });
}
