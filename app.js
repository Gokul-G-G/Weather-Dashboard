const searchBtn = document.getElementById("searchBtn");
const temperature = document.getElementById("temperature");
const weather = document.getElementById("weather");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind");
const spinner = document.querySelector(".spinner");
const resultCard = document.querySelectorAll(".result-card");
const imageUpdate = document.getElementById("imageUpdate");
const error = document.querySelector(".error");

searchBtn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.toLowerCase();
  // Clear previous data
  clearResults();

  // Show the spinner
  displayLoading();

  // Fetch details from API
  fetchWeather(city)
    .then((data) => {
      console.log(data);
      temperature.innerText = `${data.main.temp}°C`;
      weather.innerText = data.weather[0].description;
      humidity.innerText = `${data.main.humidity}%`;
      windSpeed.innerText = `${data.wind.speed}m/S`;
      const iconChange = data.weather[0].main;
      const check = iconChange.toLowerCase();
      switch (check) {
        case "haze":
          imageUpdate.src = "./images/haze.png";
          break;
        case "clear":
          imageUpdate.src = "./images/clear.png";
          break;
        case "clouds":
          imageUpdate.src = "./images/clouds.png";
          break;
        case "rain":
          imageUpdate.src = "./images/rain.png";
          break;
        case "snow":
          imageUpdate.src = "./images/snow.png";
          break;
        case "mist":
          imageUpdate.src = "./images/mist.png";
          break;
      }
    })
    .catch((err) => {
      error.innerText = err;
    })
    .finally(() => {
      // Stop the spinner
      spinner.classList.remove("spin");
      imageUpdate.style.display = "block";
      for (let i = 0; i < resultCard.length; i++) {
        resultCard[i].style.display = "block";
      }
    });
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

function displayLoading() {
  spinner.classList.add("spin");
}

function clearResults() {
  temperature.innerText = "--";
  weather.innerText = "";
  humidity.innerText = "--";
  windSpeed.innerText = "--";
  imageUpdate.src = ""; // Optionally reset the image source
  error.innerText = ""; // Clear any previous error messages
  imageUpdate.style.display = "none"; // Hide the image initially
  for (let i = 0; i < resultCard.length; i++) {
    resultCard[i].style.display = "none"; // Hide result cards until data is fetched
  }
}
