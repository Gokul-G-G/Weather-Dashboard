const searchBtn = document.getElementById("searchBtn");
const temperature = document.getElementById("temperature");
const weather = document.getElementById("weather");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind");
const spinner = document.querySelector(".spinner");
const resultCard = document.querySelectorAll(".result-card");
const imageUpdate = document.getElementById("imageUpdate");
const cityName = document.getElementById("nameCity");
const error = document.querySelector(".error");

// Images for the Icons
const weatherIcons = {
  haze: "./images/haze.png",
  clear: "./images/clear.png",
  clouds: "./images/clouds.png",
  rain: "./images/rain.png",
  snow: "./images/snow.png",
  mist: "./images/mist.png",
  thunderstorm: "./images/thunderstorm.png",
  drizzle: "./images/drizzle.png",
  smoke: "./images/smoke.png",
};

// Declare colors for the card
const backgroundColors = {
  hot: "orange",
  warm: "green",
  cool: "blue",
};

// Event listener
searchBtn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim().toLowerCase();
  // To check the input is empty
  if (!city) {
    clearResults();
    error.innerText = "Oops! Please enter a city name.";
    imageUpdate.src = "./images/error.png";
    imageUpdate.style.display = "block";
  } else {
    clearResults();
    displayLoading();

    fetchWeather(city)
      .then(updateUI)
      .catch((err) => {
        imageUpdate.src = "./images/404.png";
        error.innerText = err.message || "An error occurred.";
      })
      .finally(() => {
        spinner.classList.remove("spin");
        imageUpdate.style.display = "block";
        resultCard.forEach((card) => (card.style.display = "block"));
      });
  }
});

function fetchWeather(city, delay = 3000) {
  const apiKey = "befd984de4d3c050671d4eb935e6c660";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("City not found");
          }
          return response.json();
        })
        .then(resolve)
        .catch(reject);
    }, delay);
  });
}

function updateUI(data) {
  cityName.innerText = `${data.name}`;
  temperature.innerText = `${data.main.temp}°C`;
  weather.innerText = data.weather[0].description;
  humidity.innerText = `${data.main.humidity}%`;
  windSpeed.innerText = `${data.wind.speed} m/s`;

  const iconKey = data.weather[0].main.toLowerCase();
  imageUpdate.src = weatherIcons[iconKey] || ""; // Default to empty if no icon matches

  // Set background color based on temperature
  let bgColor = backgroundColors.cool; // Default to cool
  if (data.main.temp >= 30) {
    bgColor = backgroundColors.hot;
  } else if (data.main.temp >= 20) {
    bgColor = backgroundColors.warm;
  }
  resultCard.forEach((card) => (card.style.backgroundColor = bgColor));
}

// Spinner
function displayLoading() {
  spinner.classList.add("spin");
}

function clearResults() {
  temperature.innerText = "--";
  weather.innerText = "";
  cityName.innerText = "";
  humidity.innerText = "--";
  windSpeed.innerText = "--";
  imageUpdate.src = "";
  error.innerText = "";
  imageUpdate.style.display = "none";
  resultCard.forEach((card) => (card.style.display = "none"));
}
