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
  currentAirPollution();
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

// Geocoding Api for different cities

function getDifferentCity() {
  let userInput = document.getElementById("research").value.trim();
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length == 0) {
        const p = document.createElement("p");
        p.className = "geolocation-denied";
        p.innerText = "Invalid city name, please try again";
        p.style.position = "absolute";
        p.style.left = "5%";
        p.style.color = "#7b002c";
        document.getElementById("form").after(p);
        function remove() {
          p.style.display = "none";
        }
        document.getElementById("research").addEventListener("focus", remove);
        document
          .getElementById("research")
          .addEventListener("keypress", remove);
      } else {
        let newLatitude = data[0].lat;
        let newLongitude = data[0].lon;
        localStorage.setItem("user-lat", newLatitude);
        localStorage.setItem("user-long", newLongitude);

        getCurrentWeather();
        getForecastWeather();
        currentAirPollution();
      }
    });

  document.getElementById("form").reset();
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

      // Get User Current Weather

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
        if (data.current.rain["1h"] < 10) {
          userRainUvValue.innerText =
            data.current.rain["1h"].toFixed(2) + " " + "mm";
        } else {
          userRainUvValue.innerText =
            Math.trunc(data.current.rain["1h"]) + " " + "mm";
        }
      } else if (data.current.snow) {
        userRainUv.innerHTML =
          '<span><i class="fa-solid fa-snowflake"></i></span>Snow';
        if (data.current.snow["1h"] < 10) {
          userRainUvValue.innerText =
            data.current.snow["1h"].toFixed(2) + " " + "mm";
        } else {
          userRainUvValue.innerText =
            Math.trunc(data.current.snow["1h"]) + " " + "mm";
        }
      } else {
        userRainUv.innerHTML =
          '<span><i class="fa-solid fa-umbrella-beach"></i></span>UV index';

        let UV = data.current.uvi;
        let UVvalue = "";
        if (UV >= 0 && UV < 3) {
          UVvalue = "Low";
        } else if (UV >= 3 && UV < 6) {
          UVvalue = "Moderate";
        } else if (UV >= 6 && UV < 8) {
          UVvalue = "High";
        } else if (UV >= 8 && UV < 11) {
          UVvalue = "Very High";
        } else {
          UVvalue = "Extreme";
        }
        userRainUvValue.innerText =
          UVvalue + " " + "(" + Math.trunc(data.current.uvi) + ")";
      }

      const userTempMorning = document.getElementById("userTempMorning");
      const userTempAfternoon = document.getElementById("userTempAfternoon");
      const userTempEvening = document.getElementById("userTempEvening");
      const userTempNight = document.getElementById("userTempNight");

      userTempMorning.innerText = Math.trunc(data.daily[0].temp.morn) + "°C";
      userTempAfternoon.innerText = Math.trunc(data.daily[0].temp.day) + "°C";
      userTempEvening.innerText = Math.trunc(data.daily[0].temp.eve) + "°C";
      userTempNight.innerText = Math.trunc(data.daily[0].temp.night) + "°C";

      // Change Background dynamically

      let backgroundValue = data.current.weather[0].main;
      //backgroundValue = "Ash";
      switch (backgroundValue) {
        case "Clouds":
          document.documentElement.style.setProperty(
            "--backgroundSection",
            "url(/Images/Weather/Clouds/clouds.jpg)"
          );
          break;

        case "Thunderstorm":
          document.documentElement.style.setProperty(
            "--backgroundSection",
            "url(/Images/Weather/Thunderstorm/thunderstorm.jpg)"
          );
          break;

        case "Drizzle":
          document.documentElement.style.setProperty(
            "--backgroundSection",
            "url(/Images/Weather/Drizzle/drizzle.jpg)"
          );
          break;

        case "Rain":
          document.documentElement.style.setProperty(
            "--backgroundSection",
            "url(/Images/Weather/Rain/rain.jpg)"
          );
          break;

        case "Snow":
          document.documentElement.style.setProperty(
            "--backgroundSection",
            "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.2)), url(/Images/Weather/Snow/snow.jpg)"
          );
          break;

        case "Clear":
          document.documentElement.style.setProperty(
            "--backgroundSection",
            "url(/Images/Weather/Clear/clear.jpg)"
          );
          break;

        case "Tornado":
        case "Squall":
          document.documentElement.style.setProperty(
            "--backgroundSection",
            "url(/Images/Weather/Tornado/tornado.jpg)"
          );
          break;

        case "Fog":
        case "Mist":
        case "Smoke":
        case "Haze":
          document.documentElement.style.setProperty(
            "--backgroundSection",
            "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.3)), url(/Images/Weather/Fog/fog.jpg)"
          );
          break;

        case "Sand":
        case "Dust":
          document.documentElement.style.setProperty(
            "--backgroundSection",
            "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url(/Images/Weather/Sandstorm/sandstorm.jpg)"
          );
          break;

        case "Ash":
          document.documentElement.style.setProperty(
            "--backgroundSection",
            "url(/Images/Weather/Ash/ash.jpg)"
          );
          break;

        default:
          document.documentElement.style.setProperty(
            "--backgroundSection",
            "url(/Images/Weather/Clouds/clouds.jpg)"
          );
          break;
      }

      const backgroundMain = document.getElementById("backgroundMain");
      switch (backgroundValue) {
        case "Clouds":
          backgroundMain.style.background =
            "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url(/Images/Weather/Clouds/clouds-2.jpg) center";
          backgroundMain.style.backgroundSize = "cover";
          break;

        case "Thunderstorm":
          backgroundMain.style.background =
            "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url(/Images/Weather/Thunderstorm/thunderstorm-2.jpg) center";
          backgroundMain.style.backgroundSize = "cover";
          break;

        case "Drizzle":
          backgroundMain.style.background =
            "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url(/Images/Weather/Drizzle/drizzle-2.jpg) center";
          backgroundMain.style.backgroundSize = "cover";
          break;

        case "Rain":
          backgroundMain.style.background =
            "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url(/Images/Weather/Rain/rain-2.jpg) center";
          backgroundMain.style.backgroundSize = "cover";
          break;

        case "Snow":
          backgroundMain.style.background =
            "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.2)), url(/Images/Weather/Snow/snow-2.jpg) center";
          backgroundMain.style.backgroundSize = "cover";
          break;

        case "Clear":
          backgroundMain.style.background =
            "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(/Images/Weather/Clear/clear-2.jpg) center";
          backgroundMain.style.backgroundSize = "cover";
          break;

        case "Tornado":
        case "Squall":
          backgroundMain.style.background =
            "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.2)), url(/Images/Weather/Tornado/tornado.jpg) 65%";
          backgroundMain.style.backgroundSize = "cover";
          break;

        case "Fog":
        case "Mist":
        case "Smoke":
        case "Haze":
          backgroundMain.style.background =
            "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3)), url(/Images/Weather/Fog/fog-2.jpg) center";
          backgroundMain.style.backgroundSize = "cover";
          break;

        case "Sand":
        case "Dust":
          backgroundMain.style.background =
            "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.2)), url(/Images/Weather/Sandstorm/sandstorm.jpg) center";
          backgroundMain.style.backgroundSize = "cover";
          break;

        case "Ash":
          backgroundMain.style.background =
            "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url(/Images/Weather/Ash/ash-2.jpg) center";
          backgroundMain.style.backgroundSize = "cover";
          break;

        default:
          backgroundMain.style.background =
            "linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), url(/Images/Weather/Clouds/clouds-2.jpg) center";
          backgroundMain.style.backgroundSize = "cover";
          break;
      }

      // 5 days forecast

      weatherForecast.innerHTML = data.daily
        .map((day, idx) => {
          let rainUv = "";
          let rainUvVal = "";
          if (day.rain) {
            rainUv = "Rain";
            if (day.rain < 10) {
              rainUvVal = day.rain.toFixed(2) + " " + "mm";
            } else {
              rainUvVal = Math.trunc(day.rain) + " " + "mm";
            }
          } else if (day.snow) {
            rainUv = "Snow";
            if (day.snow < 10) {
              rainUvVal = day.snow.toFixed(2) + " " + "mm";
            } else {
              rainUvVal = Math.trunc(day.snow) + " " + "mm";
            }
          } else {
            rainUv = "UV";
            let UV = day.uvi;
            let UVvalue = "";
            if (UV >= 0 && UV < 3) {
              UVvalue = "Low";
            } else if (UV >= 3 && UV < 6) {
              UVvalue = "Moderate";
            } else if (UV >= 6 && UV < 8) {
              UVvalue = "High";
            } else if (UV >= 8 && UV < 11) {
              UVvalue = "Very High";
            } else {
              UVvalue = "Extreme";
            }
            rainUvVal = UVvalue + " " + "(" + Math.trunc(day.uvi) + ")";
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
      // Forecasts Same Day

      function forecastSameDay() {
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

        let IconMorning = data.list[0].weather[0].icon.replace("n", "d");
        userWeatherIconMorning.src = `http://openweathermap.org/img/wn/${IconMorning}.png`;

        if (
          data.list[2].dt_txt.includes("12:00:00") ||
          data.list[2].dt_txt.includes("15:00:00") ||
          data.list[2].dt_txt.includes("18:00:00")
        ) {
          let IconAfternoon = data.list[2].weather[0].icon.replace("n", "d");
          userWeatherIconAfternoon.src = `http://openweathermap.org/img/wn/${IconAfternoon}.png`;
        } else {
          let IconAfternoon = data.list[1].weather[0].icon.replace("n", "d");
          userWeatherIconAfternoon.src = `http://openweathermap.org/img/wn/${IconAfternoon}.png`;
        }

        if (
          data.list[3].dt_txt.includes("18:00:00") ||
          data.list[3].dt_txt.includes("21:00:00") ||
          data.list[3].dt_txt.includes("00:00:00")
        ) {
          let IconEvening = data.list[3].weather[0].icon.replace("d", "n");
          userWeatherIconEvening.src = `http://openweathermap.org/img/wn/${IconEvening}.png`;
        } else {
          let IconEvening = data.list[2].weather[0].icon.replace("d", "n");
          userWeatherIconEvening.src = `http://openweathermap.org/img/wn/${IconEvening}.png`;
        }

        if (
          data.list[4].dt_txt.includes("00:00:00") ||
          data.list[4].dt_txt.includes("03:00:00") ||
          data.list[4].dt_txt.includes("06:00:00")
        ) {
          let IconNight = data.list[4].weather[0].icon.replace("d", "n");
          userWeatherIconNight.src = `http://openweathermap.org/img/wn/${IconNight}.png`;
        } else {
          let IconNight = data.list[3].weather[0].icon.replace("d", "n");
          userWeatherIconNight.src = `http://openweathermap.org/img/wn/${IconNight}.png`;
        }
      }

      forecastSameDay();

      // 5 day forecast

      function forecast5days() {
        let addNumber = 0;
        let forecastMorningIcon = document.querySelectorAll(
          "p > .forecast-morning-icon"
        );
        forecastMorningIcon.forEach((m) => {
          try {
            if (
              data.list[7 + addNumber].dt_txt.includes("06:00:00") ||
              data.list[7 + addNumber].dt_txt.includes("09:00:00") ||
              data.list[7 + addNumber].dt_txt.includes("12:00:00")
            ) {
              morningIcon = data.list[7 + addNumber].weather[0].icon.replace(
                "n",
                "d"
              );
            } else if (
              data.list[4 + addNumber].dt_txt.includes("06:00:00") ||
              data.list[4 + addNumber].dt_txt.includes("09:00:00") ||
              data.list[4 + addNumber].dt_txt.includes("12:00:00")
            ) {
              morningIcon = data.list[4 + addNumber].weather[0].icon.replace(
                "n",
                "d"
              );
            } else {
              morningIcon = data.list[2 + addNumber].weather[0].icon.replace(
                "n",
                "d"
              );
            }

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
            if (
              data.list[10 + addNumber].dt_txt.includes("12:00:00") ||
              data.list[10 + addNumber].dt_txt.includes("15:00:00") ||
              data.list[10 + addNumber].dt_txt.includes("18:00:00")
            ) {
              afternoonIcon = data.list[10 + addNumber].weather[0].icon.replace(
                "n",
                "d"
              );
            } else if (
              data.list[7 + addNumber].dt_txt.includes("12:00:00") ||
              data.list[7 + addNumber].dt_txt.includes("15:00:00") ||
              data.list[7 + addNumber].dt_txt.includes("18:00:00")
            ) {
              afternoonIcon = data.list[7 + addNumber].weather[0].icon.replace(
                "n",
                "d"
              );
            } else {
              afternoonIcon = data.list[5 + addNumber].weather[0].icon.replace(
                "n",
                "d"
              );
            }

            a.src = `http://openweathermap.org/img/wn/${afternoonIcon}@2x.png`;
            addNumber += 8;
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
            if (
              data.list[12 + addNumber].dt_txt.includes("18:00:00") ||
              data.list[12 + addNumber].dt_txt.includes("21:00:00") ||
              data.list[12 + addNumber].dt_txt.includes("00:00:00")
            ) {
              eveningIcon = data.list[11 + addNumber].weather[0].icon.replace(
                "d",
                "n"
              );
            } else if (
              data.list[9 + addNumber].dt_txt.includes("18:00:00") ||
              data.list[9 + addNumber].dt_txt.includes("21:00:00") ||
              data.list[9 + addNumber].dt_txt.includes("00:00:00")
            ) {
              eveningIcon = data.list[8 + addNumber].weather[0].icon.replace(
                "d",
                "n"
              );
            } else {
              eveningIcon = data.list[7 + addNumber].weather[0].icon.replace(
                "d",
                "n"
              );
            }

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
            if (
              data.list[13 + addNumber].dt_txt.includes("00:00:00") ||
              data.list[13 + addNumber].dt_txt.includes("03:00:00")
            ) {
              nightIcon = data.list[12 + addNumber].weather[0].icon.replace(
                "d",
                "n"
              );
            } else if (
              data.list[11 + addNumber].dt_txt.includes("00:00:00") ||
              data.list[11 + addNumber].dt_txt.includes("03:00:00")
            ) {
              nightIcon = data.list[9 + addNumber].weather[0].icon.replace(
                "d",
                "n"
              );
            } else if (
              data.list[9 + addNumber].dt_txt.includes("00:00:00") ||
              data.list[9 + addNumber].dt_txt.includes("03:00:00")
            ) {
              nightIcon = data.list[9 + addNumber].weather[0].icon.replace(
                "d",
                "n"
              );
            } else if (data.list[7 + addNumber].dt_txt.includes("00:00:00")) {
              nightIcon = data.list[7 + addNumber].weather[0].icon.replace(
                "d",
                "n"
              );
            }

            n.src = `http://openweathermap.org/img/wn/${nightIcon}@2x.png`;
            addNumber += 8;
          } catch (err) {
            return;
          }
        });
      }
      setTimeout(forecast5days, 500);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Get Air Pollution

function currentAirPollution() {
  let userLat = localStorage.getItem("user-lat");
  let userLong = localStorage.getItem("user-long");
  fetch(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${userLat}&lon=${userLong}&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const airPollution = document.getElementById("airPollution");
      airPollution.innerText = data.list[0].main.aqi + "/5";
    });
}
